# Layer 4 — Compute, Memory and Networking Systems

## Role in the physical architecture

Layer 4 is the productive hardware that executes Layers 7–9. Central Layer 4 equipment is installed inside Layer 5. A smaller edge instance is installed inside Layer 10. The manufacturing and integration value chain occurs outside both enclosures.

## 1. Current chain

Foundry and memory → Accelerator design → Interconnect and networking → Optics and cabling → System integration → Buyer

## 2. Main problems and missing components

### Duplication with Layer 3

Foundry belongs to Layer 3. Layer 4 should begin with semiconductor devices or packages delivered for system integration.

### Incorrect ordering

Accelerator design precedes foundry production. Memory, networking and optics are parallel system inputs rather than consecutive stages.

### “Buyer” is not a technical stage

The buyer belongs in the commercial route-to-market. Separate physical assembly from OEM, cloud and customer relationships.

### Missing components

- Host CPUs
- GPUs, accelerators and custom ASICs
- HBM, DRAM and NAND
- Storage devices and storage systems
- NICs, DPUs/SmartNICs and switch ASICs
- Retimers, PHYs and connectivity controllers
- PCIe, CXL and proprietary scale-up fabrics
- Ethernet/InfiniBand or equivalent scale-out networks
- Copper cables, optical transceivers and fibre
- Power-management ICs and voltage-regulator modules
- PCBs, connectors, trays and mechanical structures
- Servers, switches, storage appliances and racks
- Firmware, drivers, compilers, libraries and cluster-management software
- ODM, OEM and electronics-manufacturing services

### Statements to change

- Do not use “compute silicon” as the layer title; the layer includes memory, storage, networking, optics, power delivery and integrated systems.
- Do not say optics are used only between racks. Copper, optics and emerging optical integration occupy different distances and bandwidth domains.
- Do not imply more accelerators automatically create useful compute. Memory capacity/bandwidth, network topology, storage, software and utilisation determine delivered performance.

## 3. Recommended structure and corrections

Semiconductor devices/packages → Compute modules and accelerator boards → Server/storage/network equipment → Scale-up interconnect → Scale-out network → Rack integration → Cluster integration → Firmware/software enablement → Qualification/commissioning → Sale, lease or operated compute

Show five parallel component families converging at system integration:

1. Compute processors
2. Memory and storage
3. Networking and optics
4. Power delivery and cooling interfaces
5. Mechanical, PCB and manufacturing integration

## Central versus edge placement

### Inside Layer 5

Accelerator servers, storage, network fabrics and racks provide central training and cloud inference.

### Inside Layer 10

An SoC or edge accelerator, memory, local storage and real-time I/O provide low-latency perception and control.

Do not interpret the repeated “4” as duplicated value chains. It is the deployment of the same capability class at two physical scales.

## Connections to other layers

- **Layer 3:** supplies packaged logic, memory, sensors and connectivity silicon.
- **Layer 5:** houses, powers, cools and operates central Layer 4 systems.
- **Layer 6:** extends network traffic beyond local cluster boundaries.
- **Layer 7:** runs its storage and processing workloads on Layer 4.
- **Layer 8:** uses Layer 4 for training and inference.
- **Layer 9:** uses Layer 4 to execute agents and applications.
- **Layer 10:** contains edge Layer 4 hardware.

## Website wording

> Layer 4 integrates compute, memory, storage, networking, optics and power delivery into the central and edge machines that execute AI workloads.

## Required verification

For performance claims, specify workload, precision, batch size, memory requirements, network configuration, utilisation, power and total system cost.

