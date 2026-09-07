# AI Infrastructure — Company and Value-Chain Database

> **This file decides which companies appear at each stage of every layer.**
>
> It is the source of truth for the company map: `brand/build-companies.py`
> reads it directly and writes `MARKET_MAP` and the `CT` rows into `script.js`.
> `brand/stage_map.py` says where each value-chain position below belongs in
> this report's own chains.
>
> To add, remove or move a company, edit the table below and then run:
>
> ```bash
> python3 brand/build-companies.py
> python3 bump-assets.py
> ```
>
> Logos are not managed here — see `brand/README.md`.


**Version date:** 2026-09-07  
**Purpose:** source document for mapping public and private companies onto the ten-layer AI physical architecture and each layer's internal value chain.

## Scope and interpretation

- This is a **curated global market map**, not a claim to contain every supplier worldwide.
- Companies are placed where they provide a material product, service or enabling capability. A company may appear in several stages or layers.
- A brand owned by another company is marked as a subsidiary or brand to prevent double-counting it as an independent investable company.
- Public tickers identify the primary or most accessible listing where practical. Tickers, ownership and listing status must be refreshed before publication or investment use.
- Inclusion means relevance, not endorsement, market leadership or investability.
- Cybersecurity, safety, governance and professional deployment are cross-stack overlays rather than additional physical layers.

## Status legend

| Code | Meaning |
|---|---|
| **Public** | Publicly listed operating company |
| **Private** | Privately held or venture-backed company |
| **Subsidiary** | Brand/business controlled by a parent company |
| **State/other** | State-owned, cooperative, consortium, foundation or nonprofit |

---

# Layer 1 — Energy, Power and Utilities

Layer 1 covers external generation and grids, on-site electrical/thermal infrastructure, storage and the mobile energy chain inside embodied AI.

## Energy-resource and generation chain

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Uranium mining and nuclear fuel | Cameco (`CCJ`, `CCO.TO`); Kazatomprom (`KAP.L`); Centrus Energy (`LEU`); BWX Technologies (`BWXT`) | Orano (French state); Urenco (government consortium); Westinghouse (Cameco/Brookfield) | Uranium production, enrichment, fuel fabrication and nuclear components |
| Nuclear generation and utilities | Constellation Energy (`CEG`); Vistra (`VST`); Talen Energy (`TLN`); Duke Energy (`DUK`); Southern Company (`SO`); Entergy (`ETR`); PSEG (`PEG`); NextEra Energy (`NEE`) | EDF (French state-controlled); Ontario Power Generation (provincial) | Existing nuclear generation and utility operation |
| Advanced nuclear and SMRs | Oklo (`OKLO`); NuScale Power (`SMR`); Nano Nuclear Energy (`NNE`); BWX Technologies (`BWXT`); Rolls-Royce (`RR.L`) | TerraPower; X-energy; Commonwealth Fusion Systems; Helion; General Fusion | Advanced fission, microreactors, SMRs and prospective fusion |
| Natural-gas turbines and engines | GE Vernova (`GEV`); Siemens Energy (`ENR.DE`); Mitsubishi Heavy Industries (`7011.T`); Caterpillar (`CAT`); Cummins (`CMI`); Wärtsilä (`WRT1V.HE`) | INNIO Group; Rolls-Royce Power Systems (Rolls-Royce) | Utility turbines, reciprocating generation and backup power |
| Renewable developers and operators | NextEra Energy (`NEE`); Iberdrola (`IBE.MC`); Enel (`ENEL.MI`); RWE (`RWE.DE`); Ørsted (`ORSTED.CO`); Brookfield Renewable (`BEPC`, `BEP`); AES (`AES`); Engie (`ENGI.PA`) | Invenergy; Lightsource bp (bp); EDF Renewables | Solar, wind, hydro and integrated renewable projects |
| Solar modules and inverters | First Solar (`FSLR`); JinkoSolar (`JKS`); Canadian Solar (`CSIQ`); LONGi Green Energy (`601012.SS`); Trina Solar (`688599.SS`); Enphase (`ENPH`); SolarEdge (`SEDG`); SMA Solar (`S92.DE`); Sungrow (`300274.SZ`) | Huawei Digital Power | PV modules, power conversion and plant controls |
| Fuel cells and alternative generation | Bloom Energy (`BE`); Plug Power (`PLUG`); FuelCell Energy (`FCEL`); Ballard Power (`BLDP`) | Doosan Fuel Cell system partners | On-site fuel cells and hydrogen-linked power systems |

## Grid, power-equipment and thermal chain

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Transmission and distribution utilities | National Grid (`NG.L`); American Electric Power (`AEP`); Exelon (`EXC`); Dominion Energy (`D`); Eversource (`ES`); Xcel Energy (`XEL`); Edison International (`EIX`); PG&E (`PCG`) | Swissgrid; TenneT; RTE | Grid ownership, connection capacity and transmission/distribution service |
| Transformers and grid equipment | GE Vernova (`GEV`); Siemens Energy (`ENR.DE`); ABB (`ABBN.SW`); Schneider Electric (`SU.PA`); Eaton (`ETN`); Mitsubishi Electric (`6503.T`); Fuji Electric (`6504.T`); LS Electric (`010120.KS`); Hyosung Heavy Industries (`298040.KS`); HD Hyundai Electric (`267260.KS`) | Hitachi Energy (Hitachi `6501.T`); Prolec GE (GE Vernova/Xignux); SGB-SMIT | Transformers, switchgear, substations, protection and grid automation |
| Conductors and high-voltage cable | Prysmian (`PRY.MI`); Nexans (`NEX.PA`); NKT (`NKT.CO`); Sumitomo Electric (`5802.T`); LS Cable via LS Corp (`006260.KS`) | Southwire; Hellenic Cables (Cenergy) | Copper/aluminium conductors and high-voltage transmission cable |
| Electrical balance of plant | Eaton (`ETN`); Schneider Electric (`SU.PA`); ABB (`ABBN.SW`); Vertiv (`VRT`); nVent (`NVT`); Hubbell (`HUBB`); Powell Industries (`POWL`); Legrand (`LR.PA`) | Rittal (Friedhelm Loh Group); Socomec | UPS, busway, switchgear, enclosures, PDUs and distribution |
| EPC and grid construction | Quanta Services (`PWR`); EMCOR (`EME`); MYR Group (`MYRG`); MasTec (`MTZ`); Fluor (`FLR`); Jacobs Solutions (`J`) | Burns & McDonnell; Black & Veatch; Bechtel; Cupertino Electric | Engineering, procurement, construction and interconnection |
| Stationary batteries and storage systems | Tesla (`TSLA`); Fluence (`FLNC`); CATL (`300750.SZ`); BYD (`1211.HK`, `002594.SZ`); LG Energy Solution (`373220.KS`); Samsung SDI (`006400.KS`); Panasonic Holdings (`6752.T`); Eos Energy (`EOSE`); ESS Tech (`GWH`); Energy Vault (`NRGV`) | Form Energy; Redwood Materials; Powin; Lyten (owner of acquired Northvolt assets) | Cells, packs, storage systems and energy-management software |
| Cooling and thermal infrastructure | Vertiv (`VRT`); Schneider Electric (`SU.PA`); Johnson Controls (`JCI`); Trane Technologies (`TT`); Carrier (`CARR`); Modine (`MOD`); Munters (`MTRS.ST`); Daikin (`6367.T`); Delta Electronics (`2308.TW`) | CoolIT Systems (KKR); LiquidStack; Submer; Green Revolution Cooling; Boyd | Chillers, heat rejection, air/liquid cooling and thermal controls |

---

# Layer 2 — Raw and Processed Materials

The chain is exploration → permitting/financing → extraction → beneficiation → refining/separation → high-purity processing → engineered form → qualification → recycling.

| Value-chain position | Public companies | Private, subsidiary or other organisations | Principal relevance |
|---|---|---|---|
| Diversified mining | BHP (`BHP`); Rio Tinto (`RIO`); Glencore (`GLEN.L`); Vale (`VALE`); Anglo American (`AAL.L`); Zijin Mining (`2899.HK`, `601899.SS`); CMOC (`3993.HK`, `603993.SS`) | State mining enterprises and regional producers | Copper, iron ore, nickel, cobalt and industrial minerals |
| Copper extraction and refining | Freeport-McMoRan (`FCX`); Southern Copper (`SCCO`); Antofagasta (`ANTO.L`); Boliden (`BOL.ST`); Aurubis (`NDA.DE`); KGHM (`KGH.WA`); Jiangxi Copper (`0358.HK`) | Codelco (Chile state) | Copper concentrate, cathode, rod and recycling |
| Lithium and battery minerals | Albemarle (`ALB`); SQM (`SQM`); Ganfeng Lithium (`1772.HK`, `002460.SZ`); Tianqi Lithium (`9696.HK`, `002466.SZ`); Pilbara Minerals (`PLS.AX`); Mineral Resources (`MIN.AX`); Lithium Americas (`LAC`) | Ioneer project partners and emerging developers | Lithium chemicals and mine development |
| Nickel and cobalt | Vale (`VALE`); Glencore (`GLEN.L`); Nickel Industries (`NIC.AX`); IGO (`IGO.AX`); CMOC (`3993.HK`); Huayou Cobalt (`603799.SS`) | Tsingshan Holding; Eurasian Resources Group | Battery and superalloy feedstocks |
| Rare earth mining and separation | MP Materials (`MP`); Lynas Rare Earths (`LYC.AX`); China Northern Rare Earth (`600111.SS`); Iluka Resources (`ILU.AX`); Energy Fuels (`UUUU`) | Shenghe Resources partners; government-backed separation projects | Nd, Pr, Dy, Tb and other rare-earth products |
| Aluminium and alumina | Alcoa (`AA`); Norsk Hydro (`NHY.OL`); Century Aluminum (`CENX`); Chalco (`2600.HK`); South32 (`S32.AX`) | Emirates Global Aluminium; Rusal (sanctions/geography dependent) | Primary/recycled aluminium and alumina |
| Steel and electrical steel | ArcelorMittal (`MT`); Nucor (`NUE`); Steel Dynamics (`STLD`); POSCO Holdings (`PKX`); Nippon Steel (`5401.T`); JFE Holdings (`5411.T`); Cleveland-Cliffs (`CLF`); voestalpine (`VOE.VI`) | thyssenkrupp Electrical Steel business units | Structural, stainless, tool and electrical steels |
| Silicon metal and polysilicon | Ferroglobe (`GSM`); Wacker Chemie (`WCH.DE`); OCI Holdings (`010060.KS`); Tongwei (`600438.SS`); Daqo New Energy (`DQ`) | Hemlock Semiconductor (Corning/Shin-Etsu); Qatar Solar Technologies | Silicon metal and high-purity polysilicon |
| Semiconductor wafers | Shin-Etsu Chemical (`4063.T`); SUMCO (`3436.T`); GlobalWafers (`6488.TWO`); Siltronic (`WAF.DE`); Soitec (`SOI.PA`); Coherent (`COHR`) | SK Siltron (SK Group) | Silicon, SOI, SiC and compound-semiconductor substrates |
| Electronic chemicals and photoresists | Entegris (`ENTG`); Merck KGaA (`MRK.DE`); Tokyo Ohka Kogyo (`4186.T`); Fujifilm (`4901.T`); Resonac (`4004.T`); DuPont (`DD`); Solvay (`SOLB.BR`) | JSR (Japan Investment Corporation); Brewer Science | Photoresists, deposition/etch materials, cleans and CMP inputs |
| Industrial and electronic gases | Linde (`LIN`); Air Liquide (`AI.PA`); Air Products (`APD`); Taiyo Nippon Sanso via Nippon Sanso (`4091.T`) | Regional specialty-gas suppliers | Ultra-high-purity bulk and specialty gases |
| Speciality metals and alloys | Materion (`MTRN`); ATI (`ATI`); Carpenter Technology (`CRS`); Umicore (`UMI.BR`) | Heraeus (family-owned); Plansee Group | Beryllium copper, refractory metals, sputter targets, superalloys and precious metals |
| Glass, ceramics and composites | Corning (`GLW`); AGC (`5201.T`); Saint-Gobain (`SGO.PA`); Kyocera (`6971.T`); Morgan Advanced Materials (`MGAM.L`) | CoorsTek | Optical glass/fibre, substrates, technical ceramics and insulation |
| Magnet materials and components | Proterial (`5486.T`); Shin-Etsu Chemical (`4063.T`); TDK (`6762.T`); JL MAG Rare-Earth (`300748.SZ`, `6680.HK`) | VACUUMSCHMELZE; Arnold Magnetic Technologies | NdFeB, SmCo, ferrite and soft-magnetic materials |
| Recycling and circular materials | Umicore (`UMI.BR`); Aurubis (`NDA.DE`); Boliden (`BOL.ST`); Li-Cycle (`LICY`); Redwood peers | Redwood Materials; Ascend Elements; Cirba Solutions | Copper, precious-metal, battery and electronics recovery |

---

# Layer 3 — Semiconductor Production Ecosystem

Layer 3 combines design/IP, manufacturing inputs, equipment, fabrication, assembly/test and distribution.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| CPU/GPU/ASIC architecture and IP | Arm (`ARM`); Synopsys (`SNPS`); Cadence (`CDNS`); Rambus (`RMBS`) | SiFive; RISC-V International; Imagination Technologies; Alphawave Semi assets where integrated | Processor, interface, memory and foundation IP |
| EDA and verification | Synopsys (`SNPS`); Cadence (`CDNS`); Siemens (`SIE.DE`) | Siemens EDA (Siemens subsidiary); Keysight (`KEYS`) in electronic design/test | Logic/physical design, verification, simulation and sign-off |
| Photomasks and reticles | Photronics (`PLAB`); HOYA (`7741.T`); Dai Nippon Printing (`7912.T`); TOPPAN Holdings (`7911.T`) | Toppan Photomask/JV structures | Mask blanks, advanced masks and reticles |
| Lithography | ASML (`ASML`); Canon (`7751.T`); Nikon (`7731.T`) | Carl Zeiss SMT (Carl Zeiss foundation group) | EUV/DUV lithography, optics and mature-node lithography |
| Deposition, etch and process equipment | Applied Materials (`AMAT`); Lam Research (`LRCX`); Tokyo Electron (`8035.T`); ASM International (`ASM.AS`); Kokusai Electric (`6525.T`); Veeco (`VECO`); Axcelis (`ACLS`) | Hitachi High-Tech (Hitachi) | Deposition, etch, implant, thermal processing and cleaning |
| Inspection and metrology | KLA (`KLAC`); Lasertec (`6920.T`); Onto Innovation (`ONTO`); Nova (`NVMI`); Camtek (`CAMT`); Hitachi (`6501.T`) | Selected specialist metrology vendors | Defect inspection, process control and dimensional/material metrology |
| Wafer cleaning and wet processing | SCREEN Holdings (`7735.T`); Tokyo Electron (`8035.T`); Lam Research (`LRCX`) | Regional wet-bench specialists | Single-wafer and batch cleaning/coating/developing |
| Dicing, bonding and packaging equipment | DISCO (`6146.T`); BE Semiconductor (`BESI.AS`); Kulicke & Soffa (`KLIC`); ASMPT (`0522.HK`); Applied Materials (`AMAT`); SUSS MicroTec (`SMHN.DE`) | EV Group | Dicing, hybrid bonding, die attach, molding and advanced packaging |
| Test equipment and interfaces | Advantest (`6857.T`); Teradyne (`TER`); Cohu (`COHU`); FormFactor (`FORM`); Keysight (`KEYS`); Chroma ATE (`2360.TW`) | Specialist probe/test-interface vendors | Wafer probe, final test, burn-in and test interfaces |
| Leading-edge foundry | TSMC (`TSM`, `2330.TW`); Samsung Electronics (`005930.KS`); Intel (`INTC`) | Rapidus (private/state-backed) | Leading logic and advanced process manufacturing |
| Specialty and mature-node foundry | GlobalFoundries (`GFS`); UMC (`UMC`, `2303.TW`); SMIC (`0981.HK`); Hua Hong Semiconductor (`1347.HK`); Tower Semiconductor (`TSEM`); DB HiTek (`000990.KS`) | PSMC and regional foundry capacity | Mature logic, analog, RF, power, sensors and speciality processes |
| Memory fabrication | Samsung Electronics (`005930.KS`); SK hynix (`000660.KS`); Micron (`MU`); Kioxia Holdings (`285A.T`); Nanya Technology (`2408.TW`); Winbond (`2344.TW`) | CXMT; YMTC | HBM/DRAM, NAND and specialty memory |
| OSAT and advanced packaging services | ASE Technology (`ASX`, `3711.TW`); Amkor (`AMKR`); JCET (`600584.SS`); Tongfu Microelectronics (`002156.SZ`); Powertech Technology (`6239.TW`); ChipMOS (`IMOS`); KYEC (`2449.TW`); Unisem (`5005.KL`); Hana Micron (`067310.KQ`) | Siliconware within ASE and specialist packaging houses | Assembly, chiplets, 2.5D/3D integration, test and qualification |
| Distribution and electronics supply | Arrow Electronics (`ARW`); Avnet (`AVT`); WPG Holdings (`3702.TW`); WT Microelectronics (`3036.TW`); Macnica Holdings (`3132.T`) | Manufacturer-direct and specialist distributors | Component distribution, design support and supply-chain services |

---

# Layer 4 — Compute, Memory and Networking Systems

Layer 4 integrates semiconductor devices into boards, servers, storage, switches, optical systems, racks and clusters.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| AI accelerators and GPUs | NVIDIA (`NVDA`); AMD (`AMD`); Intel (`INTC`); Qualcomm (`QCOM`); Cambricon (`688256.SS`) | Cerebras; Groq; Tenstorrent; SambaNova; d-Matrix; FuriosaAI; Rebellions; Graphcore (SoftBank subsidiary); Biren Technology; Moore Threads; Enflame; Huawei Ascend | Training/inference accelerators and associated software stacks |
| Custom cloud accelerators | Alphabet (`GOOGL`, `GOOG`); Amazon (`AMZN`); Microsoft (`MSFT`); Meta (`META`); Alibaba (`BABA`, `9988.HK`); Baidu (`BIDU`, `9888.HK`) | ByteDance; Huawei | TPU, Trainium/Inferentia, Maia and other captive accelerators |
| Host CPUs and control processors | AMD (`AMD`); Intel (`INTC`); Arm (`ARM`); IBM (`IBM`); Qualcomm (`QCOM`); Apple (`AAPL`) | Ampere Computing (SoftBank); SiFive; Alibaba T-Head | Host CPUs, embedded processors and CPU IP |
| HBM and DRAM | SK hynix (`000660.KS`); Samsung Electronics (`005930.KS`); Micron (`MU`) | Packaging partners | High-bandwidth and system memory |
| NAND and enterprise storage media | Micron (`MU`); Kioxia (`285A.T`); Sandisk (`SNDK`); Samsung (`005930.KS`); SK hynix/Solidigm (`000660.KS`); Seagate (`STX`); Western Digital (`WDC`) | Solidigm (SK hynix subsidiary) | NAND, SSDs and HDDs |
| Switch silicon, NICs, DPUs and retimers | Broadcom (`AVGO`); NVIDIA (`NVDA`); Marvell (`MRVL`); Intel (`INTC`); AMD (`AMD`); Astera Labs (`ALAB`); Credo Technology (`CRDO`); Semtech (`SMTC`); MACOM (`MTSI`) | Xsight Labs; Enfabrica; Cornelis Networks | Scale-up/scale-out switching, I/O, connectivity and data movement |
| Server and storage OEMs | Dell Technologies (`DELL`); Hewlett Packard Enterprise (`HPE`); Lenovo (`0992.HK`); Super Micro Computer (`SMCI`); IBM (`IBM`); Pure Storage (`PSTG`); NetApp (`NTAP`) | VAST Data; WEKA; DDN | Servers, integrated systems, storage arrays and data platforms |
| ODMs and contract manufacturing | Hon Hai/Foxconn (`2317.TW`); Quanta Computer (`2382.TW`); Wiwynn (`6669.TW`); Wistron (`3231.TW`); Inventec (`2356.TW`); Pegatron (`4938.TW`); Celestica (`CLS`); Jabil (`JBL`); Flex (`FLEX`); Fabrinet (`FN`) | ZT Systems assets within AMD/Sanmina structures | Board, server, rack and network-system manufacturing |
| Network-system vendors | Arista Networks (`ANET`); Cisco (`CSCO`); HPE (`HPE`); Nokia (`NOK`); NVIDIA (`NVDA`); Extreme Networks (`EXTR`) | Juniper Networks (HPE subsidiary); DriveNets | Ethernet, InfiniBand, routing and network operating systems |
| Rack power and thermal interfaces | Vertiv (`VRT`); Schneider Electric (`SU.PA`); Eaton (`ETN`); Delta Electronics (`2308.TW`); Modine (`MOD`); nVent (`NVT`) | CoolIT Systems; Boyd; LiquidStack | Rack power, busbars, CDUs, cold plates and thermal integration |
| Cluster/system integration | Dell (`DELL`); HPE (`HPE`); Lenovo (`0992.HK`); Supermicro (`SMCI`); NVIDIA (`NVDA`); Eviden via Atos (`ATO.PA`); Penguin Solutions (`SGH`) | Specialist integrators | Validated clusters, supercomputers and commissioned AI systems |

---

# Layer 5 — Data Centres, Cloud and Edge Infrastructure

Layer 5 contains the facility, electrical/mechanical plant and central Layer 4 equipment; it hosts Layers 7–9.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Hyperscale cloud and self-build | Amazon (`AMZN`); Microsoft (`MSFT`); Alphabet (`GOOGL`); Meta (`META`); Oracle (`ORCL`); Alibaba (`BABA`); Tencent (`0700.HK`); Baidu (`BIDU`) | ByteDance; Huawei Cloud | Global cloud regions, AI campuses and captive infrastructure |
| Colocation and wholesale operators | Equinix (`EQIX`); Digital Realty (`DLR`); Iron Mountain (`IRM`); GDS Holdings (`GDS`); VNET (`VNET`); NEXTDC (`NXT.AX`); Keppel DC REIT (`AJBU.SI`) | QTS (Blackstone); CyrusOne (KKR/GIP); Vantage Data Centers (DigitalBridge); STACK Infrastructure (DigitalBridge); Aligned Data Centers (Macquarie); Compass Datacenters; EdgeConneX (EQT); Yondr | Powered shells, wholesale capacity and interconnection |
| GPU cloud and neocloud | CoreWeave (`CRWV`); Nebius (`NBIS`); IREN (`IREN`); Applied Digital (`APLD`); Hut 8 (`HUT`); TeraWulf (`WULF`); Northern Data (`NB2.DE`) | Crusoe; Lambda; Fluidstack; Together AI; Vultr | Accelerator capacity, AI clusters and managed training/inference |
| Site development and powered land | Digital Realty (`DLR`); Equinix (`EQIX`); American Tower (`AMT`); Prologis (`PLD`) where relevant | Tract; PowerHouse Data Centers; Rowan Digital Infrastructure; Related Digital; Edged Energy; Quantum Loophole | Site control, entitlement, grid/fibre development and powered land |
| Data-centre design and engineering | AECOM (`ACM`); Jacobs (`J`); WSP Global (`WSP.TO`); Arup peers | Arup; Burns & McDonnell; Black & Veatch; Corgan; Gensler | Architecture, civil, electrical, mechanical and programme design |
| General construction | Turner (Hochtief/ACS `ACS.MC`); EMCOR (`EME`); Comfort Systems USA (`FIX`); Sterling Infrastructure (`STRL`); Fluor (`FLR`); Skanska (`SKA-B.ST`) | DPR Construction; Mortenson; HITT; Holder Construction; Suffolk; Bechtel | Data-centre construction and installation |
| Electrical installation and grid connection | Quanta Services (`PWR`); EMCOR (`EME`); MYR Group (`MYRG`); Comfort Systems (`FIX`); MasTec (`MTZ`) | Cupertino Electric; Rosendin; Faith Technologies | Substations, cabling, busway and electrical fit-out |
| Mechanical and cooling plant | Vertiv (`VRT`); Schneider Electric (`SU.PA`); Johnson Controls (`JCI`); Trane (`TT`); Carrier (`CARR`); Modine (`MOD`); Munters (`MTRS.ST`); Daikin (`6367.T`) | CoolIT; LiquidStack; Submer; GRC; Boyd | Cooling, controls, liquid distribution and heat rejection |
| Backup power and UPS | Caterpillar (`CAT`); Cummins (`CMI`); GE Vernova (`GEV`); Eaton (`ETN`); Schneider (`SU.PA`); Vertiv (`VRT`); Bloom Energy (`BE`) | INNIO; Rolls-Royce Power Systems | Generators, UPS, fuel cells and power conditioning |
| Commissioning and testing | Bureau Veritas (`BVI.PA`); SGS (`SGSN.SW`); Intertek (`ITRK.L`); TÜV-related organisations | CxA specialists; Uptime Institute (Dominus Capital) | Commissioning, certification, reliability and performance testing |
| Operations and facility management | CBRE (`CBRE`); JLL (`JLL`); Cushman & Wakefield (`CWK`); Equinix (`EQIX`); Digital Realty (`DLR`) | Specialist critical-facility operators | Facility operations, maintenance and lifecycle management |

---

# Layer 6 — Connectivity and Communications

The chain is components → modules/cables → switching/transport → data-centre/metro → long-haul/subsea → peering/CDN/edge → access → endpoint.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Optical components and transceivers | Lumentum (`LITE`); Coherent (`COHR`); Fabrinet (`FN`); Applied Optoelectronics (`AAOI`); Innolight (`300308.SZ`); Eoptolink (`300502.SZ`); Accelink (`002281.SZ`); Hisense Visual (`600060.SS`) | Source Photonics; Hisense Broadband business | Lasers, modulators, photodetectors, optical engines and transceivers |
| Optical DSP and connectivity silicon | Marvell (`MRVL`); Broadcom (`AVGO`); MACOM (`MTSI`); Semtech (`SMTC`); Credo (`CRDO`); MaxLinear (`MXL`) | Coherent/optics internal silicon and specialist startups | DSPs, drivers, TIAs, PHYs and connectivity ICs |
| Fibre and optical cable | Corning (`GLW`); Prysmian (`PRY.MI`); Sumitomo Electric (`5802.T`); Furukawa Electric (`5801.T`); Yangtze Optical Fibre (`6869.HK`); Hengtong Optic-Electric (`600487.SS`); ZTT (`600522.SS`) | OFS (Furukawa subsidiary) | Fibre preforms, optical fibre, terrestrial and subsea cable |
| Connectors and copper interconnect | Amphenol (`APH`); TE Connectivity (`TEL`); CommScope (`COMM`); Belden (`BDC`); Molex peers | Molex (Koch); Samtec; Rosenberger | High-speed connectors, copper cable and passive interconnect |
| Data-centre switching | Arista (`ANET`); Cisco (`CSCO`); NVIDIA (`NVDA`); Nokia (`NOK`); HPE (`HPE`); Extreme (`EXTR`) | Juniper (HPE); DriveNets | Switches, routers and network software |
| Optical transport and DCI | Ciena (`CIEN`); Cisco (`CSCO`); Nokia (`NOK`); Huawei-related peers; ZTE (`0763.HK`, `000063.SZ`) | Infinera (Nokia subsidiary); Huawei | Coherent transport, routing and data-centre interconnect |
| Long-haul, metro and dark fibre | Lumen Technologies (`LUMN`); Cogent (`CCOI`); Tata Communications (`TATACOMM.NS`); NTT (`9432.T`); Deutsche Telekom (`DTE.DE`); Orange (`ORA.PA`) | Zayo; Colt (Fidelity); GTT; euNetworks (Stonepeak) | Backbone, wavelength, dark fibre and enterprise connectivity |
| Subsea cable ownership/supply | NEC (`6701.T`); Prysmian (`PRY.MI`); Alphabet (`GOOGL`); Meta (`META`); Amazon (`AMZN`); Microsoft (`MSFT`) | SubCom (Cerberus); consortium cable owners | Subsea systems, repeaters, cable ships and capacity |
| CDN and edge delivery | Cloudflare (`NET`); Akamai (`AKAM`); Fastly (`FSLY`); Amazon (`AMZN`); Alphabet (`GOOGL`); Microsoft (`MSFT`) | Private regional CDN providers | Content delivery, edge compute, security and traffic acceleration |
| Wireless access and private networks | Ericsson (`ERIC`); Nokia (`NOK`); Samsung Electronics (`005930.KS`); ZTE (`0763.HK`); Cisco (`CSCO`) | Huawei; Celona; Airspan-related assets | 5G/RAN, Wi-Fi, private wireless and core networks |
| Satellite connectivity | Amazon (`AMZN`); AST SpaceMobile (`ASTS`); Iridium (`IRDM`); Globalstar (`GSAT`); Eutelsat (`ETL.PA`); SES (`SESG.PA`) | SpaceX/Starlink | LEO/GEO capacity and remote connectivity |

---

# Layer 7 — Data and Knowledge Infrastructure

Layer 7 covers data rights, acquisition, ingestion, storage, quality, annotation, governance, retrieval, monitoring and feedback.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Cloud object/data storage | Amazon (`AMZN`); Microsoft (`MSFT`); Alphabet (`GOOGL`); Oracle (`ORCL`); IBM (`IBM`) | Cloud-provider internal services | Object, block, archival and managed database storage |
| Data warehouse and lakehouse | Snowflake (`SNOW`); Databricks peers; Oracle (`ORCL`); Microsoft (`MSFT`); Alphabet (`GOOGL`); Amazon (`AMZN`); Teradata (`TDC`) | Databricks | Warehouses, lakehouses and governed analytics platforms |
| Operational databases | MongoDB (`MDB`); Oracle (`ORCL`); Microsoft (`MSFT`); IBM (`IBM`); SAP (`SAP`) | Couchbase (Haveli Investments subsidiary); Redis; Cockroach Labs; SingleStore; Neo4j | Transactional, document, graph and distributed databases |
| Streaming and event data | IBM (`IBM`); Amazon (`AMZN`); Microsoft (`MSFT`); Alphabet (`GOOGL`) | Confluent (IBM subsidiary); Redpanda; Materialize | Event streaming, queues and real-time pipelines |
| Ingestion and transformation | Salesforce (`CRM`); Informatica within Salesforce; Palantir (`PLTR`) | Fivetran; dbt Labs; Airbyte; Matillion; Rivery | Connectors, ETL/ELT, transformation and integration |
| Catalogue, governance and lineage | IBM (`IBM`); Microsoft (`MSFT`); SAP (`SAP`); Oracle (`ORCL`); Salesforce (`CRM`) | Collibra; Alation; Atlan; data.world; BigID | Metadata, ownership, quality, lineage, privacy and access governance |
| Data observability | Datadog (`DDOG`); Dynatrace (`DT`); Elastic (`ESTC`); New Relic assets within Francisco Partners/TPG | Monte Carlo; Acceldata; Bigeye; Cribl | Pipeline health, quality monitoring, telemetry and incident detection |
| Vector databases and retrieval | Elastic (`ESTC`); MongoDB (`MDB`); Oracle (`ORCL`); Microsoft (`MSFT`); Amazon (`AMZN`); Alphabet (`GOOGL`) | Pinecone; Weaviate; Zilliz; Qdrant; Chroma | Embedding storage, vector search and retrieval infrastructure |
| Annotation and data operations | Appen (`APX.AX`); TELUS Digital (`TIXT`) | Scale AI; Surge AI; Sama; Labelbox; Snorkel AI; Toloka | Human/model-assisted labelling, RLHF data and evaluation data |
| Enterprise knowledge/search | Elastic (`ESTC`); Microsoft (`MSFT`); Alphabet (`GOOGL`); ServiceNow (`NOW`); Coveo (`CVO.TO`) | Glean; Sinequa; Hebbia | Search, retrieval, knowledge graphs and permissions-aware access |
| Licensed content and data owners | Reddit (`RDDT`); Getty Images (`GETY`); Shutterstock (`SSTK`); News Corp (`NWSA`); Thomson Reuters (`TRI`); RELX (`RELX`); Wiley (`WLY`) | Associated publishers, archives and specialist datasets | Text, image, legal, scientific and domain-specific licensed corpora |
| Synthetic data and simulation data | NVIDIA (`NVDA`); Dassault Systèmes (`DSY.PA`); Siemens (`SIE.DE`); Unity (`U`); Palantir (`PLTR`) | Parallel Domain; Mostly AI; Gretel; Synthesis AI | Synthetic environments, digital twins and privacy-preserving data |

---

# Layer 8 — AI Models and Inference

The chain is research/architecture → data/compute preparation → pre-training → post-training → evaluation/safety → optimisation → deployment → inference → monitoring → updating/licensing.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| General frontier-model developers | Alphabet (`GOOGL`); Meta (`META`); Microsoft (`MSFT`); Amazon (`AMZN`); Alibaba (`BABA`); Baidu (`BIDU`); Tencent (`0700.HK`); MiniMax (`0100.HK`); Zhipu AI (`2513.HK`) | OpenAI; Anthropic; xAI; Mistral AI; Cohere; DeepSeek; Moonshot AI; AI21 Labs; Aleph Alpha; Reka AI | Foundation models, multimodal models and APIs |
| Open-model ecosystems | Meta (`META`); Alibaba (`BABA`); Alphabet (`GOOGL`) | Hugging Face; Mistral AI; Stability AI; EleutherAI | Open weights, model repositories and community tooling |
| Vertical/domain models | Thomson Reuters (`TRI`); RELX (`RELX`); Adobe (`ADBE`); Intuit (`INTU`); Palantir (`PLTR`) | Harvey; Hippocratic AI; Abridge; Glean; Writer; Poolside; PhysicsX | Legal, healthcare, coding, finance, scientific and enterprise models |
| Model training platforms | Amazon (`AMZN`); Microsoft (`MSFT`); Alphabet (`GOOGL`); Oracle (`ORCL`); NVIDIA (`NVDA`) | Databricks/Mosaic AI; Anyscale; Together AI; CoreWeave platform services | Distributed training, fine-tuning and experiment infrastructure |
| Post-training and alignment | Appen (`APX.AX`); TELUS Digital (`TIXT`) | Surge AI; Scale AI; OpenAI; Anthropic; Snorkel AI | Preference data, reinforcement learning, red teaming and alignment |
| Evaluation and AI assurance | Microsoft (`MSFT`); Alphabet (`GOOGL`); IBM (`IBM`); Palantir (`PLTR`) | Scale AI; Arize AI; Fiddler AI; Patronus AI; Giskard; Galileo; Arthur AI | Capability, safety, bias, robustness and production evaluation |
| Optimisation and compilation | NVIDIA (`NVDA`); AMD (`AMD`); Intel (`INTC`); Qualcomm (`QCOM`); Arm (`ARM`) | Modular; OctoAI assets; Neural Magic assets within Red Hat/IBM; Deci assets | Compilers, kernels, quantisation and runtime optimisation |
| Inference engines and model serving | NVIDIA (`NVDA`); Microsoft (`MSFT`); Amazon (`AMZN`); Alphabet (`GOOGL`); Cloudflare (`NET`); CoreWeave (`CRWV`); Cerebras peers | Groq; Cerebras; Together AI; Fireworks AI; Baseten; Replicate; Modal; BentoML | Hosted APIs, dedicated inference, routing and serving runtimes |
| Model registry, monitoring and LLMOps | Datadog (`DDOG`); Dynatrace (`DT`); IBM (`IBM`); Microsoft (`MSFT`); Snowflake (`SNOW`) | Weights & Biases (CoreWeave); MLflow within Databricks; Arize AI; WhyLabs; Humanloop; LangSmith | Experiment tracking, registries, observability and feedback |

---

# Layer 9 — Agentic Software and Applications

The chain is model access/routing → context/memory → connectors/tools → planning/orchestration → secure execution → human oversight → application/UX → enterprise integration → operations.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Enterprise agent platforms | Microsoft (`MSFT`); Salesforce (`CRM`); ServiceNow (`NOW`); SAP (`SAP`); Oracle (`ORCL`); Alphabet (`GOOGL`); Amazon (`AMZN`); IBM (`IBM`); Palantir (`PLTR`) | OpenAI; Anthropic; Moveworks (ServiceNow subsidiary) | Enterprise copilots, agents, workflow platforms and control planes |
| Model gateways and routing | Cloudflare (`NET`); Microsoft (`MSFT`); Amazon (`AMZN`); Alphabet (`GOOGL`) | OpenRouter; Portkey; LiteLLM; Martian; Not Diamond | Multi-model access, routing, caching and cost controls |
| Agent frameworks and orchestration | Microsoft (`MSFT`); Alphabet (`GOOGL`) | LangChain; LlamaIndex; CrewAI; AutoGen ecosystem; Temporal; Prefect; Dagster | Planning, state, memory, tool use and multi-agent orchestration |
| Integration, iPaaS and automation | UiPath (`PATH`); Pegasystems (`PEGA`); Appian (`APPN`); Salesforce (`CRM`); ServiceNow (`NOW`); Microsoft (`MSFT`) | Automation Anywhere; Workato; Zapier; Make; n8n; Tray.ai; Boomi | Connectors, RPA, APIs and enterprise workflow integration |
| Process intelligence | SAP (`SAP`); UiPath (`PATH`); Microsoft (`MSFT`); ServiceNow (`NOW`) | Celonis; Soroco; FortressIQ assets | Process mining, task discovery and automation measurement |
| Coding agents and developer tools | Microsoft (`MSFT`); Alphabet (`GOOGL`); Amazon (`AMZN`); Atlassian (`TEAM`); GitLab (`GTLB`) | GitHub (Microsoft subsidiary); Anysphere/Cursor; Cognition; Replit; Codeium/Windsurf assets; Poolside; Magic | Code generation, software agents, review and developer automation |
| Knowledge-work applications | Adobe (`ADBE`); Intuit (`INTU`); Thomson Reuters (`TRI`); RELX (`RELX`); Zoom (`ZM`); DocuSign (`DOCU`) | Glean; Writer; Harvey; Sierra; Hebbia; Dust; Lindy; Aisera; Kore.ai | Sales, legal, finance, support, research and productivity agents |
| Identity and privileged access | Microsoft (`MSFT`); Okta (`OKTA`); CyberArk (`CYBR`); Cisco (`CSCO`); Broadcom (`AVGO`) | Beyond Identity; Aembit; SPIFFE/SPIRE ecosystem | Human/machine identity, secrets, permissions and zero trust |
| Observability and agent operations | Datadog (`DDOG`); Dynatrace (`DT`); Elastic (`ESTC`); Cloudflare (`NET`); Palantir (`PLTR`) | LangSmith; Arize AI; Braintrust; Helicone; AgentOps; Humanloop | Tracing, evaluation, incident response and cost/performance monitoring |
| Application security and AI security | Palo Alto Networks (`PANW`); CrowdStrike (`CRWD`); Cloudflare (`NET`); Zscaler (`ZS`); Fortinet (`FTNT`); Check Point (`CHKP`); Cisco (`CSCO`); F5 (`FFIV`) | Snyk; HiddenLayer; Protect AI assets within Palo Alto; Robust Intelligence within Cisco; Lakera within Check Point; CalypsoAI within F5 | Prompt/tool protection, model security, runtime controls and application defence |

---

# Layer 10 — Embodied AI and Autonomous Systems

Layer 10 combines structures, actuation, sensors, edge compute, energy/thermal systems, model/control integration, certification, deployment and fleet operations.

| Value-chain position | Public companies | Private, subsidiary or other organisations | What they provide |
|---|---|---|---|
| Humanoid and general-purpose robots | Tesla (`TSLA`); UBTECH Robotics (`9880.HK`); XPeng (`XPEV`, `9868.HK`); Xiaomi (`1810.HK`); Rainbow Robotics (`277810.KQ`) | Figure AI; Agility Robotics; Apptronik; Boston Dynamics (Hyundai); Sanctuary AI; 1X; Unitree; Fourier Intelligence; NEURA Robotics; PAL Robotics; EngineAI | Integrated humanoid/mobile-manipulation platforms |
| Industrial robot OEMs | FANUC (`6954.T`); Yaskawa (`6506.T`); ABB (`ABBN.SW`); Kawasaki Heavy (`7012.T`); Mitsubishi Electric (`6503.T`); Denso (`6902.T`); Omron (`6645.T`); Teradyne (`TER`) | KUKA (Midea); Stäubli; Universal Robots and MiR (Teradyne subsidiaries); Comau | Robot arms, cobots, controllers and factory automation |
| Warehouse and mobile robots | Symbotic (`SYM`); AutoStore (`AUTO.OL`); Ocado (`OCDO.L`); Zebra Technologies (`ZBRA`); Geek+ (`2590.HK`); SEER Robotics (`6106.HK`) | Locus Robotics; GreyOrange; Seegrid; Exotec; Hai Robotics; Addverb | AMRs, goods-to-person systems and warehouse automation |
| Autonomous driving platforms | Tesla (`TSLA`); Aurora Innovation (`AUR`); Mobileye (`MBLY`); Baidu (`BIDU`); Pony AI (`PONY`); WeRide (`WRD`) | Waymo (Alphabet subsidiary); Zoox (Amazon subsidiary); Nuro; Wayve; Waabi; Motional (Hyundai/Aptiv); May Mobility | Autonomous-driving stacks, robotaxis and delivery vehicles |
| Drones and autonomous aircraft | AeroVironment (`AVAV`); Kratos (`KTOS`); Joby Aviation (`JOBY`); Archer Aviation (`ACHR`); EHang (`EH`) | DJI; Zipline; Skydio; Shield AI; Anduril; Wing (Alphabet) | UAVs, autonomy, inspection, logistics and defence systems |
| Precision reducers, gears and bearings | Harmonic Drive Systems (`6324.T`); Nabtesco (`6268.T`); THK (`6481.T`); NSK (`6471.T`); SKF (`SKF-B.ST`); Schaeffler (`SHA.DE`); Timken (`TKR`) | Specialist gearbox and precision-mechanics suppliers | Strain-wave/cycloidal reducers, linear motion, bearings and joints |
| Motors and actuation | Nidec (`6594.T`); Moog (`MOG-A`); Parker-Hannifin (`PH`); SMC (`6273.T`); ABB (`ABBN.SW`); Yaskawa (`6506.T`) | maxon; Bosch Rexroth; Kollmorgen (Regal Rexnord); FAULHABER | Motors, drives, hydraulics, pneumatics and motion control |
| Machine vision and perception | Keyence (`6861.T`); Cognex (`CGNX`); Sony (`6758.T`); Teledyne (`TDY`); Basler (`BSL.DE`); Ouster (`OUST`); Hesai (`HSAI`); RoboSense (`2498.HK`); Innoviz (`INVZ`) | SICK; Orbbec; Prophesee; Lumotive | Cameras, lidar, depth, event sensing and industrial vision |
| Radar, IMU and force/tactile sensors | Infineon (`IFX.DE`); NXP (`NXPI`); STMicroelectronics (`STM`); TDK (`6762.T`); onsemi (`ON`); Analog Devices (`ADI`); Sensata (`ST`); TE Connectivity (`TEL`) | Robert Bosch; ATI Industrial Automation (Novanta); GelSight; XELA Robotics | Radar, inertial, force/torque, tactile and position sensing |
| Edge AI compute and modules | NVIDIA (`NVDA`); Qualcomm (`QCOM`); NXP (`NXPI`); Intel (`INTC`); AMD (`AMD`); Texas Instruments (`TXN`); Renesas (`6723.T`); Ambarella (`AMBA`) | Hailo; Axelera AI; SiMa.ai; Kinara assets | Edge SoCs, accelerators, safety MCUs and embedded modules |
| Batteries and power electronics | CATL (`300750.SZ`); BYD (`1211.HK`); LG Energy Solution (`373220.KS`); Panasonic (`6752.T`); Samsung SDI (`006400.KS`); Infineon (`IFX.DE`); STMicro (`STM`); onsemi (`ON`) | ProLogium; Factorial Energy; StoreDot | Cells, packs, BMS, chargers, inverters and motor drives |
| Simulation, digital twins and robot training | NVIDIA (`NVDA`); Siemens (`SIE.DE`); Dassault Systèmes (`DSY.PA`); PTC (`PTC`); Unity (`U`); Synopsys (`SNPS`) | Applied Intuition; Parallel Domain; PhysicsX; Intrinsic (Alphabet) | Simulation, synthetic data, digital twins and virtual commissioning |
| Fleet deployment and lifecycle service | ABB (`ABBN.SW`); FANUC (`6954.T`); Teradyne (`TER`); Symbotic (`SYM`); Zebra (`ZBRA`) | Formic; RobCo; InOrbit; Freedom Robotics; system integrators | Integration, robots-as-a-service, fleet management, maintenance and updates |

---

# Cross-Stack Overlay — Cybersecurity, Safety, Trust and Governance

This is not Layer 11. It spans the physical and logical stack.

| Security domain | Representative public companies | Representative private/subsidiary organisations | Layers primarily served |
|---|---|---|---|
| OT and critical-infrastructure security | Palo Alto Networks (`PANW`); Fortinet (`FTNT`); Cisco (`CSCO`); Check Point (`CHKP`); Honeywell (`HON`); Siemens (`SIE.DE`); Schneider (`SU.PA`) | Dragos; Claroty; Nozomi Networks; Armis | 1, 3, 5, 10 |
| Cloud and workload security | Palo Alto (`PANW`); CrowdStrike (`CRWD`); Zscaler (`ZS`); Cloudflare (`NET`); Microsoft (`MSFT`); Alphabet (`GOOGL`) | Wiz (Google subsidiary); Orca Security; Lacework assets; Aqua Security | 4, 5, 7–9 |
| Identity and machine authorization | Microsoft (`MSFT`); Okta (`OKTA`); CyberArk (`CYBR`); Cisco (`CSCO`) | Aembit; Beyond Identity; Teleport; SPIFFE/SPIRE | 5–10 |
| Data security and privacy | IBM (`IBM`); Microsoft (`MSFT`); Broadcom (`AVGO`); Thales (`HO.PA`); Cloudflare (`NET`) | BigID; Cyera; Immuta; Privacera | 7–9 |
| AI/model/agent security | Palo Alto (`PANW`); Cisco (`CSCO`); Check Point (`CHKP`); F5 (`FFIV`); IBM (`IBM`) | HiddenLayer; Protect AI (Palo Alto); Robust Intelligence (Cisco); Lakera (Check Point); CalypsoAI (F5); Prompt Security | 8–10 |
| Device, firmware and supply-chain security | Synopsys (`SNPS`); NXP (`NXPI`); Infineon (`IFX.DE`); STMicro (`STM`); Qualcomm (`QCOM`) | Finite State; Binarly; Eclypsium; Exein | 3, 4, 6, 10 |

---

# Commercial Section — Deployment, Integration and End Markets

This section is commercially important but is not an additional physical layer.

| Commercial position | Representative companies | Function |
|---|---|---|
| Global consultancies and transformation | Accenture (`ACN`); IBM (`IBM`); Capgemini (`CAP.PA`); Deloitte; PwC; EY; KPMG; Cognizant (`CTSH`); Tata Consultancy Services (`TCS.NS`); Infosys (`INFY`) | Strategy, integration, operating-model change and managed services |
| Engineering and industrial integration | Siemens (`SIE.DE`); ABB (`ABBN.SW`); Rockwell Automation (`ROK`); Honeywell (`HON`); Schneider (`SU.PA`); Emerson (`EMR`); PTC (`PTC`) | Factory/OT integration, controls, digital twins and lifecycle service |
| Cloud and AI system integration | Accenture (`ACN`); IBM (`IBM`); Microsoft (`MSFT`); Amazon (`AMZN`); Alphabet (`GOOGL`); Oracle (`ORCL`) | Cloud migration, AI platform deployment and managed operations |
| Data-centre integration | Dell (`DELL`); HPE (`HPE`); Lenovo (`0992.HK`); Supermicro (`SMCI`); NVIDIA (`NVDA`); Schneider (`SU.PA`); Vertiv (`VRT`) | Validated infrastructure and commissioning |
| Robotics integration and RaaS | ABB (`ABBN.SW`); FANUC (`6954.T`); Teradyne (`TER`); Symbotic (`SYM`); Zebra (`ZBRA`) plus regional integrators | Cell engineering, deployment, financing, fleet operation and maintenance |

---

# Database Maintenance Rules for Claude

1. Keep a canonical company ID independent of name, ticker and logo.
2. Store multiple listings separately from the company identity.
3. Allow multiple `layer_id` and `stage_id` mappings per company.
4. Distinguish `company`, `brand`, `subsidiary`, `joint venture` and `project`.
5. Record `parent_company_id`, ownership percentage where known and an `as_of_date`.
6. Never describe a private subsidiary as directly investable through its brand name.
7. Mark announced but incomplete acquisitions as `pending`; do not pre-merge them.
8. Maintain `evidence_url`, `last_verified_at` and `confidence` for every material mapping.
9. Do not infer leadership from inclusion or ordering.
10. Add companies only when their product/service can be tied to a defined value-chain stage.

## Recommended structured fields

`company_id`, `legal_name`, `display_name`, `entity_type`, `ownership_status`, `parent_company_id`, `public_private`, `exchange`, `ticker`, `isin`, `country`, `website_domain`, `layer_id`, `stage_id`, `role`, `product_examples`, `customer_type`, `evidence_url`, `as_of_date`, `confidence`, `logo_id`.

## Verification sources

Prioritise company filings and official product pages, followed by exchange records, regulator filings, industry associations and reputable business reporting. Useful directories include SEMI, JEDEC, the Open Compute Project, the Ultra Ethernet Consortium, UCIe Consortium, CXL Consortium, GSMA, IETF, NIST and IFR.

## Recent ownership corrections applied

The database incorporates material ownership changes through the version date. Claude should preserve these parent-child relationships and re-check them during future refreshes:

- Confluent became an IBM subsidiary when IBM completed its acquisition on 17 March 2026: <https://newsroom.ibm.com/2026-03-17-ibm-completes-acquisition-of-confluent%2C-making-real-time-data-the-engine-of-enterprise-ai-and-agents>
- Wiz became a Google subsidiary when Google completed its acquisition on 11 March 2026: <https://cloud.google.com/blog/products/identity-security/google-completes-acquisition-of-wiz>
- Lyten completed its acquisition of Northvolt's Swedish battery assets on 26 February 2026: <https://lyten.com/2026/02/26/lyten-completes-acquisition-of-northvolt-sweden-and-establishes-its-first-lyten-industrial-hub-in-sweden/>
- Ampere Computing became a SoftBank subsidiary after the acquisition closed in November 2025: <https://group.softbank/en/news/press/20251126>
- Juniper Networks became an HPE subsidiary on 2 July 2025: <https://www.hpe.com/us/en/newsroom/press-release/2025/07/hewlett-packard-enterprise-closes-acquisition-of-juniper-networks-to-offer-industry-leading-comprehensive-cloud-native-ai-driven-portfolio.html>
- Infinera became a Nokia subsidiary on 28 February 2025: <https://www.nokia.com/newsroom/nokia-completes-acquisition-of-infinera-to-create-innovation-powerhouse-in-optical-networks-with-the-scale-to-power-the-data-center-revolution/>
- Couchbase was taken private by Haveli Investments in September 2025; preserve Couchbase as a product/company brand but do not present `BASE` as a current investable ticker: <https://www.sec.gov/Archives/edgar/data/1845022/000119312525143735/d934361d8k.htm>
