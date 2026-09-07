# Layer 10 — Embodied AI and Autonomous Systems

## Role in the physical architecture

Layer 10 is the physical edge enclosure that connects computation to reality. It combines sensors, edge compute, local models, agent/control software, actuators, power and mechanical systems. It observes the world, decides locally, acts through physical effectors and returns selected experience data to central infrastructure.

## 1. Current chain

Rare earth and magnets → Precision components → Actuators and modules → Sensing and edge compute → Platform → Deployment → Data curation → Back into training

## 2. Main problems and missing components

### The chain is not physically correct

Materials, precision components, sensors, actuators, compute and batteries are parallel subsystem inputs. They converge during machine integration and manufacturing.

### Rare-earth claim is too absolute

Many compact, high-performance electric motors use permanent magnets, but not every actuator requires rare-earth magnets. Alternatives include induction, switched-reluctance, hydraulic, pneumatic and other actuator technologies.

### BOM claim is too broad

The share of cost attributable to actuators depends on robot type, payload, degrees of freedom, volumes, sensor suite, battery, compute and accounting boundary. Do not publish a universal percentage.

### Missing hardware subsystems

- Chassis, structures, covers and environmental sealing
- Bearings, gears, screws, reducers and transmissions
- Motors, drives, brakes and joint modules
- End effectors, hands, grippers and tools
- Cameras, lidar, radar, microphones and tactile sensors
- Inertial, force, torque and position sensing
- Compute, memory, local storage and real-time I/O
- Batteries, charging, power distribution and conversion
- Thermal management
- Wired buses and wireless communications
- Functional safety, emergency systems and redundancy

### Missing software and lifecycle stages

- Simulation, digital twins and synthetic environments
- Perception, localisation and state estimation
- World modelling, planning and policy execution
- Low-level controls and real-time firmware
- Safety supervision and human override
- Design for manufacture and assembly
- Factory calibration, test and quality control
- Certification and application validation
- Deployment, fleet management and teleoperation
- Maintenance, repair, spares and refurbishment
- Data selection, upload, curation and retraining

### Statements to change

- Remove “every actuator needs sintered magnets.”
- Qualify any statement that actuators are half the BOM.
- Do not say robotics volume has arrived without profit across the whole industry. Separate industrial, medical, logistics, autonomous-vehicle and humanoid segments.
- Do not imply all raw sensor data is uploaded. Bandwidth, privacy, cost and utility require selection and compression.

## 3. Recommended structure and corrections

### Parallel component branches

1. Structure and precision mechanics
2. Actuation, transmissions and power electronics
3. Sensors and perception modules
4. Edge compute, memory and communications
5. Battery/energy and thermal systems
6. End effectors and application-specific tools

### Integration and lifecycle chain

Components → Subsystem modules → Mechanical/electrical integration → Firmware and control → Model/software integration → Factory test/calibration → Safety validation/certification → Application deployment → Fleet operations/maintenance → Experience-data selection → Retraining/update → Refurbishment/recycling

## Essential internal containment

Inside Layer 10, show:

Sensors → Edge Layer 4 → Local Layer 8 → Local Layer 9/control → Actuators

Also show battery/power/thermal systems supporting the entire internal chain.

The physical-world loop is:

Physical world → Sensors → Local perception/decision → Actuators → Changed physical world

The learning loop is:

Experience data → Layer 6 → Layer 7 → Layer 8 training/evaluation → validated update → Layer 6 → Layer 10

## Connections to other layers

- **Layers 1–3:** supply power systems, materials, sensors, processors and power electronics.
- **Layer 4:** provides edge compute and central training hardware.
- **Layer 6:** transfers data, updates and supervision.
- **Layer 7:** stores and curates selected experience.
- **Layer 8:** supplies local perception, world and policy models.
- **Layer 9:** supplies planning, tool use, safety supervision and control coordination.

## Website wording

> Layer 10 closes the loop between intelligence and reality by sensing the environment, making local decisions, acting through physical systems and returning selected experience for improvement.

## Required verification

Robot-performance claims must specify task, environment, payload, speed, autonomy level, intervention rate, duty cycle, energy use, reliability and safety conditions.

