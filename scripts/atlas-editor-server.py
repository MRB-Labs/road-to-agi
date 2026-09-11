#!/usr/bin/env python3
"""Local server for the atlas visual editor.

It serves the repository files and accepts one local-only save endpoint that
updates coordinates in assets/atlas/atlas-layout.js.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from datetime import datetime
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
LAYOUT = ROOT / "assets" / "atlas" / "atlas-layout.js"
CONTENT = ROOT / "assets" / "content.js"
COMMIT_FILES = [
    "assets/atlas/atlas-layout.js",
    "assets/content.js",
    "assets/content-index.js",
    "content/copy-snapshot.json",
    "atlas-editor.html",
    "index.html",
]
NUMBER = r"-?\d+(?:\.\d+)?"


def _set_prop(src: str, prop: str, value: int) -> tuple[str, int]:
    pattern = re.compile(rf"(\b{re.escape(prop)}:)\s*{NUMBER}")
    match = pattern.search(src)
    if match:
        old_value = match.group(0).split(":", 1)[1].strip()
        new_value = str(int(value))
        if old_value == new_value:
            return src, 0
        return src[:match.start()] + match.group(1) + new_value + src[match.end():], 1
    return src[:-1] + f", {prop}:{int(value)}}}", 1


def _update_object(src: str, ident_prop: str, ident_value: str, values: dict[str, int]) -> tuple[str, int]:
    pattern = re.compile(r"\{[^{}]*\b" + re.escape(ident_prop) + r":'" + re.escape(ident_value) + r"'[^{}]*\}")
    match = pattern.search(src)
    if not match:
        raise ValueError(f"Could not find {ident_prop} '{ident_value}' in atlas layout")
    block = match.group(0)
    changed = 0
    for prop, value in values.items():
        if (prop in {"ix", "iy"} and int(value) == 0) or (prop == "iz" and int(value) == 100):
            if not re.search(rf"\b{prop}:", block):
                continue
            block = re.sub(rf",\s*{prop}:{NUMBER}", "", block, count=1)
            changed += 1
            continue
        block, count = _set_prop(block, prop, int(value))
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
                updated = body[:-1] + ", " + _format_via(route) + "}"
                count = 1
            elif updated == body:
                return src, 0
            start = route_start + match.start()
            end = route_start + match.end()
            return src[:start] + updated + src[end:], count
    return src, 0


def _js_string(value: str) -> str:
    value = "" if value is None else str(value)
    return "'" + value.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n") + "'"


def _js_array(values: list[str]) -> str:
    return "[" + ",".join(_js_string(v) for v in values if v) + "]"


def _replace_const_block(src: str, name: str, new_block: str) -> tuple[str, int]:
    match = re.search(rf"const {re.escape(name)}=.*?;\n", src, re.S)
    if not match:
        raise ValueError(f"Could not find {name} in assets/content.js")
    if match.group(0) == new_block:
        return src, 0
    return src[:match.start()] + new_block + src[match.end():], 1


def _format_cards(cards: dict) -> str:
    lines = ["const ATLAS_CARDS={"]
    for node in [
        "l1", "l2", "l3", "l1p", "l5", "l4", "l7", "l8", "l9", "l6",
        "l10", "sens", "l4e", "l8e", "l9e", "act", "l1b",
    ]:
        c = cards.get(node)
        if not c:
            continue
        lines.append(f" {node.ljust(6)}:{{t:{_js_string(c.get('t', ''))},s:{_js_array(c.get('s', []))}}},")
    lines.append("};")
    return "\n".join(lines) + "\n"


def _format_regions(regions: dict) -> str:
    order = ["foundations", "silicon", "compute", "intelligence", "network", "embodied"]
    pad = {"foundations":"foundations ", "silicon":"silicon     ", "compute":"compute     ",
           "intelligence":"intelligence", "network":"network     ", "embodied":"embodied    "}
    lines = ["const ATLAS_REGIONS_TEXT={"]
    for key in order:
        r = regions.get(key)
        if not r:
            continue
        title = _js_string(r.get("t", ""))
        spaces = " " * max(1, 15 - len(title))
        lines.append(f" {pad[key]}:{{t:{title},{spaces}s:{_js_array(r.get('s', []))}}},")
    lines.append("};")
    return "\n".join(lines) + "\n"


def _format_world(world: dict, current: str) -> str:
    t = _js_string(world.get("t", ""))
    s = _js_string(world.get("s", ""))
    lede = re.search(r"\blede:('(?:\\.|[^'])*')", current)
    reach = re.search(r"\breach:(\[[^\]]*\])", current)
    lede_part = lede.group(1) if lede else "''"
    reach_part = reach.group(1) if reach else "[]"
    return f"const ATLAS_WORLD_TEXT={{t:{t}, s:{s},\n lede:{lede_part},\n reach:{reach_part}}};\n"


def _format_route_text(routes: dict) -> str:
    items = [f"{_js_string(k)}:{_js_string(v)}" for k, v in sorted(routes.items()) if v]
    return "const ATLAS_ROUTE_TEXT={" + ", ".join(items) + "};\n"


def save_content(payload: dict) -> int:
    if not payload:
        return 0
    src = CONTENT.read_text(encoding="utf-8")
    total = 0
    if "cards" in payload:
        src, count = _replace_const_block(src, "ATLAS_CARDS", _format_cards(payload["cards"]))
        total += count
    if "regions" in payload:
        src, count = _replace_const_block(src, "ATLAS_REGIONS_TEXT", _format_regions(payload["regions"]))
        total += count
    if "world" in payload:
        current = re.search(r"const ATLAS_WORLD_TEXT=.*?;\n", src, re.S)
        if not current:
            raise ValueError("Could not find ATLAS_WORLD_TEXT in assets/content.js")
        src, count = _replace_const_block(src, "ATLAS_WORLD_TEXT", _format_world(payload["world"], current.group(0)))
        total += count
    if "routes" in payload:
        src, count = _replace_const_block(src, "ATLAS_ROUTE_TEXT", _format_route_text(payload["routes"]))
        total += count
    CONTENT.write_text(src, encoding="utf-8")
    if total:
        result = subprocess.run(
            ["python3", "build-content.py"],
            cwd=ROOT,
            text=True,
            capture_output=True,
            check=False,
        )
        if result.returncode:
            raise ValueError(result.stderr.strip() or result.stdout.strip() or "build-content.py failed")
    return total


def save_layout(payload: dict) -> int:
    src = LAYOUT.read_text(encoding="utf-8")
    total = 0

    for node in payload.get("nodes", []):
        node_id = str(node.get("id", ""))
        values = {k: int(round(float(node[k]))) for k in ("x", "y", "w", "h", "ix", "iy", "iz") if k in node}
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
            block, changed = _set_prop(block, prop, value)
            total += changed
        src = src[:match.start()] + block + src[match.end():]

    LAYOUT.write_text(src, encoding="utf-8")
    return total


def _git(args: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        ["git", *args],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if check and result.returncode:
        message = result.stderr.strip() or result.stdout.strip() or "git command failed"
        raise ValueError(message)
    return result


def _run_guard(args: list[str]) -> None:
    result = subprocess.run(
        args,
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        message = result.stderr.strip() or result.stdout.strip() or "guard failed"
        raise ValueError(message)


def commit_and_push() -> dict:
    # Approve the map's own words only — the ATLAS_* tables the editor writes.
    # The full wording check below then fails on any other pending change, so
    # a save can never accept an edit nobody meant to make.
    _run_guard(["python3", "check-content.py", "--accept-only=content.js/ATLAS_"])
    result = subprocess.run(
        ["python3", "bump-assets.py"],
        cwd=ROOT,
        text=True,
        capture_output=True,
        check=False,
    )
    if result.returncode:
        message = result.stderr.strip() or result.stdout.strip() or "bump-assets.py failed"
        raise ValueError(message)
    _run_guard(["python3", "build-content.py", "--check"])
    _run_guard(["python3", "scripts/check-atlas.py"])
    _run_guard(["python3", "brand/build-companies.py", "--check"])
    _run_guard(["python3", "check-content.py"])
    _run_guard(["python3", "scripts/check-figures.py"])
    _run_guard(["python3", "scripts/check-offline.py"])
    _git(["add", "--", *COMMIT_FILES])
    staged = _git(["diff", "--cached", "--quiet", "--", *COMMIT_FILES], check=False)
    if staged.returncode == 0:
        return {"committed": False, "pushed": False, "message": "No Git changes to commit."}
    if staged.returncode not in {0, 1}:
        message = staged.stderr.strip() or staged.stdout.strip() or "Could not inspect staged changes"
        raise ValueError(message)

    stamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    _git(["commit", "-m", f"Update atlas layout from visual editor ({stamp})"])
    push = _git(["push"], check=False)
    if push.returncode:
        message = push.stderr.strip() or push.stdout.strip() or "git push failed"
        raise ValueError(f"Saved and committed locally, but push failed: {message}")
    head = _git(["rev-parse", "--short", "HEAD"]).stdout.strip()
    return {"committed": True, "pushed": True, "commit": head}


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        if self.path == "/__atlas_editor/ping":
            self._json({"ok": True, "features": ["git-push"]})
            return
        super().do_GET()

    def do_POST(self):
        if self.path != "/__atlas_editor/save":
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            changed = save_layout(payload) + save_content(payload.get("text") or {})
            git = commit_and_push()
            self._json({"ok": True, "changed": changed, "git": git})
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
