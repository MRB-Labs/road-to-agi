# Layer 3 — Semiconductor Production Ecosystem

## Role in the physical architecture

Layer 3 converts designs and highly specialised inputs into logic, memory, networking, sensing and power-management devices. Semiconductor manufacturing happens in fabs and packaging/test facilities; the finished devices are then integrated into Layer 4 systems and Layer 10 machines.

## 1. Current chain

Materials and gases → Design tools and IP → Equipment → Wafer fabrication → Advanced packaging and test

## 2. Main problems and missing components

### Parallel inputs are shown as sequential

EDA/IP, materials, masks and manufacturing equipment do not buy sequentially from one another. They are parallel inputs to chip design and manufacturing.

### Design is under-specified

Chip architecture, verification, physical design, interface IP, tape-out and mask generation should be visible.

### Manufacturing is over-compressed

“Equipment” includes many specialised categories: lithography, deposition, etch, implant, clean, process control, metrology, inspection and test. Wafer fabrication also requires cleanrooms, ultrapure water, gases and abatement.

### Packaging is incomplete

Add substrates, interposers, chiplets, bonding, HBM integration, wafer sort, final test, burn-in and qualification. Distinguish conventional assembly/test from advanced packaging.

### Statements to change

- Replace “packaging, not lithography, rations accelerators” with a conditional statement. Binding constraints may include leading-edge wafers, yield, HBM, substrates, packaging, test, networking, power or cooling.
- Do not describe “foundry and memory” as one manufacturing input. Logic foundry and memory are separate industries that converge in the system package.
- Chokepoints must be dated because capacity constraints change.

## 3. Recommended structure and corrections

### Design branch

Research/architecture → EDA and core/interface IP → RTL/design → Verification → Physical design → Tape-out → Masks/reticles

### Manufacturing-input branch

Wafers + chemicals + gases + photoresists + equipment + cleanroom infrastructure → Wafer fabrication

### Production branch

Front-end fabrication → Wafer probing/sort → Dicing → Substrates/interposers → Die stacking/bonding → HBM or chiplet integration → Final test/burn-in → Qualification → Distribution

### Output categories

- AI accelerators and custom ASICs
- Host CPUs and control processors
- HBM, DRAM and NAND
- Switch ASICs, DPUs, NICs, PHYs and retimers
- Optical DSPs, laser drivers and photodetectors
- Sensors and edge-AI SoCs
- Power-management and motor-control devices

## Connections to other layers

- **Layer 2:** provides wafers, gases, chemicals and high-purity materials.
- **Layer 1:** powers fabs, cleanrooms, water systems and manufacturing equipment.
- **Layer 4:** integrates logic, memory and networking devices into servers and racks.
- **Layer 6:** uses communications and optical semiconductors.
- **Layer 10:** uses compute, sensing, connectivity, power and motor-control devices.

## Website wording

> Layer 3 combines chip design, fabrication inputs, wafer processing, packaging and test to produce the semiconductor devices used throughout central and edge AI systems.

## Required verification

Separate capacity, utilisation, yield and lead time. A high installed capacity figure does not mean qualified, available output for a specific product.

