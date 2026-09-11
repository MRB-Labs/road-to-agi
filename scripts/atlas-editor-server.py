#!/usr/bin/env python3
"""Local server for the atlas visual editor.

It serves the repository files and accepts one local-only save endpoint that
updates coordinates in assets/atlas/atlas-layout.js.
"""

from __future__ import annotations

import argparse
import json
import re
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LAYOUT = ROOT / "assets" / "atlas" / "atlas-layout.js"
NUMBER = r"-?\d+(?:\.\d+)?"


def _replace_prop(src: str, prop: str, value: int) -> tuple[str, int]:
    pattern = re.compile(rf"(\b{re.escape(prop)}:)\s*{NUMBER}")
    return pattern.subn(rf"\g<1>{int(value)}", src, count=1)


def _update_object(src: str, ident_prop: str, ident_value: str, values: dict[str, int]) -> tuple[str, int]:
    pattern = re.compile(r"\{[^{}]*\b" + re.escape(ident_prop) + r":'" + re.escape(ident_value) + r"'[^{}]*\}")
    match = pattern.search(src)
    if not match:
        raise ValueError(f"Could not find {ident_prop} '{ident_value}' in atlas layout")
    block = match.group(0)
    changed = 0
    for prop, value in values.items():
        block, count = _replace_prop(block, prop, int(value))
        changed += count
    return src[:match.start()] + block + src[match.end():], changed


def _route_signature(block: str) -> tuple[str | None, str | None]:
    from_match = re.search(r"\bfrom:'([^']+)'", block)
    to_match = re.search(r"\bto:'([^']+)'", block)
    return (
        from_match.group(1) if from_match else None,
        to_match.group(1) if to_match else None,
    )


def _route_blocks(src: str) -> tuple[int, list[re.Match[str]]]:
    routes_match = re.search(r"const ATLAS_ROUTES = \[", src)
    if not routes_match:
        raise ValueError("Could not find ATLAS_ROUTES in atlas layout")
    start = src.find("[", routes_match.start())
    end = src.find("\n];", start)
    if end == -1:
        raise ValueError("Could not find end of ATLAS_ROUTES in atlas layout")
    body = src[start:end]
    return start, list(re.finditer(r"\{[^{}]*(?:via:\[[^\]]+\][^{}]*)?\}", body))


def _format_via(route: dict) -> str:
    via = []
    for guide in route.get("via", []):
        if "x" in guide:
            via.append("{x:%d}" % int(round(float(guide["x"]))))
        elif "y" in guide:
            via.append("{y:%d}" % int(round(float(guide["y"]))))
    return "via:[" + ",".join(via) + "]"


def _update_route_via(src: str, route: dict) -> tuple[str, int]:
    via = route.get("via")
    if not via:
        return src, 0
    route_index = route.get("index")
    route_from = route.get("from")
    route_to = route.get("to")
    route_start, blocks = _route_blocks(src)
    for idx, match in enumerate(blocks):
        body = match.group(0)
        sig_from, sig_to = _route_signature(body)
        if route_index == idx and sig_from == route_from and sig_to == route_to:
            updated, count = re.subn(r"via:\[[^\]]+\]", _format_via(route), body, count=1)
            if count == 0:
                return src, 0
            start = route_start + match.start()
            end = route_start + match.end()
            return src[:start] + updated + src[end:], count
    return src, 0


def save_layout(payload: dict) -> int:
    src = LAYOUT.read_text(encoding="utf-8")
    total = 0

    for node in payload.get("nodes", []):
        node_id = str(node.get("id", ""))
        values = {k: int(round(float(node[k]))) for k in ("x", "y", "w", "h") if k in node}
        if node_id and values:
            src, changed = _update_object(src, "id", node_id, values)
            total += changed

    for region in payload.get("regions", []):
        key = str(region.get("key", ""))
        values = {k: int(round(float(region[k]))) for k in ("x", "y", "w", "h") if k in region}
        if key and values:
            src, changed = _update_object(src, "key", key, values)
            total += changed

    for route in payload.get("routes", []):
        src, changed = _update_route_via(src, route)
        total += changed

    world = payload.get("world") or {}
    if world:
        values = {k: int(round(float(world[k]))) for k in ("cx", "cy", "r") if k in world}
        pattern = re.compile(r"const ATLAS_WORLD = \{[^{}]*\};")
        match = pattern.search(src)
        if not match:
            raise ValueError("Could not find ATLAS_WORLD in atlas layout")
        block = match.group(0)
        for prop, value in values.items():
            block, changed = _replace_prop(block, prop, value)
            total += changed
        src = src[:match.start()] + block + src[match.end():]

    LAYOUT.write_text(src, encoding="utf-8")
    return total


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path == "/__atlas_editor/ping":
            self._json({"ok": True})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/__atlas_editor/save":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            changed = save_layout(payload)
            self._json({"ok": True, "changed": changed})
        except Exception as exc:
            self._json({"ok": False, "error": str(exc)}, HTTPStatus.BAD_REQUEST)

    def _json(self, payload, status=HTTPStatus.OK):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> int:
    parser = argparse.ArgumentParser(description="Serve the atlas visual editor.")
    parser.add_argument("--port", type=int, default=8766)
    args = parser.parse_args()
    server = ThreadingHTTPServer(("127.0.0.1", args.port), Handler)
    print(f"Atlas editor: http://127.0.0.1:{args.port}/atlas-editor.html")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
