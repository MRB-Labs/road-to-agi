# -*- coding: utf-8 -*-
"""Where each value-chain position in the company database belongs in this site.

The database uses its own stage names; this report's chains were written to the
AUDIT brief and carry their own prose, chokepoint qualifications and ordering.
Neither is wrong, so rather than replace one with the other, every database
position is mapped by hand onto the stage it belongs to here.

Keys are "Layer N :: position" from the database. Values are "L<layer>.<branch>.<stage>"
in this report's chains. A value of None means the position is deliberately not
carried across, with the reason given.
"""

STAGE_MAP = {
 # ── Layer 1 ────────────────────────────────────────────────────────────────
 "1::Uranium mining and nuclear fuel":            "L1.0.0",
 "1::Nuclear generation and utilities":           "L1.0.1",
 "1::Advanced nuclear and SMRs":                  "L1.0.1",
 "1::Natural-gas turbines and engines":           "L1.0.1",
 "1::Renewable developers and operators":         "L1.0.1",
 "1::Solar modules and inverters":                "L1.0.1",
 "1::Fuel cells and alternative generation":      "L1.0.1",
 "1::Transmission and distribution utilities":    "L1.0.4",
 "1::Transformers and grid equipment":            "L1.1.1",
 "1::Conductors and high-voltage cable":          "L1.1.1",
 "1::Electrical balance of plant":                "L1.1.3",
 "1::EPC and grid construction":                  "L1.0.6",
 "1::Stationary batteries and storage systems":   "L1.0.2",
 "1::Cooling and thermal infrastructure":         "L1.2.0",

 # ── Layer 2 ────────────────────────────────────────────────────────────────
 "2::Diversified mining":                         "L2.0.2",
 "2::Copper extraction and refining":             "L2.0.4",
 "2::Lithium and battery minerals":               "L2.0.2",
 "2::Nickel and cobalt":                          "L2.0.2",
 "2::Rare earth mining and separation":           "L2.0.4",
 "2::Aluminium and alumina":                      "L2.0.4",
 "2::Steel and electrical steel":                 "L2.0.7",
 "2::Silicon metal and polysilicon":              "L2.0.5",
 "2::Semiconductor wafers":                       "L2.0.6",
 "2::Electronic chemicals and photoresists":      "L2.0.5",
 "2::Industrial and electronic gases":            "L2.0.5",
 "2::Speciality metals and alloys":               "L2.0.6",
 "2::Glass, ceramics and composites":             "L2.0.6",
 "2::Magnet materials and components":            "L2.0.6",
 "2::Recycling and circular materials":           "L2.0.9",

 # ── Layer 3 ────────────────────────────────────────────────────────────────
 "3::CPU/GPU/ASIC architecture and IP":           "L3.0.0",
 "3::EDA and verification":                       "L3.0.1",
 "3::Photomasks and reticles":                    "L3.0.5",
 "3::Lithography":                                "L3.1.1",
 "3::Deposition, etch and process equipment":     "L3.1.2",
 "3::Inspection and metrology":                   "L3.1.3",
 "3::Wafer cleaning and wet processing":          "L3.1.2",
 "3::Dicing, bonding and packaging equipment":    "L3.2.4",
 "3::Test equipment and interfaces":              "L3.2.5",
 "3::Leading-edge foundry":                       "L3.2.0",
 "3::Specialty and mature-node foundry":          "L3.2.0",
 "3::Memory fabrication":                         "L3.2.1",
 "3::OSAT and advanced packaging services":       "L3.2.4",
 "3::Distribution and electronics supply":        "L3.2.6",

 # ── Layer 4 ────────────────────────────────────────────────────────────────
 "4::AI accelerators and GPUs":                   "L4.0.0",
 "4::Custom cloud accelerators":                  "L4.0.0",
 "4::Host CPUs and control processors":           "L4.0.0",
 "4::HBM and DRAM":                               "L4.0.1",
 "4::NAND and enterprise storage media":          "L4.0.1",
 "4::Switch silicon, NICs, DPUs and retimers":    "L4.0.2",
 "4::Server and storage OEMs":                    "L4.1.1",
 "4::ODMs and contract manufacturing":            "L4.0.4",
 "4::Network-system vendors":                     "L4.1.3",
 "4::Rack power and thermal interfaces":          "L4.0.3",
 "4::Cluster/system integration":                 "L4.1.5",

 # ── Layer 5 ────────────────────────────────────────────────────────────────
 "5::Hyperscale cloud and self-build":            "L5.1.0",
 "5::Colocation and wholesale operators":         "L5.1.2",
 "5::GPU cloud and neocloud":                     "L5.1.3",
 "5::Site development and powered land":          "L5.0.2",
 "5::Data-centre design and engineering":         "L5.0.6",
 "5::General construction":                       "L5.0.7",
 "5::Electrical installation and grid connection":"L5.0.8",
 "5::Mechanical and cooling plant":               "L5.0.8",
 "5::Backup power and UPS":                       "L5.0.8",
 "5::Commissioning and testing":                  "L5.0.10",
 "5::Operations and facility management":         "L5.0.11",

 # ── Layer 9 ────────────────────────────────────────────────────────────────
 "6::Optical components and transceivers":        "L9.0.0",
 "6::Optical DSP and connectivity silicon":       "L9.0.0",
 "6::Fibre and optical cable":                    "L9.0.1",
 "6::Connectors and copper interconnect":         "L9.0.2",
 "6::Data-centre switching":                      "L9.0.3",
 "6::Optical transport and DCI":                  "L9.0.3",
 "6::Long-haul, metro and dark fibre":            "L9.0.5",
 "6::Subsea cable ownership/supply":              "L9.0.5",
 "6::CDN and edge delivery":                      "L9.0.6",
 "6::Wireless access and private networks":       "L9.0.7",
 "6::Satellite connectivity":                     "L9.0.7",

 # ── Layer 6 ────────────────────────────────────────────────────────────────
 "7::Cloud object/data storage":                  "L6.0.3",
 "7::Data warehouse and lakehouse":               "L6.0.3",
 "7::Operational databases":                      "L6.0.3",
 "7::Streaming and event data":                   "L6.0.2",
 "7::Ingestion and transformation":               "L6.0.2",
 "7::Catalogue, governance and lineage":          "L6.0.6",
 "7::Data observability":                         "L6.0.9",
 "7::Vector databases and retrieval":             "L6.0.8",
 "7::Annotation and data operations":             "L6.0.5",
 "7::Enterprise knowledge/search":                "L6.1.2",
 "7::Licensed content and data owners":           "L6.0.0",
 "7::Synthetic data and simulation data":         "L6.0.7",

 # ── Layer 7 ────────────────────────────────────────────────────────────────
 "8::General frontier-model developers":          "L7.0.3",
 "8::Open-model ecosystems":                      "L7.0.9",
 "8::Vertical/domain models":                     "L7.0.3",
 "8::Model training platforms":                   "L7.0.1",
 "8::Post-training and alignment":                "L7.0.4",
 "8::Evaluation and AI assurance":                "L7.0.5",
 "8::Optimisation and compilation":               "L7.0.6",
 "8::Inference engines and model serving":        "L7.0.7",
 "8::Model registry, monitoring and LLMOps":      "L7.0.8",

 # ── Layer 8 ────────────────────────────────────────────────────────────────
 "9::Enterprise agent platforms":                 "L8.0.6",
 "9::Model gateways and routing":                 "L8.0.0",
 "9::Agent frameworks and orchestration":         "L8.0.3",
 "9::Integration, iPaaS and automation":          "L8.0.7",
 "9::Process intelligence":                       "L8.0.7",
 "9::Coding agents and developer tools":          "L8.0.6",
 "9::Knowledge-work applications":                "L8.0.6",
 "9::Identity and privileged access":             "L8.1.0",
 "9::Observability and agent operations":         "L8.1.3",
 "9::Application security and AI security":       "L8.1.1",

 # ── Layer 10 ───────────────────────────────────────────────────────────────
 "10::Humanoid and general-purpose robots":       "L10.1.1",
 "10::Industrial robot OEMs":                     "L10.1.1",
 "10::Warehouse and mobile robots":               "L10.1.7",
 "10::Autonomous driving platforms":              "L10.1.1",
 "10::Drones and autonomous aircraft":            "L10.1.1",
 "10::Precision reducers, gears and bearings":    "L10.0.0",
 "10::Motors and actuation":                      "L10.0.1",
 "10::Machine vision and perception":             "L10.0.3",
 "10::Radar, IMU and force/tactile sensors":      "L10.0.3",
 "10::Edge AI compute and modules":               "L10.0.4",
 "10::Batteries and power electronics":           "L10.0.5",
 "10::Simulation, digital twins and robot training": "L10.1.4",
 "10::Fleet deployment and lifecycle service":    "L10.1.8",

 # ── Cross-stack security overlay ───────────────────────────────────────────
 # The audit is explicit that security is a control plane running across layers
 # 7 to 10, not a stage after the application. It lands in layer 8's control
 # plane, which is where this report already puts it.
 "X::Security domain":                            None,   # a table header, not a position
 "X::OT and critical-infrastructure security":    "L8.1.1",
 "X::Cloud and workload security":                "L8.1.1",
 "X::Identity and machine authorization":         "L8.1.0",
 "X::Data security and privacy":                  "L8.1.1",
 "X::AI/model/agent security":                    "L8.1.1",
 "X::Device, firmware and supply-chain security": "L8.1.1",
}
