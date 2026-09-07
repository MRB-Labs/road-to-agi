# Layer 6 — Connectivity and Communications

## Role in the physical architecture

Layer 6 is the communications bridge across physical locations. It exists within racks and data centres, between data centres, across carrier networks and between the cloud and embodied edge systems.

## 1. Current chain

Optical and electronic components → Fibre/cable → Network equipment → Metro and long-haul transport → Subsea/backbone networks → Access network → Edge gateway/device

This layer was missing from the original eight-layer website and was partially hidden inside “compute silicon.”

## 2. Main problems and missing components

### Networking domains are conflated

Separate:

- Chip/package interconnect
- Scale-up accelerator fabric
- Scale-out cluster network
- Storage and front-end network
- Data-centre interconnect
- Metro, long-haul and subsea transport
- Internet exchange, peering and CDN
- Fixed, Wi-Fi, private wireless, 5G and satellite access
- Robot/device internal buses and wireless links

Layer 4 owns much of the intra-data-centre equipment. Layer 6 focuses on communication across system and location boundaries, while acknowledging overlap.

### Missing components

- Lasers, modulators, photodetectors and optical DSPs
- Transceivers, active electrical cables and passive copper cables
- Fibre preforms, fibre and cable
- Switches, routers and optical transport systems
- Amplification, wavelength management and network control
- Carrier-neutral facilities and internet exchanges
- Subsea cable systems and landing stations
- Radio access networks, Wi-Fi, private networks and satellite links
- Edge gateways, time synchronisation and deterministic networking
- Network security, encryption and traffic engineering
- Redundancy, failover and service assurance

### Statements to change

- Do not say all high-bandwidth links are optical. Copper remains important over short distances.
- Do not equate raw link speed with application performance. Latency, topology, congestion, protocol overhead and reliability matter.
- Do not assume autonomous machines can rely continuously on the cloud. Safety-critical functions require local operation or a defined safe state.

## 3. Recommended structure and corrections

Components → Modules/cables → Switch/router/transport equipment → Data-centre and metro networks → Long-haul/subsea backbone → Peering/CDN/edge nodes → Access network → Enterprise or embodied endpoint

For the physical architecture, show three primary flows:

1. Sensor, telemetry and experience data: Layer 10 → Layer 6 → Layer 7
2. Models, policies and software updates: Layers 8/9 → Layer 6 → Layer 10
3. Remote supervision, fleet control and tools: Layer 9 ↔ Layer 6 ↔ Layer 10

## Connections to other layers

- **Layer 2:** supplies copper, glass and compound-semiconductor materials.
- **Layer 3:** supplies switch, interface and optical semiconductors.
- **Layer 4:** contains local network interfaces, fabrics, switches and optics.
- **Layer 5:** houses network equipment and carrier interconnection points.
- **Layer 7:** receives and distributes data through Layer 6.
- **Layers 8–9:** distribute inference responses, models and agent actions.
- **Layer 10:** connects to central services while retaining local autonomy.

## Website wording

> Layer 6 transports data, model updates and control information between compute clusters, data centres, users and autonomous machines.

## Required verification

For bandwidth and latency claims, specify distance, topology, protocol, traffic pattern, redundancy and whether the number is theoretical, measured or application-level.

