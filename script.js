/* ══════════════════════════════════════════════════════════════════════════
   MULTI-PAGE GUARD
   The report is split across several pages, so any given page holds only a
   subset of the mount points the builders below write into. Rather than guard
   every call site, getElementById hands back a detached element when the id is
   not on this page: writes to it are discarded and the rest of the script runs
   unchanged.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  const real=document.getElementById.bind(document);
  document.getElementById=id=>real(id)||document.createElement('div');
})();

/* ══════════════════════════════════════════════════════════════════════════
   V4 — company reference data and per-layer value chains
   ══════════════════════════════════════════════════════════════════════════ */

/* Country of domicile and an approximate share of the specific niche named.
   Shares come from the report body where stated, otherwise from widely
   published industry estimates. Bases and dates differ between rows, so they
   indicate order of magnitude and position, not a like-for-like ranking.
   "n/d" means no share figure I am willing to state. */
const COMETA={
 '1|GE Vernova':['United States','≈30% heavy-duty gas turbines'],
 '1|Siemens Energy':['Germany','≈25% heavy-duty gas turbines'],
 '1|Schneider Electric':['France','Top three in DC electrical · n/d'],
 '1|Vertiv':['United States','Top two in DC power and thermal · n/d'],
 '1|Eaton':['Ireland / United States','n/d'],
 '1|Constellation Energy':['United States','Largest US nuclear fleet, ≈21 GW'],
 '1|Cleveland-Cliffs':['United States','100% of US grain-oriented electrical steel'],
 '2|MP Materials':['United States','Most advanced integrated non-Chinese rare earth position'],
 '2|Lynas Rare Earths':['Australia','The established non-Chinese separation capacity'],
 '2|Freeport-McMoRan':['United States','≈4bn lb of copper a year; largest listed pure-play'],
 '2|Aurubis':['Germany','Europe\u2019s largest copper smelter'],
 '2|Cleveland-Cliffs':['United States','100% of US grain-oriented electrical steel'],
 '2|Howmet Aerospace':['United States','Leading single-crystal superalloy castings'],
 '2|Linde':['United Kingdom / United States','≈25% of industrial gases'],
 '2|Wacker Chemie':['Germany','One of four electronic-grade polysilicon producers'],
 '2|Sibelco and The Quartz Corp (private)':['Belgium / Norway','≈80% of world high-purity quartz between them'],
 '3|ASML':['Netherlands','100% of EUV · ≈90% of lithography'],
 '3|TSMC':['Taiwan','≈65% of foundry revenue · >90% at leading edge'],
 '3|Cadence Design Systems':['United States','≈30% of EDA'],
 '3|Synopsys':['United States','≈32% of EDA'],
 '3|Applied Materials':['United States','≈18% of wafer fab equipment'],
 '3|Lam Research':['United States','≈13% of wafer fab equipment'],
 '3|KLA':['United States','>50% of process control'],
 '3|ASE Technology':['Taiwan','≈30% of outsourced assembly and test'],
 '4|NVIDIA':['United States','≈85–90% of AI accelerators'],
 '4|Broadcom':['United States','Leading custom AI ASIC and DC networking silicon'],
 '4|AMD':['United States','Low single digits of AI accelerators'],
 '4|SK hynix':['South Korea','≈50–60% of HBM'],
 '4|Micron Technology':['United States','≈20% of HBM · ≈22% of DRAM'],
 '4|Marvell Technology':['United States','Number two in custom silicon · n/d'],
 '4|Arista Networks':['United States','≈25% of high-speed DC switching'],
 '5|Alphabet':['United States','≈13% of cloud infrastructure'],
 '5|Microsoft':['United States','≈20–25% of cloud infrastructure'],
 '5|Amazon':['United States','≈29% of cloud infrastructure'],
 '5|Meta Platforms':['United States','Self-consumption — not a merchant provider'],
 '5|Oracle':['United States','Low single digits of cloud infrastructure'],
 '5|CoreWeave':['United States','Largest listed neocloud · n/d'],
 '5|Equinix':['United States','≈10% of retail colocation'],
 '6|Alphabet':['United States','n/d — frontier model share is contested'],
 '6|Microsoft':['United States','n/d — distribution rather than model share'],
 '6|Meta Platforms':['United States','Leading Western open-weight releases'],
 '6|Palantir':['United States','n/d — deployment layer, not a frontier lab'],
 '6|OpenAI (private)':['United States','Leading consumer assistant reach · n/d'],
 '6|Anthropic (private)':['United States','Leading enterprise API traction · n/d'],
 '6|DeepSeek and Alibaba Qwen':['China','Leading non-Western open-weight models'],
 '7|CrowdStrike':['United States','≈18% of modern endpoint security'],
 '7|Palo Alto Networks':['United States','≈20% of network security'],
 '7|Microsoft':['United States','Largest security vendor by revenue'],
 '7|Snowflake':['United States','≈20% of cloud data warehousing'],
 '7|Datadog':['United States','≈12% of observability'],
 '7|ServiceNow':['United States','≈40% of IT service management'],
 '7|Salesforce':['United States','≈20% of CRM'],
 '8|Harmonic Drive Systems':['Japan','>50% of high-precision strain-wave reducers'],
 '8|Nabtesco':['Japan','>60% of RV cycloidal reducers'],
 '8|Sony':['Japan','>50% of image sensors · in ≈80% of humanoids'],
 '8|NVIDIA':['United States','≈80–90% of humanoid AI compute'],
 '8|THK and Hiwin':['Japan / Taiwan','Leaders in linear motion · n/d'],
 '8|Tesla':['United States','n/d — pre-commercial in humanoids'],
 '8|Hyundai (Boston Dynamics)':['South Korea','n/d — pre-commercial in humanoids'],
  '8|Keyence':['Japan','Leader in machine vision and factory sensing · n/d'],
  '8|Alphabet (Waymo)':['United States','Largest US driverless commercial fleet'],
 '8|Deere':['United States','≈50% of US large agricultural equipment'],
 '8|Scale AI, Surge, Mercor (private)':['United States','Private — no reliable share disclosed']};

/* Who depends on whom, stage by stage. Chokepoint stages are flagged. */
/* What each entity supplies at the point it appears in a chain. Role
   identification written for this report, not a sourced share claim; the
   market column beside it carries the figures, and says n/d where none is
   stated. */
const CDESC={"ABB": "Swiss-Swedish electrical group; switchgear, drives and data centre power distribution.", "AMD": "The credible second source in both server CPUs and AI accelerators.", "ASE": "Taiwan’s largest outsourced assembly and test house.", "ASML": "Sole maker of EUV lithography machines. No substitute exists at the leading edge.", "AT&S": "Austrian maker of IC substrates and high-end printed circuit boards.", "ATI Industrial": "Robotic end-effectors, tool changers and force-torque sensors.", "AWS": "Amazon’s cloud arm, and the largest renter of accelerator capacity.", "AWS Trainium": "Amazon’s in-house training accelerator, built to cut its merchant silicon bill.", "Adobe": "Creative and document software; an incumbent testing whether agents erode seat pricing.", "AgiBot": "Chinese humanoid developer shipping units at aggressive price points.", "Agility": "US humanoid maker; its Digit platform is in warehouse pilots.", "Air Liquide": "French industrial gases group supplying fab-grade bulk and specialty gases.", "Ajinomoto": "Makes the insulating build-up film used in nearly every high-end IC substrate.", "Alfa Laval": "Swedish heat exchanger specialist used in data centre cooling loops.", "Alibaba Qwen": "Alibaba’s open-weight model family, widely deployed across Chinese industry.", "Amazon": "Hyperscaler, accelerator designer, and the largest cloud operator.", "Amkor": "US-listed outsourced assembly and test provider, second to ASE.", "Amphenol": "High-speed connectors and cable assemblies inside and between racks.", "Anthropic": "Frontier model lab; developer of Claude.", "Applied Materials": "The broadest wafer fab equipment portfolio; leads deposition, implant and polishing.", "Apptronik": "US humanoid developer working with Mercedes-Benz on plant deployment.", "Arista": "High-speed data centre Ethernet switching, taking share from InfiniBand.", "Arm": "Licenses the instruction set behind most edge silicon and a rising share of server CPUs.", "Astera Labs": "Connectivity silicon that keeps PCIe and CXL links viable at rack scale.", "Aurubis": "Europe’s largest copper smelter and refiner.", "Azure": "Microsoft’s cloud, and the primary compute host for OpenAI.", "BHP": "Diversified miner; copper is the input that matters to this stack.", "BMW": "Carmaker running humanoid pilots on its own assembly lines.", "Baseten": "Inference hosting for teams that would rather not run a serving stack.", "Boliden": "Swedish miner and smelter of copper and zinc.", "Bosch": "Automotive-grade sensors and actuators, transferable to robotics volume.", "Boston Dynamics": "Hyundai-owned robotics developer; Atlas is the reference humanoid platform.", "Boyd": "Liquid cooling loops, cold plates and thermal assemblies.", "Broadcom": "Custom AI accelerators and the switch silicon most data centre networks are built on.", "Cadence": "One of two companies a modern chip can realistically be designed in.", "Cameco": "Canadian uranium miner; fuel for the reactors backing nuclear-powered halls.", "Carpenter Technology": "Specialty alloys for turbine hot sections and precision components.", "Caterpillar": "Standby generators and prime power for sites the grid cannot yet serve.", "ChatGPT": "OpenAI’s consumer surface, and the largest single distribution point for a model.", "China separation capacity": "The state-backed refining base that separates most of the world’s rare earths.", "Claude": "Anthropic’s model family, distributed through its own apps and cloud partners.", "Clayco": "US design-build contractor active in data centre construction.", "Cleveland-Cliffs": "The only domestic US producer of grain-oriented electrical steel.", "Coherent": "Optical transceivers, lasers and photonic components for rack-to-rack links.", "Confluent": "Streaming data platform; moves enterprise events to where models can use them.", "Constellation": "Operator of the largest US nuclear fleet; sells firm power to hyperscalers.", "Copilot": "Microsoft’s assistant surface, bundled through Windows and Office.", "CoreWeave": "Neocloud renting accelerator capacity at scale to labs and enterprises.", "Corning": "Optical fibre and specialty glass, including fibre for data centre interconnect.", "Credo": "Active electrical cables and SerDes that extend copper reach inside a rack.", "CrowdStrike": "Endpoint and workload security, extending into machine identity.", "Cummins": "Diesel and gas generating sets for backup and bridging power.", "DPR": "US contractor with a large mission-critical and data centre practice.", "Databricks": "Data and model platform where enterprises keep the context agents need.", "Datadog": "Observability; consumption pricing tracks agent volume rather than headcount.", "DeepSeek": "Chinese lab whose open-weight releases reset cost expectations for frontier training.", "Dell": "Servers and storage, and one of the largest integrators of accelerator racks.", "Digital Realty": "Wholesale data centre landlord leasing halls to hyperscalers and enterprises.", "Dynatrace": "Application observability and automated root-cause analysis.", "Eaton": "Power distribution, switchgear and uninterruptible supply for critical facilities.", "Enterprise APIs": "Model access sold as a metered API — a cost line, not an owned asset.", "Enterprises": "The end buyers of agent software, and the owners of the context it needs.", "Equinix": "The largest colocation and interconnection operator.", "Fabrinet": "Contract manufacturer that builds much of the world’s high-end optical hardware.", "Figure": "US humanoid developer with a BMW deployment and its own model stack.", "Fireworks": "Fast inference hosting for open-weight models.", "Foxconn": "The largest contract manufacturer; assembles servers and, increasingly, robots.", "Freeport-McMoRan": "The largest listed copper pure-play.", "Frontier labs": "The handful of organisations running training at the capability frontier.", "GE Vernova": "Heavy-duty gas turbines and grid equipment; delivery slots sold years forward.", "Gemini": "Google’s model family, distributed through Search, Workspace and Cloud.", "GlobalFoundries": "Foundry for mature and specialty nodes rather than the leading edge.", "Google": "Hyperscaler, frontier lab, and designer of its own accelerators.", "Google Cloud": "Google’s cloud arm; sells both its own TPU and merchant accelerator capacity.", "Google DeepMind": "Google’s frontier research and model organisation.", "Google TPU": "Google’s in-house training and inference accelerator, now several generations deep.", "Governments": "Sovereign buyers funding national compute and model programmes.", "Grafana": "Open-source dashboards and metrics for the systems agents run on.", "Green Harmonic": "Chinese harmonic reducer maker attacking Japanese pricing.", "HPE": "Servers, high-performance systems, and networking after the Juniper acquisition.", "Harmonic Drive Systems": "The incumbent in strain-wave reducers — the joint most humanoids depend on.", "Hemlock": "US producer of electronic-grade polysilicon; privately held.", "Hitachi Energy": "Transformers, HVDC and grid equipment; order books stretch years out.", "Hiwin": "Taiwanese maker of ball screws, linear guides and robot joints.", "Howmet": "Single-crystal superalloy castings for turbine hot sections.", "Hyperscalers": "The handful of buyers whose capital spending sets demand for the whole stack.", "Hyundai Mobis": "Hyundai’s components arm; actuators and modules for its robotics programmes.", "Ibiden": "Japanese maker of the high-layer-count IC substrates advanced packages need.", "InnoLight": "Chinese optical transceiver maker, dominant in high-speed volume.", "Intel Foundry": "Intel’s contract manufacturing arm, attempting to become a credible second source.", "Intuit": "Financial software; an incumbent testing agent pricing against seats.", "JL MAG": "The largest Chinese sintered rare earth magnet producer.", "JSR": "Japanese photoresist maker; one of a handful qualified at the leading edge.", "KLA": "Process control — metrology and inspection — at every stage of the fab.", "Kazatomprom": "The world’s largest uranium producer, state-controlled in Kazakhstan.", "Lam Research": "Etch and deposition; the key enabler as memory and logic go vertical.", "LangChain": "Framework for chaining model calls into applications and agents.", "Layer 6": "The models themselves, bought as an input by everything above.", "Licensed corpora": "Text, image and video licensed from publishers rather than scraped.", "Leader Drive": "Chinese harmonic reducer maker, one of the domestic challengers on price.", "Linde": "The largest industrial gases group; bulk and specialty gases for fabs.", "LiquidStack": "Immersion and direct-to-chip liquid cooling systems.", "Logistics operators": "Warehouse and fulfilment operators — the first real market for humanoid fleets.", "Lumentum": "Lasers and optical components for transceivers.", "Lynas": "The largest rare earth separator outside China.", "Lynas Malaysia": "Lynas’s Malaysian separation plant — the established non-Chinese capacity.", "MP Materials": "The only integrated US rare earth miner and separator.", "MYR Group": "Electrical contractor building transmission and substation infrastructure.", "Magnet motor makers": "The assemblers turning magnets and windings into finished motors.", "Maintenance depots": "The service network a deployed robot fleet needs and does not yet have.", "Marvell": "Custom silicon and data centre interconnect; the number two in custom accelerators.", "Mercor": "Marketplace supplying expert human data for model training and evaluation.", "Meta": "Hyperscaler consuming its own compute; publisher of the Llama open weights.", "Micron": "US memory maker, and the only non-Korean source of high-bandwidth memory.", "Microsoft": "Hyperscaler, OpenAI’s compute partner, and the largest enterprise software vendor.", "Microsoft Entra": "Microsoft’s identity platform, where machine identity is being defined.", "Mistral": "European frontier lab shipping both open-weight and hosted models.", "Mitsubishi Heavy": "Japanese heavy engineering; gas turbines and nuclear plant.", "Model labs": "The organisations that train and sell frontier models.", "MongoDB": "Document database widely used as the store behind agent applications.", "Mortenson": "US contractor with a large data centre and renewable construction practice.", "Motivair (Schneider)": "High-density liquid cooling, acquired by Schneider Electric.", "NSK": "Japanese precision bearings and ball screws.", "NVIDIA": "The dominant accelerator vendor; its software stack is why customers stay.", "NVIDIA Jetson": "NVIDIA’s edge compute module — the default brain in most robot prototypes.", "NVIDIA NVLink": "NVIDIA’s scale-up fabric for linking accelerators inside a rack.", "Nabtesco": "The incumbent in cycloidal reducers for heavy robot joints.", "Neo Performance": "Rare earth processor and magnet maker with non-Chinese capacity.", "Neoclouds": "Accelerator-first cloud providers renting the capacity hyperscalers do not.", "NextEra": "The largest US renewables developer; power purchase agreements for new halls.", "Nidec": "The largest precision motor maker, scaling into robot actuators.", "Nippon Steel": "Japanese steelmaker; electrical steel for transformer cores.", "OCI": "Oracle’s cloud, and a growing host for frontier training workloads.", "Okta": "Identity and access management, extending to non-human identities.", "On-robot selection": "Deciding on board which sensor data is worth transmitting at all.", "Open weights": "Freely downloadable model weights — the floor under API pricing.", "OpenAI": "Frontier lab; ChatGPT is the largest consumer distribution of a model.", "Oracle": "Enterprise software, and a cloud increasingly rented to model labs.", "POSCO": "Korean steelmaker; electrical steel and battery materials.", "Palo Alto Networks": "Network and cloud security across enterprise estates.", "Precision Castparts": "Berkshire-owned maker of superalloy castings and forgings.", "Prysmian": "The largest cable maker; high-voltage transmission and data centre cabling.", "Qualcomm": "Edge and mobile silicon, pushing into on-device inference.", "Quanta": "Taiwanese ODM assembling a large share of the world’s AI servers.", "Quanta Services": "US electrical infrastructure contractor building transmission and substations.", "Regal Rexnord": "Motors, gearing and power transmission components.", "Renishaw": "Precision encoders and metrology; position feedback for robot joints.", "Rio Tinto": "Diversified miner; copper, aluminium and lithium.", "Rosendin": "One of the largest US electrical contractors — the binding trade on site.", "SAP": "Enterprise resource planning, where much industrial process context lives.", "SK hynix": "The leading supplier of high-bandwidth memory to accelerator makers.", "SUMCO": "Japanese silicon wafer maker; one of a handful at leading-edge quality.", "Salesforce": "Enterprise applications; the clearest test of agents against seat pricing.", "Samsung": "Memory, foundry and consumer electronics conglomerate.", "Samsung Foundry": "Samsung’s contract manufacturing arm — the only other leading-edge logic source.", "Sanhua": "Chinese thermal components maker moving into robot actuators.", "Scale AI": "Data labelling and evaluation for model training.", "Schneider": "Schneider Electric’s data centre power and cooling business.", "Schneider Electric": "French electrical group; power distribution, UPS and cooling for data halls.", "ServiceNow": "Workflow automation, positioning agents as the execution layer for enterprise process.", "Shin-Etsu": "The largest silicon wafer maker, and a major photoresist supplier.", "Shinko": "Japanese IC substrate maker for high-end packages.", "Sibelco": "Belgian minerals group, and a source of high-purity quartz.", "Siemens": "German industrial group; electrification, automation and factory software.", "Siemens EDA": "Siemens’ chip design software arm, the third EDA vendor.", "Siemens Energy": "Gas turbines, grid technology and transformers.", "Snowflake": "Cloud data warehouse; enterprise context for retrieval and agents.", "Solvay": "Belgian chemicals group; rare earth processing and specialty materials.", "Sony": "Image sensors — the dominant supplier for the cameras robots see with.", "Sovereign programmes": "State-funded national compute and model efforts.", "Splunk (Cisco)": "Log analytics and security operations, now inside Cisco.", "Supermicro": "Server integrator that scaled fastest on accelerator rack demand.", "Surge": "Human data provider for model training and evaluation.", "Synopsys": "The largest design software vendor — the other half of the EDA duopoly.", "Synthetic generation": "Training data the labs produce themselves rather than collect.", "THK": "Japanese linear motion and ball screw maker.", "TSMC": "Manufactures the overwhelming majority of leading-edge logic.", "TSMC CoWoS": "TSMC’s advanced packaging line — the binding constraint on accelerator supply.", "Talen": "Independent power producer selling nuclear output directly to data centres.", "Temporal": "Durable execution framework for long-running agent workflows.", "Tesla": "Vehicle fleet, in-house silicon, and the Optimus humanoid programme.", "The Quartz Corp": "Norwegian-French producer of ultra-high-purity quartz.", "Together": "Inference and training hosting for open-weight models.", "Tokuyama": "Japanese producer of polysilicon and electronic materials.", "Tokyo Electron": "Coaters and deposition; a near monopoly in track systems.", "Transformer makers": "The transformer industry as a whole; lead times measured in years.", "Tuopu": "Chinese automotive components supplier moving into humanoid actuators.", "Turbine OEMs": "The three companies able to supply heavy-duty gas turbines at scale.", "Turner": "One of the largest US construction managers.", "UBTech": "Chinese humanoid maker shipping into education and industrial pilots.", "Unimicron": "Taiwanese IC substrate and printed circuit board maker.", "Unitree": "Chinese robot maker undercutting Western humanoid pricing sharply.", "Utilities": "The regulated utilities whose interconnection queues set the schedule.", "Vertiv": "Data centre power and thermal management; a primary liquid cooling supplier.", "Vistra": "Independent power producer with nuclear and gas capacity.", "Wacker Chemie": "German chemicals group; one of few electronic-grade polysilicon producers.", "Wafer makers": "The silicon wafer industry — a handful of firms at leading-edge quality.", "Wistron": "Taiwanese ODM building AI servers and modules.", "Zeiss SMT": "Makes the optics inside every EUV scanner — a monopoly upstream of ASML.", "Zscaler": "Cloud security; zero-trust access for users and workloads.", "xAI": "Frontier lab, training on its own Colossus cluster.", "Microsoft Maia": "Microsoft’s in-house AI accelerator, designed to run Azure and OpenAI workloads on its own silicon.", "Meta MTIA": "Meta’s in-house training and inference accelerator, built for its own ranking and model workloads.", "Tesla AI5": "Tesla’s next-generation inference chip for the vehicle fleet and Optimus."};

const PROC={"3": {"t": "Inside wafer fabrication", "lead": "One layer of a chip is built by this sequence, and the sequence is then repeated — dozens of times for a leading-edge part. Early layers carry the smallest features and need the most capable machines; later layers do not. Almost every step has a different owner, which is why no single company can supply a fab.", "steps": [["Deposition", "Applied Materials", "Material is laid down across the wafer, a film at a time."], ["Coat and develop", "Tokyo Electron", "The wafer is coated in light-sensitive photoresist, then developed after exposure. A near monopoly in coaters."], ["Lithography", "ASML", "The pattern is projected through a reticle onto the resist. The only source of EUV machines in the world."], ["Etch", "Lam Research", "Exposed material is removed to leave the pattern behind. The step that matters most as devices go vertical."], ["Ion implantation", "Applied Materials", "Ions are driven into the wafer to set its electrical properties."], ["Clean and polish", "Applied Materials", "Contaminants are washed off and the surface is polished flat enough to take the next layer."], ["Metrology and inspection", "KLA", "Wafers are measured and checked for defects throughout, and the results fed back to raise yield. Over half the market."]], "note": "Once the last layer is complete the wafer is cut into die and packaged — and for accelerators it is that packaging step, not any of the ones above, that is currently rationing supply.", "src": "Sequence and vendor positions per Generative Value, “A Primer on Semiconductor Capital Equipment” and “An Overview of the Semiconductor Industry”."}, "5": {"t": "What a hall is actually made of", "lead": "Roughly half to sixty per cent of a data centre’s cost is the IT it holds; the rest is the building that keeps it powered and cool. Power management is the largest line in that second half, which is why an electrical supply chain sits underneath a compute thesis.", "steps": [["Compute", "NVIDIA", "Accelerators and the CPUs beside them. The single largest line in the budget, and the one that depreciates fastest."], ["Networking", "Arista", "Switches, network cards and the fabric between racks. Ethernet has been taking share from InfiniBand."], ["Storage", "Dell", "Flash and disk for the training corpus and checkpoints. Small next to compute, but it gates utilisation."], ["Servers", "Supermicro", "Integration of silicon, memory, networking and cooling into a rack. ODMs increasingly sell direct to hyperscalers, bypassing the brands."], ["Power management", "Schneider Electric", "Distribution, generators and uninterruptible supply — the biggest facility cost of the lot."], ["Cooling", "Vertiv", "Chillers, air handlers and, increasingly, direct liquid to the chip."], ["Operator", "Equinix", "Whoever builds, hosts and manages the hall. Colocation lets a tenant rent space rather than build it."]], "note": "The split matters for who captures the spend: the IT half is concentrated in a handful of silicon vendors, while the facility half is spread across industrial companies with far longer order books and far less pricing power over their customers.", "src": "Cost split, segment structure and vendor positions per Generative Value, “A Primer on Data Centers”."}};

const CHAIN={
1:{lead:'Fuel and metal at one end, a powered rack at the other. The two stages that stop the project are both metallurgical.',
 stages:[
  {t:'Fuel and critical metal',w:'Uranium, gas, and the two metallurgical inputs a turbine hall cannot be built without: grain-oriented electrical steel for transformer cores, single-crystal superalloy castings for hot-section blades.',n:['Cameco','Kazatomprom','Cleveland-Cliffs','Freeport-McMoRan','Howmet','Carpenter Technology'],c:1,note:'Grain-oriented electrical steel and single-crystal turbine castings'},
  {t:'Generation',w:'Turbines, reactors and the merchant fleets that own them. Firm new capacity is sold years forward, so a project buys a delivery slot rather than a machine.',n:['GE Vernova','Siemens Energy','Mitsubishi Heavy','Constellation','Vistra','NextEra'],c:1,note:'Turbine slots sold to 2031'},
  {t:'Transmission and interconnect',w:'Moving the electricity from where it is made to where the racks sit: high-voltage cable, substations, and the contractors who build and energise them.',n:['Hitachi Energy','Prysmian','Quanta Services','MYR Group'],note:'Five to seven year queues'},
  {t:'On-site electrical plant',w:'Everything between the substation fence and the rack — transformers, switchgear, busway, uninterruptible supply. The longest single lead time in the build.',n:['Schneider Electric','Eaton','ABB','Vertiv','Siemens'],c:1,note:'Large power transformers at 128 weeks'},
  {t:'Thermal and the rack',w:'Rejecting the heat the accelerators make: chillers, coolant distribution units, cold plates and the rack itself.',n:['Vertiv','Motivair (Schneider)','Boyd','Alfa Laval','LiquidStack'],note:'Fragmented — top seven vendors hold ~35%'}]},
2:{lead:'Ore at one end, a qualified process material at the other. Mining is the diversified step and almost never the constraint; every stage after it narrows.',
 stages:[
  {t:'Extraction',w:'Digging up ore, pumping brine and recovering by-products. Geographically diverse, and on its own no chokepoint at all.',n:['Freeport-McMoRan','BHP','Rio Tinto','Lynas','MP Materials','Cameco','Sibelco','The Quartz Corp'],note:'The least concentrated stage in the whole report'},
  {t:'Refining and separation',w:'Turning ore into a purified metal or oxide. Separating the individual rare earth elements is the step that concentrates.',n:['China separation capacity','Aurubis','Boliden','Lynas Malaysia','Solvay','Neo Performance','JL MAG'],c:1,note:'China holds 86–90% of rare earth separation'},
  {t:'Purification to electronic grade',w:'Driving impurities down to parts per billion. Electronic-grade polysilicon and high-purity quartz are made by a handful of firms and nobody else.',n:['Wacker Chemie','Hemlock','Tokuyama','OCI','Shin-Etsu','SUMCO','Linde','Air Liquide'],c:1,note:'Four producers of eleven-nines polysilicon'},
  {t:'Transformation',w:'Converting purified material into the form the stack consumes: sintered magnets, single-crystal castings, annealed strip, drawn wire.',n:['Cleveland-Cliffs','Nippon Steel','POSCO','Howmet','Carpenter Technology','Precision Castparts','JL MAG'],c:1,note:'Annealing, single-crystal casting, magnet sintering'},
  {t:'Qualified into the infrastructure stack',w:'Certification into a customer\'s process. Requalifying a wafer line or a transformer core takes years, and that is where the switching cost actually sits.',n:['Transformer makers','Turbine OEMs','Wafer makers','Magnet motor makers'],note:'Requalification takes years, which is the real switching cost'}]},
3:{lead:'The most concentrated chain in the report. Almost every stage has fewer than five credible suppliers, and two have exactly one.',
 stages:[
  {t:'Materials and gases',w:'Blank wafers, photoresists, specialty gases, and the ultra-high-purity quartz the crucibles themselves are made from.',n:['Sibelco','The Quartz Corp','Shin-Etsu','SUMCO','Linde','Air Liquide','JSR','Ajinomoto'],c:1,note:'Two mines in one North Carolina district'},
  {t:'Design tools and IP',w:'The software a chip is designed in and the processor architectures it is designed around. Nothing reaches a fab without passing through here.',n:['Cadence','Synopsys','Arm','Siemens EDA'],note:'Effective duopoly in EDA'},
  {t:'Equipment',w:'The wafer fab equipment that deposits, patterns, etches and inspects every layer. Each vendor owns a different step, and almost none of them compete.',n:['ASML','Zeiss SMT','Applied Materials','Lam Research','KLA','Tokyo Electron'],c:1,note:'Zeiss is a monopoly upstream of ASML\u2019s monopoly'},
  {t:'Wafer fabrication',w:'Running the process: hundreds of steps, repeated layer by layer, that turn a blank wafer into finished die.',n:['TSMC','Samsung Foundry','Intel Foundry','GlobalFoundries'],c:1,note:'>90% of leading-edge logic in one company'},
  {t:'Advanced packaging and test',w:'Cutting, stacking and bonding die onto a substrate, then testing them. Packaging, not lithography, is what currently rations accelerators.',n:['TSMC CoWoS','Ibiden','Shinko','Unimicron','AT&S','ASE','Amkor'],c:1,note:'The binding constraint on accelerator supply'}]},
4:{lead:'Design sits in the middle and captures most of the margin, but it depends on a foundry it does not own and a memory oligopoly it cannot expand.',
 stages:[
  {t:'Foundry and memory',w:'The two manufactured inputs an accelerator cannot exist without: leading-edge logic wafers and high-bandwidth memory stacks.',n:['TSMC','SK hynix','Micron','Samsung'],c:1,note:'HBM sold out across all three suppliers'},
  {t:'Accelerator design',w:'Designing the processors themselves, merchant and custom, together with the software stack that keeps customers on them.',n:['NVIDIA','AMD','Broadcom','Marvell','Google TPU','AWS Trainium','Microsoft Maia','Meta MTIA','Tesla AI5'],note:'Where the margin pools. Read the design-model note on each row: the merchant vendors sell silicon, the hyperscalers and Tesla design it only to consume it themselves.'},
  {t:'Interconnect and networking',w:'Moving data between accelerators and between racks — switch silicon, network cards, and the scale-up fabric inside a rack.',n:['NVIDIA NVLink','Broadcom','Arista','Astera Labs','Credo'],note:'Scale-up versus scale-out is the live standards fight'},
  {t:'Optics and cabling',w:'The physical links between racks. Transceiver volume rises faster than accelerator count as clusters get larger.',n:['Coherent','Lumentum','Fabrinet','InnoLight','Amphenol','Corning'],note:'Volume rises faster than accelerator count'},
  {t:'System integration',w:'Assembling silicon, memory, networking and cooling into a rack that can be shipped, installed and powered.',n:['Foxconn','Quanta','Wistron','Supermicro','Dell','HPE'],note:'Thin margin, high volume'},
  {t:'Buyer',w:'Demand sits with a handful of hyperscalers and model labs, which is what makes the order book simultaneously enormous and fragile.',n:['Hyperscalers','Neoclouds','Sovereign programmes'],note:'Concentrated demand, few buyers'}]},
5:{lead:'The operator sits at the end of the chain and pays everyone in it. That is the arithmetic case for owning suppliers rather than owners.',
 stages:[
  {t:'Power and land',w:'Securing a site that can actually be energised. A rounding error in the budget and effectively all of the schedule risk.',n:['Constellation','Vistra','NextEra','Talen','Utilities'],c:1,note:'0.9% of budget, 100% of schedule risk'},
  {t:'Design and construction',w:'Engineering and building the shell and the electrical rooms. Skilled electricians, not concrete, are the binding trade.',n:['Turner','DPR','Mortenson','Clayco','Rosendin','Quanta Services'],note:'Electricians are the binding trade'},
  {t:'Critical equipment',w:'Long-lead plant ordered before the ground is broken: transformers, generators, switchgear, chillers.',n:['Vertiv','Schneider','Eaton','Cummins','Caterpillar'],note:'Ordered before the land is bought'},
  {t:'Compute fit-out',w:'The racks themselves. Compute, networking and storage account for roughly half to sixty per cent of total project cost.',n:['NVIDIA','Broadcom','SK hynix','Supermicro','Dell'],note:'56% of the capital'},
  {t:'Operator',w:'Whoever owns, leases or runs the finished hall — and therefore carries the depreciation and the debt.',n:['AWS','Azure','Google Cloud','Meta','Oracle','CoreWeave','Equinix','Digital Realty'],note:'Where the leverage and the depreciation sit'},
  {t:'Tenant',w:'The party actually renting the capacity. Contract tenor is consistently shorter than the debt that financed the building.',n:['Model labs','Enterprises','Governments'],note:'Contract tenor is shorter than the debt'}]},
6:{lead:'No material chokepoint anywhere in this chain. Every stage is rented, and the only durable asset is distribution at the end.',
 stages:[
  {t:'Compute',w:'Access to accelerators, owned or rented. The only genuinely scarce input to a frontier training run.',n:['NVIDIA','Google TPU','AWS Trainium','AMD'],c:1,note:'The only genuinely scarce input'},
  {t:'Data',w:'Corpora, licensed content, and increasingly data the labs generate themselves rather than collect.',n:['Scale AI','Surge','Mercor','Licensed corpora','Synthetic generation'],note:'Increasingly synthetic'},
  {t:'Training',w:'The frontier runs and the labs that do them. Capability leads are now measured in months, not years.',n:['OpenAI','Anthropic','Google DeepMind','Meta','xAI','Mistral','DeepSeek','Alibaba Qwen'],note:'Capability leads last months, not years'},
  {t:'Serving and inference',w:'Running a trained model for customers. Price per token has fallen faster than almost any underlying input cost.',n:['Azure','AWS','Google Cloud','Together','Fireworks','Baseten'],note:'Commoditising fast'},
  {t:'Distribution',w:'The surfaces a model reaches users through. The only stage in this layer holding a durable moat.',n:['ChatGPT','Gemini','Copilot','Claude','Enterprise APIs'],note:'The only stage with a real moat'}]},
7:{lead:'The layer where the thesis inverts: the same capability that creates these businesses can also compress the seat-based pricing several of them depend on.',
 stages:[
  {t:'Model access',w:'Models bought as an input through an API. A cost line on the income statement, not an asset on the balance sheet.',n:['OpenAI','Anthropic','Google','Open weights'],note:'A purchased input, not an asset'},
  {t:'Data platform',w:'Where enterprise context is stored and retrieved from, which is what separates a useful agent from a demo.',n:['Snowflake','Databricks','MongoDB','Confluent'],note:'Where enterprise context lives'},
  {t:'Orchestration and agents',w:'Frameworks that chain model calls into completed work. The standards here are still unsettled.',n:['Microsoft','ServiceNow','LangChain','Temporal'],note:'Standards still unsettled'},
  {t:'Applications',w:'The software people actually buy. Seat-based pricing is precisely what capable agents put at risk.',n:['Salesforce','ServiceNow','Adobe','Intuit','SAP'],c:1,note:'Seat-based pricing is the exposed model'},
  {t:'Security and identity',w:'Authenticating and authorising people and, increasingly, the machine identities acting on their behalf.',n:['CrowdStrike','Palo Alto Networks','Okta','Microsoft Entra','Zscaler'],note:'Machine identity becomes the growth vector'},
  {t:'Observability',w:'Watching what these systems actually did. Consumption pricing tracks agent volume rather than headcount.',n:['Datadog','Dynatrace','Splunk (Cisco)','Grafana'],note:'Consumption pricing tracks agent volume'}]},
8:{lead:'The chain runs the opposite way geographically to layers 3 and 4. Adding it does not diversify geopolitical risk; it adds a second one.',
 stages:[
  {t:'Rare earth and magnets',w:'The sintered magnets every actuator needs. China restricts export of the separation and magnet-making technology itself, not merely the metal.',n:['China separation capacity','JL MAG','Lynas','MP Materials','Neo Performance','Solvay'],c:1,note:'Separation technology export itself is banned'},
  {t:'Precision components',w:'Harmonic and cycloidal reducers, bearings and ball screws — the parts that set what a joint can actually do.',n:['Harmonic Drive Systems','Nabtesco','THK','NSK','Hiwin','Green Harmonic','Leader Drive'],c:1,note:'~50× expansion needed; Japanese pricing under attack'},
  {t:'Actuators and modules',w:'Motors, reducers, encoders and drives packaged into a joint. Around half the bill of materials.',n:['Sanhua','Tuopu','Nidec','Hyundai Mobis','Regal Rexnord'],note:'~50% of the bill of materials'},
  {t:'Sensing and edge compute',w:'Cameras, tactile skin, inertial units, and the on-board silicon that runs the policy in real time.',n:['Sony','ATI Industrial','Renishaw','Bosch','NVIDIA Jetson','Qualcomm'],note:'Tactile sensing is the capability gap'},
  {t:'Platform',w:'The firms building whole machines. Volume has so far arrived without profit.',n:['Tesla','Figure','Agility','Apptronik','Unitree','UBTech','Boston Dynamics','AgiBot'],note:'Volume without profit is the observed pattern'},
  {t:'Deployment',w:'Putting fleets into real work and keeping them running — a maintenance trade that barely exists yet.',n:['BMW','Amazon','Logistics operators','Maintenance depots'],note:'A maintenance trade that does not yet exist'},
  {t:'Data curation',w:'Choosing which part of the fleet\'s sensor stream is worth keeping. Bandwidth forces that choice to be made on board.',n:['Scale AI','Surge','Mercor','On-robot selection'],note:'200 Tbps forces curation on board'},
  {t:'Back into training',w:'Returning curated interaction data to the training layer. This is where the loop closes, or the thesis stops compounding.',n:['Frontier labs','Layer 6'],note:'The loop closes here, or the thesis does not compound'}
 ]},};

/* Value chain view — who depends on whom, stage by stage.
   Rendered as HTML rather than SVG so it reflows on narrow screens and the
   company names stay selectable text. */
function chainPane(n,col){
  const d=(typeof CHAIN!=='undefined')&&CHAIN[n];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const stages=d.stages.map((st,i)=>`
    <li class="chain-stage${st.c?' is-choke':''}" style="--stage:${col}">
      <div class="chain-step">Stage ${i+1}${st.c?' · chokepoint':''}</div>
      <h5>${esc(st.t)}</h5>
      <div class="chain-nodes">${st.n.map(x=>`<span class="chain-node">${esc(x)}</span>`).join('')}</div>
      ${st.note?`<p class="chain-note">${esc(st.note)}</p>`:''}
    </li>`).join('');
  return `<p class="chain-lead">${d.lead}</p>
    <p class="chain-hint">Upstream on the left, downstream on the right — scroll sideways to follow the chain.</p>
    <div class="chain-wrap"><ol class="chain-flow" aria-label="Value chain for this layer, upstream first">${stages}</ol></div>
    <div class="chain-key">
      <span><i class="k-choke"></i>Chokepoint stage — few credible suppliers, long time to relieve</span>
      <span><i class="k-flow"></i>Each stage buys from the one on its left</span>
    </div>
    <p class="tnote">Market capitalisation is converted to US dollars at a single FX snapshot taken ${_esc(MCAP_ASOF)}, so the column is comparable across exchanges but is a point-in-time figure and will drift. Entity descriptions identify what a company supplies at that stage; they are not sourced share claims. Companies are named for structural completeness of the chain, not as recommendations, and several are private, Chinese-listed or embedded inside much larger groups. Position within a stage does not imply ranking. The chain is drawn at the level that matters for dependency, so a company can appear in more than one stage or more than one layer.</p>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   V6 — ticker links and per-layer source registers
   ══════════════════════════════════════════════════════════════════════════ */

/* Listing lookups for stockanalysis.com. US listings use /stocks/{ticker}/,
   everything else uses /quote/{exchange}/{ticker}/. Rows naming more than one
   company carry several entries; private companies carry none. */
const TICK={
 'GE Vernova':[['GEV','stocks/gev']],
 'Siemens Energy':[['ETR:ENR','quote/etr/enr']],
 'Schneider Electric':[['EPA:SU','quote/epa/su']],
 'Vertiv':[['VRT','stocks/vrt']],
 'Eaton':[['ETN','stocks/etn']],
 'Constellation Energy':[['CEG','stocks/ceg']],
 'Cleveland-Cliffs':[['CLF','stocks/clf']],
 'MP Materials':[['MP','stocks/mp']],
 'Lynas Rare Earths':[['ASX:LYC','quote/asx/lyc']],
 'Freeport-McMoRan':[['FCX','stocks/fcx']],
 'Aurubis':[['ETR:NDA','quote/etr/nda']],
 'Howmet Aerospace':[['HWM','stocks/hwm']],
 'Linde':[['LIN','stocks/lin']],
 'Wacker Chemie':[['ETR:WCH','quote/etr/wch']],
 'Sibelco and The Quartz Corp (private)':[],
 'ASML':[['ASML','stocks/asml']],
 'TSMC':[['TSM','stocks/tsm']],
 'Cadence Design Systems':[['CDNS','stocks/cdns']],
 'Synopsys':[['SNPS','stocks/snps']],
 'Applied Materials':[['AMAT','stocks/amat']],
 'Lam Research':[['LRCX','stocks/lrcx']],
 'KLA':[['KLAC','stocks/klac']],
 'ASE Technology':[['ASX','stocks/asx']],
 'NVIDIA':[['NVDA','stocks/nvda']],
 'Broadcom':[['AVGO','stocks/avgo']],
 'AMD':[['AMD','stocks/amd']],
 'SK hynix':[['KRX:000660','quote/krx/000660']],
 'Micron Technology':[['MU','stocks/mu']],
 'Marvell Technology':[['MRVL','stocks/mrvl']],
 'Arista Networks':[['ANET','stocks/anet']],
 'Alphabet':[['GOOGL','stocks/googl']],
 'Alphabet (Waymo)':[['GOOGL','stocks/googl']],
 'Microsoft':[['MSFT','stocks/msft']],
 'Amazon':[['AMZN','stocks/amzn']],
 'Meta Platforms':[['META','stocks/meta']],
 'Oracle':[['ORCL','stocks/orcl']],
 'CoreWeave':[['CRWV','stocks/crwv']],
 'Equinix':[['EQIX','stocks/eqix']],
 'Palantir':[['PLTR','stocks/pltr']],
 'CrowdStrike':[['CRWD','stocks/crwd']],
 'Palo Alto Networks':[['PANW','stocks/panw']],
 'Snowflake':[['SNOW','stocks/snow']],
 'Datadog':[['DDOG','stocks/ddog']],
 'ServiceNow':[['NOW','stocks/now']],
 'Salesforce':[['CRM','stocks/crm']],
 'Harmonic Drive Systems':[['TYO:6324','quote/tyo/6324']],
 'Nabtesco':[['TYO:6268','quote/tyo/6268']],
 'Sony':[['SONY','stocks/sony']],
 'Keyence':[['TYO:6861','quote/tyo/6861']],
 'Deere':[['DE','stocks/de']],
 'Tesla':[['TSLA','stocks/tsla']],
 'Hyundai (Boston Dynamics)':[['KRX:005380','quote/krx/005380']],
 'THK and Hiwin':[['TYO:6481','quote/tyo/6481'],['TPE:2049','quote/tpe/2049']],
 'THK, NSK, Hiwin':[['TYO:6481','quote/tyo/6481'],['TYO:6471','quote/tyo/6471'],['TPE:2049','quote/tpe/2049']],
 'Sanhua, Tuopu, Green Harmonic':[['SHE:002050','quote/she/002050'],['SHA:601689','quote/sha/601689']],
 'CATL, LG Energy, Panasonic':[['SHE:300750','quote/she/300750'],['KRX:373220','quote/krx/373220'],['TYO:6752','quote/tyo/6752']],
 'DeepSeek and Alibaba Qwen':[['BABA','stocks/baba']],
 'OpenAI (private)':[],'Anthropic (private)':[],
 'Scale AI, Surge, Mercor (private)':[]};
const SA='https://stockanalysis.com/';

/* Source register. Links resolve to the publisher, dataset or filings search
   rather than to a single document, because several underlying items sit
   behind subscriptions or are not stably addressable. */
const SRC_SHARED=[
 ['SEC EDGAR full-text search','Annual reports, 10-K, 20-F and 8-K filings for every listed company named in this report','https://www.sec.gov/edgar/search/'],
 ['Stock Analysis','Share counts, market capitalisation, margins and per-company financial history','https://stockanalysis.com/'],
 ['Reuters','Contemporaneous reporting on capex announcements, export controls and supply agreements','https://www.reuters.com/'],
 ['Financial Times','Reporting on hyperscaler capital expenditure and financing structures','https://www.ft.com/']];

const SOURCES={
1:{lead:'Power, generation and electrical plant. The lead-time and interconnection figures are the least stable numbers in the report and change quarterly.',
 items:[
  ['US Energy Information Administration','Electricity generation, capacity additions and retirements; fuel prices','https://www.eia.gov/'],
  ['International Energy Agency','Data centre electricity demand projections and grid investment','https://www.iea.org/'],
  ['Lawrence Berkeley National Laboratory','United States data centre energy use reports','https://www.lbl.gov/'],
  ['North American Electric Reliability Corporation','Reliability assessments and load growth forecasts','https://www.nerc.com/'],
  ['Federal Energy Regulatory Commission','Interconnection queue policy and large-load interconnection dockets','https://www.ferc.gov/'],
  ['World Nuclear Association','Reactor status, SMR programmes and construction timelines','https://world-nuclear.org/'],
  ['Company disclosure — GE Vernova, Siemens Energy, Schneider, Eaton, Vertiv','Backlog, capacity, lead times and segment margins as reported','https://www.sec.gov/edgar/search/']]},
2:{lead:'Critical materials, refining capacity and export controls. Several figures here are third-party estimates in industries that researchers describe as extremely secretive — high-purity quartz volumes above all — and are presented to convey scale rather than precision.',
 items:[
  ['United States Geological Survey','Mineral commodity summaries: production, reserves and refining concentration','https://www.usgs.gov/centers/national-minerals-information-center'],
  ['International Energy Agency','Critical minerals outlook, refining concentration and the cost of control reimplementation','https://www.iea.org/'],
  ['International Copper Study Group','Refined copper balance, smelting capacity and treatment charges','https://icsg.org/'],
  ['Benchmark Mineral Intelligence','Rare earth, magnet and lithium pricing and capacity analysis','https://www.benchmarkminerals.com/'],
  ['Center for Strategic and International Studies','Analysis of the Chinese export control regime and its suspension','https://www.csis.org/'],
  ['Federal Register','Published text of United States export control rules and entity listings','https://www.federalregister.gov/'],
  ['Company disclosure — MP Materials, Lynas, Aurubis, Cleveland-Cliffs, Wacker','Capacity, offtake terms, treatment charges and qualification status','https://www.sec.gov/edgar/search/']]},
3:{lead:'The semiconductor equipment and materials base. Equipment share figures move with the shipment cycle; treat any single quarter with caution.',
 items:[
  ['SEMI','Wafer fab equipment billings, fab construction and materials market data','https://www.semi.org/'],
  ['TrendForce','Foundry revenue share, memory pricing and advanced packaging capacity','https://www.trendforce.com/'],
  ['United States Geological Survey','Mineral commodity summaries, including quartz, gallium and germanium','https://www.usgs.gov/centers/national-minerals-information-center'],
  ['Company disclosure — ASML, TSMC, Applied Materials, Lam, KLA','Bookings, systems shipped, capacity and capital intensity as reported','https://www.sec.gov/edgar/search/'],
  ['Reuters','Reporting on the Spruce Pine quartz district and the Hurricane Helene shutdown','https://www.reuters.com/']]},
4:{lead:'Accelerators, memory and networking. Accelerator share estimates vary widely by definition; the range is disclosed rather than averaged away.',
 items:[
  ['TrendForce','HBM supply share, DRAM and NAND pricing, CoWoS capacity allocation','https://www.trendforce.com/'],
  ['Dell\u2019Oro Group','Data centre switching, optics and network equipment share','https://www.delloro.com/'],
  ['Center for Strategic and International Studies','Analysis of semiconductor and critical mineral export controls','https://www.csis.org/'],
  ['Federal Register','The text of United States export control rules as published','https://www.federalregister.gov/'],
  ['Company disclosure — NVIDIA, AMD, Broadcom, Micron, Marvell, Arista','Segment revenue, gross margin, inventory and purchase commitments','https://www.sec.gov/edgar/search/']]},
5:{lead:'Data centre construction and economics. The 1 GW cost model is built bottom-up from the Epoch AI study; the depreciation debate is unresolved and is treated as such.',
 items:[
  ['Epoch AI','The gigawatt data centre cost study underlying the capital and TCO model','https://epoch.ai/'],
  ['Synergy Research Group','Cloud infrastructure market share and data centre capacity tracking','https://www.srgresearch.com/'],
  ['Uptime Institute','Outage data, PUE benchmarks and operational practice surveys','https://uptimeinstitute.com/'],
  ['Lawrence Berkeley National Laboratory','Data centre load, cooling and efficiency research','https://www.lbl.gov/'],
  ['Company disclosure — Alphabet, Microsoft, Amazon, Meta, Oracle, CoreWeave, Equinix','Capital expenditure, useful-life assumptions, lease and debt terms','https://www.sec.gov/edgar/search/']]},
6:{lead:'Frontier models. This layer has the weakest public data in the report: capability rankings are contested, and no reliable market share series exists.',
 items:[
  ['Epoch AI','Training compute estimates, model release tracking and scaling analysis','https://epoch.ai/'],
  ['Stanford HAI AI Index','Annual measurement of capability, investment and deployment','https://hai.stanford.edu/ai-index'],
  ['LMArena','Community preference rankings across frontier models','https://lmarena.ai/'],
  ['Company and laboratory publications','Model cards, system cards and technical reports as published by each laboratory','https://epoch.ai/']]},
7:{lead:'Enterprise software and security. Share figures here come from vendor-funded analyst research and should be read as positional rather than precise.',
 items:[
  ['Gartner','Enterprise software, security and IT services market sizing','https://www.gartner.com/'],
  ['International Data Corporation','Security, data platform and observability share estimates','https://www.idc.com/'],
  ['Canalys','Cybersecurity channel and vendor share tracking','https://www.canalys.com/'],
  ['Company disclosure — CrowdStrike, Palo Alto, Snowflake, Datadog, ServiceNow, Salesforce','ARR, net revenue retention, remaining performance obligations','https://www.sec.gov/edgar/search/']]},
8:{lead:'Humanoids and precision components. The reducer capacity denominator behind the fiftyfold figure is a derivation, not a disclosed statistic, and is the number here most in need of independent verification.',
 items:[
  ['International Federation of Robotics','World robotics installation and stock statistics','https://ifr.org/'],
  ['Benchmark Mineral Intelligence','Rare earth and magnet pricing, capacity and supply chain analysis','https://www.benchmarkminerals.com/'],
  ['United States Geological Survey','Rare earth production, reserves and processing capacity','https://www.usgs.gov/centers/national-minerals-information-center'],
  ['Center for Strategic and International Studies','Analysis of Chinese rare earth and magnet export controls','https://www.csis.org/'],
  ['Federal Register','Published text of United States controls and entity listings','https://www.federalregister.gov/'],
  ['Company disclosure — Harmonic Drive Systems, Nabtesco, THK, Sony, Tesla','Order intake, segment share, capacity expansion and pricing commentary','https://www.sec.gov/edgar/search/'],
  ['International Federation of Robotics','Industrial and service robotics deployment statistics','https://ifr.org/'],
  ['California Department of Motor Vehicles','Autonomous vehicle disengagement and mileage reports','https://www.dmv.ca.gov/portal/vehicle-industry-services/autonomous-vehicles/'],
  ['Stanford HAI AI Index','Robotics, autonomy and real-world deployment measurement','https://hai.stanford.edu/ai-index'],
  ['Company disclosure — Alphabet, Tesla, Deere, Sony, Keyence','Fleet scale, autonomy revenue and sensor segment reporting','https://www.sec.gov/edgar/search/']
 ]},};

/* Company names link to the listing on stockanalysis.com. Rows naming several
   companies carry one link per listing; private companies carry none. */
function coName(name){
  const t=(typeof TICK!=='undefined')&&TICK[name];
  const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const lnk=(label,path)=>`<a class="tick" href="${SA}${path}/" target="_blank" rel="noopener noreferrer">${esc(label)}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
  if(!t) return `<span class="co-name">${esc(name)}</span>`;
  if(!t.length) return `<span class="co-name">${esc(name)}</span><span class="co-priv">Private — not listed</span>`;
  if(t.length===1) return `<a class="co-name co-link" href="${SA}${t[0][1]}/" target="_blank" rel="noopener noreferrer">${esc(name)}</a>`+
    `<span class="co-tick">${lnk(t[0][0],t[0][1])}</span>`;
  return `<span class="co-name">${esc(name)}</span><span class="co-tick">${t.map(x=>lnk(x[0],x[1])).join('')}</span>`;
}

/* Sources view — where each layer's numbers actually come from. */
function sourcePane(n){
  const d=(typeof SOURCES!=='undefined')&&SOURCES[n];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const host=u=>u.replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  const row=([name,use,url])=>`<li class="src">
      <a class="src-name" href="${url}" target="_blank" rel="noopener noreferrer">${esc(name)}
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      <span class="src-use">${esc(use)}</span>
      <span class="src-host">${esc(host(url))}</span>
    </li>`;
  return `<p class="chain-lead">${d.lead}</p>
    <h4 class="mini-h">Primary sources for this layer</h4>
    <ol class="src-list">${d.items.map(row).join('')}</ol>
    <h4 class="mini-h">Used throughout the report</h4>
    <ol class="src-list">${SRC_SHARED.map(row).join('')}</ol>
    <p class="tnote"><b>How to read these links.</b> Each resolves to the publisher, dataset or filings search rather than to a single document, because several of the underlying items sit behind subscriptions, are updated in place, or are not stably addressable. Where a figure in this layer is a derivation rather than a published statistic, the text says so at the point the number appears. Figures were compiled to September 2026 and several — lead times, interconnection queues, equipment share and model rankings above all — change on a quarterly or faster cadence.</p>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   V7 — listings for the value-chain entities, and project source registers
   ══════════════════════════════════════════════════════════════════════════ */

/* [display ticker, stockanalysis path, country]. Product and platform names
   resolve to the parent listing. Entities with no entry are private, generic,
   or not separately listed, and are shown without a link. */
const CT={
 'Microsoft Maia':['MSFT','stocks/msft','United States'],
 'Meta MTIA':['META','stocks/meta','United States'],
 'Tesla AI5':['TSLA','stocks/tsla','United States'],
 'BHP':['BHP','stocks/bhp','Australia'],
 'Rio Tinto':['RIO','stocks/rio','United Kingdom / Australia'],
 'Boliden':['STO:BOL','quote/sto/bol','Sweden'],
 'Aurubis':['ETR:NDA','quote/etr/nda','Germany'],
 'Wacker Chemie':['ETR:WCH','quote/etr/wch','Germany'],
 'Hemlock':[null,null,'United States'],
 'Tokuyama':['TYO:4043','quote/tyo/4043','Japan'],
 'OCI':[null,null,'South Korea'],
 'Nippon Steel':['TYO:5401','quote/tyo/5401','Japan'],
 'POSCO':['PKX','stocks/pkx','South Korea'],
 'Precision Castparts':[null,null,'United States'],
 'Lynas Malaysia':['ASX:LYC','quote/asx/lyc','Australia'],
 'Transformer makers':[null,null,null],
 'Turbine OEMs':[null,null,null],
 'Wafer makers':[null,null,null],
 'Magnet motor makers':[null,null,null],
 'ABB':['SWX:ABBN','quote/swx/abbn','Switzerland'],
 'AMD':['AMD','stocks/amd','United States'],
 'ASE':['ASX','stocks/asx','Taiwan'],
 'ASML':['ASML','stocks/asml','Netherlands'],
 'Adobe':['ADBE','stocks/adbe','United States'],
 'Air Liquide':['EPA:AI','quote/epa/ai','France'],
 'Ajinomoto':['TYO:2802','quote/tyo/2802','Japan'],
 'Alfa Laval':['STO:ALFA','quote/sto/alfa','Sweden'],
 'Alibaba Qwen':['BABA','stocks/baba','China'],
 'Amazon':['AMZN','stocks/amzn','United States'],
 'AWS':['AMZN','stocks/amzn','United States'],
 'AWS Trainium':['AMZN','stocks/amzn','United States'],
 'Ambarella':['AMBA','stocks/amba','United States'],
 'Amkor':['AMKR','stocks/amkr','United States'],
 'Amphenol':['APH','stocks/aph','United States'],
 'Applied Materials':['AMAT','stocks/amat','United States'],
 'Arista':['ANET','stocks/anet','United States'],
 'Arm':['ARM','stocks/arm','United Kingdom'],
 'Astera Labs':['ALAB','stocks/alab','United States'],
 'Azure':['MSFT','stocks/msft','United States'],
 'BMW':['ETR:BMW','quote/etr/bmw','Germany'],
 'Boston Dynamics':['KRX:005380','quote/krx/005380','South Korea'],
 'Broadcom':['AVGO','stocks/avgo','United States'],
 'Cadence':['CDNS','stocks/cdns','United States'],
 'Cameco':['CCJ','stocks/ccj','Canada'],
 'Carpenter Technology':['CRS','stocks/crs','United States'],
 'Caterpillar':['CAT','stocks/cat','United States'],
 'Cleveland-Cliffs':['CLF','stocks/clf','United States'],
 'Coherent':['COHR','stocks/cohr','United States'],
 'Confluent':['CFLT','stocks/cflt','United States'],
 'Constellation':['CEG','stocks/ceg','United States'],
 'Copilot':['MSFT','stocks/msft','United States'],
 'CoreWeave':['CRWV','stocks/crwv','United States'],
 'Corning':['GLW','stocks/glw','United States'],
 'Credo':['CRDO','stocks/crdo','United States'],
 'CrowdStrike':['CRWD','stocks/crwd','United States'],
 'Cummins':['CMI','stocks/cmi','United States'],
 'Datadog':['DDOG','stocks/ddog','United States'],
 'Deere':['DE','stocks/de','United States'],
 'Dell':['DELL','stocks/dell','United States'],
 'Digital Realty':['DLR','stocks/dlr','United States'],
 'Dynatrace':['DT','stocks/dt','United States'],
 'Eaton':['ETN','stocks/etn','Ireland / United States'],
 'Equinix':['EQIX','stocks/eqix','United States'],
 'Fabrinet':['FN','stocks/fn','Thailand / United States'],
 'Foxconn':['TPE:2317','quote/tpe/2317','Taiwan'],
 'Freeport-McMoRan':['FCX','stocks/fcx','United States'],
 'GE Vernova':['GEV','stocks/gev','United States'],
 'Gemini':['GOOGL','stocks/googl','United States'],
 'GlobalFoundries':['GFS','stocks/gfs','United States'],
 'Google':['GOOGL','stocks/googl','United States'],
 'Google Cloud':['GOOGL','stocks/googl','United States'],
 'Google DeepMind':['GOOGL','stocks/googl','United States'],
 'Google TPU':['GOOGL','stocks/googl','United States'],
 'HPE':['HPE','stocks/hpe','United States'],
 'Harmonic Drive Systems':['TYO:6324','quote/tyo/6324','Japan'],
 'Hitachi Energy':['TYO:6501','quote/tyo/6501','Japan'],
 'Hiwin':['TPE:2049','quote/tpe/2049','Taiwan'],
 'Howmet':['HWM','stocks/hwm','United States'],
 'Hyundai Mobis':['KRX:012330','quote/krx/012330','South Korea'],
 'Ibiden':['TYO:4062','quote/tyo/4062','Japan'],
 'Intel Foundry':['INTC','stocks/intc','United States'],
 'Intuit':['INTU','stocks/intu','United States'],
 'KLA':['KLAC','stocks/klac','United States'],
 'Kazatomprom':['LON:KAP','quote/lon/kap','Kazakhstan'],
 'Keyence':['TYO:6861','quote/tyo/6861','Japan'],
 'Lam Research':['LRCX','stocks/lrcx','United States'],
 'Linde':['LIN','stocks/lin','United Kingdom / United States'],
 'Lumentum':['LITE','stocks/lite','United States'],
 'Lynas':['ASX:LYC','quote/asx/lyc','Australia'],
 'MP Materials':['MP','stocks/mp','United States'],
 'MYR Group':['MYRG','stocks/myrg','United States'],
 'Marvell':['MRVL','stocks/mrvl','United States'],
 'Meta':['META','stocks/meta','United States'],
 'Micron':['MU','stocks/mu','United States'],
 'Microsoft':['MSFT','stocks/msft','United States'],
 'Microsoft Entra':['MSFT','stocks/msft','United States'],
 'Mitsubishi Heavy':['TYO:7011','quote/tyo/7011','Japan'],
 'MongoDB':['MDB','stocks/mdb','United States'],
 'Motivair (Schneider)':['EPA:SU','quote/epa/su','France'],
 'NSK':['TYO:6471','quote/tyo/6471','Japan'],
 'NVIDIA':['NVDA','stocks/nvda','United States'],
 'NVIDIA Jetson':['NVDA','stocks/nvda','United States'],
 'NVIDIA NVLink':['NVDA','stocks/nvda','United States'],
 'Nabtesco':['TYO:6268','quote/tyo/6268','Japan'],
 'NextEra':['NEE','stocks/nee','United States'],
 'Nidec':['TYO:6594','quote/tyo/6594','Japan'],
 'Okta':['OKTA','stocks/okta','United States'],
 'Oracle':['ORCL','stocks/orcl','United States'],
 'Palo Alto Networks':['PANW','stocks/panw','United States'],
 'Prysmian':['BIT:PRY','quote/bit/pry','Italy'],
 'Qualcomm':['QCOM','stocks/qcom','United States'],
 'Quanta':['TPE:2382','quote/tpe/2382','Taiwan'],
 'Quanta Services':['PWR','stocks/pwr','United States'],
 'Regal Rexnord':['RRX','stocks/rrx','United States'],
 'Renishaw':['LON:RSW','quote/lon/rsw','United Kingdom'],
 'SAP':['SAP','stocks/sap','Germany'],
 'SK hynix':['KRX:000660','quote/krx/000660','South Korea'],
 'STMicroelectronics':['STM','stocks/stm','Switzerland / Netherlands'],
 'SUMCO':['TYO:3436','quote/tyo/3436','Japan'],
 'Salesforce':['CRM','stocks/crm','United States'],
 'Samsung':['KRX:005930','quote/krx/005930','South Korea'],
 'Samsung Foundry':['KRX:005930','quote/krx/005930','South Korea'],
 'Schneider':['EPA:SU','quote/epa/su','France'],
 'Schneider Electric':['EPA:SU','quote/epa/su','France'],
 'ServiceNow':['NOW','stocks/now','United States'],
 'Shin-Etsu':['TYO:4063','quote/tyo/4063','Japan'],
 'Shinko':['TYO:6967','quote/tyo/6967','Japan'],
 'Siemens':['ETR:SIE','quote/etr/sie','Germany'],
 'Siemens EDA':['ETR:SIE','quote/etr/sie','Germany'],
 'Siemens Energy':['ETR:ENR','quote/etr/enr','Germany'],
 'Snowflake':['SNOW','stocks/snow','United States'],
 'Solvay':['EBR:SOLB','quote/ebr/solb','Belgium'],
 'Sony':['SONY','stocks/sony','Japan'],
 'Splunk (Cisco)':['CSCO','stocks/csco','United States'],
 'Supermicro':['SMCI','stocks/smci','United States'],
 'Symbotic':['SYM','stocks/sym','United States'],
 'Synopsys':['SNPS','stocks/snps','United States'],
 'THK':['TYO:6481','quote/tyo/6481','Japan'],
 'TSMC':['TSM','stocks/tsm','Taiwan'],
 'TSMC CoWoS':['TSM','stocks/tsm','Taiwan'],
 'Talen':['TLN','stocks/tln','United States'],
 'Tesla':['TSLA','stocks/tsla','United States'],
 'Tesla FSD silicon':['TSLA','stocks/tsla','United States'],
 'Tokyo Electron':['TYO:8035','quote/tyo/8035','Japan'],
 'Unimicron':['TPE:3037','quote/tpe/3037','Taiwan'],
 'Vertiv':['VRT','stocks/vrt','United States'],
 'Vistra':['VST','stocks/vst','United States'],
 'Waymo':['GOOGL','stocks/googl','United States'],
 'Wistron':['TPE:3231','quote/tpe/3231','Taiwan'],
 'Zscaler':['ZS','stocks/zs','United States'],
 'ams OSRAM':['SWX:AMS','quote/swx/ams','Austria / Switzerland'],
 'ChatGPT':[null,null,'United States'],
 'Claude':[null,null,'United States'],
 'OpenAI':[null,null,'United States'],
 'Anthropic':[null,null,'United States'],
 'DeepSeek':[null,null,'China'],
 'Mistral':[null,null,'France'],
 'xAI':[null,null,'United States'],
 'Databricks':[null,null,'United States'],
 'Scale AI':[null,null,'United States'],
 'Surge':[null,null,'United States'],
 'Mercor':[null,null,'United States'],
 'Figure':[null,null,'United States'],
 'Apptronik':[null,null,'United States'],
 'Agility':[null,null,'United States'],
 'Unitree':[null,null,'China'],
 'AgiBot':[null,null,'China'],
 'UBTech':[null,null,'China'],
 'JL MAG':[null,null,'China'],
 'Sanhua':[null,null,'China'],
 'Tuopu':[null,null,'China'],
 'Green Harmonic':[null,null,'China'],
 'Leader Drive':[null,null,'China'],
 'China separation capacity':[null,null,'China'],
 'InnoLight':[null,null,'China'],
 'Neo Performance':[null,null,'Canada'],
 'Zeiss SMT':[null,null,'Germany'],
 'Bosch':[null,null,'Germany'],
 'Sibelco':[null,null,'Belgium'],
 'The Quartz Corp':[null,null,'Norway / United States'],
 'JSR':[null,null,'Japan'],
 'AT&S':[null,null,'Austria'],
 'ATI Industrial':[null,null,'United States'],
 'Boyd':[null,null,'United States'],
 'LiquidStack':[null,null,'United States'],
 'Hailo':[null,null,'Israel'],
 'Turner':[null,null,'United States'],
 'DPR':[null,null,'United States'],
 'Mortenson':[null,null,'United States'],
 'Clayco':[null,null,'United States'],
 'Rosendin':[null,null,'United States'],
 'Utilities':[null,null,null],'Hyperscalers':[null,null,null],'Neoclouds':[null,null,null],
 'Model labs':[null,null,null],'Enterprises':[null,null,null],'Governments':[null,null,null],
 'Frontier labs':[null,null,null],'Layer 6':[null,null,null],'Open weights':[null,null,null],
 'Enterprise APIs':[null,null,null],'Licensed corpora':[null,null,null],
 'Synthetic generation':[null,null,null],'On-robot selection':[null,null,null],
 'Sovereign programmes':[null,null,null],'Logistics operators':[null,null,null],
 'Maintenance depots':[null,null,null],'LangChain':[null,null,'United States'],
 'Temporal':[null,null,'United States'],'Grafana':[null,null,'United States'],
 'Together':[null,null,'United States'],'Fireworks':[null,null,'United States'],
 'Baseten':[null,null,'United States']};

/* Where each project's numbers come from. */
const PSOURCES={
gw:{title:'Sources — one gigawatt data centre',
 lead:'The capital model is built bottom-up from the Epoch AI study. Everything downstream of it — lead times, energy scenarios, break-even prices — is assembled from the sources below and recomputed here rather than quoted. Where a figure is a derivation, the text says so at the point it appears.',
 groups:[
  ['The capital and cost model',[
   ['Epoch AI','The gigawatt data centre cost study behind the $37.9bn capital stack and the $8.51bn annualised TCO','https://epoch.ai/'],
   ['Lawrence Berkeley National Laboratory','United States data centre energy use, cooling and efficiency research','https://www.lbl.gov/'],
   ['Uptime Institute','PUE benchmarks, outage data and commissioning practice','https://uptimeinstitute.com/']]],
  ['Power, generation and interconnection',[
   ['US Energy Information Administration','Generation capacity, fuel prices and capacity additions','https://www.eia.gov/'],
   ['International Energy Agency','Data centre demand projections and grid investment','https://www.iea.org/'],
   ['Federal Energy Regulatory Commission','Interconnection queue policy and large-load dockets','https://www.ferc.gov/'],
   ['North American Electric Reliability Corporation','Load growth forecasts and reliability assessments','https://www.nerc.com/'],
   ['World Nuclear Association','AP1000 and SMR capital cost and construction schedules','https://world-nuclear.org/']]],
  ['Equipment, lead times and construction',[
   ['Company disclosure — GE Vernova, Siemens Energy, Schneider, Eaton, Vertiv, Cummins','Backlog, order books, published lead times and capacity expansion','https://www.sec.gov/edgar/search/'],
   ['Reuters','Contemporaneous reporting on turbine slots, transformer lead times and site announcements','https://www.reuters.com/'],
   ['US Bureau of Labor Statistics','Electrician and construction trade wage and employment data','https://www.bls.gov/']]],
  ['Compute, memory and GPU pricing',[
   ['TrendForce','HBM supply, DRAM pricing and CoWoS capacity allocation','https://www.trendforce.com/'],
   ['Company disclosure — NVIDIA, Micron, SK hynix, Supermicro, Dell','Accelerator pricing, lead times and purchase commitments','https://www.sec.gov/edgar/search/'],
   ['Operator published rate cards','GPU-hour spot and contracted pricing as published by cloud and neocloud operators','https://www.sec.gov/edgar/search/']]],
  ['Financing and capital structure',[
   ['SEC EDGAR full-text search','Debt terms, lease structures, useful-life assumptions and covenant disclosure','https://www.sec.gov/edgar/search/'],
   ['Financial Times','Reporting on private credit, GPU-collateralised lending and neocloud financing','https://www.ft.com/'],
   ['Stock Analysis','Balance sheet, depreciation schedules and capital expenditure history','https://stockanalysis.com/']]]],
 caveat:'The single most consequential assumption in this project is the useful life of the IT equipment, and it is not a measured quantity — operators disclose a policy, not an outcome. The break-even model therefore reports 3, 5 and 7 year cases side by side rather than selecting one. GPU-hour reference prices are as at 1 September 2026 and move faster than any other input here.'},
hu:{title:'Sources — ten million humanoids',
 lead:'This project has the thinnest public data in the report. Humanoid production is pre-commercial, component capacity is largely undisclosed, and several key figures are derivations from adjacent industrial statistics rather than published numbers. The sources below are where the inputs come from; the derivations are flagged in the text.',
 groups:[
  ['Robotics and component industry data',[
   ['International Federation of Robotics','World robotics installations and operational stock, the denominator behind the reducer expansion estimate','https://ifr.org/'],
   ['Company disclosure — Harmonic Drive Systems, Nabtesco, THK, NSK, Nidec','Segment capacity, order intake, pricing commentary and expansion plans','https://www.sec.gov/edgar/search/'],
   ['Stock Analysis','Revenue, margin and capital expenditure history for the listed component makers','https://stockanalysis.com/']]],
  ['Rare earths, magnets and export controls',[
   ['United States Geological Survey','Rare earth production, reserves and separation capacity','https://www.usgs.gov/centers/national-minerals-information-center'],
   ['Benchmark Mineral Intelligence','Magnet and rare earth pricing, capacity and supply chain analysis','https://www.benchmarkminerals.com/'],
   ['Center for Strategic and International Studies','Analysis of Chinese export controls on rare earths and magnets','https://www.csis.org/'],
   ['Federal Register','Published text of United States controls and entity listings','https://www.federalregister.gov/'],
   ['Reuters','Reporting on the April 2025 licensing regime, the October 2025 package and the November 2025 suspension','https://www.reuters.com/']]],
  ['Cost, bill of materials and platforms',[
   ['Morgan Stanley Research','Humanoid teardown and bill-of-materials estimates','https://www.morganstanley.com/'],
   ['Goldman Sachs Research','Humanoid market sizing and cost-curve projections','https://www.goldmansachs.com/'],
   ['Company and programme disclosure — Tesla, Hyundai, UBTech, Unitree','Stated production targets, unit costs and deployment partners','https://www.sec.gov/edgar/search/']]],
  ['Compute, sensing and energy',[
   ['Company disclosure — NVIDIA, Qualcomm, Sony','Edge inference silicon specifications and image sensor segment reporting','https://www.sec.gov/edgar/search/'],
   ['US Energy Information Administration','United States electricity consumption, the denominator for the fleet energy comparison','https://www.eia.gov/'],
   ['Stanford HAI AI Index','Robotics capability, autonomy and deployment measurement','https://hai.stanford.edu/ai-index']]]],
 caveat:'Two numbers here carry more weight than the rest and both are derivations. The fiftyfold reducer expansion rests on an estimate of roughly five million units a year of world precision reducer output, inferred from industrial robot installation volumes rather than taken from a disclosed capacity statistic; it is the single figure in this report most in need of independent verification. The 2034 timeline assumes sustained 100% annual production growth from a 2026 base of about twenty thousand units, which is an assumption stated to be tested, not a forecast.'}};

/* ── Value chain, V7: linked entities plus structural diagrams ───────────── */
const _esc=x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const _arrow='<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M4 2h6v6M10 2 3 9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/* Company marks. Logos resolved from CompaniesLogo.com and vendored into
   assets/logos/ rather than hotlinked, because their URLs carry a content
   hash that rotates whenever a logo is updated. Maps a value-chain entity to
   its logo file; product and platform names point at the parent company's
   mark, matching how the ticker links already resolve. Entities absent here
   are private, unlisted, or simply not carried by that source. */
const LOGO={
 'Microsoft Maia':'microsoft',
 'Meta MTIA':'meta-platforms',
 'Tesla AI5':'tesla',
 'ABB':'abb',
 'AMD':'amd',
 'ASE':'ase-group',
 'ASML':'asml',
 'AWS':'amazon',
 'AWS Trainium':'amazon',
 'Adobe':'adobe',
 'Air Liquide':'air-liquide',
 'Ajinomoto':'ajinomoto',
 'Alfa Laval':'alfa-laval',
 'Alibaba Qwen':'alibaba',
 'Amazon':'amazon',
 'Ambarella':'ambarella',
 'Amkor':'amkor-technology',
 'Amphenol':'amphenol',
 'Applied Materials':'applied-materials',
 'Arista':'arista-networks',
 'Arm':'arm-holdings',
 'Astera Labs':'astera-labs',
 'Aurubis':'aurubis',
 'Azure':'microsoft',
 'BHP':'bhp-group',
 'BMW':'bmw',
 'Boliden':'boliden',
 'Broadcom':'broadcom',
 'Cadence':'cadence-design-systems',
 'Cameco':'cameco',
 'Carpenter Technology':'carpenter-technology',
 'Caterpillar':'caterpillar',
 'Cleveland-Cliffs':'cleveland-cliffs',
 'Coherent':'coherent',
 'Confluent':'confluent',
 'Constellation':'constellation-energy',
 'Copilot':'microsoft',
 'CoreWeave':'coreweave',
 'Corning':'corning',
 'Credo':'credo-technology',
 'CrowdStrike':'crowdstrike',
 'Cummins':'cummins',
 'Datadog':'datadog',
 'Deere':'deere-company',
 'Dell':'dell',
 'Digital Realty':'digital-realty',
 'Dynatrace':'dynatrace',
 'Eaton':'eaton',
 'Equinix':'equinix',
 'Fabrinet':'fabrinet',
 'Foxconn':'foxconn',
 'Freeport-McMoRan':'freeport-mcmoran',
 'GE Vernova':'ge-vernova',
 'Gemini':'google',
 'GlobalFoundries':'globalfoundries',
 'Google':'google',
 'Google Cloud':'google',
 'Google DeepMind':'google',
 'Google TPU':'google',
 'HPE':'hewlett-packard-enterprise',
 'Harmonic Drive Systems':'harmonic-drive-systems',
 'Hitachi Energy':'hitachi',
 'Howmet':'howmet-aerospace',
 'Hyundai Mobis':'hyundai-mobis',
 'Ibiden':'ibiden',
 'Intel Foundry':'intel',
 'Intuit':'intuit',
 'KLA':'kla',
 'Kazatomprom':'kazatomprom',
 'Keyence':'keyence',
 'Lam Research':'lam-research',
 'Linde':'linde',
 'Lumentum':'lumentum',
 'Lynas':'lynas',
 'Lynas Malaysia':'lynas',
 'MP Materials':'mp-materials',
 'MYR Group':'myr-group',
 'Marvell':'marvell',
 'Meta':'meta-platforms',
 'Micron':'micron-technology',
 'Microsoft':'microsoft',
 'Microsoft Entra':'microsoft',
 'Mitsubishi Heavy':'mitsubishi-heavy-industries',
 'MongoDB':'mongodb',
 'Motivair (Schneider)':'schneider-electric',
 'NSK':'nsk-ltd',
 'NVIDIA':'nvidia',
 'NVIDIA Jetson':'nvidia',
 'NVIDIA NVLink':'nvidia',
 'Nabtesco':'nabtesco-corporation',
 'NextEra':'nextera-energy',
 'Nidec':'nidec',
 'Nippon Steel':'nippon-steel',
 'Okta':'okta',
 'Oracle':'oracle',
 'POSCO':'posco',
 'Palo Alto Networks':'palo-alto-networks',
 'Prysmian':'prysmian-group',
 'Qualcomm':'qualcomm',
 'Quanta':'quanta-computer',
 'Quanta Services':'quanta-services',
 'Regal Rexnord':'regal-rexnord',
 'Renishaw':'renishaw',
 'Rio Tinto':'rio-tinto',
 'SAP':'sap',
 'SK hynix':'sk-hynix',
 'STMicroelectronics':'stmicroelectronics',
 'SUMCO':'sumco-corporation',
 'Salesforce':'salesforce',
 'Samsung':'samsung',
 'Samsung Foundry':'samsung',
 'Schneider':'schneider-electric',
 'Schneider Electric':'schneider-electric',
 'Shin-Etsu':'shin-etsu-chemical',
 'Siemens':'siemens',
 'Siemens EDA':'siemens',
 'Siemens Energy':'siemens-energy',
 'Snowflake':'snowflake',
 'Solvay':'solvay',
 'Sony':'sony',
 'Splunk (Cisco)':'splunk',
 'Supermicro':'supermicro',
 'Symbotic':'symbotic',
 'Synopsys':'synopsys',
 'THK':'thk-co',
 'TSMC':'tsmc',
 'TSMC CoWoS':'tsmc',
 'Talen':'talen-energy',
 'Tesla':'tesla',
 'Tesla FSD silicon':'tesla',
 'Tokuyama':'tokuyama-corporation',
 'Tokyo Electron':'tokyo-electron',
 'Unimicron':'unimicron',
 'Vertiv':'vertiv-holdings',
 'Vistra':'vistra',
 'Wacker Chemie':'wacker-chemie',
 'Waymo':'waymo',
 'Wistron':'wistron-corporation',
 'Zscaler':'zscaler',
 'ams OSRAM':'ams-ag'
};
const logoMark=(name,cls)=>{const s=LOGO[name];return s?`<img class="${cls||'co-logo'}" src="assets/logos/${s}.png" alt="" loading="lazy" decoding="async">`:'';};

function chainChip(name){
  const c=(typeof CT!=='undefined')&&CT[name], mark=logoMark(name);
  const plate=mark||'<span class="co-logo is-blank" aria-hidden="true"></span>';
  const body=`${plate}<span class="cn-text"><span class="cn-name">${_esc(name)}</span>`+
    (c&&c[0]?`<span class="chip-tick">${_esc(c[0])}</span>`:'<span class="chip-tick is-priv">private</span>')+`</span>`;
  if(c&&c[1]) return `<a class="chain-node is-link" href="${SA}${c[1]}/" target="_blank" rel="noopener noreferrer" title="${_esc(name)} — ${_esc(c[0])} on Stock Analysis">${body}${_arrow}</a>`;
  return `<span class="chain-node">${body}</span>`;
}

/* One entity, as a row in the vertical chain: mark, what it supplies here, and
   what is known about its position. Share comes from COMETA where a figure is
   stated for this layer, and is n/d otherwise — never inferred. */
/* COMETA is keyed layer|company because the same firm appears in several layer
   tables. A share is a property of the company, not of the layer it is being
   read in, so fall back to whichever layer states one. */
/* The chain names an entity the way the chain reads; the share table names the
   listed parent. Verified by hand — fuzzy matching alone paired Carpenter
   Technology with Marvell Technology, and Siemens with Siemens Energy, which
   are different companies. */
/* Country marks as emoji flags: no image requests, and they follow the
   viewer's font in either theme. A dual-domicile string shows both. */
const FLAG={"Australia": "🇦🇺", "Austria": "🇦🇹", "Belgium": "🇧🇪", "Canada": "🇨🇦", "China": "🇨🇳", "France": "🇫🇷", "Germany": "🇩🇪", "Ireland": "🇮🇪", "Israel": "🇮🇱", "Italy": "🇮🇹", "Japan": "🇯🇵", "Kazakhstan": "🇰🇿", "Netherlands": "🇳🇱", "Norway": "🇳🇴", "South Korea": "🇰🇷", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Taiwan": "🇹🇼", "Thailand": "🇹🇭", "United Kingdom": "🇬🇧", "United States": "🇺🇸"};
const flagFor=geo=>!geo?'':geo.split(' / ').map(p=>FLAG[p.trim()]||'').join('\u2009');

/* Market capitalisation in US dollars, scraped from the listings already linked
   here and converted at one FX snapshot so the column is comparable across
   exchanges. A point-in-time figure — it is dated in the pane. */
const MCAP_ASOF="Sat, 05 Sep 2026 00:02:32 +0000";
const MCAP={"BHP": 228.08, "Rio Tinto": 176.73, "Boliden": 16.26, "Aurubis": 8.83, "Wacker Chemie": 5.33, "Tokuyama": 1.8, "Nippon Steel": 23.18, "POSCO": 18.92, "Lynas Malaysia": 11.11, "ABB": 174.27, "AMD": 779.62, "ASE": 81.73, "ASML": 654.92, "Adobe": 105.94, "Air Liquide": 125.98, "Ajinomoto": 31.63, "Alfa Laval": 24.02, "Alibaba Qwen": 273.9, "Amazon": 2790.0, "AWS": 2790.0, "AWS Trainium": 2790.0, "Ambarella": 2.78, "Amkor": 11.87, "Amphenol": 204.13, "Applied Materials": 360.86, "Arista": 244.4, "Arm": 269.25, "Astera Labs": 53.85, "Azure": 3710.0, "BMW": 43.68, "Boston Dynamics": 65.69, "Broadcom": 1700.0, "Cadence": 80.61, "Cameco": 43.9, "Carpenter Technology": 23.56, "Caterpillar": 374.15, "Cleveland-Cliffs": 7.13, "Coherent": 55.2, "Confluent": 11.13, "Constellation": 105.92, "Copilot": 3710.0, "CoreWeave": 49.29, "Corning": 132.91, "Credo": 32.06, "CrowdStrike": 218.2, "Cummins": 77.2, "Datadog": 76.46, "Deere": 186.99, "Dell": 338.67, "Digital Realty": 71.15, "Dynatrace": 15.0, "Eaton": 159.57, "Equinix": 102.22, "Fabrinet": 14.6, "Foxconn": 113.5, "Freeport-McMoRan": 104.44, "GE Vernova": 250.87, "Gemini": 4140.0, "GlobalFoundries": 24.81, "Google": 4140.0, "Google Cloud": 4140.0, "Google DeepMind": 4140.0, "Google TPU": 4140.0, "HPE": 69.03, "Harmonic Drive Systems": 3.47, "Hitachi Energy": 154.4, "Hiwin": 4.06, "Howmet": 103.4, "Hyundai Mobis": 27.67, "Ibiden": 36.63, "Intel Foundry": 503.38, "Intuit": 91.01, "KLA": 242.5, "Kazatomprom": 19.63, "Keyence": 120.71, "Lam Research": 384.97, "Linde": 220.15, "Lumentum": 79.05, "Lynas": 11.11, "MP Materials": 9.71, "MYR Group": 4.46, "Marvell": 196.04, "Meta": 1570.0, "Micron": 1150.0, "Microsoft": 3710.0, "Microsoft Entra": 3710.0, "Mitsubishi Heavy": 80.82, "MongoDB": 29.7, "Motivair (Schneider)": 188.07, "NSK": 3.48, "NVIDIA": 5560.0, "NVIDIA Jetson": 5560.0, "NVIDIA NVLink": 5560.0, "Nabtesco": 3.35, "NextEra": 174.03, "Nidec": 19.15, "Okta": 29.82, "Oracle": 457.36, "Palo Alto Networks": 271.61, "Prysmian": 41.49, "Qualcomm": 180.22, "Quanta": 42.05, "Quanta Services": 93.88, "Regal Rexnord": 10.85, "Renishaw": 5.08, "SAP": 249.06, "SK hynix": 889.88, "STMicroelectronics": 46.45, "SUMCO": 7.24, "Salesforce": 213.35, "Samsung": 1205.91, "Samsung Foundry": 1205.91, "Schneider": 188.07, "Schneider Electric": 188.07, "ServiceNow": 146.04, "Shin-Etsu": 68.91, "Shinko": 5.11, "Siemens": 243.16, "Siemens EDA": 243.16, "Siemens Energy": 145.53, "Snowflake": 116.87, "Solvay": 3.18, "Sony": 146.19, "Splunk (Cisco)": 430.53, "Supermicro": 26.01, "Symbotic": 25.97, "Synopsys": 75.47, "THK": 4.56, "TSMC": 1980.0, "TSMC CoWoS": 1980.0, "Talen": 15.19, "Tesla": 1400.0, "Tesla FSD silicon": 1400.0, "Tokyo Electron": 155.23, "Unimicron": 46.79, "Vertiv": 108.0, "Vistra": 50.11, "Waymo": 4140.0, "Wistron": 19.91, "Zscaler": 27.69, "ams OSRAM": 2.22};
const mcapText=n=>{if(n==null)return'';
  return n>=1000?'$'+(n/1000).toFixed(n>=10000?1:2)+'T':'$'+(n>=100?Math.round(n):n.toFixed(1))+'bn';};

/* Design model, for the accelerator-design stage: who sells the silicon they
   design and who only consumes it. Shown in that stage's note column. */
const DESIGN_MODEL={"NVIDIA": "Fabless chip firm — designs and sells merchant silicon", "AMD": "Fabless chip firm — designs and sells merchant silicon", "Broadcom": "Fabless chip firm — designs custom silicon for others", "Marvell": "Fabless chip firm — designs custom silicon for others", "Google TPU": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "AWS Trainium": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "Microsoft Maia": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "Meta MTIA": "Fabless non-chip firm — designs for its own use, does not sell the silicon", "Tesla AI5": "Fabless non-chip firm — designs for its own use, does not sell the silicon"};

const CALIAS={"ASE": "ASE Technology", "Anthropic": "Anthropic (private)", "Arista": "Arista Networks", "Boston Dynamics": "Hyundai (Boston Dynamics)", "Cadence": "Cadence Design Systems", "Constellation": "Constellation Energy", "DeepSeek": "DeepSeek and Alibaba Qwen", "Alibaba Qwen": "DeepSeek and Alibaba Qwen", "Howmet": "Howmet Aerospace", "Lynas": "Lynas Rare Earths", "Lynas Malaysia": "Lynas Rare Earths", "Marvell": "Marvell Technology", "Meta": "Meta Platforms", "Micron": "Micron Technology", "Microsoft Entra": "Microsoft", "NVIDIA Jetson": "NVIDIA", "NVIDIA NVLink": "NVIDIA", "OpenAI": "OpenAI (private)", "Schneider": "Schneider Electric", "Sibelco": "Sibelco and The Quartz Corp (private)", "The Quartz Corp": "Sibelco and The Quartz Corp (private)", "THK": "THK and Hiwin", "Hiwin": "THK and Hiwin", "TSMC CoWoS": "TSMC", "Google TPU": "Alphabet", "Google": "Alphabet", "Google Cloud": "Alphabet", "Google DeepMind": "Alphabet", "Gemini": "Alphabet", "Waymo": "Alphabet", "AWS": "Amazon", "AWS Trainium": "Amazon", "Azure": "Microsoft", "Copilot": "Microsoft", "ChatGPT": "OpenAI (private)", "Claude": "Anthropic (private)", "Microsoft Maia": "Microsoft", "Meta MTIA": "Meta", "Tesla AI5": "Tesla"};

/* CALIAS maps a chain name to the name the share table uses. The companies
   table starts from the other end, so it needs the reverse to find a logo. */
const RALIAS=(()=>{const o={};Object.keys(CALIAS).forEach(k=>{const v=CALIAS[k];if(!o[v])o[v]=k;});return o;})();
const logoFor=(name,cls)=>logoMark(name,cls)||logoMark(CALIAS[name]||'',cls)||logoMark(RALIAS[name]||'',cls)||'';

const COMETA_ANY=(()=>{const o={};
  if(typeof COMETA==='undefined') return o;
  Object.keys(COMETA).forEach(k=>{const n=k.slice(k.indexOf('|')+1); if(!o[n]) o[n]=COMETA[k];});
  return o;})();

function chainRow(name,layer){
  const c=(typeof CT!=='undefined')&&CT[name];
  const alias=CALIAS[name];
  const m=((typeof COMETA!=='undefined')&&COMETA[layer+'|'+name])||COMETA_ANY[name]
        ||(alias&&COMETA_ANY[alias]);
  const geo=(m&&m[0])||(c&&c[2])||'';
  let note=DESIGN_MODEL[name]||(m&&m[1])||'';
  if(note==='n/d') note='';
  const cap=MCAP[name]!=null?MCAP[name]:(alias!=null?MCAP[alias]:null);
  const mark=logoFor(name,'vr-logo')||'<span class="vr-logo is-blank" aria-hidden="true"></span>';
  const desc=CDESC[name]||'';
  const head=c&&c[1]
    ? `<a class="vr-name is-link" href="${SA}${c[1]}/" target="_blank" rel="noopener noreferrer">${_esc(name)}${_arrow}</a>`
    : `<span class="vr-name">${_esc(name)}</span>`;
  const tick=c&&c[0]?`<span class="vr-tick">${_esc(c[0])}</span>`:'<span class="vr-tick is-priv">not listed</span>';
  return `<li class="vrow">
    ${mark}
    <div class="vr-main"><div class="vr-top">${head}${tick}</div>${desc?`<p class="vr-desc">${_esc(desc)}</p>`:''}</div>
    <div class="vr-cap">${cap!=null?`<b>${mcapText(cap)}</b><span class="vr-lbl">market cap</span>`
      :'<span class="vr-none">not listed</span>'}</div>
    <div class="vr-note">${note?`<span>${_esc(note)}</span>`:'<span class="vr-none">no share stated</span>'}</div>
    <div class="vr-geo">${geo?`<span class="vr-flag" aria-hidden="true">${flagFor(geo)}</span><span>${_esc(geo)}</span>`:''}</div>
  </li>`;
}

/* Two derived diagrams: how deep each stage is, and where the chain sits. */
function chainDiagrams(d,col){
  const rows=d.stages.map(st=>({l:st.t,v:st.n.length,c:st.c}));
  const max=Math.max(...rows.map(r=>r.v));
  const depth=rows.map(r=>`<div class="bar"><span class="lb2">${_esc(r.l)}</span>`+
    `<span class="tr"><i class="fl" data-w="${(r.v/max*100).toFixed(1)}" style="background:${r.c?'var(--amber)':col}"></i></span>`+
    `<span class="vl">${r.v}</span></div>`).join('');

  const tally={};
  d.stages.forEach(st=>st.n.forEach(n=>{
    const c=(typeof CT!=='undefined')&&CT[n]; const k=c&&c[2];
    if(k) tally[k]=(tally[k]||0)+1; }));
  const geo=Object.entries(tally).sort((a,b)=>b[1]-a[1]);
  const gmax=geo.length?geo[0][1]:1, gtot=geo.reduce((s,g)=>s+g[1],0);
  const geoRows=geo.map(([k,v])=>`<div class="bar"><span class="lb2">${_esc(k)}</span>`+
    `<span class="tr"><i class="fl" data-w="${(v/gmax*100).toFixed(1)}" style="background:${col}"></i></span>`+
    `<span class="vl">${v}</span></div>`).join('');

  return `<div class="split chain-dia">
    <div class="block"><h4>How deep is each stage?</h4>
      <p class="cap" style="margin:0 0 12px">Credible named suppliers per stage. Amber bars are the stages flagged as chokepoints — depth and chokepoint status track each other closely, which is the point.</p>
      ${depth}
      <p class="cap" style="margin-top:12px">DERIVED — a count of the entities named in this chain, not a census of the industry. It measures how many suppliers a buyer can realistically approach, which is what matters for pricing power.</p></div>
    <div class="block"><h4>Where the chain is domiciled</h4>
      <p class="cap" style="margin:0 0 12px">Named entities by country of listing or headquarters, ${gtot} of them placed.</p>
      ${geoRows}
      <p class="cap" style="margin-top:12px">DERIVED — a headcount, not a value-weighted measure. One monopolist counts the same as one of five competitors, so read it for where the chain touches ground, not for how much value sits in each country.</p></div>
  </div>`;
}

/* Every listed entity in the chain, with its stage and where to look it up. */
function chainTable(d){
  const rows=[];
  d.stages.forEach(st=>st.n.forEach(n=>{
    const c=(typeof CT!=='undefined')&&CT[n];
    if(c&&c[1]) rows.push([n,st.t,c[0],c[1],c[2]]);
  }));
  const seen=new Set(), uniq=rows.filter(r=>{const k=r[0]; if(seen.has(k))return false; seen.add(k); return true;});
  if(!uniq.length) return '';
  return `<h4 class="mini-h">Listed entities in this chain</h4>
  <div class="tw"><table class="dat chain-tbl"><thead><tr><th>Entity</th><th>Stage</th><th>Country</th><th>Listing</th></tr></thead><tbody>`+
    uniq.map(r=>`<tr><td class="co-n"><a class="co-link" href="${SA}${r[3]}/" target="_blank" rel="noopener noreferrer">${_esc(r[0])}</a></td>`+
      `<td class="sm">${_esc(r[1])}</td><td class="sm">${_esc(r[4]||'—')}</td>`+
      `<td class="sm"><a class="tick" href="${SA}${r[3]}/" target="_blank" rel="noopener noreferrer">${_esc(r[2])}${_arrow}</a></td></tr>`).join('')+
    `</tbody></table></div>`;
}

function chainPane(n,col){
  const d=(typeof CHAIN!=='undefined')&&CHAIN[n];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const chokes=d.stages.filter(st=>st.c).length;
  const names=[...new Set(d.stages.flatMap(st=>st.n))];
  const listed=names.filter(x=>(typeof CT!=='undefined')&&CT[x]&&CT[x][1]).length;
  const thinnest=d.stages.reduce((a,b)=>b.n.length<a.n.length?b:a);

  const stages=d.stages.map((st,i)=>`
    <li class="chain-stage${st.c?' is-choke':''}" style="--stage:${col}">
      <div class="cs-head">
        <span class="cs-num">${i+1}</span>
        <div class="cs-title">
          <span class="chain-step">Stage ${i+1}${st.c?' · chokepoint':''}</span>
          <h5>${_esc(st.t)}</h5>
        </div>
        <span class="cs-count">${st.n.length} named ${st.n.length===1?'supplier':'suppliers'}</span>
      </div>
      ${st.w?`<p class="cs-what">${_esc(st.w)}</p>`:''}
      <ul class="vs-rows">${st.n.map(x=>chainRow(x,n)).join('')}</ul>
      ${st.note?`<p class="chain-note">${_esc(st.note)}</p>`:''}
    </li>`).join('');

  const p=(typeof PROC!=='undefined')&&PROC[n];
  const proc = p ? `
    <section class="vc-proc">
      <h4 class="blockhead">${_esc(p.t)}</h4>
      <p class="blocksub">${_esc(p.lead)}</p>
      <ol class="proc-flow">${p.steps.map((x,i)=>`
        <li class="proc-step">
          <span class="ps-num">${i+1}</span>
          <div class="ps-body">
            <h6>${_esc(x[0])}</h6>
            <div class="ps-who">${logoMark(x[1])||''}<span>${_esc(x[1])}</span></div>
            <p>${_esc(x[2])}</p>
          </div>
        </li>`).join('')}</ol>
      <p class="chain-note proc-note">${_esc(p.note)}</p>
      <p class="tnote">${_esc(p.src)}</p>
    </section>` : '';

  return `<p class="chain-lead">${d.lead}</p>
    <div class="vc-stats">
      <div><b class="num">${d.stages.length}</b><span>stages, upstream to downstream</span></div>
      <div><b class="num">${chokes}</b><span>${chokes===1?'stage is':'stages are'} a chokepoint</span></div>
      <div><b class="num">${names.length}</b><span>entities named, ${listed} of them listed</span></div>
      <div><b class="num">${thinnest.n.length}</b><span>suppliers at the thinnest stage &mdash; ${_esc(thinnest.t.toLowerCase())}</span></div>
    </div>
    <div class="chain-key">
      <span><i class="k-choke"></i>Chokepoint stage &mdash; few credible suppliers, long time to relieve</span>
      <span><i class="k-flow"></i>Each stage buys from the one on its left</span>
      <span><i class="k-link"></i>Listed &mdash; opens on Stock Analysis</span>
    </div>
    <p class="chain-hint">Upstream at the top, downstream at the bottom &mdash; scroll down to follow the chain. Each row is what that company supplies at that stage; the right-hand column is its position where a figure can be stated.</p>
    <div class="chain-wrap"><ol class="chain-flow" aria-label="Value chain for this layer, upstream first">${stages}</ol></div>
    ${proc}
    ${chainDiagrams(d,col)}
    ${chainTable(d)}
    <p class="tnote">Companies are named for structural completeness of the chain, not as recommendations, and several are private, Chinese-listed or embedded inside much larger groups. Position within a stage does not imply ranking. A company can appear in more than one stage or more than one layer. Product and platform names resolve to the parent listing, so Google TPU opens Alphabet and NVIDIA Jetson opens NVIDIA. Entities without a ticker are private, state-held, generic categories, or not separately listed.</p>`;
}

/* ── Project sources ─────────────────────────────────────────────────────── */
function projectSourcePane(key){
  const d=(typeof PSOURCES!=='undefined')&&PSOURCES[key];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const host=u=>u.replace(/^https?:\/\//,'').replace(/\/.*$/,'');
  const row=([name,use,url])=>`<li class="src">
      <a class="src-name" href="${url}" target="_blank" rel="noopener noreferrer">${_esc(name)}${_arrow}</a>
      <span class="src-use">${_esc(use)}</span>
      <span class="src-host">${_esc(host(url))}</span></li>`;
  return `<p class="chain-lead">${d.lead}</p>`+
    d.groups.map(([t,items])=>`<h4 class="mini-h">${_esc(t)}</h4><ol class="src-list">${items.map(row).join('')}</ol>`).join('')+
    `<div class="verdict" style="margin-top:22px"><h3>What to distrust first</h3><p>${_esc(d.caveat)}</p></div>`+
    `<p class="tnote"><b>How to read these links.</b> Each resolves to the publisher, dataset or filings search rather than to a single document, because several of the underlying items sit behind subscriptions, are updated in place, or are not stably addressable. Figures were compiled to September 2026. Nothing in this project is a forecast; each figure is an input to a model whose assumptions are stated where the number appears.</p>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   V9 — the physical world: context rather than an allocation
   ══════════════════════════════════════════════════════════════════════════ */
function worldPane(){
  const row=r=>`<tr>${r.map((c,i)=>`<td class="${i?'sm':'co-n'}">${c}</td>`).join('')}</tr>`;
  const table=(h,rows,min=720)=>`<div class="tw"><table class="dat" style="min-width:${min}px">`+
    `<thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(row).join('')}</tbody></table></div>`;
  return `
  <div class="overview-lede">
    <div>
      <p class="lede">Everything in the eight layers above is, in the end, rearranged pieces of this. Nothing in the stack is created — it is extracted, concentrated, purified and shaped, using energy that was itself captured from somewhere physical.</p>
      <p>The physical world is not a layer because you cannot invest in it and it has no supplier. It belongs in this report for two reasons. It is the source of the two base layers, energy and materials, and the transformation steps between a natural resource and a usable input are where almost every chokepoint in this analysis actually sits. And it is the environment embodied machines have to operate in — the one part of the stack that was not designed, does not follow a specification, and does not hold still.</p>
    </div>
    <aside class="constraint"><b>The framing that matters.</b> Nature supplies abundance in raw form and scarcity in useful form. There is no shortage of quartz on earth, no shortage of iron, no shortage of sunlight. What is scarce is quartz pure enough for a crucible, steel annealed into a transformer core, and electricity that is firm at three in the morning. <b>Every constraint in this report is a transformation constraint, not a resource constraint.</b></aside>
  </div>

  <h4 class="mini-h">Energy — from a natural flow or stock to a usable electron</h4>
  <p class="sub">Each row is a conversion. The value, the capital and the bottlenecks sit in the middle column, not the first.</p>
  ${table(['Natural resource','What has to be built to use it','What comes out','Where the difficulty is'],[
    ['Uranium ore','Mining, milling, conversion to hexafluoride, enrichment, fuel fabrication, a reactor, a turbine hall','Firm baseload electricity, 90%+ capacity factor','Enrichment capacity and, for advanced reactors, high-assay low-enriched fuel — not ore. Construction schedules run seven years and longer'],
    ['Natural gas','Extraction, pipelines, a combined-cycle plant with single-crystal turbine blades','Firm, dispatchable electricity in hours','Turbine hot-section castings from a handful of specialised foundries. Slots are sold to 2031'],
    ['Sunlight','Silicon purification, cell and module manufacture, inverters, land, storage','Cheap electricity, but only when the sun is up','Firmness. Round-the-clock supply needs roughly fourfold overbuild plus overnight storage'],
    ['Wind','Rare earth magnets or electrically excited generators, towers, blades, grid connection','Variable electricity','Magnets, grid connection queues, and the same firmness problem'],
    ['Falling water','Dams, penstocks, turbines, decades of permitting','Firm and storable electricity','Geography. The good sites are largely taken'],
    ['Any of the above','Transformers, switchgear, transmission lines, substations, cooling','Electricity where and when it is needed','Grain-oriented electrical steel, copper and 128-week transformer lead times'],
  ])}
  <p class="cap">The last row is the one most analysis skips. Generation is only half the problem; moving and conditioning the electricity is the half that is currently gating the build-out.</p>

  <h4 class="mini-h">Materials — from rock to a qualified input</h4>
  <p class="sub">The same shape appears again. Ore is common; the refined, purified, qualified form is not.</p>
  ${table(['Natural resource','Transformation chain','What it becomes','Where the difficulty is'],[
    ['Copper ore, 0.4–1% metal','Crushing, flotation, smelting, electrolytic refining','Cathode at 99.99%, then wire, busbar, tube','Smelting, not mining. China holds roughly 8% of concentrate and 48% of smelting'],
    ['Silica sand and high-purity quartz','Carbothermic reduction, the Siemens process, crucible forming, crystal growth','Electronic-grade polysilicon at eleven nines, then wafers','Purity, and a crucible material that comes almost entirely from one North Carolina district'],
    ['Bastnäsite and monazite ore','Cracking, leaching, hundreds of solvent-extraction stages, metal reduction, sintering','Neodymium-iron-boron magnets that survive heat','Separation. Chemically near-identical elements, and the process technology itself is export-controlled'],
    ['Iron ore','Steelmaking, hot and cold rolling, decarburisation anneal, days-long box anneal','Grain-oriented electrical steel for transformer cores','A metallurgical recipe accumulated over decades. One domestic US producer'],
    ['Nickel, cobalt, rhenium','Vacuum induction melting, single-crystal investment casting, coating','Turbine blades that survive above 1,000°C for years','Yield. Growing one continuous metal crystal with internal cooling channels'],
    ['Lithium brine or spodumene','Concentration, conversion, cathode manufacture, cell assembly','Storage for the grid and for the fleet','Refining and cathode production, both heavily concentrated in China'],
  ])}

  <h4 class="mini-h">Moving and sensing in it — the part that was not designed</h4>
  <p>A data centre is a controlled environment built to a specification. A warehouse aisle, a construction site, a kitchen and a public road are not. This is the gap between a model that performs well on a benchmark and a machine that is useful on a Tuesday afternoon, and it is a physics and engineering problem rather than a scaling one.</p>
  ${table(['The challenge','Why the physical world makes it hard','What has to improve'],[
    ['Perception under real conditions','Rain, glare, dust, night, reflective surfaces and partial occlusion break sensors that work in a lab. Every deployment discovers new failure modes rather than exhausting a fixed list','Sensor fusion, and enough real operating hours to encounter the long tail at all'],
    ['Touch','Manipulation depends on feeling grip slip, compliance and contact force. Tactile sensing is the least mature modality in robotics and has no dominant supplier','A tactile sensing stack that is durable, cheap and manufacturable at fleet volume'],
    ['Acting inside a latency budget','A picking robot needs sub-200-millisecond action cycles. A cloud round trip is 50–150 ms and a dropped connection mid-task is a safety event, so inference has to run on board','Models small enough to run in roughly 130 watts that are still good enough to be useful'],
    ['Carrying its own energy','A humanoid carries about 2.3 kWh — a high-end electric bicycle — against 82 kWh in a car. Adding capacity adds mass, which adds torque demand, which eats the runtime the capacity was meant to buy','Architecture rather than chemistry: hot-swappable packs, autonomous docking, charging infrastructure as a deployed asset'],
    ['Wear','Reducers, bearings and actuators are consumables. Ten million machines with 45 actuators each implies a maintenance economy and a trade that do not yet exist','A trained technician base, spare-part logistics and honest duty-life data'],
    ['Being safe around people','An agent with credentials that can only write to a database is a data breach risk. An agent with credentials that can lift 25 kg is a physical safety risk','Standards, machine identity, per-action authorisation, and insurance markets that will price it'],
  ])}

  <h4 class="mini-h">The feedback that closes the loop</h4>
  <p>Text describes the world; it does not verify claims about it. A model trained only on text learns what people have written about physics, not what physics does. Sensors close that gap by returning an error signal from reality itself: actuators change the world, sensors observe the changed world, and the discrepancy between prediction and observation is the training signal. <b>Each turn generates data that could not have existed before that turn</b> — which is the structural difference between a flywheel and a pipeline, and the reason a decade of fleet driving data cannot be bought, scraped or licensed by a competitor.</p>
  <div class="wrongnote" style="margin:16px 0 0"><b>The honest caveat, repeated here because it matters.</b> Research teams reported in 2026 that robot policies trained on 40% synthetic data matched policies trained wholly on real demonstrations. If synthetic generation substitutes that well, real-world collection is a threshold asset rather than a scaling one — enough to seed a simulator, and sharply diminishing after that. That would make the data-collection arms race over-funded and shift the advantage to whoever simulates best. I cannot resolve this from outside, and every embodiment position should be sized as though it might go either way.</div>

  <div class="layer-verdict"><b>How to use this section.</b> Not as an allocation. Use it as a check on the two claims the rest of the report depends on: that a natural resource can actually be transformed into a usable input on the schedule the build-out assumes, and that machines can eventually operate in unstructured surroundings well enough to be worth their cost. If the first fails, layers 1 and 2 reprice upward and everything above them slips. If the second fails, layer 8 stays a pilot programme and the loop never closes.</div>

  <p class="tnote">This section is context rather than analysis: it carries no company list, no valuation and no rating, and it deliberately has no sub-views. The material chains summarised here are treated in full in layer 2, the energy conversions in layer 1, and the sensing and manipulation constraints in layer 8.</p>`;
}

/* ══════════════════════════════════════════════════════════════════════════
   Layer marks. One line-drawn icon per layer on a 44x44 artboard, in the same
   grammar as the globe on the overview map: round caps and joins, no fill, the
   stroke inherited so each mark takes its own layer colour in both themes.
   Used in three places — the overview map, the layer rail, and the layer head.
   ══════════════════════════════════════════════════════════════════════════ */
const LAYER_ICONS={
 0:'<circle cx="22" cy="22" r="15"/><ellipse cx="22" cy="22" rx="6.6" ry="15"/><path d="M7.4 16.5 H36.6"/><path d="M7.4 27.5 H36.6"/>',
 1:'<rect x="8" y="8" width="28" height="28" rx="7"/><path d="M24.5 13.5 L17.5 23 H22.5 L19.5 30.5 L26.5 21 H21.5 Z"/>',
 2:'<path d="M6.5 36 L11 25.5 L22 24.5 L26 36 Z"/><path d="M26.5 36 L29 26 L37.5 27.5 L37 36 Z"/><path d="M13 24 L18 13.5 L27.5 16 L25.5 24.5"/>',
 3:'<circle cx="22" cy="22" r="15"/><g clip-path="url(#waferClip)"><path d="M6 15 H38"/><path d="M6 22 H38"/><path d="M6 29 H38"/><path d="M15 6 V38"/><path d="M22 6 V38"/><path d="M29 6 V38"/></g><path d="M19.4 7.5 L22 12.2 L24.6 7.5"/>',
 4:'<rect x="12" y="12" width="20" height="20" rx="3"/><rect x="18" y="18" width="8" height="8" rx="1.5"/><path d="M17 12 V6"/><path d="M22 12 V6"/><path d="M27 12 V6"/><path d="M17 32 V38"/><path d="M22 32 V38"/><path d="M27 32 V38"/><path d="M12 17 H6"/><path d="M12 22 H6"/><path d="M12 27 H6"/><path d="M32 17 H38"/><path d="M32 22 H38"/><path d="M32 27 H38"/>',
 5:'<rect x="6" y="8" width="32" height="7.5" rx="2.2"/><rect x="6" y="18.3" width="32" height="7.5" rx="2.2"/><rect x="6" y="28.6" width="32" height="7.5" rx="2.2"/><circle cx="11" cy="11.75" r="1.4"/><circle cx="11" cy="22.05" r="1.4"/><circle cx="11" cy="32.35" r="1.4"/><path d="M30 11.75 H34"/><path d="M30 22.05 H34"/><path d="M30 32.35 H34"/>',
 6:'<path d="M14.6 12.8 L29.4 16.2"/><path d="M14.1 14.1 L29.9 24.9"/><path d="M14.6 21.2 L29.4 17.8"/><path d="M14.6 22.8 L29.4 26.2"/><path d="M14.1 29.9 L29.9 19.1"/><path d="M14.6 31.2 L29.4 27.8"/><circle cx="11" cy="12" r="2.9"/><circle cx="11" cy="22" r="2.9"/><circle cx="11" cy="32" r="2.9"/><circle cx="33" cy="17" r="2.9"/><circle cx="33" cy="27" r="2.9"/>',
 7:'<rect x="6" y="10" width="32" height="24" rx="3.2"/><path d="M6 17 H38"/><circle cx="10.6" cy="13.5" r="1.3"/><circle cx="14.8" cy="13.5" r="1.3"/><path d="M12 22.5 L16.5 26.5 L12 30.5"/><path d="M20 30.5 H30"/>',
 8:'<rect x="16" y="4.5" width="12" height="9.5" rx="3.2"/><circle cx="19.6" cy="9.3" r="1.3"/><circle cx="24.4" cy="9.3" r="1.3"/><path d="M22 14 V16.5"/><rect x="14" y="16.5" width="16" height="12" rx="3.2"/><path d="M14 19.5 H9.5 V26.5"/><path d="M30 19.5 H34.5 V26.5"/><path d="M18.5 28.5 V30.7"/><circle cx="18.5" cy="32.2" r="1.5"/><path d="M18.5 33.7 V36.5"/><path d="M16.2 36.5 H20.8"/><path d="M25.5 28.5 V30.7"/><circle cx="25.5" cy="32.2" r="1.5"/><path d="M25.5 33.7 V36.5"/><path d="M23.2 36.5 H27.8"/>'
};
/* A standalone mark. `wafer` is why each copy needs its own clip id. */
let __icn=0;
function layerIcon(n,cls){
  const id='wc'+(++__icn);
  const body=LAYER_ICONS[n].replace('url(#waferClip)','url(#'+id+')');
  return `<svg class="licon ${cls||''}" viewBox="0 0 44 44" aria-hidden="true" style="stroke:var(--l${n})">`+
    `<defs><clipPath id="${id}"><circle cx="22" cy="22" r="13.6"/></clipPath></defs>${body}</svg>`;
}

const C=Object.fromEntries([1,2,3,4,5,6,7,8].map(n=>[n,`var(--l${n})`]));

const LAYERS=[
{n:1,t:'Energy and power',moat:'Strong moat',mk:'good',
 sub:{h:['Sub-layer','Function','Where the chokepoint sits'],r:[
 ['Generation','Firm, dispatchable 24/7 output','Existing interconnected capacity, not new build'],
 ['Transmission and interconnection','Grid connection, substations, lines','Five to seven year queues — the binding constraint'],
 ['On-site electrical plant','Transformers, switchgear, UPS, busway','Grain-orientation annealing and MV switchgear capacity'],
 ['Thermal management','Cold plates, CDUs, chillers','Fragmented — top seven vendors hold only ~35%'],
 ['The rack','50–130 kW, versus 5–15 kW before','Density broke air cooling and made liquid mandatory']]},
 detail:[
 ['Why firmness, not cheapness, decides this layer',
  'US data centre electricity demand rose from roughly 23 GW in 2023 to about 42 GW in 2026, with interconnection queues running five to seven years. Gas-fired capacity in development to serve US data centres reached 189 GW in the first half of 2026 alone. Hyperscalers have committed over 9.8 GW of nuclear across thirteen deals, but as of July 2026 only 19.6% of that committed power was actually flowing, and Western SMR deployments realistically begin between 2029 and 2035 at first-of-a-kind costs of $80–150/MWh against vendor targets of $60–80. <b>The SMR narrative runs roughly five years ahead of SMR revenue.</b> The near-term winners own firm generation that already exists and is already connected — a reactor that might exist in 2032 is not the scarce good.'],
 ['The turbine oligopoly, in numbers',
  'GE Vernova\u2019s gas turbine backlog reached 116 GW at the end of Q2 2026, up from 83 GW at end-2025 — of which roughly 53 GW is firm equipment backlog and 63 GW is paid slot reservations. Siemens Energy ended its fiscal Q3 at 69 GW; Mitsubishi Heavy at 35 GW, up from 23 GW a year earlier. Wood Mackenzie puts global heavy-duty manufacturing capacity at only 60–70 GW a year against roughly 110 GW of outstanding orders. Combined-cycle lead times stretched from 3.5 years in 2023 to around five today, and up to seven for some frames. The chokepoints are hot-section castings from a limited set of specialised foundries, and skilled welders and machinists laid off during the lean 2010s who were never replaced. Fuel is almost irrelevant — Henry Hub sat around $2.79/MMBtu in mid-August 2026. <b>Discipline born of scar tissue is the most durable form of supply discipline, because it is cultural rather than contractual.</b>'],
 ['The transformer squeeze, and its consequence',
  'US power transformer lead times average 128 weeks, with generator step-up units at 144. Prices are up 77% since 2019 on 119% demand growth. Substation transformer lead times stretched from roughly 140 weeks in 2023 to more than 160 in 2026, and data-centre-specification medium-voltage switchgear approaches two to three years. Wood Mackenzie projects the US data centre electrical equipment market growing from roughly $20bn to $65bn by 2030, with annual transformer demand potentially exceeding 9,000 units against about 1,500 today. Electrical infrastructure represents 40–50% of total build cost. <b>The consequence is already visible:</b> of roughly 12 GW of US capacity slated to come online in 2026, only about a third was under active construction, with industry estimates suggesting 30–50% of planned openings will be delayed or cancelled. This cuts both ways — bullish for equipment suppliers, bearish for anyone assuming hyperscaler capex converts smoothly into deployed compute.'],
 ['Thermal management — high growth, weaker moat',
  'The data centre liquid cooling market is projected to expand from roughly $6.6bn in 2026 to $38.4bn by 2033, a 28.7% compound rate, with direct-to-chip holding about 47% of the segment because it retrofits into standard rack designs. But the top seven players — Schneider, Vertiv, Rittal, Stulz, Boyd, CoolIT and Alfa Laval — held only around 35% of the market in 2025. <b>That is a fragmented, competitive market: high growth, structurally weaker moats than turbines or transformers.</b> Both Vertiv and Schneider bought their way in, which tells you the technology was acquirable. Growth is not the same as pricing power.'],
 ['How to hold this layer',
  'Layer 1 is the diversifier within the AI theme rather than an additional bet on it. Its correlation to the semiconductor complex is high but not total, because it has a second demand driver — electrification, grid replacement and reshoring — that continues even if AI capex plateaus. Companies where that second driver is large (Eaton, ABB, Schneider, Quanta) are more defensive; companies where it is small (Vertiv, the neocloud-adjacent names) are more levered. <b>The asymmetry that defines the layer: a $2bn campus can sit idle waiting on a $40m transformer. A supplier of a 2% cost item that gates 100% of the project has extraordinary pricing power, and that is not a temporary condition.</b>']],
 watch:[
 ['Firm backlog versus slot reservations','A rising ratio of reservations to firm orders at GE Vernova and Siemens Energy is the earliest warning that the order book is softer than the headline'],
 ['Transformer and switchgear lead times','A <em>shortening</em> lead time is the first sign the shortage is resolving and pricing power is peaking'],
 ['Announced versus under-construction capacity','Currently around one third — the cleanest proxy for whether the build-out is real or aspirational'],
 ['Incremental margin on backlog conversion','Backlog booked at today\u2019s prices against rising input costs is how great order books produce mediocre returns']],
 lede:'Generation, transmission, substations, electrical distribution gear and thermal management. An AI accelerator is a machine for converting electricity into inference — that is the whole business.',
 why:'Power has replaced silicon as the practical limit on how fast the infrastructure stack can grow. It requires <b>firm</b> power, not just power: training runs and inference serving need continuous 24/7 supply, which is why hyperscalers went to nuclear and gas rather than simply buying more renewables. The cheapest-electron framework that dominated energy investing for fifteen years does not apply here.',
 choke:'The chokepoint is <b>long-lead-time electrical equipment and turbine hot-section castings</b>, not generation. Global heavy-duty turbine capacity runs 60–70 GW a year against roughly 110 GW of outstanding orders, and the constraint is specialised foundries and skilled welders laid off during the lean 2010s.',
 facts:[['116 GW','GE Vernova turbine backlog, Q2 2026'],['128 wks','Large power transformer lead time'],['~1/3','Announced 2026 US capacity under construction'],['40–45%','Electrical plant as a share of facility cost']],
 chart:{t:'Equipment lead times, order to delivery',u:'weeks',b:[['Distribution transformers',30],['UPS above 500 kVA',33],['Pad-mount transformers',52],['Backup generators 2MW+',65],['MV switchgear',95],['HV circuit breakers',125],['Large power transformers',128],['Generator step-up units',160],['Heavy-duty gas turbine',260]],
  note:'The gas turbine figure converts GE Vernova\u2019s stated 2031 delivery slots into weeks from a mid-2026 order. A supplier of a 2% cost item that gates 100% of the project has extraordinary pricing power.'},
 co:[
 ['GE Vernova','Heavy-duty gas turbines, grid equipment, nuclear services','$176bn total backlog; capacity 20 GW/yr rising toward 30 GW by 2030','Largest gas turbine OEM','Sold out to 2031; sits at two chokepoints simultaneously; supply discipline is cultural, born of the 2018 turbine crash','63 GW of the 116 GW backlog is paid slot reservations, which can be released; backlog booked at today\u2019s prices; wind segment drag'],
 ['Siemens Energy','Turbines, grid technology, transmission','69 GW firm turbine backlog; record order book','Second turbine OEM, leading grid technology','Grid plus turbines is two bottlenecks in one company; European listing diversifies USD exposure','Legacy wind execution history; margin recovery still in progress'],
 ['Schneider Electric','Electrical distribution, DC power architecture, Motivair liquid cooling','Broadest data centre portfolio; large services annuity','Top-tier in both power and thermal','Only supplier spanning power and cooling at scale; services revenue smooths the cycle','Top seven cooling vendors hold only ~35% share — a materially weaker moat than the power business'],
 ['Vertiv','UPS, busway, coolant distribution units, cold plates','Purest listed exposure to rack density rather than floor space','Top-two in DC power and thermal','Levered to kilowatts per rack, and density is rising faster than footprint','Highest beta to the capex cycle in both directions; fragmented cooling competition'],
 ['Eaton','Switchgear, busway, electrical components','Data centre is a growth segment inside a diversified industrial','Major US electrical supplier','Diversification lowers single-cycle risk; reshoring and electrification tailwinds independent of AI','Lower purity of AI exposure; aerospace and vehicle segments dilute the story'],
 ['Constellation Energy','Largest US nuclear fleet; long-dated hyperscaler PPAs','Firm, already-interconnected, carbon-free baseload','Largest US nuclear operator','Owns the genuinely scarce good — power that already exists and is already connected to the grid','Widely understood and priced accordingly; merchant exposure on uncontracted volume'],
 ['Cleveland-Cliffs','Grain-oriented electrical steel; steel','Only domestic US GOES producer; transformer prices up 77% since 2019 on 119% demand growth','Monopoly on a critical input','Genuine monopoly on the material that gates US transformer output','The good asset sits inside a cyclical, leveraged steel business with heavy exposure elsewhere']],
 wrong:'Backlogs are booked at today\u2019s prices, not future prices. If castings, copper, electrical steel and skilled labour rise faster than contracted prices, a record order book converts into revenue growth with margin compression — the commonest way great backlogs produce mediocre returns.'},

{n:2,t:'Materials',moat:'Strong moat',mk:'good',
 sub:{h:['Sub-layer','Function','Where the chokepoint sits'],r:[
 ['Extraction','Ore bodies, brines and by-product streams','The least concentrated step — mining is geographically diverse'],
 ['Refining and separation','Concentrate into purified metal or oxide','Where the leverage actually sits; China holds 86–90% of rare earth separation'],
 ['Purification','Electronic-grade purity, six to eleven nines','Four producers of electronic-grade polysilicon worldwide'],
 ['Transformation','Annealing, casting, alloying, magnet sintering','Tacit process knowledge, not equipment that can be bought'],
 ['Qualification','Certification into a customer process','Requalifying a wafer line or a transformer core takes years']]},
 detail:[
 ['Refining beats mining, and it is not close',
  'The instinct is to focus on the mine. That instinct is wrong almost everywhere in this stack. China holds roughly <b>8% of copper concentrate production but 48% of smelting capacity</b>. It mines a minority of the world\u2019s rare earths but processes an estimated 86–90% of them. Reserves take a decade to develop; refineries take three to five years and require process knowledge that cannot be purchased. <b>Across every material in this layer, mining is more diversified and lower-margin than refining, separation or conversion.</b> Where listed exposure to the refining step exists — Aurubis in copper, Lynas in rare earths, Wacker in polysilicon, Linde and Air Liquide in gases — it is generally the higher-quality position.'],
  ['The most concentrated dependency in the entire stack',
  'To grow a monocrystalline silicon ingot, molten polysilicon must be held in a crucible that withstands roughly 1,400°C without contaminating the melt. The only material that works is fused quartz of extraordinary purity, and BloombergNEF estimated in 2024 that the <b>Spruce Pine district in western North Carolina supplies roughly 80% of the world\u2019s high-purity quartz sand</b>, with industry estimates putting the semiconductor-grade share above 90%. Two companies mine there: Sibelco and The Quartz Corp. Hurricane Helene forced both to halt operations in September 2024 — the closest thing to a live stress test the industry has run. <b>There is no United States export control regime covering high-purity quartz</b>, while Washington has spent heavily to break Chinese control of rare earth separation. For an investor the relevant observation is not the policy critique but the asymmetry, and the fact that this chokepoint has almost no direct listed exposure at all.'],
 ['By-products cannot respond to their own price',
  'Rhenium, gallium, germanium, indium and hafnium are all recovered as by-products of an unrelated primary metal. Rhenium — 3% to 7% by weight of a third-generation single-crystal turbine blade — comes out of copper-molybdenum production, so its supply is a function of how much copper the world happens to mine, not of what turbine makers will pay. Gallium and germanium are by-products of aluminium and zinc refining, which is precisely why China dominates them and precisely why they became the first materials placed under export control in August 2023. <b>Supply that cannot respond to price is structurally prone to acute shortage, and that is exactly what makes it an attractive policy instrument.</b>'],
 ['Material chokepoints are acute in the short run and weaker in the long run',
  'This is the distinction that separates layer 2 from layer 3. ASML\u2019s monopoly is defended by accumulated engineering. A refining monopoly is defended by capital, environmental permitting and tacit process knowledge — all replicable given enough time and political will, typically three to eight years. <b>Material constraints therefore determine the near-term shape of the build-out and the timing of bottlenecks, but they are a weak basis for a decade-long thesis on their own.</b> The single exception is where the process knowledge itself is protected: China\u2019s Announcement 62 of October 2025 banned the export of rare earth mining, smelting, separation, metal production, magnet manufacturing and recycling <em>technology</em>, including the equipment and the people who carry it. Licensing the metal is a tariff. Banning the know-how is a moat.'],
 ['The scheduled risk date',
  'The April 2025 licensing requirement on seven heavy rare earths — including the dysprosium and terbium that keep magnets working at temperature — <b>was never suspended and remains active</b>, with Chinese customs data showing exports running roughly 50% below prior levels. What was suspended in November 2025 is the October 2025 package and the United States-specific bans, and that suspension expires on 10 November 2026, with the gallium, germanium and antimony arrangement running to 27 November 2026. The IEA has assessed that full reimplementation of existing controls would cost the global economy on the order of $6.5 trillion annually. <b>This is a known, dated risk event affecting layers 1, 2, 3, 4 and 8 simultaneously</b>, which is unusual — most portfolio risks are not in the diary.']],
 watch:[
 ['Copper treatment and refining charges','Spot charges reached negative $90 a tonne in March 2026, meaning smelters paid for the right to process ore. A recovery signals concentrate supply loosening; sustained negative charges signal Western smelter closures, which concentrates refining further in China'],
 ['Any disruption at Spruce Pine','The most concentrated, least monitored and least policy-protected dependency in the infrastructure stack'],
 ['November 2026 export control expiry','A scheduled, known date affecting four layers at once'],
 ['Western separation capacity coming online','Lynas, Solvay at La Rochelle and MP Materials are the test of whether the Chinese separation lead is actually replicable'],
 ['HALEU production milestones','The hard gate on the nuclear portion of the layer 1 energy thesis, and a capacity problem rather than a cost problem']],
 lede:'Ore, brine, gas and by-product streams, and the refining, separation and transformation steps that turn them into something a fab, a transformer or a magnet can actually use.',
 why:'Everything above this layer is a claim on material that has been dug up, purified and qualified. Materials sit alongside energy at the base of the infrastructure stack because they are the two things the physical world supplies directly — and because a $38bn project can be gated by an input worth a few million dollars. <b>The relevant question is never how much of a material exists. It is who can refine it, and how long it takes to qualify an alternative.</b>',
 choke:'The chokepoint is <b>refining and separation capacity, not reserves in the ground</b>. Mining is geographically diverse; refining is not. China holds 86–90% of rare earth separation, 48% of copper smelting against 8% of copper mining, and two mines in one North Carolina district supply roughly 80% of the world\u2019s high-purity quartz.',
 facts:[['86–90%','China share of world rare earth refining'],['~80%','World high-purity quartz from one US district'],['48%','China copper smelting, against 8% of mining'],['3–8 yr','Time to build alternative refining capacity']],
 chart:{t:'Concentration at the single dominant node',u:'% of world capacity',b:[['Copper mining, China',8],['Copper refining, China',44.6],['Copper smelting, China',48],['Rare earth magnets, China',70],['High-purity quartz, Spruce Pine',80],['Rare earth refining, China',86],['Electronic-grade polysilicon, top four',95],['EUV optics, Zeiss SMT',100]],
  note:'Read the gap between the first and third bars. China mines 8% of the world\u2019s copper concentrate and smelts 48% of it — the same pattern repeats in almost every material in this layer, and it is why the investable position usually sits one step above the mine.'},
 co:[
 ['MP Materials','Mountain Pass mining, separation and magnet manufacturing','The most advanced integrated non-Chinese rare earth position; Department of Defense price floor agreement','US rare earth champion','Policy-supported, vertically integrating into magnets, and structurally advantaged if controls tighten','Named on China\u2019s June 2026 export control list; depends on Chinese inputs at points in its own chain; performs when the rest of an AI portfolio is being hurt, which makes it insurance rather than growth'],
 ['Lynas Rare Earths','Mining at Mount Weld, processing in Malaysia and Australia','The most established non-Chinese separation capacity outside China','The only proven Western separator at scale','Genuinely operating separation capacity, not a development story; heavy rare earth capability is the scarce part','Chinese production is genuinely lower cost; the business is structurally challenged if controls loosen; Malaysian regulatory history'],
 ['Freeport-McMoRan','Copper mining and concentrate','Roughly 4 billion pounds of copper a year; Grasberg and Morenci','Largest listed pure-play copper miner','Inelastic copper demand from data centres, grid and EVs simultaneously; grades are declining industry-wide, which supports price','Mining is the least concentrated step in the chain and the most price-taking; Indonesian political exposure'],
 ['Aurubis','European copper smelting and refining','Europe\u2019s largest copper smelter; multi-metal recycling','Western refining capacity','The structurally interesting position: squeezed by negative treatment charges while being treated as strategic infrastructure by Western governments, a combination that historically precedes policy support','Treatment and refining charges at or below zero are a direct margin problem now; policy support is a hope, not a contract'],
 ['Cleveland-Cliffs','Grain-oriented electrical steel, flat-rolled steel','The only domestic US producer of grain-oriented electrical steel','Single-point US dependency','A genuine monopoly on an input every transformer on earth requires, with transformer prices up 77% since 2019','The good asset is embedded in a difficult, heavily cyclical steel business with meaningful leverage'],
 ['Howmet Aerospace','Single-crystal superalloy castings and forgings','Hot-section castings for gas turbines and aero engines','Cleanest listed proxy for the turbine casting bottleneck','The constraint is furnace capacity and skilled labour rather than order book, which is the more durable kind of constraint','Aerospace cycle exposure; rhenium supply is a by-product of copper-molybdenum mining and cannot respond to demand'],
 ['Linde','Industrial and electronic specialty gases','On-site plants co-located with fabs on long-term contracts','Infrastructure-like, not equipment-like','Revenue scales with wafer starts rather than with equipment purchases — a materially more stable revenue shape than semiconductor capital equipment','Utility-like growth and valuation; the AI linkage is real but dilute across a very large base'],
 ['Wacker Chemie','Electronic-grade polysilicon, silicones','One of four producers of eleven-nines electronic-grade polysilicon','Purification chokepoint','Electronic grade requires several orders of magnitude more purity than solar grade and the two are not interchangeable, which insulates it from Chinese solar overcapacity','Chemicals cyclicality and European energy costs; the solar polysilicon collapse has repeatedly obscured the electronic-grade business'],
 ['Sibelco and The Quartz Corp (private)','High-purity quartz sand from the Spruce Pine district','Roughly 80% of world high-purity quartz supply between them','The infrastructure stack\u2019s most concentrated dependency','If you could own it, you would; the qualification cycle makes substitution extremely slow','Neither is listed. This is a chokepoint with almost no direct investable exposure — which is itself worth knowing']],
 wrong:'Material chokepoints are the most reversible kind in this report. A refining monopoly can be replicated with capital, permitting and political will in three to eight years, and Western governments are actively funding exactly that. If separation capacity outside China arrives faster than expected, or if the November 2026 controls lapse quietly, the scarcity premium in this layer compresses well before the AI build-out does. Sizing this as a hedge against the rest of the thesis is defensible; sizing it as growth is not.'},
{n:3,t:'Semiconductor value chain',moat:'Very strong moat',mk:'good',
 sub:{h:['Sub-layer','Function','Where the chokepoint sits'],r:[
 ['Design tools and IP','EDA software, reusable circuit blocks','Three vendors hold ~75% globally and ~80% of China'],
 ['Equipment','Lithography, etch, deposition, metrology','ASML sole EUV supplier; Zeiss its sole optics supplier'],
 ['Materials','Wafers, gases, photoresists, CMP slurries','High-purity quartz; Japanese resist chemistry'],
 ['Wafer fabrication','Leading-edge logic and memory dies','TSMC at the leading edge; scale now insurmountable'],
 ['Advanced packaging','CoWoS, SoIC, silicon interposers','Over 90% TSMC — the current binding constraint'],
 ['Test and assembly','OSAT, burn-in, final test','ASE and Amkor absorbing constrained-line overflow']]},
 detail:[
 ['EDA — the highest-quality business model in the infrastructure stack',
  'Per TrendForce estimates, Synopsys holds roughly 32% share, Cadence 30% and Siemens EDA 13% — about three-quarters of the global market and roughly 80% of China\u2019s. Every advanced chip in the world is designed in this software, by engineers trained on it, using IP libraries qualified against specific foundry process design kits. Switching means requalifying an entire design flow with a multi-year gap in which you ship nothing. In May 2025 the US Commerce Department required licences for EDA exports to China and Synopsys suspended guidance; the controls were rescinded roughly five weeks later. Synopsys had generated approximately $989.5m from China in FY2024, about 16% of revenue. <b>That episode is the instructive one: it demonstrated both the political fragility of the China line and how quickly the risk can reverse. Neither direction should be extrapolated.</b>'],
 ['ASML — and the disclosure change nobody discussed',
  'ASML guided FY2026 revenue to €36–40bn and reported Q1 2026 sales of €8.8bn at 53% gross margin. Year-end 2025 backlog stood at €38.8bn after Q4 net bookings of €13.2bn, with orders extending through 2027 — and notably, memory orders represented 56% of bookings, surpassing logic for the first time. It plans to ship roughly 60 low-NA EUV systems in 2026, about 25% more than 2025, targeting capacity for 80 in 2027. <b>From Q1 2026 ASML stopped publishing quarterly net bookings.</b> The stated rationale — that lumpy large orders distort the read — is defensible. It is also the kind of change that is much easier to make while orders are strong than after they turn. It is not a red flag, but it is a reason to weight TSMC capex, memory groundbreakings and wafer fab equipment forecasts more heavily.'],
 ['High-NA is a 2028 story, not a 2026 one',
  'High-NA systems cost roughly $350–400m each and print at 8nm resolution, about 1.7 times smaller, with up to 2.9x density potential. But TSMC has deferred High-NA to its A14 node around 2028, using low-NA plus multi-patterning for 2nm and A16; SemiAnalysis estimates it may not adopt until A10 around 2029–2030, because low-NA double patterning can match 8nm resolution at potentially lower cost. Intel is the aggressive first mover, deploying it for 14A. <b>Anyone underwriting ASML on near-term High-NA contribution is underwriting the wrong thing.</b> The near-term case rests on low-NA volume, installed-base service revenue and the memory cycle. Wafer fab equipment spending is forecast to grow roughly 7% in 2026 and 14% in 2027, with memory outpacing logic in both.'],
 ['TSMC — where a margin decline is a bullish signal',
  'Q2 2026 revenue of $40.2bn, up 36%, at 67.7% gross margin, with full-year growth guidance raised above 40%. Capex was raised to $60–64bn from roughly $56bn guided in January, implying second-half spending 56–75% higher year on year. 3nm runs above 100% utilisation and 2nm is booked well into 2028. Q3 gross margin guidance of 65–67% came in below elevated expectations, with the 2nm ramp expected to dilute margins by three to four points before scale efficiencies arrive. <b>This is the rare company where a capex raise and a margin decline are simultaneously bullish</b> — the spend is demand-driven and the dilution is a ramp cost, not a competitive one. But a repeated pattern of margin guide-downs alongside capex raises would eventually mean pricing power is not keeping pace with capital intensity.'],
 ['CoWoS allocation is a competitive weapon',
  'TSMC controls more than 90% of global CoWoS output, with lead times of 52 to 78 weeks. NVIDIA alone is estimated to hold roughly 60% of 2026 capacity — around 595,000 wafers — and has reportedly booked more than half of the 2026–2027 expansion; the top three customers account for an estimated 85%-plus. The supply-demand gap ran around 20% in mid-2026, narrowing toward 10% by year-end as capacity arrives, with OSAT partners adding 50,000–60,000 monthly wafers toward a possible 200,000 industry total. <b>The non-obvious consequence: competitive position in layer 4 is partly determined by procurement decisions made in layer 3.</b> AMD\u2019s MI-series volumes have been held below what the demand curve would support by packaging capacity, not design competitiveness.'],
 ['Three distinct return profiles inside one layer',
  'Owning twelve semiconductor names is not diversification — it is paying twelve sets of transaction costs to own the same cycle. The separations that matter: <b>toll collectors</b> (EDA, Arm, ASML services, consumables) with recurring revenue, low capital intensity and lower cyclical amplitude, which should be the core; <b>cycle amplifiers</b> (Lam, Applied Materials, Advantest, Besi) with higher up-cycle returns and genuine drawdowns, sized accordingly; and <b>the irreplaceable manufacturers</b> (TSMC, ASML systems) carrying the highest structural quality and the highest concentration of geopolitical risk in a single geography.']],
 watch:[
 ['TSMC incremental gross margin per incremental capex dollar','The test of whether monopoly pricing is keeping pace with rising capital intensity'],
 ['The CoWoS supply-demand gap','Closing faster than 20% toward 10% means packaging scarcity rents compress sooner than expected'],
 ['ASML memory versus logic order mix','Memory crossed 56% for the first time; memory capex is more volatile, so a rising share raises backlog cyclicality even as it raises backlog size'],
 ['Export-control legislation touching servicing','The MATCH Act, introduced in the US House on 2 April 2026, would extend restrictions to DUV immersion and ban servicing installed systems in China — high-margin annuity revenue, materially worse than a systems ban']],
 lede:'Design software and IP, wafer fabrication equipment, materials and chemicals, the foundry itself, and advanced packaging and test. Everything required to turn sand into a working advanced logic or memory die.',
 why:'This is the only layer with <b>no substitute and no workaround</b>. You can cool a data centre three ways and generate power five ways. You cannot pattern a 2nm transistor without EUV lithography, and there is exactly one supplier of it. You cannot design a modern chip without EDA software, where three companies hold three-quarters of the market. It also sells into every other technology cycle simultaneously, giving it a demand base that does not vanish if AI capex disappoints.',
 choke:'The bottleneck moved. For years it was lithography; it is now <b>advanced packaging</b> — bonding a logic die to twelve stacks of HBM on a silicon interposer. TSMC controls over 90% of global CoWoS output, and CoWoS allocation is effectively the revenue ceiling for every accelerator vendor.',
 facts:[['1','Suppliers of EUV lithography, worldwide'],['&gt;90%','TSMC share of global CoWoS packaging'],['67.7%','TSMC gross margin, on manufacturing'],['52–78 wks','CoWoS packaging lead time']],
 chart:{t:'Advanced packaging demand, CoWoS wafers',u:'thousand wafers',b:[['2024',370],['2025',670],['2026 estimate',1000]],
  note:'TSMC has ramped monthly capacity from roughly 35,000 wafers at end-2024 to about 75,000 at end-2025, targeting 120,000–130,000 by end-2026 — and the lines remain fully booked. NVIDIA alone is estimated to hold about 60% of 2026 capacity.'},
 co:[
 ['ASML','EUV and DUV lithography; High-NA systems at $350–400m each','€38.8bn backlog at end-2025; FY26 guide €36–40bn; Q1 26 gross margin 53%','Sole EUV supplier worldwide','No substitute exists at the leading edge; installed-base service annuity; memory crossed 56% of Q4 bookings for the first time','Top two customers ~38% of revenue; China fell from 41% to 19% of system sales; stopped publishing quarterly bookings; High-NA revenue is a 2028+ story'],
 ['TSMC','Leading-edge foundry; CoWoS and SoIC advanced packaging','Q2 26 revenue $40.2bn, up 36%; 2026 capex raised to $60–64bn; 3nm above 100% utilisation','The leading edge and the packaging gatekeeper','67.7% margins on manufacturing is the moat proven in numbers; 2nm booked into 2028','Q3 margin guided to 65–67% on 2nm ramp dilution; single-island concentration; capital intensity rising faster than revenue'],
 ['Cadence Design Systems','Digital and analog design, simulation, verification','~30% EDA share; recurring subscription model, negligible capital intensity','Half of the EDA duopoly','Arguably the highest business quality in the entire stack — recurring revenue, no manufacturing risk, total switching costs','Valuation embeds that quality; the 2025 China licensing episode showed the political beta is real'],
 ['Synopsys','EDA plus the largest silicon IP portfolio; Ansys simulation','~32% EDA share; China was roughly 16% of FY24 revenue','Largest EDA vendor','Tools plus IP plus multiphysics; every advanced chip in the world runs through it','Higher China revenue exposure than Cadence; guidance was suspended outright during the 2025 export restriction'],
 ['Applied Materials','Deposition, etch, ion implantation, inspection','Broadest process portfolio; exposed to both logic and memory cycles','Largest equipment vendor by revenue','Benefits from logic, memory and advanced packaging equipment simultaneously','Full cyclical amplitude; China revenue share and export-control exposure'],
 ['Lam Research','Etch and deposition','Disproportionately levered to 3D scaling and HBM stack heights','Leader in etch','Cleanest listed proxy for the memory capex cycle, which is now outpacing logic','Cuts both ways — memory is the most volatile capex line in semiconductors'],
 ['KLA','Process control, metrology, inspection','Inspection steps per wafer rise structurally at 2nm and in HBM stacking','Dominant in process control','As yield becomes the binding economic variable, metrology intensity rises independent of unit volumes','Concentrated customer base; fully exposed to the equipment cycle'],
 ['ASE Technology','Outsourced assembly, packaging and test','Largest OSAT; absorbing CoWoS overflow from constrained TSMC lines','Largest outsourced packager','The most direct listed way to own packaging scarcity without owning TSMC','Structurally lower margin than foundry; capacity additions are actively closing the supply gap']],
 wrong:'This is still a cyclical industry wearing a secular costume. Wafer fab equipment growth of roughly 7% in 2026 and 14% in 2027 is healthy but nothing like the rates embedded in some valuations. Semiconductor equipment has had around a dozen down-cycles in forty years; the AI cycle changed the amplitude of demand, not the existence of cyclicality.'},

{n:4,t:'Compute silicon',moat:'Moderate, eroding',mk:'',
 sub:{h:['Sub-layer','Function','Where the chokepoint sits'],r:[
 ['On-package','Logic die plus HBM on a silicon interposer','Terabytes per second — fastest, costliest, most constrained'],
 ['Rack scale-up','NVLink and equivalents, die to die','Proprietary interconnect — the architectural moat'],
 ['Cluster scale-out','Ethernet or InfiniBand, 800G moving to 1.6T','An open standard beat a proprietary one in under three years'],
 ['Memory','HBM3E and HBM4 stacks','Three suppliers, sold out, extracting rent upward'],
 ['Accelerators','Merchant GPUs and custom ASICs','Bifurcating into two tracks growing at very different speeds']]},
 detail:[
 ['The scale, and the customer mix nobody registered',
  'Quarter ended 26 July 2026: revenue $96.2bn, up 106% year on year and 18% sequentially; data centre $89.0bn, up 117%, representing over 92% of company revenue; GAAP operating income $63.7bn and net income $59.7bn; Q3 guidance $108bn ±2% at roughly 74% gross margin, explicitly assuming no China data centre compute revenue. Vera Rubin has entered full production and is expected at roughly 20% of data centre revenue this quarter. Fourteen consecutive earnings beats. <b>The mix matters more than the headline:</b> hyperscale grew 101% to $48.7bn while AI clouds, industrial and enterprise grew 138% to $40.3bn and is on track to become the larger half. The standard bear argument — that four customers control its fate — is weakening on the evidence, not strengthening. But concentration risk is partly being exchanged for credit risk, since sovereign and neocloud buyers carry worse balance sheets than hyperscalers.'],
 ['The bifurcation into merchant and custom tracks',
  'Broadcom reported $8.4bn of AI semiconductor revenue in Q1 FY2026, up 106%, guided $10.7bn for Q2, carries roughly $73bn of AI backlog and has publicly targeted $100bn of annual AI chip revenue by 2027. It has confirmed six major XPU customers including Google, Meta, OpenAI, Anthropic and Apple; Google has been a partner since 2014 across seven TPU generations, and OpenAI signed a multi-year agreement in October 2025 for 10 gigawatts of custom accelerators. Broadcom holds an estimated 70% of custom design services with Marvell around 25% — together roughly 95%. ASIC-based AI server shipments are projected at 27.8% of the market in 2026, growing 44.6% against 16.1% for GPU systems. The accelerator TAM has grown from roughly $55bn in 2023 to about $160bn in 2025 and toward $200bn-plus in 2026, with NVIDIA\u2019s share estimated at 87% at its 2024 peak, around 80% in 2025 and about 75% in 2026. <b>The marginal dollar of accelerator spend is increasingly captured by whoever enables custom silicon, not by whoever sells the best GPU.</b>'],
 ['Memory is taxing everyone else — and carries the biggest valuation risk',
  'The DRAM market grew roughly 80% quarter on quarter and 260% year on year in Q1 2026. HBM is estimated to grow from about $38bn in 2025 to $58bn in 2026, sold out across all three suppliers. NVIDIA\u2019s Q2 commentary flagged rising memory costs creating a near-term margin trade-off, guiding Q3 gross margin down to roughly 74% from 75%. <b>Read that carefully: the most profitable semiconductor company in history is guiding margins down because its suppliers raised prices.</b> That is value transferring up the chain against the buyer\u2019s wishes — what a genuine bottleneck looks like. But Samsung, SK hynix and Micron each crossed $1tn in market capitalisation in May 2026, with 2026 share price gains of 149%, 215% and 245% through late May. A cyclical industry is being priced as a structural one, and CXMT rising from 3% to 8% DRAM share in twelve months is the visible start of the supply response.'],
 ['Networking — where incumbency proved fragile',
  'The data centre Ethernet switch market reached $15.4bn in Q1 2026 alone, up 39.8% year on year. NVIDIA\u2019s share rose from under 4% to 21.5% in a single year, making it the number one vendor — a shift IDC has described as among the most significant it has tracked in enterprise networking. Arista holds roughly 19%. InfiniBand held roughly 80% of AI back-end networking in late 2023; Ethernet has since overtaken it, driven by RoCEv2 maturity and the Ultra Ethernet Consortium. 2026 is the first year of volume 1.6 Tbps switch deployment and the initial ramp of co-packaged optics. <b>An open standard beat a proprietary one in under three years — and the company that benefited most simply built an Ethernet product. Owning the system architecture matters more than owning the protocol.</b>'],
 ['Vendor financing is the revenue-quality question',
  'NVIDIA has disclosed approximately $279bn in supply and capacity commitments, $29bn in cloud agreements, plus long-term data centre leases and equity investments — and has provided credit support of up to $105bn tied to a single OpenAI campus in Ohio. Each individual transaction is defensible. <b>The aggregate is a structure in which supplier, financier and customer are partially the same set of parties.</b> When a supplier begins financing its customers\u2019 purchases, revenue quality declines even as revenue growth accelerates. This is not yet a problem. It is the specific thing that would become a problem first if demand softened, and it deserves quarterly attention.'],
 ['Where AMD actually stands',
  'AMD\u2019s MI350X matches Blackwell\u2019s FP8 compute and exceeds it on memory capacity, but achieves roughly 45% model FLOPs utilisation against NVIDIA\u2019s 50–55%. <b>That is a software gap, not a silicon gap</b> — and software gaps close slowly when the competitor has a two-decade head start on developer training. AMD is strategically valuable to customers precisely as a second source, which is a real business but a structurally capped one. Its volumes have also been constrained by CoWoS allocation rather than by design competitiveness, which means its share is partly determined upstream in layer 3.']],
 watch:[
 ['Custom ASIC unit growth versus merchant GPU unit growth','Currently 44.6% against 16.1% — a widening gap is the share shift becoming real'],
 ['NVIDIA gross margin against memory pricing','The direct measure of who is capturing the marginal dollar in the chain'],
 ['CXMT DRAM share','The memory supply response, and the best early warning that the cycle is turning'],
 ['Supply commitments and customer financing disclosures','The revenue-quality check on an accelerating top line']],
 lede:'The accelerators, the memory that feeds them, and the networking that binds them into a single training fabric. Highest revenue growth in the infrastructure stack, and the shortest moat half-life.',
 why:'An AI accelerator is not a compute problem, it is a <b>data movement problem</b>. Modern accelerators spend much of their time waiting for data, which is why memory bandwidth and interconnect are co-equal constraints with raw FLOPs — and why the profit pool has split three ways rather than accruing to one company. The workload is also shifting from training to inference, which systematically favours custom silicon and memory bandwidth over peak compute.',
 choke:'Three separate chokepoints, and memory is currently the tightest. <b>The most profitable chip company in history is guiding margins down because its memory suppliers raised prices</b> — value transferring up the supply chain against the buyer\u2019s wishes is what a genuine bottleneck looks like.',
 facts:[['$89.0bn','NVIDIA data centre revenue, quarter to July 2026'],['+117%','Year-on-year growth in that line'],['58%','SK hynix share of HBM revenue'],['44.6%','Custom ASIC unit growth vs 16.1% for GPUs']],
 chart:{t:'HBM revenue share, Q1 2026',u:'% of market',b:[['SK hynix',58],['Samsung',21],['Micron',21]],
  note:'HBM capacity has been sold out across all three suppliers. The global HBM market is estimated to grow from about $38bn in 2025 to $58bn in 2026. All three memory makers crossed $1tn in market value in May 2026 — which is precisely why entry valuation now matters more than the bottleneck itself.'},
 co:[
 ['NVIDIA','GB200 and GB300, Vera Rubin, NVLink, Spectrum-X, CUDA','Q2 FY27 revenue $96.2bn (+106%); gross margin 75.0%; operating margin 66.2%; Q3 guide $108bn','~75–80% of merchant accelerators','CUDA lock-in is a developer-base switching cost, not a silicon lead; sells full rack-scale systems; non-hyperscaler revenue grew 138% and is diversifying the customer base','A 75% gross margin is the largest incentive in technology to disintermediate it; $279bn of supply commitments; vendor financing of customers is appearing; China written to zero in guidance'],
 ['Broadcom','Custom XPUs; Tomahawk and Jericho switching silicon','Q1 FY26 AI semiconductor revenue $8.4bn (+106%); $73bn AI backlog; targeting $100bn annual AI revenue by 2027','~70% of custom accelerator design services','Wins whether merchant GPUs or custom silicon take share — a rare both-outcomes position; six disclosed XPU customers including Google, Meta, OpenAI and Apple','Google concentration is significant, and Google may diversify TPU design work to Marvell from FY2028'],
 ['AMD','MI-series accelerators, EPYC server CPUs','~7–10% of accelerators; MI350X matches Blackwell FP8 compute at ~45% model FLOPs utilisation vs 50–55%','Credible second source','Customers structurally want a second source and will pay to sustain one; silicon is competitive','The gap is software, not silicon; CoWoS allocation caps volume regardless of design quality'],
 ['SK hynix','HBM3E and HBM4, DRAM','~58% HBM revenue share; 29% of DRAM; sold out','HBM leader and NVIDIA\u2019s primary supplier','Purest exposure to the tightest link in the whole chain; three-player DRAM structure is genuinely improved versus history','A cyclical industry priced as structural growth; CXMT moved from 3% to 8% DRAM share in twelve months'],
 ['Micron Technology','HBM, DRAM, NAND','~21% HBM; 22% of DRAM; US-domiciled production','Third HBM supplier','Reshoring policy support the Korean suppliers do not have; HBM sold out','Peak-cycle earnings configuration; memory has had roughly a dozen down-cycles in forty years'],
 ['Marvell Technology','Custom silicon for Trainium and Maia; optical DSPs','Projected up to $11bn of AI ASIC revenue in 2026','Credible number two in custom silicon','Gaining share from a smaller base; potential Google TPU work from FY2028','Distant second to Broadcom; customer concentration and programme-win volatility'],
 ['Arista Networks','Ethernet switching; EOS network operating system','~19% of data centre Ethernet switching','Leading merchant switch vendor','EOS software is a genuine moat; deep hyperscaler relationships and Ethernet is winning the fabric war','NVIDIA went from under 4% to 21.5% share in a single year and now leads — competing against the supplier of the GPUs its switches connect']],
 wrong:'The base case is not that NVIDIA loses share catastrophically, but that its share drifts down while the market grows — a good outcome for the business and a potentially poor one for a stock priced on share retention. Custom ASIC shipments are growing at nearly three times the GPU rate.'},

{n:5,t:'Data centres and cloud',moat:'Weak, capital-driven',mk:'warn',
 sub:{h:['Business model','What it owns','The risk it carries'],r:[
 ['Hyperscalers','Own compute and own buildings','Financed from operating cash flow — the strongest position'],
 ['Colocation REITs','Own buildings, lease space','Interconnection is the moat, not floor space'],
 ['Neoclouds','Own compute, lease buildings','Long debt, short contracts, depreciating collateral'],
 ['Site developers','Own land, power and permits','Hold the genuinely scarce asset in the whole layer'],
 ['Integrators and ODMs','Assemble racks and servers','Real volume, structurally thin margins']]},
 detail:[
 ['Demand is not the question — financing is',
  'Google Cloud reported $24.8bn in Q2 2026, up 82% and accelerating from 63% in Q1, with $8.8bn of operating income (roughly a 35.6% margin) and a $514bn backlog, while stating it remains supply constrained. Azure grew 43% in the quarter ended June 2026 and surpassed $100bn in annual revenue, with Microsoft first-half FY2026 capex of $72.4bn against reported commercial backlog in the $625–678bn range. AWS grew 36.7% to $42.2bn, its fastest in eighteen quarters, at roughly 39% operating margin with backlog up 150%. <b>These are not the numbers of a bubble in its final stage.</b> Revenue is accelerating at three companies simultaneously, at scale, with margins expanding and demand exceeding supply. Anyone arguing AI demand is imaginary has to explain them. The bear case here is about who finances the supply, and on what terms.'],
 ['The financing structure, in detail',
  'Morgan Stanley and J.P. Morgan project the technology sector needs roughly $1.5tn of new debt over three years. Much of it flows through layered arrangements involving private credit funds, special purpose vehicles, securitisation and conditional credit guarantees rather than plain corporate balance sheets. GPU-collateralised lending is now established practice — CoreWeave\u2019s $7.5bn facility led by Blackstone used its GPUs and customer contracts as security, split across investment-grade and speculative tranches. NVIDIA has committed more than $5bn in backstop obligations through Fluidstack to former bitcoin miners pivoting to AI infrastructure. <b>The collateral behind much of this debt is a rapidly depreciating asset whose resale value depends on continuation of the very demand cycle the debt is financing. That is a procyclical structure</b> — it works beautifully while demand grows and fails quickly if it does not. CoreWeave fell 12.1% in a single session as the 30-year Treasury yield reached 5.32%, with Nebius and TeraWulf falling alongside: the market repricing the leveraged build-out as a category, not as one company.'],
 ['CoreWeave as the case study in duration mismatch',
  'Capacity scaled from 70 MW to 1.5 GW by mid-2026 with a $104bn contracted revenue backlog. Against that: roughly $35bn of debt, $640m of quarterly interest expense, debt-to-equity of 8.94x, net-debt-to-EBITDA of 10.75x, a 59% adjusted EBITDA margin on $2.575bn of quarterly revenue, but negative free cash flow and GAAP losses. Across its first five post-IPO quarters, equity issuance totalled roughly $3.5bn against debt issuance of $18.81bn — more than five times higher. A $2.6bn leveraged loan raised in July 2026 runs roughly five years, against customer contracts averaging about three, against underlying data centre leases running up to fifteen. <b>The liabilities are long, the assets depreciate fast, and the revenue contracts are short. Borrowing long and getting paid short is the oldest failure mode in finance.</b> Take-or-pay contracts mitigate usage risk, but take-or-pay is only as good as the counterparty — and the counterparties are AI labs and intermediaries rather than investment-grade enterprises.'],
 ['The depreciation debate, and the test that resolves it',
  'Hyperscalers have progressively extended server useful lives from three or four years to five or six. Meta uses five and a half; CoreWeave raised technology equipment from five to six at the start of 2023, before it went public; Amazon shortened a subset of servers to five. Michael Burry has argued real economic life is closer to two or three years given annual architecture cycles, estimating roughly $176bn of understated depreciation and profits overstated by more than 20% across 2026–2028; Chanos and Damodaran have made related arguments. Under ASC 360, changes in useful life are treated as changes in accounting estimate applied prospectively, so restatements are not the expected outcome even if the assumptions prove too long. The hyperscaler defence is a value cascade — frontier training early, high-value inference in the middle, lower-priority batch work later. <b>Both sides are partly right and talking past each other: there are genuinely two obsolescence curves and GAAP forces one estimate per asset class.</b> Ignore the fraud framing and apply a different test — look at free cash flow rather than earnings. Depreciation is non-cash; the money left the building when the GPUs were purchased. If a business generates strong free cash flow, useful life is an accounting question. If it does not, useful life is holding up the entire earnings picture. That single test separates the hyperscalers from the neoclouds more cleanly than any other metric in the layer.'],
 ['The quality filter to apply before any valuation filter',
  'One question sorts this layer: <b>does the company fund its build-out from operating cash flow, or from debt secured against depreciating assets?</b> That separates Alphabet, Microsoft and Amazon — financing an enormous programme largely out of cash generation, with fortress balance sheets and diversified revenue — from Oracle and the neocloud complex, financing the same build-out with leverage against short contracts. These are not the same investment and should not share a discount rate. It is also worth being honest that this is the layer where an investor should take the <em>least</em> AI-specific exposure, because it is the layer that pays rather than the layer that gets paid. The hyperscalers are attractive for reasons largely independent of AI; owning them as an AI bet imports capex risk to gain exposure available more directly upstream.']],
 watch:[
 ['Cloud revenue growth versus capex growth','While revenue accelerates faster than capex the loop compounds; when capex persistently outruns revenue, it is breaking'],
 ['Announced versus under-construction capacity','Around one third currently — capex guidance and delivered compute are diverging, and most investors treat them as the same thing'],
 ['Neocloud credit spreads and new facility pricing','These move before equity prices do'],
 ['Any change in stated useful-life assumptions','A shortening would be an unusually honest signal, and a significant one']],
 lede:'The physical buildings and the operating businesses that sell capacity: hyperscale cloud, colocation and GPU-rental neoclouds. Four genuinely different business models that are routinely conflated.',
 why:'Layers 1 to 4 sell into this layer; this layer pays. That makes it where demand is validated or falsified, and where balance sheet risk concentrates. Compute must be sited somewhere with land, fibre, water and — above all — a grid connection. <b>The scarce asset is not the building but the interconnection agreement</b>, which is why sites with secured hundreds of megawatts trade as options on the entire build-out.',
 choke:'This is no longer a technology sector. It is a <b>leveraged infrastructure sector wearing technology multiples</b>. Once the build-out is financed with debt, SPVs and depreciating collateral rather than operating cash flow, the right analytical toolkit is project finance, not software.',
 facts:[['+82%','Google Cloud growth, accelerating from 63%'],['$1.5tn','Projected new tech-sector debt over three years'],['8.94×','CoreWeave debt-to-equity ratio'],['5–7 yrs','Grid interconnection queue']],
 chart:{t:'Hyperscale cloud growth, quarter ended June 2026',u:'% year on year',b:[['Google Cloud',82],['Microsoft Azure',43],['AWS',36.7]],
  note:'Revenue is accelerating at three companies simultaneously, at scale, with margins expanding and demand exceeding supply. Anyone arguing AI demand is imaginary has to explain this. The bear case in this layer is not about demand — it is about who finances the supply and on what terms.'},
 co:[
 ['Alphabet','Google Cloud, TPU silicon, Gemini, Search and Android distribution','Q2 26 cloud revenue $24.8bn (+82%); operating income $8.8bn; $514bn backlog; supply constrained','Fastest-growing hyperscaler','The only fully vertically integrated player — own silicon, cloud, model and distribution, so it pays neither NVIDIA\u2019s margin nor anyone else\u2019s cloud margin','Search disruption risk from AI-native interfaces; rising capex intensity; regulatory overhang'],
 ['Microsoft','Azure, Copilot, Maia silicon, OpenAI partnership','Azure +43% and past $100bn annual revenue; commercial backlog reported $625–678bn; H1 FY26 capex $72.4bn','Largest enterprise distribution surface','Distribution across Windows, Office and Azure is the deepest in enterprise; demand continues to exceed available supply','The OpenAI relationship is simultaneously the largest asset and the largest single-counterparty concentration in the company'],
 ['Amazon','AWS, Trainium and Inferentia silicon, Bedrock','Q2 26 AWS revenue $42.2bn (+36.7%), fastest in 18 quarters; ~39% operating margin; backlog up 150%','Largest cloud by revenue','Reacceleration plus own silicon reducing NVIDIA dependence; Anthropic has committed over $100bn to AWS technologies','Lost share to Azure and Google Cloud over several years; retail business dilutes the multiple'],
 ['Meta Platforms','Hyperion 5 GW campus, MTIA silicon, open-weight models','Hyperion over $50bn with a Blue Owl JV; 2.6 GW of nuclear PPAs signed January 2026','Largest non-cloud AI spender','The purest test of AI return on investment — with no cloud revenue line, returns must show up in advertising performance','No cloud revenue means capex has no direct offset; the hardest of the four to evaluate on returns'],
 ['Oracle','OCI; very large contracted AI backlogs','Substantial debt raised against a concentrated set of AI counterparties','Aggressive late entrant','Enormous contracted backlog and Stargate participation give visible forward revenue','The highest-risk model among large operators — hyperscaler ambitions on a weaker balance sheet with worse customer diversification'],
 ['CoreWeave','GPU rental at scale','1.5 GW capacity; $104bn backlog; ~$35bn debt; net debt/EBITDA 10.75×; $18.8bn debt vs $3.5bn equity issued post-IPO','Largest pure-play neocloud','Genuine backlog and genuine execution; take-or-pay contracts protect against usage shortfalls','Five-year loans against three-year customer contracts and fifteen-year leases; a credit instrument with equity-like volatility, not a growth stock'],
 ['Equinix','Interconnection-focused colocation','Owns the neutral meet-me points where networks physically join','Largest interconnection REIT','Interconnection revenue is the moat, not the floor space; durable underlying assets','Slower growth; AI training workloads favour hyperscale self-build over retail colocation']],
 wrong:'Depreciation assumptions are load-bearing for reported earnings. Hyperscalers use five to six years; critics including Burry, Chanos and Damodaran argue two to three. If useful lives compress from six years to four, the effect on hyperscaler profits is material and on neocloud viability is existential.'},

{n:6,t:'AI models',moat:'Weak moat',mk:'warn',
 sub:{h:['Sub-layer','Function','What it is worth'],r:[
 ['Pre-training','Frontier model training runs','Produces a depreciating asset — expensive, fast to obsolete'],
 ['Post-training','Alignment, RLHF, distillation','Expert human labour, largely private and underpriced'],
 ['Inference serving','Production token generation','Where the durable margin actually sits'],
 ['Data pipelines','Collection, curation, evaluation','The scarce input, as text runs out'],
 ['Distribution','Getting the model in front of users','The only moat that has compounded rather than eroded']]},
 detail:[
 ['The pricing data says something more precise than "commoditisation"',
  'Over the twelve months to August 2026 the BenchLM Token Price Index shows frontier model prices up 36.4% while mid-tier prices fell 35.8%. Frontier prices remain roughly 88% below their March 2023 level, and open-weight models carry a median blended API price 82% below proprietary — $0.53 against $3.00 per million tokens. OpenAI cut API prices on 30 July 2026, with GPT-5.6 Luna reported at $0.20 / $1.20 per million tokens; DeepSeek prices near $0.14 / $0.28 for near-frontier reasoning. <b>Two markets are separating. Anything a capable open-weight model can do is racing toward marginal cost; anything only a frontier model can do commands a rising premium. The dangerous place to be is the middle, not the top.</b>'],
 ['Why the reported financials cannot be used',
  'Published estimates for one private lab\u2019s annualised run rate over recent months include roughly $6.5–7.5bn, approximately $30bn in April 2026, approximately $47bn in May 2026 and $65bn in July 2026. For another they include $18–20bn, $25bn and $33bn. <b>A five-to-tenfold dispersion for the same company in the same quarter is not a rounding difference.</b> These are private companies with unaudited figures; "annualised run rate" is not a defined accounting term; and some figures are reported gross while others are net — an enormous difference for a company reselling compute. Reported rounds include OpenAI at $852bn post-money in March 2026, Anthropic at $965bn in May with a confidential IPO filing on 1 June, and xAI merging with SpaceX in February 2026 in a stock deal reportedly creating a $1.25tn entity. <b>Private valuations that reprice from $380bn to $965bn in three months are marks, not prices.</b> They reflect terms a small number of buyers accepted, not a liquid market\u2019s judgment. You cannot underwrite an investment on these numbers.'],
 ['What actually compounds here',
  'Distribution is the strongest moat and the only one that has clearly compounded rather than eroded over three years. Alphabet reaches billions through Search and Android; Microsoft reaches essentially every enterprise desktop; Meta reaches roughly half the planet. <b>A model is a feature. A default is a business.</b> Proprietary data and workflow lock-in are real but slow, and accrue to whoever holds the customer relationship — often not the model provider. Vertical integration is the third: Alphabet alone owns accelerator, cloud, frontier model and distribution, so it pays neither NVIDIA\u2019s margin nor a cloud provider\u2019s nor depends on anyone else\u2019s user base. What is <em>not</em> a moat: benchmark leadership, parameter count, being first to a capability, or compute access alone. Every one has proved temporary, usually within twelve months.'],
 ['Training and inference are becoming different businesses',
  'Training is episodic, capital-intensive, concentrated in a handful of labs, and produces a depreciating asset. Inference is continuous, margin-bearing, and scales with usage. Inference is on track to represent roughly two-thirds of accelerator spending. <b>The market still largely values labs on training-derived capability, but the durable economics sit in inference.</b> The scarce input is also shifting — from compute toward data and evaluation. Public internet text is available to everyone, which is exactly why it produces no competitive advantage. What is not available to everyone: proprietary enterprise data, real-world interaction data, expert-labelled reasoning traces, and the evaluation infrastructure to know whether a model has actually improved.'],
 ['This layer is an indicator, not a holding',
  'You cannot buy the frontier labs today. Buying Alphabet or Microsoft to obtain model-layer exposure means buying advertising and enterprise software businesses that happen to contain a model division — a perfectly reasonable position, but not the exposure the diagram implies. The more useful role is diagnostic. <b>Layer 6 sits at the point in the loop where cash flow either materialises or does not. Everything held in layers 1 to 5 is a derivative claim on this layer\u2019s ability to monetise.</b> Anthropic reported Q2 2026 revenue of $11.5bn with positive adjusted operating income, described as the first profitable quarter for a frontier lab. If frontier labs can generate operating profit at scale it falsifies the strongest bear argument on the whole stack; if they cannot, the entire capex chain below is exposed. One quarter, at one company, on a basis nobody outside can audit, is not sufficient evidence either way.']],
 watch:[
 ['The frontier versus mid-tier price spread','If frontier pricing power erodes, the whole layer commoditises and the capex beneath it becomes unjustifiable'],
 ['Frontier lab funding rounds and compute contracts','The leading indicator for layers 1 to 5 capex, by roughly two to four quarters — track funding, not shipments'],
 ['Any audited financials, particularly via an IPO','The first point at which the layer becomes analysable rather than merely observable'],
 ['Open-weight capability relative to frontier','If the gap narrows the premium disappears; if it widens the premium is structural']],
 lede:'Frontier training, post-training and alignment, inference serving, and the data pipelines that feed all of it. Where capital expenditure is converted into capability.',
 why:'This is the transformation step in the loop, and the point at which the entire stack below either monetises or does not. But it is also the only layer with <b>no physical barrier to entry</b> — no mine, no refinery, no qualified process material, no fab. Capability leads have historically lasted months, not years, and open-weight models have repeatedly compressed the price of a given capability toward marginal cost.',
 choke:'There may not be one. <b>Model weights are a depreciating asset</b>; a fab is not. The durable assets at this layer are proprietary data and distribution, not the weights themselves — which is why the vertically integrated players look structurally stronger than the pure-play labs.',
 facts:[['+36.4%','Frontier model prices, year on year'],['−35.8%','Mid-tier prices over the same period'],['82%','Open-weight discount to proprietary models'],['5×','Dispersion in estimates for one private lab']],
 chart:{t:'Token prices are diverging, not simply falling',u:'% change, 12 months to August 2026',b:[['Frontier models, up',36.4],['Mid-tier models, down',35.8]],
  note:'Frontier prices rose 36.4% while mid-tier fell 35.8%. The naive view is that models commoditise so there is no business here. The data says something more precise: the commodity tier is collapsing toward marginal cost while the genuine frontier is gaining pricing power. The dangerous place to be is the middle, not the top.'},
 co:[
 ['Alphabet','Gemini models, TPU silicon, Google Cloud, Search and Android','The only company owning accelerator, cloud, frontier model and distribution','Most vertically integrated position in the infrastructure stack','If the model layer commoditises it still owns distribution; if it does not, it owns a frontier model — an unusual asymmetry','Capex intensity; the AI interface threatens the search business that funds it'],
 ['Microsoft','Azure, Copilot, OpenAI relationship','Distribution through Windows, Office and Azure','Largest enterprise distribution','A model is a feature; a default is a business — and Microsoft owns the defaults in enterprise','The commercial terms of the OpenAI relationship deserve far more analytical attention than they receive'],
 ['Meta Platforms','Open-weight model releases','Deliberately commoditising the layer where it does not want a competitor holding a toll','Leading open-weight publisher','Strategically coherent: destroy the toll booth before someone else builds it','Hardest to evaluate — no revenue line isolates the return'],
 ['Palantir','Deployment layer for regulated enterprise and government workflows','Priced on outcomes rather than seats','Not a model builder; a deployment layer','Arguably the purest listed play on the thesis that context and workflow, not weights, is where value accrues','Trades at a multiple that already embeds a great deal of that thesis'],
 ['OpenAI (private)','ChatGPT, GPT-5.6 Luna, developer API','Reported ~$852bn post-money after a $122bn round, March 2026; revenue estimates range $18–33bn, unaudited','Largest consumer AI distribution','Consumer brand and distribution at a scale no competitor has matched','Not investable; reported figures vary fivefold across sources and are not reported on a consistent gross-versus-net basis'],
 ['Anthropic (private)','Claude models, enterprise API','Reported ~$965bn post-money; confidential IPO filing 1 June 2026; Q2 2026 revenue $11.5bn with positive adjusted operating income','Enterprise and API weighted','No assessment offered','The author of this document is produced by Anthropic and therefore withholds any view on its investment merits. Obtain that analysis elsewhere.'],
 ['DeepSeek and Alibaba Qwen','Open-weight frontier-adjacent models','Pricing near $0.14 / $0.28 per million tokens for near-frontier reasoning','Sets the global price floor','Not directly investable for most Western portfolios','The most direct competitive threat to Western API margins, and a policy variable as much as a commercial one']],
 wrong:'A five-to-tenfold dispersion in reported revenue for the same private company in the same quarter is not a rounding difference. Private valuations that reprice from $380bn to $965bn in three months are marks, not prices — they reflect terms a small number of buyers accepted, not a liquid market\u2019s judgment. An IPO would be the first point at which this layer becomes analysable rather than merely observable.'},

{n:7,t:'Software and agents',moat:'Contested',mk:'warn',
 sub:{h:['Sub-layer','Function','How the AI transition hits it'],r:[
 ['Orchestration and agents','Runtimes, frameworks, tool use','Fast-moving, largely open source, little defensibility'],
 ['Data platforms','Retrieval, governance, lineage, evaluation','Consumption-priced — structurally aligned with the shift'],
 ['Observability','Monitoring model and agent behaviour','Scales with monitored entities, which agents multiply'],
 ['Security and identity','Agent authorisation, delegation, audit','The clearest structural winner in the layer'],
 ['Applications','Systems of record and workflow','Contested — the seat-compression battleground']]},
 detail:[
 ['The seat compression mechanism, and the pricing transition it forces',
  'The threat is not that AI replaces software; it is that AI replaces <b>the humans who generate per-seat software revenue.</b> Software price-to-sales compressed from roughly 9x to 6x during 2026 — levels not seen since the mid-2010s — with estimates of value destroyed ranging from roughly $285bn in the early-2026 selloff to over $1tn across the full year, depending on index and window. Pure per-seat pricing fell below 20% of contracts. Deloitte projects the majority of new SaaS contracts will include usage or outcome components by 2027, and Bain analysis suggests vendors failing to transition within eighteen months of first experiencing compression face permanent revenue erosion. <b>But the transition is not a neutral repricing — it transfers risk from the customer to the vendor.</b> Seat revenue is predictable and recurring; consumption revenue is volatile and correlated with the customer\u2019s own business cycle. Even vendors who navigate it successfully emerge with lower-quality revenue that deserves lower multiples than 2021 — which means the compression from 9x to 6x may be partly correct rather than entirely an overreaction.'],
 ['The margin squeeze nobody models',
  'Roughly 70% of software providers now report that the cost of delivering AI features is eroding profitability. Average enterprise SaaS spend runs approximately $8,435 per employee per year across roughly 371 applications per large enterprise, of which about 65% is shadow IT. A 2026 Databricks survey found use of multi-agent systems spiked 327% over a four-month period. <b>Software companies face revenue pressure from seat compression and gross margin pressure from GPU compute costs simultaneously.</b> The historical model — 80% gross margins, revenue scaling with customer headcount — is being attacked from the top and the bottom of the income statement at once. The 371-applications figure points to the other half of the story: enterprises are consolidating bloated portfolios, and agents make consolidation easier by abstracting away the underlying tool. The winners of consolidation are platforms; the losers are point solutions.'],
 ['Security is the clearest structural winner, for a mechanical reason',
  'Machine identities already outnumber human identities by between 40-to-1 and 82-to-1 per CyberArk, and autonomous agents multiply that further. CrowdStrike detects roughly 1,800 distinct AI applications across enterprise devices. At RSA Conference 2026, five major vendors — Cisco, CrowdStrike, Palo Alto Networks, Microsoft and Cato — all shipped agent identity frameworks; CrowdStrike announced Continuous Identity for AI Agents in June 2026, replacing static policies and standing privileges with per-action, risk-aware authorisation; Palo Alto closed its roughly $25bn CyberArk acquisition in February 2026; SailPoint re-IPO\u2019d at $1.38bn. <b>Critically, security spending is driven by agent proliferation rather than by AI monetisation — meaning it continues even if AI\u2019s return on investment disappoints.</b> That is a genuinely different risk profile from the rest of the infrastructure stack. Worth noting honestly: none of the five vendors closed the fundamental gap. No vendor ships an out-of-the-box behavioural baseline distinguishing agent from human activity, none can track delegation chains between agents, and none can confirm a decommissioned agent holds zero credentials. The problem is unsolved — bullish for spending, bearish for anyone claiming a winner has emerged.'],
 ['The debate that is genuinely unresolved',
  'Do agents <em>disintermediate</em> seat-based software, or <em>expand</em> it by making software useful to people who never used it? The bull case is that the addressable market expands enormously because agents perform tasks never worth a human\u2019s time. The bear case is the seat arithmetic. Both are internally coherent, and I distrust anyone claiming certainty. <b>What has changed is the burden of proof.</b> For two decades "software eats the world" was the default assumption for enterprise applications. In 2026 it is no longer the default, and a specific argument is now required for each holding. The most under-weighted scenario is category contraction with winner concentration: if enterprises cut from 371 applications to 100, survivors gain share even as the category shrinks — producing very different outcomes for different holdings inside the same sector.'],
 ['The one question that sorts this layer',
  '<b>Does the company\u2019s revenue scale with human headcount, or with machine activity?</b> Companies priced per seat are structurally short the AI transition. Companies priced per query, per workload, per monitored entity or per outcome are structurally long it. Snowflake, Datadog and the security platforms sit on the right side of that line largely by accident of their existing pricing models; classic per-seat application vendors sit on the wrong side and must execute a difficult transition to move. This is also the one layer where short or underweight exposure deserves consideration alongside long, because it contains genuine losers rather than merely less attractive winners. If you are unwilling to hold both sides, the safer instruction is to hold very little of the contested middle.']],
 watch:[
 ['Net revenue retention','Displacing ARR growth as the key metric — it captures seat compression directly, because a customer spending less on renewal shows up here first'],
 ['Disclosed seat versus consumption revenue mix','Vendors that stop disclosing it are telling you something'],
 ['Gross margin trajectory at application vendors','The AI compute cost pass-through problem, which compounds the revenue pressure'],
 ['Agent deployment moving from pilot to production','The trigger for the security spending thesis and the seat compression thesis simultaneously — they are the same event']],
 lede:'Orchestration frameworks, agent runtimes, vector and operational databases, observability, security, and the application software customers actually pay for.',
 why:'A model in isolation produces text. Software gives it tools, memory, permissions and a place in a business process. But <b>this is where the thesis inverts</b>: in layers 1 to 6, AI creates demand and the exposed companies benefit. In layer 7, AI is currently a net destroyer of incumbent enterprise value, because agents replace the humans who generate per-seat revenue. "Invest in the companies creating the revolution" is precisely the wrong instruction here.',
 choke:'Data gravity and systems of record. The scarce input is <b>context, not intelligence</b> — model capability is available to everyone at collapsing prices, but a company\u2019s customer records, permission structures and process knowledge are not. Whoever owns the context owns the deployment.',
 facts:[['9× → 6×','Software price-to-sales compression in 2026'],['&lt;20%','Contracts still priced purely per seat'],['70%','Vendors reporting AI costs eroding margins'],['40–82:1','Machine identities per human, before agents']],
 chart:{t:'Software valuation multiples, price to sales',u:'multiple',b:[['Prior level',9],['2026',6]],
  note:'Levels not seen since the mid-2010s. J.P. Morgan and Goldman Sachs have argued the selloff went too far. But public SaaS growth has decelerated every quarter since 2021 — predating agents — and 70% of vendors report AI compute costs eroding profitability. Revenue pressure and margin pressure are arriving at once.'},
 co:[
 ['CrowdStrike','Falcon platform; Continuous Identity for AI Agents, June 2026','Detects roughly 1,800 distinct AI applications across enterprise devices','Endpoint and identity leader','Observing what agents did via process-tree lineage is a tractable problem; inferring intent is not — philosophically the strongest approach on offer','The agent-security thesis depends on agents reaching production rather than remaining in pilots'],
 ['Palo Alto Networks','Prisma AIRS runtime security; CyberArk, acquired ~$25bn February 2026','Unifies human, machine and agentic identity in one platform','Broadest security platform','The most complete offering on paper; identity is the correct control plane for agents','Integration execution risk on a $25bn acquisition; no vendor has yet closed the behavioural-baseline gap'],
 ['Microsoft','Entra ID, Defender, Copilot across the productivity stack','Already the identity provider for most enterprises','Largest incumbent on both sides','Agent identity is a natural extension of an existing near-monopoly position','Uniquely exposed to both sides — the most seats to lose and the best position to win the replacement. Owning it takes both sides of the debate rather than hedging it'],
 ['Snowflake','Consumption-priced data warehousing and governance','Priced per query, not per seat','Major data platform','Structurally immune to seat compression by construction; benefits directly from agent query volume','Databricks competition; AI compute costs pressure the consumption margin'],
 ['Datadog','Observability, extending to model and agent monitoring','Revenue scales with the number of monitored entities','Leading observability platform','Agents multiply the things requiring monitoring; consumption pricing aligns with the transition','Exposed to customer cost-optimisation cycles, which historically arrive with a lag'],
 ['ServiceNow','Workflow system of record; agentic automation','Repositioning toward consumption and outcome pricing','Workflow system of record','Its product is already workflow-shaped, giving one of the clearest paths to charging for outcomes rather than seats','A large per-seat revenue base still has to be defended through the transition'],
 ['Salesforce','CRM; Agentforce','The most-cited example in seat-compression analysis','Largest CRM','Deep data gravity and an installed base that is expensive to displace','The outcome is genuinely uncertain — a poor vehicle for expressing an AI view in either direction']],
 wrong:'The bear case may be overstated and two credible banks say so; or it may be understated, since growth deceleration predates agents. The more likely outcome nobody weights properly is category contraction with winner concentration: if enterprises cut from 371 applications to 100, survivors gain share even as the category shrinks.'},

{n:8,t:'AI Embodiment',moat:'Moderate moat',mk:'mixed',
 sub:{h:['Segment','What it covers','Commercial maturity'],r:[
 ['Autonomous vehicles','Robotaxis and driver assistance','<span class="ok">Scaling commercially now</span> — the only segment with revenue at scale'],
 ['Industrial robotics','Arms, AGVs, structured automation','Mature, slow growth, defended installed base'],
 ['Humanoids','General-purpose bipedal platforms','<span class="hl">Pre-commercial</span> — narrative well ahead of deployment'],
 ['Actuation components','Reducers, roller screws, servo motors','Around 50% of BOM — the durable profit pool'],
 ['Perception and edge compute','Cameras, force sensors, inference modules','Sony, ATI and NVIDIA hold dominant shares'],
 ['Sensing','Cameras, lidar, force, tactile, IMU','Sony, Keyence, ATI hold dominant positions'],
 ['Data collection','Fleet telemetry, teleoperation, annotation','Almost entirely private — Scale, Surge, Mercor'],
 ['Evaluation','Knowing whether the model actually improved','The least mature discipline in the whole stack']]},
 detail:[
 ['Autonomous vehicles — the segment that actually works',
  'Waymo operates approximately 3,000 robotaxis, providing roughly 500,000 paid rides and about 4 million rider-only miles per week. It has passed 100 million fully autonomous miles, doubling that in roughly six months, and targets around 1 million paid rides weekly plus twenty-plus new cities including Tokyo and London. By contrast, independent counts of Tesla\u2019s robotaxi fleet through mid-2026 span roughly 20 to 59 vehicles, with Bloomberg putting the Texas total at 59 as of 10 June 2026; Tesla expanded to seven metros in H1 2026 with approximately 44 active vehicles. Tesla\u2019s own Q2 2026 disclosure lists the San Francisco Bay Area status as "Safety Driver" under California charter-party carrier permit TCP0046782-A — a limousine and chauffeured-transport authorisation, <em>not</em> an autonomous vehicle deployment permit. <b>Tesla\u2019s entire cumulative unsupervised mileage is less than one day of Waymo driving.</b> This is not dismissive — Tesla has real capability and a genuinely different cost structure if camera-only scales — but an investor reading only headlines would form a materially wrong picture. And the most successful embodiment programme in the world sits inside Alphabet, unavailable as a pure play.'],
 ['Humanoids — verified deployment versus announced intent',
  'Unitree shipped approximately 5,500 humanoid units in 2025 and targets 20,000 in 2026; UBTech targets 5,000 in 2026 and 10,000 in 2027; Boston Dynamics is building a 30,000-unit-per-year factory by 2028 with Hyundai Mobis as exclusive actuator supplier. Tesla began Optimus Gen 3 mass production at Fremont in January 2026 with over 1,000 units deployed internally, though analysts tracking its public communications counted eight separate Optimus production milestones delayed or revised before their original due dates. The strongest <em>verified</em> industrial deployment records belong to Figure at BMW Spartanburg and Agility at Amazon. <b>And the fact deserving most attention: Unitree — the company shipping more humanoid units than anyone in the world — saw Q1 2026 net profit fall 52% year on year. Volume is not profit.</b> This is the classic pattern of a hardware category where competition arrives before margins do, and it is a reason to be sceptical of platform makers as investments even if the category succeeds.'],
 ['The component monopolies, and the cost attack on them',
  'Harmonic Drive Systems holds over 50% of high-precision reducers globally with 18-plus month lead times; Nabtesco holds over 60% of RV reducers for the highest-stress joints; Sony supplies over 50% of global image sensors, used in roughly 80% of humanoids; ATI Industrial holds approximately 50% of high-end force and torque sensors; NVIDIA supplies an estimated 80–90% of humanoid AI compute, with Jetson Thor supply-constrained through early 2026 until additional TSMC capacity arrived. Against that, Suzhou Green Harmonic\u2019s reducers are estimated by a16z at 30–50% cheaper than Sumitomo and Harmonic Drive, and the company targets 60% share. <b>Tesla\u2019s own Optimus supply chain is substantially Chinese:</b> Sanhua Intelligent Controls as exclusive Tier 1 for linear actuator assemblies at roughly 19% of BOM on a reported $685m order, Tuopu Group as exclusive rotary actuator supplier at roughly 13%, and harmonic reducers split between Green Harmonic and Harmonic Drive Systems at roughly 7%. Tesla is reported to be seeking magnet export licences and supporting non-Chinese NdFeB supply chain development in the US and Australia.'],
 ['The geographic inversion, stated plainly',
  'Per KR-Asia\u2019s January 2026 analysis, China holds a 63% share of humanoid robot component supply and controls over 70% of global rare earth magnet production. The Yangtze River Delta hosts suppliers, robot makers, AI labs and EV manufacturers within a two-hour logistics radius; no equivalent cluster exists anywhere in the world. <b>An American humanoid platform whose two largest component categories come from single Chinese suppliers is not a hedge against Chinese technology leadership — it is exposed to it.</b> The strategic logic that made layers 3 and 4 attractive to Western investors does not carry over here. Anyone building this thesis is adding a new and largely uncorrelated political risk, not extending an existing one. Rare earth magnet export controls would halt Western humanoid production far faster than chip controls have slowed Chinese AI.'],
 ['Where the cost actually sits, and what that implies',
  'Morgan Stanley\u2019s teardown of an Optimus Gen 2-class robot put total bill of materials at roughly $55,000 with actuators at about 56% of it. Independent 2026 estimates place high-precision joint actuators at 40–55% of hardware cost. Planetary roller screws for leg actuators run $1,350–2,700 each, with around a dozen per full-size humanoid. Chinese supply-chain BOM was approximately $46,000 in 2025, projected to fall at roughly 11% compound annually to about $16,000 when annual production reaches roughly one million units around 2034. Unitree\u2019s G1 already sits near $10,000–16,000 against Boston Dynamics Atlas at roughly $300,000 — a twentyfold spread telling you these do not compete in the same market. <b>The AI is not the expensive part. The mechanical precision is.</b> A humanoid is a mechatronics problem with an AI feature, which determines where the durable profit pool sits: in components, not platforms.'],
['The digital world ran out of data',
  'Epoch AI projects the world\u2019s stock of high-quality training data will be exhausted between 2026 and 2032. With a modest 5x overtraining factor — which the economics of inference actively encourage — that timeline collapses to 2027. The total human-generated corpus is on the order of 300 trillion tokens. Meanwhile the physical world has produced roughly 500,000 hours of high-quality robotic interaction data, against an estimated 1 billion to 10 billion hours needed for baseline generalisation in embodied AI. <b>That is a gap of 2,000x to 20,000x.</b> NVIDIA identified demonstration data, not compute, as the critical bottleneck for physical AI at GTC 2026. For four years the constraint was compute, then it was power. It is now the ability to observe the physical world at scale — a problem money cannot solve the way buying GPUs can.'],
 ['Why the loop compounds rather than merely accumulating',
  'Text describes the world; it does not verify claims about it. A model trained only on text learns what humans have <em>written</em> about physics, not what physics <em>does</em>. Sensors close that gap by returning an error signal from reality itself. Actuators change the world, sensors observe the changed world, and the discrepancy between prediction and observation is exactly the training signal that improves the model. <b>Each turn of the loop generates data that could not have existed before that turn.</b> That is the structural difference between a flywheel and a pipeline — and it is the only mechanism producing a genuinely non-replicable data asset. Waymo\u2019s 100 million-plus fully autonomous miles are not merely a safety record; they are a proprietary corpus no competitor can purchase, license or scrape. Waymo leads not because Alphabet has better researchers, but because it started collecting earlier.'],
 ['The counter-argument is serious and unresolved',
  'Research teams at Carnegie Mellon and Stanford independently reported in 2026 that vision-language-action robot policies trained on just 40% synthetic data matched policies trained on 100% real-world demonstrations on held-out tasks. NVIDIA\u2019s data factories augment a single captured motion into millions of variants. <b>This directly undercuts the assumption behind billions of dollars of robotics funding — that owning a massive real-world data collection fleet is the primary competitive moat. A moat that saturates is not a moat; it is a head start.</b> The counter-counter-argument is also strong: synthetic generation <em>amplifies</em> a real corpus but cannot <em>originate</em> one. You cannot simulate contact dynamics, friction coefficients or sensor noise patterns you have never observed, and every synthetic variant traces back to a real seed. My reading, offered as opinion and genuinely uncertain: real-world data is a <b>threshold asset rather than a scaling asset</b> — you need enough to seed the simulator, and beyond that returns diminish sharply. If correct, the data-collection arms race is being over-funded, and the durable advantage sits with whoever simulates best rather than whoever collects most.'],
 ['The geopolitical dimension of data infrastructure',
  'A 6,000-square-metre robotic data collection facility opened in China in January 2026 is capable of generating three million high-quality data entries annually — comparable in scale to the entire Open X-Embodiment dataset, which aggregated the work of 22 institutions. <b>Consistent with layer 8, the data infrastructure for physical AI is being built fastest in China, and it accumulates.</b> Whatever one concludes about the synthetic data debate, this compounds the geopolitical asymmetry already flagged in the embodiment layer.'],
 ['How to actually use this layer',
  'Layer 8 is not a place to allocate capital. It is a place to check whether the thesis is still true. The infrastructure stack only compounds if the loop closes, and everything in layers 1 through 5 — the turbines, the transformers, the lithography monopolies, the memory oligopoly, the debt-financed data centres — is a derivative claim on physical-world value eventually materialising. <b>Its practical function in an investment process is diagnostic.</b> Two risks also point in opposite directions here and neither can be resolved from outside: synthetic data may substitute more completely than expected, evaporating collection moats; or model collapse from synthetic over-reliance may prove real, making real data more valuable. Sizing should reflect that genuine uncertainty rather than a view on which resolves.']
 ],
 watch:[
 ['Verified deployment counts at Figure, Agility and Unitree','The demand signal for the component suppliers — track shipped units and verified deployments, not announced targets'],
 ['Harmonic reducer lead times','Currently 18-plus months. A shortening means either demand cooling or Chinese capacity arriving; both compress pricing power'],
 ['Green Harmonic share gains against Harmonic Drive and Nabtesco','The direct test of whether the Japanese reducer oligopoly holds or is a melting ice cube'],
 ['Waymo weekly paid rides','Currently around 500,000 against a 1 million target — the cleanest measure of whether embodiment generates real revenue anywhere'],
['The synthetic-to-real ratio in published robotics research','Currently around 40% synthetic matching 100% real. Falling means collection moats erode; rising or stalling means they harden'],
 ['Waymo weekly paid rides','The cleanest single measure of embodied AI generating actual revenue anywhere in the world'],
 ['Deployment data appearing in company disclosures','When operators report interaction hours the way they report revenue, the layer has become economically real'],
 ['Evidence of model collapse from synthetic over-reliance','The opposite risk — if synthetic amplification hits a quality ceiling, real data becomes more valuable, not less']
 ],
 lede:'Robots, vehicles, drones and devices, plus the actuators, reducers, sensors and batteries beneath them. Three industries at three completely different stages of maturity, routinely conflated.',
 why:'Roughly three-quarters of global GDP involves physical work. Software AI addresses the knowledge-work portion; embodiment addresses the rest. Without this layer the thesis is a bet on the digital economy — with it, a bet on the whole economy. It is also how the loop closes, since embodied systems generate the real-world interaction data that digital corpora cannot provide.',
 choke:'<b>The geography inverts here.</b> Layers 3 and 4 concentrate in the Netherlands, Taiwan, Japan and Korea. Layer 8 concentrates in China, which holds 63% of humanoid component supply and over 70% of rare earth magnet production. Adding this layer to a semiconductor-heavy portfolio adds a second, oppositely-directed geopolitical exposure — it does not diversify the first.',
 facts:[['50%','Actuators as a share of humanoid BOM'],['18+ mo','Harmonic Drive reducer lead times'],['63%','China share of humanoid component supply'],['3,000 vs ~50','Waymo robotaxis versus counted Tesla units']],
 chart:{t:'Humanoid cost is dominated by actuation, not intelligence',u:'% of bill of materials',b:[['Actuators and joints',50],['Sensors and perception',33],['Hands and manipulation',17]],
  note:'Morgan Stanley\u2019s teardown put actuators at roughly 56% of a ~$55,000 bill of materials. A humanoid robot is a mechatronics problem with an AI feature, not an AI problem with a mechanical body — which determines where the durable profit pool sits.'},
 co:[
 ['Harmonic Drive Systems','Strain-wave (harmonic) precision reducers','Over 50% of global high-precision reducers; 18-plus month lead times','Dominant in strain-wave reducers','Oligopoly on the single largest cost item in a humanoid, paid regardless of which platform wins','Suzhou Green Harmonic prices 30–50% below and targets 60% share — and is already inside Tesla\u2019s own supply chain'],
 ['Nabtesco','RV (cycloidal) reducers for high-shock joints','Over 60% share in RV reducers','Dominant in cycloidal reducers','Serves the highest-stress joints where substitution is hardest; large industrial installed base','The same Chinese cost attack, plus full exposure to the industrial robot capex cycle'],
 ['Sony','CMOS image sensors','Over 50% of global image sensors, used in roughly 80% of humanoids','Dominant in image sensing','The most direct listed exposure to machine perception across robots, vehicles and devices','Embedded in a diversified entertainment and electronics business that dilutes the exposure substantially'],
 ['NVIDIA','Jetson Thor edge compute; Isaac GR00T, Cosmos, Omniverse','80–90% of humanoid AI compute; Thor achieves 19.0 Hz on a π0-class model','Dominant across four of five robotics layers','Supplies training compute, simulation, synthetic data generation and edge inference — a vertically integrated position without parallel','Chinese edge SoCs entering on system cost; Thor falls below the frame rate of most cameras on larger models'],
 ['THK and Hiwin','Linear motion, ball screws, planetary roller screws','Around twelve roller screws per humanoid at $1,350–2,700 each','Leaders in precision linear motion','The highest per-unit cost components in the legs; benefit from unit volume regardless of platform winner','Machine tool cycle exposure; Chinese competition arriving in linear motion as well as gearing'],
 ['Tesla','Optimus Gen 3; FSD and robotaxi','Mass production began at Fremont January 2026 with 1,000+ units deployed internally; robotaxi fleet independently counted at roughly 44–59 vehicles','Vertically integrated platform developer','Vertical integration plus the largest consumer fleet generating real-world driving data — the strongest form of the data-moat argument','Analysts have counted eight Optimus milestones delayed or revised; cumulative unsupervised robotaxi mileage is less than one day of Waymo driving'],
 ['Hyundai (Boston Dynamics)','Atlas humanoid; Hyundai Mobis as exclusive actuator supplier','30,000 unit per year factory targeted by 2028','Most integrated Western humanoid programme','The only Western humanoid programme attached to a company that already builds complex machines at volume','Atlas at roughly $300,000 competes against $16,000 Chinese units — a twentyfold cost gap to close'],
['Keyence','Machine vision and industrial sensing','Among the highest operating margins in industrial technology','Premium industrial sensing','Margin structure is itself the evidence of genuine pricing power in sensing','Japanese industrial capex cycle; a persistently premium valuation'],
 ['Alphabet (Waymo)','Autonomous driving fleet','Approximately 3,000 robotaxis; ~500,000 paid rides and ~4m rider-only miles weekly; 100m+ autonomous miles','Largest real-world autonomy corpus','Leads not because of better researchers but because it started collecting earlier — a corpus no competitor can buy or scrape','Not separately investable; buried inside an advertising business'],
 ['Deere','Agricultural autonomy and See &amp; Spray','Structured environments with clear, measurable return on investment','Leading agricultural autonomy','Real, profitable, deployed embodied AI that nobody describes as an AI company','Agricultural capex cycle; not a pure play by any measure'],
 ['Scale AI, Surge, Mercor (private)','Human demonstration collection, expert annotation, evaluation','Edge-optimised models require 3–5× more annotation iterations than cloud models','The seed-corpus business','As compute becomes abundant and data becomes the constraint, this sub-layer is structurally undervalued relative to its importance','Almost entirely private; listed proxies such as Appen carry legacy positioning and margin pressure']
 ],
 wrong:'Humanoid timelines have slipped repeatedly. Autonomous humanoids doing productive work still number in the hundreds to low thousands globally, and Unitree — which ships more units than anyone — saw net profit fall 52% year on year. A category can be inevitable and still be a decade early as an investment.'},

];

const MATS=[
{t:'Rare earths',c:C[7],big:'86–90%',d:'Share of world rare earth refining in China. Separation requires hundreds of sequential solvent-extraction stages and a multi-decade process-knowledge lead. April 2025 controls on seven heavy rare earths have never been suspended.',s:'Enters at layers 1, 4 and 8'},
{t:'Copper',c:C[2],big:'48%',d:'China holds roughly 8% of copper concentrate production but 48% of smelting. Spot treatment charges reached negative $90 a tonne in March 2026 — smelters paying for the right to process ore.',s:'Enters at layers 1, 4 and 5'},
{t:'High-purity quartz',c:C[3],big:'~80%',d:'Two mines in one North Carolina district supply most of the world. Without these crucibles there are no silicon ingots, for anyone. It has no export control regime of any kind.',s:'Enters at layer 3'},
{t:'Electrical steel',c:C[1],big:'1',d:'Number of domestic US producers of grain-oriented electrical steel. Grain orientation takes days of high-temperature annealing and decades of metallurgical know-how. Every transformer contains it.',s:'Enters at layers 1 and 5'},
{t:'Superalloy metals',c:C[1],big:'3–7%',d:'Rhenium content by weight in third-generation single-crystal turbine blades. It is recovered only as a by-product of copper-molybdenum mining, so supply cannot respond to its own price.',s:'Enters at layer 1'}];

const MATTBL={h:['Layer','Critical materials','Where the leverage sits','Severity'],r:[
['1 Energy','Copper, grain-oriented electrical steel, rhenium, tantalum, hafnium, uranium and HALEU','Smelting capacity, grain-orientation annealing, specialised investment-casting foundries, enrichment','<span class="hl">Very high</span>'],
['2 Semiconductors','High-purity quartz, electronic-grade polysilicon, neon, helium, photoresists, fluorspar, tin','Two mines at Spruce Pine; Zeiss optics; Japanese resist chemistry; qualification cycles measured in years','<span class="hl">Extreme</span>'],
['3 Compute silicon','Gallium, germanium, indium, ruthenium, ABF resin, silicon interposers','Chinese by-product refining of gallium and germanium; Ajinomoto as sole ABF resin source','<span class="hl">High</span>'],
['4 Data centres','Copper, steel, concrete, lithium, water','Inherited from layer 1; water rights are a permitting constraint that behaves like a material one','Moderate'],
['5 AI models','None','No physical barrier to entry — which is the finding, not a gap','None'],
['6 Software','None','The two layers with no material chokepoint are the two with the weakest moats','None'],
['7 Embodiment','NdFeB magnets with dysprosium and terbium, bearing steels, lithium, cobalt','Chinese separation and magnet manufacture; the export ban covers the separation technology itself','<span class="hl">Extreme</span>']]};

const RISKS=[
{t:'Monetisation lags capex',d:'The loop compounds only if cash arrives. At $600–800bn a year, increasingly debt-funded, a demand shortfall now hits balance sheets rather than income statements — and it hits the leveraged operators first.'},
{t:'Peak earnings, wrong entry',d:'Memory in particular. The three-player DRAM structure is genuinely improved, but 260% year-on-year revenue growth is a cycle condition, not a steady state. CXMT moved from 3% to 8% share in twelve months.'},
{t:'Correlation, hiding in plain sight',d:'Six holdings across six industries can be one position. If the hyperscaler capex assumption breaks, energy equipment, lithography, foundry, memory and cooling all correlate to one at the same moment.'},
{t:'Geopolitics is not a footnote',d:'Layers 3 and 4 sit in Taiwan, Korea, the Netherlands and Japan. Layer 8 sits in China. These are independent exposures that can both be realised at once — adding one does not diversify the other.'},
{t:'The depreciation assumption',d:'Whether a GPU installed today still earns revenue in six years determines whether $38bn facilities clear their cost of capital. Nobody knows, because no accelerator generation has been observed through a full life.'}];

/* Materials and failure modes now live where they belong: inside each layer. */
const LAYER_MATERIALS={
1:{severity:"Very high",summary:"The power layer is constrained less by tonnes in the ground than by the ability to refine, cast, anneal and qualify them. Copper affects volume; electrical steel and turbine castings can stop the project outright.",
 stats:[["48%","China share of copper smelting"],["1","Domestic US GOES producer"],["3–7%","Rhenium in advanced turbine blades"],["5–8 yr","HALEU capacity relief"]],
 flow:["Ore + by-products","Smelting + enrichment","Annealing + single-crystal casting","Transformer, turbine, reactor"],
 items:[
  {n:"Copper",role:"Windings, busbars, cables, motors and cooling",choke:"Concentrate scarcity and smelting economics; spot treatment charges reached negative territory.",geo:"China ~48% of smelting",time:"3–5 years"},
  {n:"Grain-oriented electrical steel",role:"Low-loss transformer and motor cores",choke:"Days-long grain-orientation annealing plus metallurgical know-how; no grid-scale substitute.",geo:"One US producer",time:"4–6 years"},
  {n:"Rhenium superalloys",role:"Single-crystal gas-turbine hot sections",choke:"Recovered only as a copper-molybdenum by-product; supply cannot respond directly to its own price.",geo:"Tens of tonnes globally",time:"Structural"},
  {n:"HALEU + zirconium",role:"Advanced-reactor fuel and cladding",choke:"Western enrichment capacity, not uranium ore, gates most SMR schedules.",geo:"Enrichment concentrated",time:"5–8 years"},
  {n:"SiC + GaN",role:"Efficient inverters and high-voltage power electronics",choke:"Qualified wafer and device capacity; silicon substitutes with an efficiency penalty.",geo:"US / EU / Asia",time:"2–4 years"},
  {n:"Aluminium + silver",role:"Transmission, heat exchangers, solar contacts",choke:"High-volume inputs; substitution exists but shifts weight, conductivity or efficiency.",geo:"Globally traded",time:"Price, not blockage"}],
 note:"The investable leverage usually sits one transformation step above the mine: Western smelting, grain-orientation annealing, investment-casting furnaces and enrichment. A low-cost material can gate a $38bn project."},
2:{severity:"Extreme",summary:"This layer is the material base itself, so the question is not which materials it consumes but which refining steps the world cannot easily replace. Mining is diverse. Separation, purification and qualification are not.",
 stats:[["86–90%","China share of rare earth refining"],["~80%","World high-purity quartz from Spruce Pine"],["48%","China copper smelting, 8% of mining"],["3–8 yr","To build alternative refining capacity"]],
 flow:["Ore, brine, by-product","Refining + separation","Purification + transformation","Qualified into every layer above"],
 items:[
  {n:"High-purity quartz",role:"Crucibles for growing silicon ingots",choke:"Two mines in one North Carolina district; synthetic alternatives are unproven at scale and requalification takes years.",geo:"~80% one district",time:"5+ years"},
  {n:"Rare earth separation",role:"Neodymium, dysprosium and terbium for magnets",choke:"Hundreds of sequential solvent-extraction stages and a multi-decade process-knowledge lead; the technology itself is export-banned.",geo:"China 86–90%",time:"5–10 years"},
  {n:"Copper smelting",role:"Windings, busbars, cabling across every layer",choke:"Concentrate scarcity; spot treatment charges went negative in March 2026, squeezing Western smelters out.",geo:"China ~48%",time:"3–5 years"},
  {n:"Electronic-grade polysilicon",role:"The wafer itself, at eleven-nines purity",choke:"Four producers worldwide; solar-grade material is not interchangeable at this purity.",geo:"DE / US / JP / KR",time:"4–6 years"},
  {n:"Gallium + germanium",role:"RF, power electronics, photonics, fibre",choke:"Recovered as by-products of aluminium and zinc refining, so supply cannot respond to their own price.",geo:"China dominant",time:"Structural"},
  {n:"Grain-oriented electrical steel",role:"Transformer and motor cores",choke:"Days-long grain-orientation annealing and metallurgical know-how; one domestic US producer.",geo:"One US producer",time:"4–6 years"}],
 note:"The pattern repeats in every row: the mine is diversified, the step above it is not. Where a listed vehicle exists at the refining step — Aurubis, Lynas, Wacker, Linde — it is generally the higher-quality position. Where it does not, as with high-purity quartz, the chokepoint is uninvestable and worth knowing about anyway."},
3:{severity:"Extreme",summary:"This layer contains the infrastructure stack's most concentrated physical dependencies: one EUV optics supplier and two mines in one North Carolina district feeding most high-purity quartz demand.",
 stats:[["~80%","High-purity quartz from Spruce Pine"],["2","Mines in one district"],["4","Major electronic-polysilicon suppliers"],["1","Supplier of EUV optics"]],
 flow:["Quartz + industrial gases","11N polysilicon + resists","Ingot, wafer + EUV patterning","Die + advanced package"],
 items:[
  {n:"High-purity quartz",role:"Crucibles for 1,400°C silicon ingot growth",choke:"Geology, complex purification and long customer qualification; synthetic supply is not proven at equivalent scale and cost.",geo:"Spruce Pine, North Carolina",time:"Extreme / multi-year"},
  {n:"Electronic-grade polysilicon",role:"The 11N-purity wafer feedstock",choke:"Several additional orders of purity versus solar grade; four established producers.",geo:"US, Germany, Japan, Korea",time:"High"},
  {n:"Photoresists + HF",role:"Patterning, etching and wafer cleaning",choke:"Japanese chemistry concentration and qualification cycles measured in years.",geo:"Japan; China/Mexico fluorspar",time:"High"},
  {n:"Neon + helium",role:"DUV lasers, purging, cooling and leak detection",choke:"Low-value gases with high disruption potential; neon diversified after the Ukraine shock.",geo:"US, Qatar, Algeria, Asia",time:"Moderate / improving"},
  {n:"Tin + ruthenium + Mo/Si",role:"EUV plasma source and multilayer mirrors",choke:"Zeiss optics are a monopoly upstream of ASML's monopoly.",geo:"Europe-centred know-how",time:"Extreme"},
  {n:"ABF resin + copper foil",role:"Advanced package substrates",choke:"Ajinomoto is the sole source of ABF resin; substrate fabrication is concentrated in four Asian suppliers.",geo:"Japan / Taiwan",time:"High"}],
 note:"Hurricane Helene's 2024 shutdown of both Spruce Pine operators was a live stress test. The unusual policy asymmetry remains: the US restricts advanced chips while its own concentrated quartz dependency has no export-control regime."},
4:{severity:"High",summary:"Compute silicon inherits every wafer dependency from layer 3, then adds politically exposed by-product metals and a packaging stack that must dissipate more than a kilowatt per package.",
 stats:[["1", "Sole source of ABF resin"],[">1 kW","Heat per accelerator package"],["52–78 wk","CoWoS lead time"],["Nov 2026","Known export-control decision window"]],
 flow:["By-product metal recovery","Substrate + interposer fabrication","HBM stacking + die bonding","Accelerator, memory, optics"],
 items:[
  {n:"Gallium + germanium",role:"Power/RF devices, SiGe, infrared and fibre optics",choke:"By-products of aluminium and zinc; Chinese refining has already been used as a policy instrument.",geo:"China-dominant refining",time:"Politically scheduled"},
  {n:"Indium + ruthenium",role:"Photonics, transceivers, interconnect and coatings",choke:"By-product supply and difficult purification; small markets magnify disruption.",geo:"Asian refining",time:"High"},
  {n:"ABF substrates",role:"Organic base beneath silicon interposers",choke:"Single resin source, with Ibiden, Shinko, Unimicron and AT&S fabricating qualified substrates.",geo:"Japan / Taiwan / Europe",time:"High"},
  {n:"Silicon interposers",role:"CoWoS 2.5D logic-to-HBM connection",choke:"Consumes TSMC wafer capacity in addition to logic dies; packaging allocation becomes a competitive weapon.",geo:"Taiwan",time:"High"},
  {n:"Copper + underfill",role:"TSVs, hybrid bonding and HBM stack integrity",choke:"Ultra-flat surfaces, thin-die handling and specialised chemistries rather than raw copper availability.",geo:"Korea / Taiwan / Japan",time:"High"},
  {n:"Indium foil + diamond composites",role:"Thermal interface and heat spreading",choke:"At 1,000W+, packaging performance is increasingly a materials problem.",geo:"Fragmented specialists",time:"Moderate"}],
 note:"Gallium, germanium, indium and several thermal metals are by-products. Their supply curve does not respond normally to price, which makes small material markets unusually effective policy weapons."},
5:{severity:"Moderate",summary:"The facility is materially conventional—copper, steel, concrete, aluminium—but deployed at extraordinary scale. Its risks are volume, delivery and local permits rather than one irreplaceable ore body.",
 stats:[["40–50kt","Copper per major facility"],["1.15 GW","Firm power for 1 GW IT"],["7.1 TWh","Annual electricity"],["Water","Can gate site permitting"]],
 flow:["Bulk materials + cells","Cables, busway + cooling loops","Shell + electrical plant","Commissioned compute hall"],
 items:[
  {n:"Copper",role:"Busbars, cabling, transformers and cold plates",choke:"AI campuses now move the global demand curve; inherited transformer and cable lead times turn volume into schedule risk.",geo:"Mine-diverse, refine-concentrated",time:"3–5 years"},
  {n:"Steel + concrete",role:"Foundations, shell, racks and enclosures",choke:"Large regional volumes and carbon-intensive production, but multiple suppliers and substitution paths.",geo:"Local / regional",time:"Price and logistics"},
  {n:"LFP cells + graphite",role:"UPS and stationary energy storage",choke:"Lithium is geographically diverse; refining, cathodes and graphite remain China-heavy.",geo:"Australia / LatAm → China",time:"High, rising"},
  {n:"Glycols + dielectric fluids",role:"Direct-to-chip and immersion cooling",choke:"Rapid qualification as rack density rises; technically specific but supplier base is fragmented.",geo:"Diversified chemicals",time:"Moderate"},
  {n:"Fibre + germanium dopant",role:"Campus and cluster interconnect",choke:"Preform and optical-component capacity matters more than silica availability.",geo:"US / Japan / China",time:"Moderate"},
  {n:"Water rights",role:"Evaporative heat rejection and construction",choke:"A social-licence and permitting constraint that behaves like a material one in arid regions.",geo:"Entirely site-specific",time:"Potentially permanent"}],
 note:"No intrinsic material here is a universal single-point failure. The layer inherits copper and electrical-steel constraints from energy, then adds water and battery supply chains that delay or relocate projects rather than stop the category."},
6:{severity:"None direct",summary:"A model is information. It has no mine, refinery or qualified process material of its own—and that absence helps explain why model-layer moats are weaker than physical chokepoints below it.",
 stats:[["0","Distinctive raw materials"],["3","Inherited physical layers"],["$/token","Long-run energy exposure"],["Weak","Material barrier to entry"]],
 flow:["Electricity","Accelerator + HBM","Training / inference run","Model weights"],
 items:[
  {n:"Electricity",role:"The marginal physical input per token",choke:"Firm-power price and availability become cost of goods, not an externality.",geo:"Site-specific",time:"Inherited from layer 1"},
  {n:"Accelerators + HBM",role:"Embodied capital that produces the model",choke:"Inherits CoWoS, HBM and accelerator supply constraints from layers 3–4.",geo:"Taiwan / Korea / US",time:"Inherited"},
  {n:"Cooling + water",role:"Carries training heat out of the facility",choke:"Inherits facility thermal density and local water constraints.",geo:"Campus-specific",time:"Inherited"}],
 note:"Treat a model provider's electricity, compute and depreciation assumptions as physical inputs to gross margin. The absence of a unique material dependency is an analytical result, not a missing chapter."},
7:{severity:"None direct",summary:"Software and agents consume compute and electricity but introduce no distinctive material base. This makes distribution, workflow ownership, trust and switching cost—not scarcity—the only credible moats.",
 stats:[["0","Distinctive raw materials"],["2","Inherited inputs: compute + power"],["High","Substitution speed"],["Contested","Moat durability"]],
 flow:["Power + cloud compute","Model API / local model","Agent runtime + tools","Workflow outcome"],
 items:[
  {n:"Compute",role:"Inference and orchestration",choke:"Capacity can be rented, optimised or shifted between providers; dependency is economic rather than geological.",geo:"Cloud / local",time:"Flexible"},
  {n:"Electricity",role:"Indirect cost per completed task",choke:"Usually buried in cloud pricing, but decisive for scaled low-margin workloads.",geo:"Provider-specific",time:"Inherited"},
  {n:"Device hardware",role:"Local inference, sensors and secure credentials",choke:"Inherits semiconductors and batteries only where agents run at the edge.",geo:"Global electronics chain",time:"Inherited"}],
 note:"Layers 6 and 7 are the only layers without a material chokepoint and the two with the most contested moats. Physical scarcity is harder to compete away than software advantage."},
8:{severity:"Extreme",summary:"Embodiment reverses the infrastructure stack's geography. High-torque-density motors require rare-earth magnets, while precision reducers depend on metallurgy, heat treatment and micron-scale grinding capacity.",
 stats:[["86–90%","Rare-earth refining in China"],[">70%","Rare-earth magnet output in China"],["63%","Humanoid components supplied by China"],["18+ mo","Reducer lead time"]],
 flow:["Ore + alloy steel","Separation + heat treatment","Magnet + reducer manufacture","Motor, actuator, robot"],
 items:[
  {n:"NdFeB + Dy/Tb",role:"High-torque-density permanent-magnet motors",choke:"Hundreds of solvent-extraction stages; heavy rare-earth licensing remains active and separation know-how is export-controlled.",geo:"China 86–90% refining",time:"Extreme / durable"},
  {n:"Bearing + gear steels",role:"Flexsplines, cycloidal gears and rolling elements",choke:"The steel is available; fatigue metallurgy, heat-treatment recipes and single-micron grinding are not.",geo:"Japan / China / Europe",time:"5–10 years"},
  {n:"Lithium + graphite",role:"2 kWh-class batteries and fleet spares",choke:"Per-robot energy density matters more than fleet volume; cells are only ~1.1% of global output at 10m robots.",geo:"Refining China-heavy",time:"Architectural"},
  {n:"Copper",role:"Motor windings and wiring harnesses",choke:"Four kilograms per robot is immaterial to world supply, though magnet-wire manufacturing still must scale.",geo:"Global",time:"Low"},
  {n:"InGaAs + silicon",role:"Infrared, lidar, cameras and edge compute",choke:"Inherits the semiconductor value chain and small III-V material markets.",geo:"US / EU / Asia",time:"Moderate"},
  {n:"Aluminium + carbon fibre",role:"Low-mass structure and covers",choke:"Cost, cycle time and repairability—not raw material availability—determine architecture.",geo:"Diversified",time:"Low"}],
 note:"Western rare-earth developers behave more like geopolitical insurance than ordinary growth holdings: they gain when controls tighten and face Chinese cost pressure when they loosen. The reducer volume thesis can be right while incumbent margins still collapse."},};

const LAYER_RISKS={
1:{scores:[["Capex cycle",4],["Supply concentration",5],["Policy exposure",3],["Substitution",2]],items:[
 {t:"Backlog quality",d:"Paid turbine slot reservations can be released; headline gigawatts are not the same as firm equipment orders.",m:"Monitor reservation-to-firm-order conversion."},
 {t:"Input-cost squeeze",d:"Backlogs are priced today while copper, castings and skilled labour reprice before delivery.",m:"Monitor incremental margin as backlog converts."},
 {t:"Demand correlation",d:"Grid equipment has non-AI demand, but the marginal order wave still depends on hyperscaler capex.",m:"Track announced versus actively constructed MW."},
 {t:"Technology timing",d:"SMR stories can be five years ahead of revenue; HALEU can delay even technically ready reactors.",m:"Track fuel and interconnection milestones, not MOUs."}],verdict:"This layer breaks if equipment lead times normalise before suppliers convert backlog at attractive margins, or if hyperscaler projects are cancelled faster than grid replacement absorbs capacity."},
2:{scores:[["Capex cycle",3],["Supply concentration",5],["Policy exposure",5],["Substitution",2]],items:[
 {t:"Policy reversal",d:"This layer performs when export controls tighten and de-rates when they loosen. The November 2026 expiry cuts both ways.",m:"Track the status of the April 2025 heavy rare earth licensing, which was never suspended."},
 {t:"Cost disadvantage",d:"Chinese refining is genuinely lower cost, not merely subsidised. Western capacity needs either a price floor or sustained controls to clear its cost of capital.",m:"Monitor offtake terms and government price-floor arrangements."},
 {t:"Capacity arriving faster than expected",d:"Three to eight years is a short moat. Solvay, Lynas and MP are all building; if they succeed, scarcity premia compress.",m:"Track commissioned separation tonnes, not announced projects."},
 {t:"By-product supply shocks",d:"Rhenium, gallium, germanium and hafnium supply follows an unrelated primary metal and cannot respond to its own price.",m:"Watch primary copper, zinc and aluminium output as the true driver."},
 {t:"Single-point physical risk",d:"Spruce Pine demonstrated in September 2024 that a weather event can halt most of the world\u2019s high-purity quartz supply.",m:"Treat as an unhedgeable tail rather than a monitorable one."}],verdict:"This layer breaks if Western refining capacity arrives on schedule and controls lapse together — the scarcity that justifies the position disappears from both directions at once."},
3:{scores:[["Capex cycle",4],["Supply concentration",5],["Policy exposure",5],["Substitution",1]],items:[
 {t:"Taiwan concentration",d:"Leading-edge fabrication and most advanced packaging remain exposed to one island and one company.",m:"Track geographic yield parity, not announced fab shells."},
 {t:"Export controls",d:"Controls can remove China systems and service revenue—or reverse within weeks, as EDA licensing showed.",m:"Track servicing rules and November 2026 policy dates."},
 {t:"Packaging overbuild",d:"CoWoS scarcity rents compress if capacity closes the supply-demand gap faster than accelerator demand grows.",m:"Track lead time and customer allocation."},
 {t:"Memory cyclicality",d:"A rising memory share supports orders today but makes equipment backlog more cyclical tomorrow.",m:"Track ASML memory mix and HBM contract pricing."}],verdict:"The layer remains structurally strongest, but it combines irreplaceable engineering with maximum geopolitical concentration. Monopoly quality does not neutralise a binary location risk."},
4:{scores:[["Earnings cycle",5],["Supply concentration",4],["Policy exposure",5],["Obsolescence",5]],items:[
 {t:"Accelerator depreciation",d:"A three-year rather than seven-year useful life changes data-centre economics more than the chosen energy source.",m:"Track resale values and prior-generation utilisation."},
 {t:"Custom silicon",d:"Hyperscaler ASICs do not need to beat GPUs everywhere; they only need to take repetitive internal workloads.",m:"Track TPU, Trainium and Maia deployment, not announcements."},
 {t:"HBM peak earnings",d:"Oligopoly discipline is better, but triple-digit growth is still a cycle condition and China is gaining share.",m:"Track contract price, inventory and CXMT share."},
 {t:"Architecture shift",d:"Optical I/O, memory hierarchy or inference efficiency can move value away from today's winning component.",m:"Track dollars of system cost per useful token."}],verdict:"Layer 4 has the fastest growth and the shortest moat half-life. Underwrite performance per dollar and installed-base economics, not the permanence of one accelerator architecture."},
5:{scores:[["Demand shortfall",5],["Financial leverage",5],["Schedule",5],["Substitution",2]],items:[
 {t:"Monetisation lags capex",d:"Hundreds of billions are increasingly debt-funded before durable end-demand is proven.",m:"Track contracted revenue duration versus debt maturity."},
 {t:"Power delivery",d:"A completed shell can wait years for interconnection, transformer or turbine delivery.",m:"Require firm power and long-lead slots before land."},
 {t:"Utilisation",d:"Break-even deteriorates non-linearly below 70%; idle accelerators still depreciate.",m:"Track realised GPU-hours, not installed GPUs."},
 {t:"Refinancing mismatch",d:"Five-year hardware loans against shorter customer contracts and longer leases create a classic duration mismatch.",m:"Track covenant headroom and customer concentration."}],verdict:"The highest leverage in the infrastructure stack sits here. The building is not the asset; utilisation of rapidly depreciating compute is. Power, of all inputs, decides whether revenue starts on time."},
6:{scores:[["Commoditisation",5],["Capex dependency",5],["Regulation",3],["Concentration",3]],items:[
 {t:"Capability convergence",d:"Open and closed models can converge faster than providers build differentiated distribution.",m:"Track price per benchmark-adjusted token."},
 {t:"Efficiency shock",d:"Algorithmic gains can reduce training or inference demand per task faster than usage expands.",m:"Track total compute spend per completed workflow."},
 {t:"Weak pricing power",d:"Model APIs face routing, distillation and multi-model applications that arbitrage suppliers.",m:"Track net revenue retention after price cuts."},
 {t:"Evaluation failure",d:"Benchmarks can rise without reliability improving on economically valuable work.",m:"Track task completion and human-intervention rates."}],verdict:"Models are indispensable but may be a poor standalone profit pool. The investable question is who captures the surplus created by capability—not who temporarily leads a benchmark."},
7:{scores:[["Commoditisation",5],["Platform capture",5],["Security",4],["Regulation",4]],items:[
 {t:"Feature absorption",d:"Model or cloud platforms can bundle the agent feature before an application earns distribution.",m:"Track gross retention when foundation models ship substitutes."},
 {t:"Incumbent destruction",d:"Agents can reduce seats, clicks and transaction fees in the same software companies expected to monetise them.",m:"Track revenue per completed task, not per seat."},
 {t:"Permission failure",d:"Tool access turns hallucination into an action; delegation chains create identity and audit gaps.",m:"Track irreversible-action rate and override frequency."},
 {t:"Workflow lock-in",d:"Without proprietary data or control of the system of record, switching costs may remain near zero.",m:"Track depth of write access and embedded approvals."}],verdict:"Distribution wins this layer only when it becomes workflow ownership. A thin agent wrapper is a feature; a governed system of record with proprietary feedback can be a business."},
8:{scores:[["Timeline",5],["China exposure",5],["Price deflation",5],["Safety",4]],items:[
 {t:"A decade early",d:"A category can be inevitable while productive autonomous deployments remain in the hundreds or low thousands.",m:"Track verified work hours and shipped units."},
 {t:"Chinese cost attack",d:"Green Harmonic prices reducers 30–50% below incumbents and is already inside major supply chains.",m:"Track share and reducer lead-time compression."},
 {t:"Architecture substitution",d:"Quasi-direct-drive motors can reduce or remove the harmonic reducer count per robot.",m:"Track actuator topology in production designs."},
 {t:"Maintenance and liability",d:"Hundreds of millions of wear components plus physical agency create a service and insurance stack that does not exist.",m:"Track MTBF, interventions and certified deployments."},
  {t:"Synthetic saturation",d:"If simulated data generalises with a small real seed, proprietary fleet-data moats end at a threshold.",m:"Track synthetic-to-real ratios on held-out physical tasks."},
 {t:"Model collapse",d:"The opposite risk is also real: synthetic feedback can narrow diversity and amplify errors.",m:"Track quality under repeated self-generated training."},
 {t:"Structured-task ceiling",d:"If robots only master repetitive settings, purpose-built automation remains cheaper and more reliable.",m:"Track task diversity without environment engineering."},
 {t:"No economic closure",d:"The whole stack is a derivative claim on physical-world value eventually appearing as cash flow.",m:"Track revenue-producing autonomous hours."}
 ],verdict:"Volume is not margin. Ten million robots can be built while incumbent component profits disappoint—especially if Chinese suppliers drive the learning curve and alternative actuators reduce reducer content."},};

const GW={
risk:{h:['Risk','Likelihood','Impact','Mitigation'],r:[
['Power delivery delay','<span class="hl">High</span>','Extreme','Behind-the-meter generation; secure a turbine slot early'],
['Transformer or switchgear delay','<span class="hl">High</span>','Extreme','Order at month zero; pre-engineered modular skids'],
['Accelerator allocation shortfall','Moderate','Extreme','Multi-year supply agreement; CoWoS capacity is the true constraint'],
['HBM allocation','Moderate','High','Sold out across all three suppliers through 2026'],
['Cost escalation','High','High','Cost per MW rose ~7% annually since 2020; fixed-price contracts where possible'],
['Skilled labour shortage','High','High','Especially liquid-cooling commissioning; vertical integration of the workforce'],
['Financing cost rise','Moderate','High','Leveraged structures reprice directly on long yields'],
['Server life shorter than assumed','Moderate','<span class="hl">Extreme</span>','The dominant variable — see the break-even matrix'],
['Demand shortfall at commissioning','Moderate','Extreme','Phased energisation; take-or-pay contracts'],
['Water or community opposition','Moderate','Moderate','Closed-loop cooling; early local engagement'],
['Copper and materials supply','Moderate','Moderate','Refined deficit projected for 2026; early procurement']]},
gate:{h:['Gate','Test','Fail condition'],r:[
['G1 — Power','Firm 1.15 GW secured with a contractual date','No credible path inside 60 months, stop'],
['G2 — Long-lead','Transformer and turbine slots confirmed','Slots unavailable inside schedule, stop or re-site'],
['G3 — Silicon','Multi-year accelerator and HBM allocation agreed','No allocation means the building is a shell'],
['G4 — Offtake','Contracted demand covering at least 60% of capacity','Below threshold, build in phases only'],
['G5 — Financing','Full capital stack below the modelled return','Above it, do not proceed on leverage']]},
deep:[
['The value accrues upstream, not to the owner',
 'Of $38bn, roughly $21bn flows to accelerator and memory vendors, $5bn to electrical equipment makers, $2bn to cooling suppliers and $5bn to networking. <b>The owner of the asset captures none of that — the owner captures whatever margin remains after paying all of it.</b> This is the arithmetic justification for owning the suppliers rather than the operators, and it is why layers 1 and 3 deserve a higher portfolio weight than their share of industry revenue would suggest.'],
['The bottleneck is not what the capex number implies',
 'Land and interconnection are 0.9% of the budget and 100% of the schedule risk. Any monitoring framework built on capex guidance will miss the constraint entirely. <b>Watch megawatts energised, not dollars committed.</b> Only about a third of announced 2026 US capacity was under active construction, with 30–50% of planned openings expected to slip — meaning capex guidance and delivered compute are diverging while most investors treat them as the same number.'],
['Viability rests on an accounting assumption, not a technology one',
 'The AI works. The demand exists. Whether this asset earns its cost of capital depends on whether a GPU installed in 2026 is still generating revenue in 2032. <b>Nobody knows, because no AI accelerator generation has yet been observed through a full six-year life.</b> The spread between the three-year and seven-year assumption is $5bn a year — larger than the entire capital cost of the gas plant, eight times the annual energy bill, and five times every operating cost combined.'],
['The employment figure developers under-communicate',
 '$38 billion of capital creates roughly 250–350 permanent jobs, derived from the $40m annual labour line. Meta\u2019s Hyperion reports 7,500 peak construction jobs and about 1,000 permanent for 5 GW; Bloomberg estimates roughly 57 ongoing workers at Stargate Abilene. <b>Data centres are among the most capital-intensive and least labour-intensive assets in the industrial economy</b> — a fact with real consequences for permitting, local incentives and community relations.']],
facts:[['$37.9bn','Upfront capital expenditure'],['$8.5bn','Annualised total cost of ownership'],['~7.1 TWh','Annual electricity consumption'],['~500,000','Blackwell-class accelerators'],['~300','Permanent jobs created'],['48–66 mo','Time to first token']],
capex:{t:'Upfront capital by category',u:'$ millions',c:C[4],b:[['Servers',21188],['Facility',11433],['Network',4925],['Land',172],['Utility works',164]],
 note:'Land and grid interconnection together are 0.9% of the budget and 100% of the schedule risk. The scarcest input is also the cheapest — the central inversion of the project.'},
fac:{h:['Category','Share of facility','$ millions'],r:[['Electrical infrastructure','40–45%','4,600–5,150'],['Cooling systems','15–25%','1,700–2,900'],['Building shell and envelope','10–15%','1,150–1,700'],['Fire, security, controls','~10%','~1,150'],['Site works and roads','~5%','~570'],['Design, PM, contingency','remainder','1,000–2,000']]},
lead:{t:'Equipment lead times',u:'weeks',c:C[1],b:[['Distribution transformers',30],['UPS above 500 kVA',33],['Pad-mount transformers',52],['Backup generators',65],['MV switchgear',95],['HV circuit breakers',125],['Large power transformers',128],['Generator step-up units',160],['Heavy-duty gas turbine',260]],
 note:'The gas turbine figure converts GE Vernova\u2019s 2031 delivery slots into weeks from a mid-2026 order.'},
phase:[['0–12','Site selection and power strategy','Land option, utility engagement, interconnection application'],
['0–3','Long-lead equipment orders','Transformers, switchgear, turbines. Must precede everything else.'],
['6–24','Permitting and entitlement','Zoning, environmental, water, air if generation is on site'],
['12–24','Site works and foundations','Earthworks, utilities, substation civils'],
['18–36','Shell construction','Steel, envelope, roof'],
['24–42','Electrical installation','Substation, switchgear, busway, UPS'],
['26–44','Mechanical and cooling','Chillers, CDUs, piping'],
['40–52','Commissioning','Integrated systems testing, levels one to five'],
['42–60','IT fit-out','Racks, servers, network, burn-in'],
['48–66','First token','']],
bom1:{h:['Item','Quantity','Lead time'],r:[
['AI accelerators','450,000–500,000','Allocation-limited'],['Racks at 132 kW','6,300–6,900','—'],
['HBM memory installed','90–100 petabytes','Sold out'],['HBM stacks','~4 million','Sold out'],
['Main power transformers','8–12 with N+1','128 weeks'],['MV switchgear line-ups','60–120','90–100 weeks'],
['Unit substations','400–800','30–52 weeks'],['UPS modules','200–400','26–40 weeks'],
['Backup generators','300–500','52–78 weeks'],['Power distribution units','6,000–8,000','16–24 weeks'],
['Coolant distribution units','400–800','26–52 weeks'],['Cold plates','~500,000','—']]},
bom2:{h:['Material','Quantity','Context'],r:[
['Copper','40,000–50,000 t','0.2% of world annual mine output'],['Structural steel','Tens of thousands of t','—'],
['Concrete','Hundreds of thousands of m³','—'],['Grain-oriented electrical steel','Thousands of t','Single US producer'],
['Lithium-ion storage','200–500 MWh','UPS and grid firming'],['Fibre optic cable','Hundreds of km','—'],
['Land, campus','1.0–1.5 km²','250–370 acres'],['Land, if solar-supplied','+100–150 km²','~90× the campus itself']]},
energy:{h:['Scenario','Generation capex','Land added','Time to power','Firm 24/7','Annual energy cost'],r:[
['Grid','$0 (utility borne)','—','5–7 year queue','<span class="ok">Yes</span>','~$594m'],
['Gas combined cycle','~$1.0bn','0.3 km²','5–7 yrs (turbine slot)','<span class="ok">Yes</span>','$285–530m'],
['Solar plus storage','~$11–12bn','~110 km²','2–3 yrs','<span class="hl">No, not alone</span>','$330–720m'],
['Nuclear AP1000','~$9.0bn','~1.5 km²','7+ yrs','<span class="ok">Yes</span>','$570–1,280m']]},
land:{t:'Land footprint, log scale',u:'km²',c:C[1],log:true,b:[['Gas plant',0.3],['Data centre campus',1.2],['Nuclear station',1.5],['Solar plus storage',110]],
 note:'Solar sized for firm round-the-clock power needs roughly 4 GW of nameplate capacity plus overnight storage — about ninety times the land of the campus it serves.'},
be:{h:['IT life','Grid','Gas','Solar','Nuclear'],r:[
['3 years','<span class="hl">$4.36</span>','<span class="hl">$4.30</span>','<span class="hl">$4.36</span>','<span class="hl">$4.49</span>'],
['5 years','$3.19','$3.13','$3.19','$3.32'],
['7 years','<span class="ok">$2.70</span>','<span class="ok">$2.64</span>','<span class="ok">$2.70</span>','<span class="ok">$2.83</span>']]},
util:{h:['Utilisation','3-year','5-year','7-year'],r:[
['50%','$6.10','$4.45','$3.75'],['60%','$5.12','$3.74','$3.16'],
['71% base','<b>$4.36</b>','<b>$3.19</b>','<b>$2.70</b>'],['80%','$3.89','$2.85','$2.42'],['90%','$3.48','$2.56','$2.17']]},
mkt:{h:['Reference price, B200','$ per GPU-hour'],r:[
['On-demand, median','$6.52'],['Reserved, median','$5.35'],['Spot, median','$4.26'],
['Custom contract, cheapest','$3.49'],['36-month reserved, low','$2.25']]},
verdict:{h:['Case','Break-even','Assessment'],r:[
['7-year life','$2.64–2.83','<span class="ok">Comfortable.</span> Clears the $3.49 contract floor easily.'],
['5-year life','$3.13–3.32','Workable. Positive but thin at the contract floor.'],
['3-year life','$4.30–4.49','<span class="hl">Fails on long-term contracts.</span> Above the $3.49 floor and above spot median — works only at on-demand rates, meaning you carry utilisation risk on a $38bn asset.']]},
lab:{h:['Role','Peak headcount','Note'],r:[
['Electricians','1,200–2,500','<span class="hl">The binding trade</span>'],['Mechanical and pipefitters','600–1,200','Liquid cooling is a new discipline'],
['Structural and ironworkers','400–800','—'],['Concrete and civils','300–600','Front-loaded'],
['Controls and commissioning','150–400','Scarce and specialised'],['General labour','500–1,000','—'],
['<b>Peak construction total</b>','<b>3,000–7,000</b>','Sustained 12–24 months'],
['<b>Permanent operations</b>','<b>250–350</b>','Derived from the $40m labour line']]},
cap:{h:['Source','Typical share','Note'],r:[
['Corporate equity and operating cash flow','30–60%','Hyperscalers only'],['Project-level debt and SPVs','20–40%','Secured on the facility'],
['Private credit','10–30%','Blackstone, Apollo, Ares and similar'],['GPU-collateralised debt','10–30%','Neoclouds; secured on depreciating assets'],
['Vendor financing and backstops','Variable','Chip supplier credit support'],['Tax equity and incentives','5–15%','Jurisdiction dependent']]},
proj:{h:['Project','Owner','Capacity','Status'],r:[
['Meta Hyperion, Richland Parish LA','Meta with Blue Owl JV','5 GW','Under construction, over $50bn'],
['Stargate UAE','G42 and OpenAI','5 GW','Under construction'],
['Project Fairwater, Mount Pleasant WI','Microsoft and NVIDIA','3.3 GW','Bring-up reported May 2026'],
['Project Rainier, New Carlisle IN','AWS and Anthropic','2.2 GW','Operational, 500k Trainium2 chips'],
['Stargate Dona Ana, NM','OpenAI','2.2 GW','Under construction'],
['Colossus 2, Southaven MS','xAI','2 GW','Under construction'],
['Stargate Abilene, TX','OpenAI, Oracle, Crusoe','1.2 GW','Operational, 450k GB200 GPUs'],
['Prometheus, New Albany OH','Meta','1 GW','Reached 1 GW May 2026'],
['Fayetteville, NC','Microsoft','~1 GW','Reached 1 GW March 2026']]}};

const HU={
deploy:{h:['Requirement','Fleet scale'],r:[
['Charging stations and docks','3–5 million, at two to three robots per dock'],
['Battery swap stations','Where hot-swap architecture is used'],
['<b>Electrical capacity for charging</b>','<b>2.3 GW average, ~5 GW peak</b>'],
['Maintenance depots','Reducers and actuators are wear items'],
['Spare parts inventory','250m reducers in service implies a large replacement flow'],
['Trained maintenance technicians','<span class="hl">A new trade, at scale</span>'],
['Safety certification and insurance','Successors to ISO 10218 and TS 15066 for mobile humanoids'],
['Facility retrofit','Flooring, clearances, charging power, network coverage']]},
deep:[
['Timelines have slipped repeatedly and may keep slipping',
 'Eight documented Optimus milestone revisions. Autonomous humanoids doing productive work still number in the hundreds to low thousands globally. <b>A category can be inevitable and still be a decade early as an investment.</b> Anyone modelling 10 million units before 2032 should be asked specifically where 250 million precision reducers come from.'],
['The component moats face a direct cost attack',
 'Green Harmonic prices 30–50% below incumbents, targets 60% share, and is already inside Tesla\u2019s supply chain. <b>If Chinese suppliers reach precision parity — and market analysis suggests they largely have for mass-produced components — the Japanese reducer oligopoly is a melting ice cube, not a fortress.</b> This is the strongest argument against the component thesis, and it belongs on the record alongside it.'],
['Volume without profit is the observed pattern',
 'Unitree ships the most units and its profits fell 52%. If humanoids follow the trajectory of solar panels or LCD panels — enormous volume growth, no durable margin — the correct exposure is zero regardless of unit forecasts. Every economic figure here also assumes robots are productive for 5,840 hours a year at human-equivalent value, while current platforms manage two to five hours of runtime with supervision. <b>The value calculation is arithmetic; the productivity assumption is a hypothesis.</b>'],
['Manipulation may simply not generalise',
 'Every quantity assumes humanoids become useful for unstructured physical work. Current verified deployments — Figure at BMW, Agility at Amazon — are structured, repetitive tasks. <b>If humanoids remain confined to structured environments, they compete with purpose-built automation that is cheaper and more reliable, and the humanoid form factor loses.</b>'],
['The reducer capacity estimate could be wrong',
 'The roughly 5 million unit global capacity figure is derived from industrial robot installation counts, not a disclosed industry statistic. If actual capacity is 20 million, the required expansion is 12x rather than 50x — still enormous, but a different conclusion. <b>This number deserves primary-source verification before it is used for anything.</b> Actuator architecture could also change: quasi-direct-drive designs using large-diameter, low-ratio motors reduce or eliminate harmonic reducers entirely, and several developers have moved that way.'],
['China may simply do this',
 '63% component supply, over 70% of magnets, and the Yangtze River Delta cluster with suppliers, robot makers, AI labs and EV manufacturers inside a two-hour logistics radius. <b>A Western investor building this thesis should be honest that the most likely operator of a 10-million-unit fleet supply chain is not Western.</b>']],
facts:[['450m','Actuators required'],['250m','Precision reducers required'],['~50×','Expansion of world reducer output needed'],['20.4 TWh','Fleet annual electricity'],['58.4bn','Robot-hours of data per year'],['~2034','Earliest plausible date']],
layers:{h:['Layer','What it contains','The constraint'],r:[
['1 Robot hardware','Actuators, reducers, sensors, battery, structure','<span class="hl">Precision reducers — 50× expansion</span>'],
['2 Edge intelligence','On-board inference at 10–30 Hz, around 130 W','Models outpace deployable hardware'],
['3 Connectivity and data','Private 5G, selective upload, fleet telemetry, storage','200 Tbps aggregate is not buildable'],
['4 Training and simulation','Foundation models, synthetic data, evaluation, 3–5 GW of compute','Demonstration data, not compute'],
['5 Deployment','Charging docks, maintenance depots, spares, technicians, certification','A maintenance trade that does not yet exist']]},
cap:{t:'Fleet demand as a share of current world output',u:'% of annual production, log scale',c:C[7],log:true,b:[['Precision reducers',5000],['NdFeB magnets',13],['Image sensors',1.2],['Battery cells',1.1],['Copper',0.2]],
 note:'Global precision reducer output is estimated at roughly 5 million units a year including all industrial robotics and machine tools. This estimate is the single figure in the analysis most in need of independent verification.'},
comp:{h:['Component','Per robot','Fleet total'],r:[
['Actuators, body and hands','45','450 million'],['Harmonic and RV reducers','25','250 million'],
['Planetary roller screws','12','120 million'],['Image sensors','8','80 million'],
['Force and torque sensors','6','60 million'],['Edge compute modules','1','10 million'],
['NdFeB magnet','3 kg','30,000 t'],['Copper','4 kg','40,000 t'],['Battery','2.0 kWh','20 GWh']]},
bom:{t:'Where the cost sits in a humanoid',u:'% of bill of materials',c:C[7],b:[['Actuators and joints',50],['Sensors and perception',33],['Hands and manipulation',17]],
 note:'A humanoid is a mechatronics problem with an AI feature, not an AI problem with a mechanical body.'},
cost:{h:['Platform','Bill of materials','Note'],r:[
['Unitree G1','$10,000–16,000','Lowest-cost commercial unit'],
['Chinese supply chain, 2025','~$46,000','Projected to $16,000 at 1m units a year around 2034'],
['Tesla Optimus teardown','~$55,000','Morgan Stanley, Gen 2 class'],
['Boston Dynamics Atlas','~$300,000','A twentyfold spread from the low end'],
['<b>Fleet cost at $17k</b>','<b>$170bn</b>','At 10m units a year scale'],
['<b>Fleet cost at $40k</b>','<b>$400bn</b>','At today\u2019s blended BOM']]},
batt:{h:['Platform','Battery','Runtime'],r:[
['Tesla Optimus Gen 2/3','2.3 kWh','~2 hrs dynamic'],['Figure F.03','2.3 kWh structural','~5 hrs, 2 kW charging'],
['Apptronik Apollo','Undisclosed','4 hrs, hot-swappable'],['Unitree H1','0.864 kWh','under 4 hrs static'],
['Unitree H2','0.972 kWh','~3 hrs'],['NEURA 4NE1','Undisclosed','6–8 hrs, hot-swap'],
['<b>Fleet demand</b>','<b>20 GWh</b>','<b>1.1% of world output</b>']]},
edge:{h:['Hardware','Latency, π0-class model','Frequency'],r:[
['Jetson Thor, 128 GB','52.57 ms','19.0 Hz'],['Jetson Thor on π0-XL, 16.7B','—','2.1 Hz'],
['Datacenter GPU class','218.8 ms measured','Camera frame rate capable'],
['<b>Requirement</b>','<b>under 200 ms action cycle</b>','<b>Cloud round trip of 50–150 ms is marginal</b>']]},
data:{t:'Robot interaction data, billions of hours',u:'log scale',c:C[8],log:true,b:[['Exists globally today',0.0005],['Needed, low estimate',1],['Needed, high estimate',10],['10M fleet, per year',58.4]],
 note:'The fleet reproduces the entire existing global corpus every 4.5 minutes and clears the low-end requirement in 6.2 days.'},
eng:{h:['Metric','Value'],r:[
['Per robot','5.6 kWh/day at 350 W over 16 hours'],['Fleet annual consumption','20.4 TWh'],
['Equivalent gigawatt data centres','2.9'],['Average charging load','2.33 GW'],
['Peak if 25% charge at once','5.0 GW'],['On-board compute, distributed','~1.3 GW'],
['Uplink if all robots streamed','200 Tbps'],['Fleet raw data volume','526 exabytes per year'],
['At 1% selective retention','5.3 exabytes per year']]},
econ:{h:['Item','Value'],r:[
['Fleet hardware at $17k BOM','$170bn'],['Fleet hardware at $40k BOM','$400bn'],
['Supporting AI infrastructure, 3–5 GW','$114–190bn'],['Charging and deployment','$20–40bn'],
['<b>Total capital</b>','<b>$300–630bn</b>'],['Fleet output at $10/hr equivalent','$584bn per year'],
['At $15/hr','$876bn per year'],['At $25/hr','$1.46tn per year']]},
ramp:{t:'Cumulative units at 100% annual production growth',u:'millions, log scale',c:C[7],log:true,b:[['2026',0.02],['2028',0.14],['2030',0.62],['2032',2.54],['2034',10.22]],
 note:'Reaching 10 million cumulative units requires doubling production every year for nine consecutive years from a 2026 base of roughly 20,000. No hardware industry has sustained that — and none faced a component needing fiftyfold expansion.'},
rank:{h:['#','Constraint','Time to relieve'],r:[
['1','<span class="hl">Precision reducers and actuators</span>','8–12 years'],['2','<span class="hl">Rare earth magnets</span>','Political, not industrial'],
['3','Manipulation and tactile sensing','Research-dependent'],['4','Real-world training data','Self-resolving above 1m units'],
['5','Edge inference performance','3–5 years'],['6','Battery runtime per robot','Architectural workarounds exist'],
['7','Maintenance workforce','5–10 years'],['8','Data bandwidth and storage','Architectural'],
['9','Fleet electricity','<span class="ok">Not a constraint</span>'],['10','Batteries, sensors, copper at fleet level','<span class="ok">Not a constraint</span>']]},
co:[
['Harmonic Drive Systems','Strain-wave precision reducers','Over 50% global share; 18-plus month lead times','Dominant in strain-wave','Oligopoly on the largest cost item; paid regardless of platform winner','Green Harmonic prices 30–50% below and targets 60% share, already inside Tesla\u2019s supply chain'],
['Nabtesco','RV cycloidal reducers','Over 60% share','Dominant in cycloidal','Highest-stress joints where substitution is hardest','Same Chinese cost attack; industrial robot cycle exposure'],
['Sony','CMOS image sensors','Over 50% globally, in ~80% of humanoids','Dominant in sensing','Most direct listed exposure to machine perception','Diversified business dilutes the exposure heavily'],
['NVIDIA','Jetson Thor; Isaac GR00T, Cosmos, Omniverse','80–90% of humanoid AI compute','Four of five robotics layers','Supplies training, simulation, synthetic data and edge inference in one stack','Chinese edge SoCs entering on system cost; Thor below most camera frame rates on larger models'],
['THK, NSK, Hiwin','Linear motion, ball screws, roller screws','~12 roller screws per robot at $1,350–2,700 each','Leaders in linear motion','Highest per-unit cost components in the legs','Machine tool cycle exposure; Chinese competition arriving'],
['Sanhua, Tuopu, Green Harmonic','Linear and rotary actuators, harmonic reducers','Sanhua ~19% of Optimus BOM on a $685m order; Tuopu ~13%','Tesla\u2019s exclusive Tier 1 suppliers','Where the cost curve is actually being driven; operationally strongest in the layer','Highest political and governance risk; accessibility differs materially from developed-market listings'],
['Tesla','Optimus Gen 3; FSD','Fremont production began January 2026, 1,000+ deployed internally','Vertically integrated platform','Vertical integration plus the largest consumer data-generating fleet','Eight documented Optimus milestone revisions; supply chain is substantially Chinese'],
['Hyundai (Boston Dynamics)','Atlas; Hyundai Mobis actuators','30,000 unit per year factory targeted for 2028','Most integrated Western programme','Attached to a company that already builds complex machines at volume','$300k Atlas against $16k Chinese units'],
['CATL, LG Energy, Panasonic','Lithium-ion and solid-state cells','Fleet demand is 20 GWh, or 1.1% of world output','Dominant in cells','Solid-state demand for humanoids projected at 74 GWh by 2035','Will not be repriced by humanoids — the fleet is a rounding error on their volumes']]};

function bars(cfg){
  const vals=cfg.b.map(x=>x[1]);
  const mx=Math.max(...vals), mn=Math.min(...vals.filter(v=>v>0));
  const pct=v=>{ if(!cfg.log) return Math.max(1.5,v/mx*100);
    const lo=Math.log10(mn)-0.6, hi=Math.log10(mx);
    return Math.max(2,(Math.log10(v)-lo)/(hi-lo)*100); };
  const fmt=v=>{ if(v>=1000) return v.toLocaleString(undefined,{maximumFractionDigits:0});
    if(v<0.01) return String(v);
    return String(v%1===0? v : v.toFixed(v<10?2:1)); };
  return `<h4>${cfg.t}</h4>`+cfg.b.map(([l,v])=>
    `<div class="bar"><span class="lb2">${l}</span><span class="tr"><i class="fl" data-w="${pct(v).toFixed(1)}" style="background:${cfg.c}"></i></span><span class="vl num">${fmt(v)}</span></div>`
  ).join('')+`<p class="cnote"><b style="color:var(--ink2)">Units: ${cfg.u}.</b> ${cfg.note||''}</p>`;
}
function tbl(o){
  return `<thead><tr>${o.h.map(h=>`<th>${h}</th>`).join('')}</tr></thead>`+
    `<tbody>${o.r.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'':'sm'}">${c}</td>`).join('')}</tr>`).join('')}</tbody>`;
}
function cotbl(rows,layer){
  const meta=r=>(typeof COMETA!=='undefined'&&COMETA[layer+'|'+r[0]])||null;
  const head=`<thead><tr><th>Company</th><th>Country</th><th>Share of its niche</th>`+
    `<th>Key metrics and fundamentals</th><th>Position</th><th>Bulls say</th><th>Bears say</th></tr></thead>`;
  return head+`<tbody>`+rows.map(r=>{ const m=meta(r)||['—','n/d'];
    const mk=logoFor(r[0],'co-tlogo')||'<span class="co-tlogo is-blank" aria-hidden="true"></span>';
    return `<tr><td class="co-n"><div class="co-cell">${mk}<div>${coName(r[0])}</div></div></td>`+
      `<td class="sm co-geo"><span class="vr-flag" aria-hidden="true">${flagFor(m[0])}</span>${m[0]}</td><td class="sm co-share">${m[1]}</td>`+
      `<td class="sm">${r[2]}</td><td class="sm">${r[3]}</td>`+
      `<td class="bull">${r[4]}</td><td class="bear">${r[5]}</td></tr>`;}).join('')+`</tbody>`;
}
const factgrid=f=>f.map(x=>`<div><b class="num">${x[0]}</b><span>${x[1]}</span></div>`).join('');

function materialPane(m,col){
  return `<div class="material-hero" style="border-left:4px solid ${col}">
    <div><h4>Material foundation</h4><p>${m.summary}</p></div>
    <div class="severity-badge"><span>Constraint severity</span><b style="color:${col}">${m.severity}</b></div>
  </div>
  <div class="material-stats">${m.stats.map(x=>`<div><b class="num">${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>
  <div class="supply-flow">${m.flow.map((x,j)=>`<div class="flow-node"><small>${['Origin','Refine','Transform','Enters stack'][j]}</small><b>${x}</b></div>`).join('')}</div>
  <div class="material-cards">${m.items.map(x=>`<article class="material-card">
    <div><h5>${x.n}</h5><div class="mat-role">${x.role}</div></div>
    <div><div class="mat-choke">${x.choke}</div><div class="mat-meta"><span class="micro-chip">${x.geo}</span><span class="micro-chip">Relief: ${x.time}</span></div></div>
  </article>`).join('')}</div>
  <div class="conc-wrap" data-conc="${m.__n}"></div>
  ${(m.__n===3||m.__n===7)?`<div class="policy-rail" data-policy="${m.__n}"></div>`:''}
  <div class="material-note"><b>Investment reading.</b> ${m.note}</div>`;
}
function riskPane(r,L){
  return `<div class="risk-layout">
    <div class="risk-scorecard"><h4>Risk intensity · 1 low → 5 high</h4>${r.scores.map(x=>`<div class="risk-meter"><span>${x[0]}</span><span class="meter-track"><i style="width:${x[1]*20}%"></i></span><b>${x[1]}</b></div>`).join('')}</div>
    <div class="risk-cards">${r.items.map(x=>`<article class="risk-item"><h5>${x.t}</h5><p>${x.d}</p><small>${x.m}</small></article>`).join('')}</div>
  </div>
  <div class="monitor-grid">
    <div><p class="sub">Leading indicators</p><div class="tw"><table class="dat">${tbl({h:['Indicator','Why it matters'],r:L.watch})}</table></div></div>
    <div><p class="sub">Layer falsifier</p><div class="wrongnote" style="margin:0"><b>What would make this wrong.</b> ${L.wrong}</div></div>
  </div>
  <div class="layer-verdict"><b>Risk verdict.</b> ${r.verdict}</div>`;
}

const rail=document.getElementById('rail'), panels=document.getElementById('panels');
const WORLD={t:'The physical world',n:0};
(function addWorld(){
  const i=0, col='var(--accent)';
  const b=document.createElement('button');
  b.className='tab world-tab'; b.setAttribute('role','tab'); b.id='tb'+i;
  b.setAttribute('aria-controls','pn'+i); b.setAttribute('aria-selected','false');
  b.innerHTML=`${layerIcon(0,'rail-icon')}<span class="t">The physical world</span>`;
  b.onclick=()=>sel(i);
  b.onkeydown=e=>{
    if(['ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();sel(LAYERS.length,1)}
    if(['ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();sel(1,1)}};
  rail.insertBefore(b,rail.firstChild);
  const p=document.createElement('div');
  p.className='panel world-panel'; p.id='pn'+i; p.setAttribute('role','tabpanel');
  p.setAttribute('aria-labelledby','tb'+i); p.hidden=true;
  p.innerHTML=`<div class="card" style="border-top-color:${col}">
    <div class="layer-head">
      <div class="layer-head-main">${layerIcon(0,'head-icon')}<div><div class="layer-index">Not a layer · the ground the stack stands on</div>
      <div class="layer-headline"><h3>The physical world</h3><span class="chip">Context, not an allocation</span></div></div></div>
    </div>
    <div class="layer-body world-body"><div class="layer-pane on">${worldPane()}</div></div>
  </div>`;
  panels.insertBefore(p,panels.firstChild);
})();

LAYERS.forEach((L,i0)=>{
  const i=i0+1;
  const col=C[L.n];
  const mat=LAYER_MATERIALS[L.n], risk=LAYER_RISKS[L.n]; mat.__n=L.n;
  const b=document.createElement('button');
  b.className='tab'; b.setAttribute('role','tab'); b.id='tb'+i;
  b.setAttribute('aria-controls','pn'+i); b.setAttribute('aria-selected', i===0?'true':'false');
  b.style.borderLeftColor=i===0?col:'transparent';
  b.innerHTML=`${layerIcon(L.n,'rail-icon')}<span class="t">${L.n}. ${L.t}</span>`;
  b.onclick=()=>sel(i);
  b.onkeydown=e=>{
    if(['ArrowDown','ArrowRight'].includes(e.key)){e.preventDefault();sel((i+1)%LAYERS.length,1)}
    if(['ArrowUp','ArrowLeft'].includes(e.key)){e.preventDefault();sel((i-1+LAYERS.length)%LAYERS.length,1)}};
  rail.appendChild(b);
  const p=document.createElement('div');
  p.className='panel'+(i===0?' on':''); p.id='pn'+i; p.setAttribute('role','tabpanel');
  p.setAttribute('aria-labelledby','tb'+i); if(i)p.hidden=true;
  const ch=Object.assign({},L.chart,{c:col});
  p.innerHTML=`<div class="card" style="border-top-color:${col}">
    <div class="layer-head">
      <div class="layer-head-main">${layerIcon(L.n,'head-icon')}<div><div class="layer-index">Layer ${L.n} · dependency map</div><div class="layer-headline"><h3>${L.t}</h3><span class="chip ${L.mk}">${L.moat}</span></div></div></div>
      <div class="layer-score"><i style="background:${col}"></i><div><span>Material constraint</span><b>${mat.severity}</b></div></div>
    </div>
    <div class="layer-modes" role="tablist" aria-label="${L.t} views">
      <button class="layer-mode" data-mode="thesis" aria-selected="true">Layer thesis</button>
      <button class="layer-mode" data-mode="chain" aria-selected="false">Value chain</button>
      <button class="layer-mode" data-mode="materials" aria-selected="false">Materials</button>
      <button class="layer-mode" data-mode="risks" aria-selected="false">Risks + signals</button>
      <button class="layer-mode" data-mode="companies" aria-selected="false">Companies</button>
      <button class="layer-mode" data-mode="sources" aria-selected="false">Sources</button>
    </div>
    <div class="layer-body">
      <div class="layer-pane on" data-mode-pane="thesis">
        <div class="overview-lede"><div><p class="lede">${L.lede}</p><p class="why">${L.why}</p></div><div class="choke-card" style="border-left-color:${col}"><b>Binding constraint.</b> ${L.choke}</div></div>
        <div class="facts">${factgrid(L.facts)}</div>
        <div class="layer-diagnostic">
          <div><p class="sub">How the layer breaks down</p><div class="tw"><table class="dat">${tbl(L.sub)}</table></div></div>
          <div class="chartbox">${bars(ch)}</div>
        </div>
        <div class="essay-list">${L.detail.map((d,j)=>`<details class="essay" ${j===0?'open':''}><summary>${d[0]}</summary><p>${d[1]}</p></details>`).join('')}</div>
      </div>
      <div class="layer-pane" data-mode-pane="chain">${chainPane(L.n,col)}</div>
      <div class="layer-pane" data-mode-pane="materials">${materialPane(mat,col)}</div>
      <div class="layer-pane" data-mode-pane="risks">${riskPane(risk,L)}</div>
      <div class="layer-pane" data-mode-pane="companies"><p class="sub">Companies with material presence in this layer</p><div class="tw"><table class="co">${cotbl(L.co,L.n)}</table></div><p class="tnote"><b>On the share column.</b> Each figure is the company\u2019s approximate share of the specific niche named beside it, not of the layer and not of any single market. Bases, definitions and measurement dates differ from row to row, so the column indicates order of magnitude and competitive position rather than a like-for-like ranking; <em>n/d</em> means no figure is stated here because none is reliable. Country is domicile of listing, which frequently differs from where the production risk actually sits. Inclusion maps exposure to the layer; it is not a buy recommendation. Read the bull and bear columns together.</p></div>
      <div class="layer-pane" data-mode-pane="sources">${sourcePane(L.n)}</div>
    </div>
  </div>`;
  panels.appendChild(p);
  const modes=[...p.querySelectorAll('.layer-mode')];
  modes.forEach((mode,j)=>{
    mode.onclick=()=>selectLayerMode(p,mode.dataset.mode);
    mode.onkeydown=e=>{
      if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();modes[(j+1)%modes.length].click();modes[(j+1)%modes.length].focus()}
      if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();modes[(j-1+modes.length)%modes.length].click();modes[(j-1+modes.length)%modes.length].focus()}
    };
  });
});

function selectLayerMode(panel,mode){
  panel.querySelectorAll('.layer-mode').forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===mode?'true':'false'));
  panel.querySelectorAll('[data-mode-pane]').forEach(v=>v.classList.toggle('on',v.dataset.modePane===mode));
  fill();
}
function sel(i,focus){
  document.querySelectorAll('#rail .tab').forEach((t,j)=>{
    const on=j===i; t.setAttribute('aria-selected',on?'true':'false');
    const col=j>0&&LAYERS[j-1]?C[LAYERS[j-1].n]:'var(--accent)';
    t.style.borderLeftColor=on?col:'transparent';
    t.style.borderBottomColor=on?col:'transparent';});
  document.querySelectorAll('#panels .panel').forEach((p,j)=>{p.classList.toggle('on',j===i); p.hidden=j!==i});
  if(focus) document.getElementById('tb'+i).focus();
  fill();
}

document.getElementById('mats').innerHTML=MATS.map(m=>
 `<div class="mat" style="border-top:3px solid ${m.c}"><h4>${m.t}</h4><div class="big num" style="color:${m.c}">${m.big}</div><p>${m.d}</p><div class="src">${m.s}</div></div>`).join('');
document.getElementById('mattable').innerHTML=tbl(MATTBL);
document.getElementById('riskgrid').innerHTML=RISKS.map(r=>`<div class="risk"><h4>${r.t}</h4><p>${r.d}</p></div>`).join('');

document.getElementById('gw-facts').innerHTML=factgrid(GW.facts);
document.getElementById('gw-capex').innerHTML=bars(GW.capex);
document.getElementById('gw-lead').innerHTML=bars(GW.lead);
document.getElementById('gw-land').innerHTML=bars(GW.land);
[['gw-fac',GW.fac],['gw-bom1',GW.bom1],['gw-bom2',GW.bom2],['gw-energy',GW.energy],['gw-be',GW.be],
 ['gw-util',GW.util],['gw-mkt',GW.mkt],['gw-verdict',GW.verdict],['gw-lab',GW.lab],['gw-cap',GW.cap],['gw-proj',GW.proj]]
 .forEach(([id,d])=>document.getElementById(id).innerHTML=tbl(d));
document.getElementById('gw-phase').innerHTML=GW.phase.map(p=>
 `<div class="ph-t">${p[0]} mo</div><div class="ph-d"><b>${p[1]}</b>${p[2]?`<span>${p[2]}</span>`:''}</div>`).join('');

document.getElementById('hu-facts').innerHTML=factgrid(HU.facts);
document.getElementById('hu-cap').innerHTML=bars(HU.cap);
document.getElementById('hu-bom').innerHTML=bars(HU.bom);
document.getElementById('hu-data').innerHTML=bars(HU.data);
document.getElementById('hu-ramp').innerHTML=bars(HU.ramp);
[['hu-layers',HU.layers],['hu-comp',HU.comp],['hu-cost',HU.cost],['hu-batt',HU.batt],
 ['hu-edge',HU.edge],['hu-eng',HU.eng],['hu-econ',HU.econ],['hu-rank',HU.rank]]
 .forEach(([id,d])=>document.getElementById(id).innerHTML=tbl(d));
document.getElementById('hu-co').innerHTML=cotbl(HU.co,7);
[['gw-risk',GW.risk],['gw-gate',GW.gate],['hu-deploy',HU.deploy]]
 .forEach(([id,d])=>document.getElementById(id).innerHTML=tbl(d));
const deepHTML=a=>a.map(d=>`<div><h5>${d[0]}</h5><p>${d[1]}</p></div>`).join('');
document.getElementById('gw-deep').innerHTML=deepHTML(GW.deep);
document.getElementById('hu-deep').innerHTML=deepHTML(HU.deep);

// Project tabs — each long report is split into viewport-sized chapters at runtime.
const PROJECTS=['gw','hu'];
PROJECTS.forEach((k,i)=>{
  const b=document.getElementById('pt-'+k);
  b.onclick=()=>selProject(i);
  b.onkeydown=e=>{
    if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();selProject((i+1)%PROJECTS.length,1)}
    if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();selProject((i-1+PROJECTS.length)%PROJECTS.length,1)}};
});
function selProject(i,focus){
  PROJECTS.forEach((k,j)=>{
    document.getElementById('pt-'+k).setAttribute('aria-selected', i===j?'true':'false');
    const p=document.getElementById('pj-'+k);
    p.classList.toggle('on', i===j); p.hidden=i!==j;
  });
  if(focus) document.getElementById('pt-'+PROJECTS[i]).focus();
  fill();
}

const CHAPTER_LABELS={
  gw:['Brief','Capital','Schedule','Bill of materials','Power options','Economics','Labour + market','Risk gates','Thesis','Sources'],
  hu:['Brief','Fleet stack','Bottleneck','Cost curve','Battery + edge','Data flywheel','Capital + energy','Timeline','Deployment','Failure cases','Sources']
};
function buildProjectChapters(panel,key){
  const nodes=[...panel.children], groups=[];
  let current={title:'Brief',nodes:[]};
  nodes.forEach(node=>{
    if(node.matches&&node.matches('h3.blockhead')){
      if(current.nodes.length) groups.push(current);
      current={title:node.textContent.trim(),nodes:[node]};
    }else current.nodes.push(node);
  });
  if(current.nodes.length) groups.push(current);
  const nav=document.createElement('div');
  nav.className='project-chapter-nav'; nav.setAttribute('role','tablist'); nav.setAttribute('aria-label','Project chapters');
  const wrap=document.createElement('div'); wrap.className='project-chapters';
  groups.forEach((group,i)=>{
    const short=(CHAPTER_LABELS[key]||[])[i]||group.title;
    const button=document.createElement('button');
    button.className='chapter-tab'; button.type='button'; button.textContent=short;
    button.setAttribute('aria-selected',i===0?'true':'false'); button.dataset.chapter=i;
    nav.appendChild(button);
    const chapter=document.createElement('section'); chapter.className='project-chapter'+(i===0?' on':'');
    chapter.dataset.chapterPane=i; chapter.setAttribute('aria-label',group.title);
    group.nodes.forEach(n=>chapter.appendChild(n)); wrap.appendChild(chapter);
  });
  panel.replaceChildren(nav,wrap);
  const tabs=[...nav.querySelectorAll('.chapter-tab')];
  tabs.forEach((tab,i)=>{
    tab.onclick=()=>selectProjectChapter(panel,i);
    tab.onkeydown=e=>{
      if(['ArrowRight','ArrowDown'].includes(e.key)){e.preventDefault();const n=(i+1)%tabs.length;selectProjectChapter(panel,n);tabs[n].focus()}
      if(['ArrowLeft','ArrowUp'].includes(e.key)){e.preventDefault();const n=(i-1+tabs.length)%tabs.length;selectProjectChapter(panel,n);tabs[n].focus()}
    };
  });
}
function selectProjectChapter(panel,index){
  panel.querySelectorAll('.chapter-tab').forEach((b,i)=>b.setAttribute('aria-selected',i===index?'true':'false'));
  panel.querySelectorAll('.project-chapter').forEach((c,i)=>{c.classList.toggle('on',i===index); if(i===index)c.scrollTop=0});
  fill();
}
buildProjectChapters(document.getElementById('pj-gw'),'gw');
buildProjectChapters(document.getElementById('pj-hu'),'hu');

function fill(){
  document.querySelectorAll('.fl').forEach(f=>{
    const p=f.closest('.panel');
    if(p&&p.hidden) return;
    if(f.getBoundingClientRect().top<window.innerHeight+250) f.style.width=f.dataset.w+'%';
  });
}
window.addEventListener('scroll',fill,{passive:true});
window.addEventListener('resize',fill); fill();

// Deep links into a single layer. The overview map links here as
// stack.html#layer-4, and selecting a layer writes the hash back so the tab is
// shareable and survives a reload. Layer n sits at index n-1 in LAYERS.
(function(){
  const tabs=[...document.querySelectorAll('#rail .tab')];
  if(!tabs.length) return;
  const indexFromHash=()=>{
    const m=/^#layer-(\d+)$/.exec(location.hash);
    if(!m) return -1;
    if(+m[1]===0) return 0;                       // the physical world leads the rail
    const k=LAYERS.findIndex(L=>L.n===+m[1]);
    return k<0?-1:k+1;
  };
  const apply=()=>{
    const i=indexFromHash();
    if(i<0) return;
    sel(i);
    tabs[i].scrollIntoView({block:'nearest',inline:'nearest'});
  };
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{
    history.replaceState(null,'','#layer-'+(i===0?0:LAYERS[i-1].n));
  }));
  window.addEventListener('hashchange',apply);
  apply();
})();

// Multi-page navigation. Each view now lives on its own page, so the nav is a
// set of plain links and the former in-page view switcher is no longer needed.
// The per-page section is rendered by the markup itself; `fill()` still runs so
// the bar fills animate in on load.
fill();



/* ══════════════════════════════════════════════════════════════════════════
   V3 — theme controller and inline SVG chart system
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  const root=document.documentElement, btn=document.getElementById('theme-toggle');
  const meta=document.querySelector('meta[name="theme-color"]');
  const paint=t=>{ root.setAttribute('data-theme',t);
    if(btn) btn.setAttribute('aria-label', t==='dark'?'Switch to light mode':'Switch to dark mode');
    const lbl=btn&&btn.querySelector('.tt-label'); if(lbl) lbl.textContent = t==='dark'?'Dark':'Light';
    if(meta) meta.setAttribute('content', t==='dark'?'#0F1319':'#F6F7F9'); };
  paint(root.getAttribute('data-theme')||'light');
  if(btn) btn.onclick=()=>{ const next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    paint(next); try{localStorage.setItem('rtagi-theme',next)}catch(e){} };
})();

const CX=(function(){
  const N=(v,d=0)=>Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const wrap=(vb,inner,label)=>`<svg viewBox="${vb}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
  const shell=(o,body)=>`<figure class="cw"><h4>${o.t}</h4>${o.q?`<p class="cq">${o.q}</p>`:''}${body}`+
      `${o.legend?`<div class="legend">${o.legend}</div>`:''}`+
      `${o.note?`<figcaption class="cnote">${o.note}</figcaption>`:''}</figure>`;
  const key=items=>items.map(i=>`<span><i style="background:${i.c}"></i>${i.l}</span>`).join('');

  /* ── donut ─────────────────────────────────────────────────────────── */
  function donut(o){
    const W=520,H=250,cx=125,cy=125,R=100,r=60;
    const tot=o.data.reduce((s,d)=>s+d.v,0); let a=-Math.PI/2, paths='';
    o.data.forEach(d=>{
      const sw=d.v/tot*Math.PI*2, e=a+sw, big=sw>Math.PI?1:0;
      const p=(rad,ang)=>[cx+rad*Math.cos(ang),cy+rad*Math.sin(ang)];
      const[x1,y1]=p(R,a),[x2,y2]=p(R,e),[x3,y3]=p(r,e),[x4,y4]=p(r,a);
      paths+=`<path class="seg" d="M${x1.toFixed(1)} ${y1.toFixed(1)} A${R} ${R} 0 ${big} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L${x3.toFixed(1)} ${y3.toFixed(1)} A${r} ${r} 0 ${big} 0 ${x4.toFixed(1)} ${y4.toFixed(1)} Z" fill="${d.c}"><title>${esc(d.l)}: ${esc(d.vl||N(d.v))}</title></path>`;
      a=e;
    });
    let rows=o.data.map((d,i)=>{
      const y=30+i*32;
      return `<rect x="266" y="${y-10}" width="11" height="11" rx="3" fill="${d.c}"/>`+
        `<text class="cs2" x="285" y="${y}">${esc(d.l)}</text>`+
        `<text class="cv" x="520" y="${y}" text-anchor="end">${esc(d.vl||N(d.v))}</text>`+
        (String(d.vl||'').trim().endsWith('%')?'':`<text class="cs" x="520" y="${y+13}" text-anchor="end">${(d.v/tot*100).toFixed(1)}%</text>`);
    }).join('');
    const inner=paths+
      `<text class="ct" x="${cx}" y="${cy-2}" text-anchor="middle" style="font-size:24px">${esc(o.centre[0])}</text>`+
      `<text class="cs" x="${cx}" y="${cy+18}" text-anchor="middle">${esc(o.centre[1])}</text>`+rows;
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── 100% stacked comparison bars ──────────────────────────────────── */
  function stack100(o){
    const W=720,rowH=64,H=o.rows.length*rowH+34;
    let inner='',ky=[];
    o.rows.forEach((row,i)=>{
      const y=i*rowH+16, tot=row.segs.reduce((s,d)=>s+d.v,0); let x=138;
      inner+=`<text class="cs2" x="0" y="${y+22}">${esc(row.label)}</text>`+
             `<text class="cs" x="0" y="${y+38}">${esc(row.sub||'')}</text>`;
      row.segs.forEach(d=>{
        const w=d.v/tot*(W-138);
        inner+=`<rect class="seg" x="${x.toFixed(1)}" y="${y}" width="${Math.max(w,0).toFixed(1)}" height="30" fill="${d.c}"><title>${esc(d.l)}: ${esc(d.vl||N(d.v))}</title></rect>`;
        if(w>44) inner+=`<text x="${(x+w/2).toFixed(1)}" y="${y+19}" text-anchor="middle" style="fill:var(--on-layer);font:600 10.5px var(--f)">${(d.v/tot*100).toFixed(0)}%</text>`;
        x+=w;
        if(i===0) ky.push({l:d.l,c:d.c});
      });
      inner+=`<text class="cv" x="138" y="${y+46}">${esc(row.totalLabel||'')}</text>`;
    });
    return shell(Object.assign({},o,{legend:key(o.key||ky)}),wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── multi-series line chart ───────────────────────────────────────── */
  function lines(o){
    const W=720,H=300,L=58,R=14,T=16,B=52, pw=W-L-R, ph=H-T-B;
    const lg=!!o.log, ymin=o.y.min, ymax=o.y.max;
    const py=v=>{ const f=lg?(Math.log10(v)-Math.log10(ymin))/(Math.log10(ymax)-Math.log10(ymin))
      :(v-ymin)/(ymax-ymin); return T+ph-f*ph; };
    const px=i=>L+(o.x.length===1?pw/2:i*pw/(o.x.length-1));
    let inner='';
    o.y.ticks.forEach(t=>{ const y=py(t).toFixed(1);
      inner+=`<line class="gr" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/>`+
             `<text class="cs" x="${L-8}" y="${(+y+3.5).toFixed(1)}" text-anchor="end">${esc(o.y.fmt?o.y.fmt(t):N(t))}</text>`; });
    inner+=`<line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${T+ph}"/><line class="ax" x1="${L}" y1="${T+ph}" x2="${W-R}" y2="${T+ph}"/>`;
    o.x.forEach((lab,i)=>inner+=`<text class="cs" x="${px(i).toFixed(1)}" y="${T+ph+18}" text-anchor="middle">${esc(lab)}</text>`);
    (o.marks||[]).forEach(m=>{ const y=py(m.y).toFixed(1);
      inner+=`<line class="cmk" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/>`+
             `<text class="cmk-t" x="${W-R}" y="${(+y-5).toFixed(1)}" text-anchor="end">${esc(m.label)}</text>`; });
    o.series.forEach(s=>{
      const d=s.v.map((v,i)=>`${i?'L':'M'}${px(i).toFixed(1)} ${py(v).toFixed(1)}`).join(' ');
      inner+=`<path d="${d}" fill="none" stroke="${s.c}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${s.dash?' stroke-dasharray="5 4"':''}/>`;
      s.v.forEach((v,i)=>inner+=`<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="3.4" fill="${s.c}"><title>${esc(s.n)} · ${esc(o.x[i])}: ${esc(o.y.fmt?o.y.fmt(v):N(v))}</title></circle>`);
    });
    if(o.y.title) inner+=`<text class="cs" x="0" y="${T-4}">${esc(o.y.title)}</text>`;
    if(o.x.title) inner+=`<text class="cs" x="${W-R}" y="${H-8}" text-anchor="end">${esc(o.x.title)}</text>`;
    return shell(Object.assign({},o,{legend:key(o.series.map(s=>({l:s.n,c:s.c})))}),wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── bubble scatter ────────────────────────────────────────────────── */
  function scatter(o){
    const W=720,H=356,L=66,R=26,T=40,B=54, pw=W-L-R, ph=H-T-B;
    const px=v=>L+(v-o.x.min)/(o.x.max-o.x.min)*pw;
    const py=v=>T+ph-(v-o.y.min)/(o.y.max-o.y.min)*ph;
    let inner='';
    o.y.ticks.forEach(t=>{ const y=py(t).toFixed(1);
      inner+=`<line class="gr" x1="${L}" y1="${y}" x2="${W-R}" y2="${y}"/><text class="cs" x="${L-8}" y="${(+y+3.5).toFixed(1)}" text-anchor="end">${esc(o.y.fmt?o.y.fmt(t):t)}</text>`; });
    o.x.ticks.forEach(t=>{ const x=px(t).toFixed(1);
      inner+=`<line class="gr" x1="${x}" y1="${T}" x2="${x}" y2="${T+ph}"/><text class="cs" x="${x}" y="${T+ph+18}" text-anchor="middle">${esc(o.x.fmt?o.x.fmt(t):t)}</text>`; });
    inner+=`<line class="ax" x1="${L}" y1="${T}" x2="${L}" y2="${T+ph}"/><line class="ax" x1="${L}" y1="${T+ph}" x2="${W-R}" y2="${T+ph}"/>`;
    o.points.forEach(p=>{
      const x=px(p.x),y=py(p.y);
      inner+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${p.r}" fill="${p.c}" fill-opacity=".22" stroke="${p.c}" stroke-width="1.6"><title>${esc(p.l)} — ${esc(p.tip||'')}</title></circle>`+
        `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3" fill="${p.c}"/>`+
        (()=>{ const off=(p.ly!==undefined?p.ly:-p.r-8), lx=x+(p.lx||0), an=p.an||'middle',
                 my=off<0?off-13:off, sy=off<0?off:off+12;
          return `<text class="cs2" x="${lx.toFixed(1)}" y="${(y+my).toFixed(1)}" text-anchor="${an}">${esc(p.l)}</text>`+
            (p.sub?`<text class="cs" x="${lx.toFixed(1)}" y="${(y+sy).toFixed(1)}" text-anchor="${an}">${esc(p.sub)}</text>`:''); })();
    });
    inner+=`<text class="cs" x="${W-R}" y="${H-8}" text-anchor="end">${esc(o.x.title)}</text>`+
           `<text class="cs" x="0" y="${T-5}">${esc(o.y.title)}</text>`;
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── tornado / sensitivity ─────────────────────────────────────────── */
  function tornado(o){
    const W=720,rowH=52,L=178,R=16,T=26,H=o.rows.length*rowH+T+52, pw=W-L-R;
    const px=v=>L+(v-o.x.min)/(o.x.max-o.x.min)*pw;
    let inner='';
    o.x.ticks.forEach(t=>{ const x=px(t).toFixed(1);
      inner+=`<line class="gr" x1="${x}" y1="${T-8}" x2="${x}" y2="${T+o.rows.length*rowH}"/>`+
             `<text class="cs" x="${x}" y="${T+o.rows.length*rowH+18}" text-anchor="middle">$${t.toFixed(2)}</text>`; });
    const bx=px(o.base).toFixed(1);
    inner+=`<line class="ax" x1="${bx}" y1="${T-14}" x2="${bx}" y2="${T+o.rows.length*rowH}" stroke-width="1.6"/>`+
           `<text class="cs2" x="${bx}" y="${T-20}" text-anchor="middle">base $${o.base.toFixed(2)}</text>`;
    (o.marks||[]).forEach((m,i)=>{ const x=px(m.x).toFixed(1);
      inner+=`<line class="cmk" x1="${x}" y1="${T-8}" x2="${x}" y2="${T+o.rows.length*rowH}"/>`+
             `<text class="cmk-t" x="${x}" y="${T+o.rows.length*rowH+32+i*14}" text-anchor="${i%2?'start':'end'}">${esc(m.label)}</text>`; });
    o.rows.forEach((r,i)=>{
      const y=T+i*rowH+9, x1=px(Math.min(r.lo,r.hi)), x2=px(Math.max(r.lo,r.hi));
      inner+=`<text class="cs2" x="0" y="${y+16}">${esc(r.l)}</text>`+
             `<text class="cs" x="0" y="${y+30}">${esc(r.sub||'')}</text>`+
             `<rect x="${x1.toFixed(1)}" y="${y}" width="${(x2-x1).toFixed(1)}" height="22" rx="4" fill="${r.c}" fill-opacity=".78"><title>${esc(r.l)}: $${Math.min(r.lo,r.hi).toFixed(2)} to $${Math.max(r.lo,r.hi).toFixed(2)}</title></rect>`+
             `<text class="cv" x="${(x1-6).toFixed(1)}" y="${y+16}" text-anchor="end">${esc(r.loL)}</text>`+
             `<text class="cv" x="${(x2+6).toFixed(1)}" y="${y+16}">${esc(r.hiL)}</text>`;
    });
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── gantt / sequence ──────────────────────────────────────────────── */
  function gantt(o){
    const W=720,rowH=26,L=196,R=14,T=24,H=o.rows.length*rowH+T+38, pw=W-L-R;
    const px=v=>L+v/o.max*pw;
    let inner='';
    for(let m=0;m<=o.max;m+=12){ const x=px(m).toFixed(1);
      inner+=`<line class="gr" x1="${x}" y1="${T-10}" x2="${x}" y2="${T+o.rows.length*rowH}"/>`+
             `<text class="cs" x="${x}" y="${T-16}" text-anchor="middle">${m===0?'month 0':'m'+m}</text>`; }
    o.rows.forEach((r,i)=>{
      const y=T+i*rowH+4, x1=px(r.a), x2=px(r.b);
      inner+=`<text class="${r.strong?'cs2':'cs'}" x="0" y="${y+13}">${esc(r.l)}</text>`+
             `<rect x="${x1.toFixed(1)}" y="${y}" width="${Math.max(x2-x1,3).toFixed(1)}" height="15" rx="3.5" fill="${r.c}" fill-opacity="${r.kind==='lead'?'.95':'.62'}"><title>${esc(r.l)}: month ${r.a} to ${r.b}</title></rect>`+
             (r.tag?(x2>L+pw*0.86
               ?`<text class="cs" x="${(x2-7).toFixed(1)}" y="${y+12}" text-anchor="end" style="fill:var(--on-layer)">${esc(r.tag)}</text>`
               :`<text class="cs" x="${(x2+6).toFixed(1)}" y="${y+12}">${esc(r.tag)}</text>`):'');
    });
    (o.marks||[]).forEach(m=>{ const x=px(m.x).toFixed(1);
      inner+=`<line class="cmk" x1="${x}" y1="${T-10}" x2="${x}" y2="${T+o.rows.length*rowH+6}"/>`+
             `<text class="cmk-t" x="${x}" y="${T+o.rows.length*rowH+22}" text-anchor="${m.an||'middle'}">${esc(m.label)}</text>`; });
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }

  /* ── simple share bars, used for concentration profiles ────────────── */
  function shareBars(o){
    const W=720,rowH=30,H=o.rows.length*rowH+18,LM=312,R=58,pw=W-LM-R;
    const mx=o.max||Math.max(100,...o.rows.map(r=>r.v));
    let inner='';
    o.rows.forEach((r,i)=>{
      const y=i*rowH+8, w=r.v/mx*pw;
      inner+=`<text class="cs2" x="0" y="${y+14}">${esc(r.l)}</text>`+
        `<rect x="${LM}" y="${y+3}" width="${pw}" height="13" rx="4" fill="var(--track)"/>`+
        `<rect x="${LM}" y="${y+3}" width="${Math.max(w,2).toFixed(1)}" height="13" rx="4" fill="${r.c||o.c}"><title>${esc(r.l)}: ${esc(r.vl||r.v)}</title></rect>`+
        `<text class="cv" x="${W}" y="${y+14}" text-anchor="end">${esc(r.vl!==undefined?r.vl:r.v+'%')}</text>`;
    });
    return shell(o,wrap(`0 0 ${W} ${H}`,inner,o.t));
  }
  return {donut,stack100,lines,scatter,tornado,gantt,shareBars,N,key,shell,wrap};
})();

const LC=n=>`var(--l${n})`;
const put=(id,html)=>{const el=document.getElementById(id); if(el) el.innerHTML=html;};

/* ───────── Gigawatt project charts ───────── */
put('cx-tco',CX.stack100({
  t:'Upfront capital against annualised lifetime cost',
  q:'Does the balance change once the asset is running? Barely — and that is the finding.',
  rows:[
    {label:'Upfront capital',sub:'$37.9bn',totalLabel:'',segs:[
      {l:'Servers',v:21188,c:LC(4)},{l:'Facility',v:11433,c:LC(1)},{l:'Network',v:4925,c:LC(5)},
      {l:'Energy and operations',v:0,c:LC(6)},{l:'Land and utility works',v:336,c:LC(8)}]},
    {label:'Annualised total cost',sub:'$8.51bn per year',totalLabel:'',segs:[
      {l:'Servers',v:5021,c:LC(4)},{l:'Facility',v:1387,c:LC(1)},{l:'Network',v:1167,c:LC(5)},
      {l:'Energy and operations',v:897,c:LC(6)},{l:'Land and utility works',v:39,c:LC(8)}]}],
  note:'Servers move from 56% of the cheque to 59% of the annual cost. Energy — the input every headline is about — is 7% of the annual bill and zero of the upfront one. Source: Epoch AI, May 2026; operations line aggregates energy, taxes, maintenance, labour and water.'
}));

put('cx-lead-gantt',CX.gantt({
  t:'Sequence and lead times, drawn from the same month zero',
  q:'Which activity, started today, finishes last? Not the building.',
  max:66,
  rows:[
    {l:'Long-lead equipment orders',a:0,b:3,c:LC(1),kind:'lead',strong:1,tag:'must be first'},
    {l:'Site and power strategy',a:0,b:12,c:LC(8)},
    {l:'Permitting and entitlement',a:6,b:24,c:LC(8)},
    {l:'Site works and foundations',a:12,b:24,c:LC(8)},
    {l:'Shell construction',a:18,b:36,c:LC(8),tag:'18 months'},
    {l:'Electrical installation',a:24,b:42,c:LC(1)},
    {l:'Mechanical and cooling',a:26,b:44,c:LC(6)},
    {l:'Commissioning, levels 1–5',a:40,b:52,c:LC(5)},
    {l:'IT fit-out and burn-in',a:42,b:60,c:LC(4)},
    {l:'— large power transformer',a:0,b:29.5,c:LC(1),kind:'lead',tag:'128 wks'},
    {l:'— generator step-up units',a:0,b:37,c:LC(1),kind:'lead',tag:'160 wks'},
    {l:'— heavy-duty gas turbine',a:0,b:60,c:LC(2),kind:'lead',strong:1,tag:'2031 slot'}],
  marks:[{x:66,label:'first token, month 48–66',an:'end'},{x:36,label:'accelerated path, 30–40 months'}],
  note:'Bars below the rule are equipment lead times converted to months from a mid-2026 order, drawn from the same month-zero start as the construction sequence. The turbine, not the concrete, sets the date. Lead times are 2026 published figures and are changing.'
}));

put('cx-energy-scatter',CX.scatter({
  t:'Energy options: what you pay, and how long you wait',
  q:'Bubble area is land taken. The cheapest option is the one you cannot get; the fastest cannot run at night.',
  x:{min:0,max:8,ticks:[0,2,4,6,8],title:'years to firm power →',fmt:t=>t+'y'},
  y:{min:-1,max:13,ticks:[0,3,6,9,12],title:'generation capex, $bn',fmt:t=>'$'+t+'bn'},
  points:[
    {x:6,y:0,r:6,c:LC(5),l:'Grid',sub:'no capex · 5–7 yr queue',ly:-2,an:'end',lx:-16,tip:'$0 capex, land 0 km², ~$594m a year'},
    {x:6,y:1,r:9,c:LC(1),l:'Gas CCGT',sub:'0.3 km² · turbine slot gated',ly:-26,tip:'~$1.0bn capex, $285–530m a year'},
    {x:2.5,y:11.5,r:36,c:LC(7),l:'Solar + storage',sub:'~110 km² · not firm alone',ly:52,tip:'~$11–12bn capex, ~110 km² of land'},
    {x:7.5,y:9,r:12,c:LC(3),l:'Nuclear AP1000',sub:'~1.5 km² · 7+ years',ly:-6,an:'end',lx:-18,tip:'~$9.0bn capex, $570–1,280m a year'}],
  note:'Solar sized for genuine round-the-clock firmness needs roughly fourfold overbuild plus overnight storage — about ninety times the land of the campus it serves. Energy choice moves annual cost by a few hundred million on an $8.5bn total; it moves the schedule by years.'
}));

put('cx-tornado',CX.tornado({
  t:'What actually moves the break-even price',
  q:'Break-even $ per GPU-hour at a 12% hurdle. Each bar is the full range across the assumption tested, holding everything else at base.',
  base:3.19,x:{min:2.0,max:6.4,ticks:[2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0]},
  rows:[
    {l:'Utilisation rate',sub:'90% → 50%',lo:2.56,hi:4.45,c:LC(1),loL:'$2.56',hiL:'$4.45'},
    {l:'IT equipment life',sub:'7 years → 3 years',lo:2.70,hi:4.36,c:LC(4),loL:'$2.70',hiL:'$4.36'},
    {l:'Energy source',sub:'gas → nuclear',lo:3.13,hi:3.32,c:LC(6),loL:'$3.13',hiL:'$3.32'}],
  marks:[{x:3.49,label:'cheapest contract $3.49'},{x:4.26,label:'spot median $4.26'}],
  note:'Depreciation swings the answer 8.7 times harder than the energy source. Stated honestly, utilisation across the range tested is wider still — and it is the variable that moves first if demand softens. The energy debate that dominates commentary is the narrowest bar on the chart. All three are drawn from the same model; 3-year and 5-year cases both sit above the cheapest contracted price.'
}));

put('cx-util-lines',CX.lines({
  t:'Break-even against utilisation, by assumed server life',
  q:'At what occupancy does each depreciation assumption clear the market?',
  x:['50%','60%','71%','80%','90%'],
  y:{min:2,max:6.5,ticks:[2,3,4,5,6],title:'$ per GPU-hour',fmt:t=>'$'+t.toFixed(2)},
  series:[
    {n:'3-year life',v:[6.10,5.12,4.36,3.89,3.48],c:LC(3)},
    {n:'5-year life',v:[4.45,3.74,3.19,2.85,2.56],c:LC(4)},
    {n:'7-year life',v:[3.75,3.16,2.70,2.42,2.17],c:LC(6)}],
  marks:[{y:3.49,label:'cheapest custom contract, $3.49'},{y:4.26,label:'spot median, $4.26'}],
  note:'The 3-year line never crosses below the contract floor at any plausible utilisation. The 5-year line clears it only above roughly 65% occupancy. Break-even includes a 12% return on capital; market reference prices are B200 rates at 1 September 2026.'
}));

put('cx-capstack',CX.stack100({
  t:'Two capital structures, one asset',
  q:'Same building, same chips, different survival odds. The discount rate should not be the same.',
  key:[{l:'Equity and operating cash flow',c:LC(6)},{l:'Project debt and private credit',c:LC(4)},{l:'GPU-collateralised debt',c:LC(3)}],
  rows:[
    {label:'Hyperscaler-funded',sub:'balance-sheet capex',segs:[
      {l:'Equity and operating cash flow',v:75,c:LC(6)},{l:'Project debt and private credit',v:25,c:LC(4)},{l:'GPU-collateralised debt',v:0,c:LC(3)}]},
    {label:'Neocloud-funded',sub:'levered SPV',segs:[
      {l:'Equity and operating cash flow',v:20,c:LC(6)},{l:'Project debt and private credit',v:45,c:LC(4)},{l:'GPU-collateralised debt',v:35,c:LC(3)}]}],
  note:'ILLUSTRATIVE — midpoints chosen inside the disclosed ranges in the table above to show the shape of the difference, not a survey of actual deals. The structural point is not a percentage: a representative neocloud carries five-year loans against three-year customer contracts and fifteen-year leases, secured on an asset whose useful life is the single most contested assumption in the project.'
}));

/* ───────── Humanoid project charts ───────── */
put('cx-bom-donut',CX.donut({
  t:'Where the cost sits in one humanoid',
  q:'A mechatronics problem with an AI feature, not the reverse.',
  centre:['~50%','actuation'],
  data:[{l:'Actuators and joints',v:50,c:LC(7),vl:'50%'},{l:'Sensors and perception',v:33,c:LC(5),vl:'33%'},{l:'Hands and manipulation',v:17,c:LC(3),vl:'17%'}],
  note:'Morgan Stanley\u2019s teardown of an Optimus Gen 2-class robot put actuators at roughly 56% of a ~$55,000 bill of materials; independent 2026 estimates place high-precision joint actuators at 40–55% of hardware cost. Shares are analyst estimates, not disclosures.'
}));

put('cx-ramp',CX.lines({
  t:'The ramp required to reach ten million units',
  q:'What has to be true, year by year, for the fleet to exist?',
  x:['2026','2028','2030','2032','2034'],
  y:{min:0.01,max:20,ticks:[0.01,0.1,1,10],title:'cumulative units, log scale',fmt:t=>t<1?(t*1000).toFixed(0)+'k':t+'m'},log:true,
  series:[
    {n:'Annual production',v:[0.02,0.08,0.32,1.28,5.12],c:LC(5),dash:true},
    {n:'Cumulative fleet',v:[0.02,0.14,0.62,2.54,10.22],c:LC(7)}],
  marks:[{y:10,label:'10 million cumulative'}],
  note:'DERIVED — sustained 100% annual production growth applied to a 2026 base of roughly 20,000 units. Reaching the threshold requires doubling output every year for nine consecutive years. No hardware industry has sustained that, and none faced a component whose supply chain must grow fiftyfold.'
}));

put('cx-bottleneck',CX.scatter({
  t:'Bottleneck map: how bad, and how long to fix',
  q:'Position, not rank. Anything in the upper right is a decade-scale constraint, not a supply squeeze.',
  x:{min:0,max:13,ticks:[0,3,6,9,12],title:'years to relieve →',fmt:t=>t+'y'},
  y:{min:0,max:5.6,ticks:[1,2,3,4,5],title:'severity, 1 low → 5 high',fmt:t=>String(t)},
  points:[
    {x:10,y:5,r:22,c:LC(7),l:'Precision reducers',sub:'~50× expansion',ly:-32,tip:'8–12 years to relieve'},
    {x:11.5,y:4.6,r:16,c:LC(1),l:'Rare earth magnets',sub:'political, not industrial',ly:24,an:'middle',lx:0,tip:'13% of world output, export-controlled'},
    {x:8,y:4.3,r:14,c:LC(3),l:'Manipulation and tactile',sub:'research-dependent',ly:-22,tip:'Unsolved for unstructured work'},
    {x:4,y:3.4,r:12,c:LC(5),l:'Edge inference',sub:'3–5 years',ly:-22,tip:'Models outpace deployable hardware'},
    {x:1.5,y:3.9,r:11,c:LC(4),l:'Training data',sub:'self-resolving above 1m units',ly:-18,an:'end',lx:-16,tip:'Severe below 1m units'},
    {x:3,y:2.4,r:9,c:LC(6),l:'Battery runtime',sub:'workarounds exist',ly:22,tip:'Architectural, not chemical'},
    {x:7,y:2.0,r:9,c:LC(8),l:'Maintenance trade',sub:'5–10 years',ly:22,tip:'A trade that does not yet exist'},
    {x:1,y:1.0,r:7,c:LC(8),l:'Fleet electricity',sub:'not a constraint',ly:20,an:'start',lx:-6,tip:'~0.5% of US consumption'}],
  note:'Severity scores are the author\u2019s ranking, positioned against the time-to-relieve estimates in the table below. The reducer capacity denominator behind the fiftyfold figure is a derivation from industrial robot installation volumes, not a disclosed statistic, and is the single number here most in need of primary-source verification.'
}));

put('cx-energy-cmp',CX.shareBars({
  t:'Fleet energy in context',
  q:'Ten million robots against the infrastructure that trains them.',c:LC(7),
  max:100,
  rows:[
    {l:'Supporting AI training compute, 3–5 GW',v:100,vl:'~26 TWh',c:LC(4)},
    {l:'10m humanoid fleet, all charging',v:78,vl:'20.4 TWh',c:LC(7)},
    {l:'One 1 GW data centre',v:27,vl:'7.1 TWh',c:LC(5)},
    {l:'Fleet on-board compute, distributed',v:16,vl:'~1.3 GW',c:LC(8)}],
  note:'DERIVED — annual terawatt-hours, scaled to the largest bar. The 3–5 GW training estimate is converted at the same 71% utilisation used in the gigawatt model. The whole fleet is roughly 0.5% of US electricity consumption, or 2.9 gigawatt-scale data centres. Compute is energy-intensive; physical work is not. The grid strain from AI comes from training and inference, not from embodiment — the charging load is spread across thousands of facilities and looks like ordinary industrial load growth.'
}));

/* Horizontal bars are width-animated on reveal; make that robust across the
   three view tabs, the layer rail and the runtime-generated project chapters. */
const fillAll=()=>document.querySelectorAll('.fl').forEach(f=>{ if(f.dataset.w) f.style.width=f.dataset.w+'%'; });
fillAll();
document.addEventListener('click',()=>{requestAnimationFrame(fillAll); setTimeout(fillAll,60)},true);
window.addEventListener('hashchange',()=>setTimeout(fillAll,60));

/* ───────── Static diagrams built for this report ───────── */

/* Capital flow: $37.9bn, with the facility line exploded onto its own scale */
(function(){
  const el=document.getElementById('cx-sankey'); if(!el) return;
  const W=720,H=372,T=24,BH=300;
  const mid=[{l:'Servers',v:21188,c:LC(4)},{l:'Facility',v:11433,c:LC(1)},
             {l:'Network infrastructure',v:4925,c:LC(5)},{l:'Land and utility works',v:336,c:LC(8)}];
  const sub=[{l:'Electrical infrastructure',v:4875},{l:'Cooling systems',v:2300},
             {l:'Building shell and envelope',v:1425},{l:'Fire, security, controls',v:1150},
             {l:'Design, PM, contingency',v:1113},{l:'Site works and roads',v:570}];
  const tot=mid.reduce((s,d)=>s+d.v,0), k=BH/tot, gap=4;
  const x0=6,x1=34,x2=252,x3=280,x4=470,x5=498;
  let g='',y=T, nodes=[];
  g+=`<rect x="${x0}" y="${T}" width="${x1-x0}" height="${BH}" rx="3" fill="var(--ink2)"/>`;
  g+=`<text class="cs2" x="${x0}" y="${T-8}">Total upfront capital</text>`;
  g+=`<text class="ct" x="${x0}" y="${T+BH+22}" style="font-size:16px">$37.9bn</text>`;
  let ymid=T;
  mid.forEach(d=>{
    const h=d.v*k, ys=y, ym=ymid;
    g+=`<path d="M${x1} ${ys} C${(x1+x2)/2} ${ys}, ${(x1+x2)/2} ${ym}, ${x2} ${ym} L${x2} ${ym+h} C${(x1+x2)/2} ${ym+h}, ${(x1+x2)/2} ${ys+h}, ${x1} ${ys+h} Z" fill="${d.c}" fill-opacity=".26"/>`;
    g+=`<rect x="${x2}" y="${ym}" width="${x3-x2}" height="${h}" rx="3" fill="${d.c}"><title>${d.l}: $${(d.v/1000).toFixed(2)}bn</title></rect>`;
    g+=`<text class="cs2" x="${x3+8}" y="${ym+h/2+1}">${d.l}</text>`+
       `<text class="cs" x="${x3+8}" y="${ym+h/2+14}">$${(d.v/1000).toFixed(2)}bn · ${(d.v/tot*100).toFixed(1)}%</text>`;
    if(d.l==='Facility') nodes.push([ym,h]);
    y+=h; ymid+=h+gap;
  });
  const [fy,fh]=nodes[0], k2=BH/11433;
  let sy=T;
  sub.forEach((d,i)=>{
    const h=d.v*k2;
    const a=fy+fh*(sub.slice(0,i).reduce((s,x)=>s+x.v,0)/11433), b=a+fh*(d.v/11433);
    g+=`<path d="M${x3} ${a.toFixed(1)} C${(x3+x4)/2} ${a.toFixed(1)}, ${(x3+x4)/2} ${sy}, ${x4} ${sy} L${x4} ${(sy+h).toFixed(1)} C${(x3+x4)/2} ${(sy+h).toFixed(1)}, ${(x3+x4)/2} ${b.toFixed(1)}, ${x3} ${b.toFixed(1)} Z" fill="${LC(1)}" fill-opacity="${0.3-i*0.035}"/>`;
    g+=`<rect x="${x4}" y="${sy}" width="${x5-x4}" height="${h.toFixed(1)}" rx="3" fill="${LC(1)}" fill-opacity="${0.95-i*0.11}"><title>${d.l}: $${(d.v/1000).toFixed(2)}bn</title></rect>`;
    g+=`<text class="cs2" x="${x5+8}" y="${(sy+h/2+1).toFixed(1)}">${d.l}</text>`+
       `<text class="cs" x="${x5+8}" y="${(sy+h/2+13).toFixed(1)}">$${(d.v/1000).toFixed(2)}bn</text>`;
    sy+=h;
  });
  g+=`<text class="cs" x="${x4}" y="${T-8}">Facility, on its own scale</text>`;
  el.innerHTML=`<h4>Where the $37.9 billion goes</h4>`+
    `<p class="cq">Follow the money once, then follow the facility line again at ten times magnification.</p>`+
    CX.wrap(`0 0 ${W} ${H}`,g,'Capital flow from total upfront capital into servers, facility, network and land, with the facility line broken out into electrical, cooling, shell, controls, design and site works')+
    `<figcaption class="cnote">Servers are 56% of the cheque. Inside the building, electrical infrastructure is larger than cooling and shell combined — and the shell itself, the thing most commentary pictures, is 10–15% of the facility line and under 5% of the project. Facility sub-categories are midpoints of the disclosed ranges. Source: Epoch AI, May 2026.</figcaption>`;
})();

/* Moat durability against material chokepoint strength */
(function(){
  const el=document.getElementById('cx-matrix'); if(!el) return;
  const W=320,H=330,L=34,R=12,T=24,B=42, pw=W-L-R, ph=H-T-B;
  const P=[[1,.62,.82,'Energy',0],[2,.86,.62,'Materials',0],[3,.94,.95,'Semis',0],[4,.58,.48,'Silicon',0],
           [5,.32,.24,'Data centres',0],[6,.06,.14,'Models',0],[7,.06,.40,'Software',0],[8,.78,.44,'Embodiment',0]];
  const px=v=>L+v*pw, py=v=>T+ph-v*ph;
  let g=`<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="var(--surface2)" rx="6"/>`;
  g+=`<line class="gr" x1="${L+pw/2}" y1="${T}" x2="${L+pw/2}" y2="${T+ph}"/>`+
     `<line class="gr" x1="${L}" y1="${T+ph/2}" x2="${L+pw}" y2="${T+ph/2}"/>`;
  P.forEach(([n,x,y,lab,dy])=>{
    const an=x<.15?'start':(x>.85?'end':'middle'), lx=x<.15?-13:(x>.85?13:0);
    g+=`<circle cx="${px(x).toFixed(1)}" cy="${py(y).toFixed(1)}" r="13" fill="var(--l${n})"/>`+
       `<text x="${px(x).toFixed(1)}" y="${(py(y)+4).toFixed(1)}" text-anchor="middle" style="fill:var(--on-layer);font:600 11px var(--f)">${n}</text>`+
       `<text class="cs" x="${(px(x)+lx).toFixed(1)}" y="${(py(y)+27+(dy||0)).toFixed(1)}" text-anchor="${an}">${lab}</text>`;
  });
  g+=`<text class="cs" x="${L}" y="${H-24}">no chokepoint</text>`+
     `<text class="cs" x="${L+pw}" y="${H-24}" text-anchor="end">extreme</text>`+
     `<text class="cs" x="${L+pw/2}" y="${H-8}" text-anchor="middle">material chokepoint →</text>`+
     `<text class="cs" x="${-(T+ph/2)}" y="12" transform="rotate(-90)" text-anchor="middle">moat durability →</text>`;
  el.innerHTML=`<h4>Chokepoint and moat, layer by layer</h4>`+
    `<p class="cq">The correlation is the most useful heuristic in the analysis.</p>`+
    CX.wrap(`0 0 ${W} ${H}`,g,'Scatter of the seven investable layers positioned by material chokepoint strength against moat durability, showing a strong positive relationship')+
    `<figcaption class="cnote">Layers 6 and 7 have no material chokepoint and the weakest moats; layers 1, 2 and 3 have the strongest of both. Materials sits high on chokepoint but lower on moat durability than semiconductors, because a refining monopoly can be rebuilt in three to eight years while accumulated engineering cannot. Positions are the author\u2019s assessment, not measured values.</figcaption>`;
})();

/* Export control chronology */
function policySVG(){
  const W=720,H=276,LP=8,RP=8,Y=140,pw=W-LP-RP;
  const t0=Date.UTC(2023,5,1), t1=Date.UTC(2027,0,15);
  const px=d=>LP+(d-t0)/(t1-t0)*pw;
  // lv 1 sits close to the axis, lv 2 further out, so neighbouring events never overlap
  const E=[
    {d:Date.UTC(2023,7,1),l:'Gallium and germanium controls begin',s:'1 Aug 2023',up:1,lv:1,an:'start',c:LC(3)},
    {d:Date.UTC(2024,11,1),l:'Ga, Ge and Sb banned to the US',s:'Dec 2024',up:0,lv:1,an:'middle',c:LC(3)},
    {d:Date.UTC(2025,3,4),l:'Seven heavy rare earths licensed',s:'4 Apr 2025 · never suspended',up:1,lv:2,an:'middle',c:LC(1),flag:1},
    {d:Date.UTC(2025,9,9),l:'Announcements 61 and 62',s:'9 Oct 2025 · technology export ban',up:0,lv:2,an:'end',c:LC(1)},
    {d:Date.UTC(2025,10,7),l:'One-year suspension',s:'7 Nov 2025',up:1,lv:1,an:'middle',c:LC(6)},
    {d:Date.UTC(2026,5,22),l:'MP Materials and USA Rare Earth listed',s:'22 Jun 2026',up:0,lv:1,an:'middle',c:LC(3)},
    {d:Date.UTC(2026,10,10),l:'Suspension expires',s:'10–27 Nov 2026',up:1,lv:2,an:'end',c:LC(3),flag:1}];
  let g=`<line class="ax" x1="${LP}" y1="${Y}" x2="${W-RP}" y2="${Y}" stroke-width="1.6"/>`;
  [2024,2025,2026].forEach(yr=>{ const x=px(Date.UTC(yr,0,1)).toFixed(1);
    g+=`<line class="gr" x1="${x}" y1="18" x2="${x}" y2="${H-30}"/><text class="cs" x="${x}" y="${H-12}" text-anchor="middle">${yr}</text>`; });
  const a=px(Date.UTC(2025,10,7)),b=px(Date.UTC(2026,10,10));
  g+=`<rect x="${a.toFixed(1)}" y="${Y-9}" width="${(b-a).toFixed(1)}" height="18" rx="4" fill="${LC(6)}" fill-opacity=".18"/>`+
     `<text class="cs" x="${(a+(b-a)*0.34).toFixed(1)}" y="${Y+4}" text-anchor="middle">October package suspended</text>`;
  E.forEach(e=>{
    const x=px(e.d), stem=e.lv===1?30:62, dir=e.up?-1:1;
    const y2=Y+dir*stem, ty=e.up?y2-10:y2+14;
    g+=`<line x1="${x.toFixed(1)}" y1="${Y+dir*9}" x2="${x.toFixed(1)}" y2="${y2}" stroke="${e.c}" stroke-width="1.3"/>`+
       `<circle cx="${x.toFixed(1)}" cy="${Y}" r="${e.flag?5.5:4}" fill="${e.c}"/>`+
       `<text class="cs2" x="${x.toFixed(1)}" y="${ty}" text-anchor="${e.an}">${e.l}</text>`+
       `<text class="cs" x="${x.toFixed(1)}" y="${ty+(e.up?-13:13)}" text-anchor="${e.an}">${e.s}</text>`;
  });
  return `<figure class="cw"><h4>China\u2019s export controls, and the date already in the diary</h4>`+
    `<p class="cq">What is suspended, what never was, and what expires.</p>`+
    CX.wrap(`0 0 ${W} ${H}`,g,'Timeline of Chinese export controls from August 2023 to November 2026, showing the suspension window and the April 2025 heavy rare earth licensing that was never suspended')+
    `<figcaption class="cnote">The reading most commentary gets wrong: the suspension covers the October 2025 expansion and the US-specific bans. <b>The April 2025 licensing requirement on seven heavy rare earths — including the dysprosium and terbium that keep magnets working hot — was never suspended and remains active</b>, with customs data showing exports running roughly 50% below prior levels. The suspension expires 10 November 2026; the gallium, germanium and antimony arrangement runs to 27 November 2026. This is a scheduled, known risk date affecting layers 1, 3, 4 and 8 at once. Sources: Clark Hill, CIRS Group, Benchmark Minerals, CSIS.</figcaption></figure>`;
}
put('cx-policy',policySVG());
document.querySelectorAll('[data-policy]').forEach(n=>{n.innerHTML=policySVG()});

/* Per-layer concentration profiles, injected into each layer's materials view */
const CONC={
 1:{t:'Concentration at the power chokepoints',c:LC(1),rows:[
   {l:'China, copper smelting',v:48},{l:'China, copper refining',v:44.6},
   {l:'US producers of electrical steel',v:100,vl:'1 of 1'},
   {l:'Hyperscaler nuclear actually flowing',v:19.6}],
   note:'The single US GOES producer is shown as a share of one because the concentration is absolute, not proportional. Turbine order books stand at roughly 110 GW against 60–70 GW a year of world manufacturing capacity.'},
 2:{t:'Concentration at the single dominant node',c:LC(2),rows:[
   {l:'China, rare earth refining',v:86},
   {l:'Spruce Pine, world high-purity quartz',v:80},
   {l:'China, rare earth magnet production',v:70},
   {l:'China, copper smelting',v:48},
   {l:'China, copper mining',v:8}],
   note:'The last two rows are the argument of the whole layer in one comparison. China mines 8% of the world\u2019s copper concentrate and smelts 48% of it. Reserves take a decade to develop; refineries take three to five years. The leverage is never in the ground.'},
 3:{t:'Concentration in the semiconductor material base',c:LC(2),rows:[
   {l:'Spruce Pine, world high-purity quartz',v:80},
   {l:'Semiconductor-grade share, estimated',v:90},
   {l:'EUV optics, Zeiss SMT',v:100,vl:'sole'},
   {l:'ABF substrate resin, Ajinomoto',v:100,vl:'sole'}],
   note:'Two mines in one North Carolina district. Hurricane Helene shut both in September 2024 — the closest thing to a live stress test the industry has run. There is no US export-control regime covering high-purity quartz.'},
 4:{t:'Concentration in the compute silicon inputs',c:LC(3),rows:[
   {l:'China, rare earth refining',v:86},
   {l:'China, gallium and germanium refining',v:90,vl:'~90%'},
   {l:'One 1 GW site, world HBM output',v:4},
   {l:'One 1 GW site, world CoWoS wafers',v:2.5}],
   note:'Gallium and germanium are recovered as by-products of aluminium and zinc refining, so their supply cannot respond to their own price — which is exactly what makes them useful policy instruments. The HBM and CoWoS figures are derived: twenty-five such facilities would absorb the world\u2019s entire high-bandwidth memory output.'},
 5:{t:'Where the data centre budget and the schedule diverge',c:LC(4),rows:[
   {l:'Electrical, share of facility capex',v:42},
   {l:'Servers, share of lifetime cost',v:60},
   {l:'2026 US capacity under construction',v:33},
   {l:'Land and interconnection, of budget',v:0.9}],
   note:'The last two rows are the layer in one line: the cheapest input gates the schedule, and announced capacity is not delivered capacity.'},
 8:{t:'Concentration in the embodiment supply chain',c:LC(7),rows:[
   {l:'China, rare earth magnet production',v:70},
   {l:'China, humanoid component supply',v:63},
   {l:'Nabtesco, RV reducers',v:60},
   {l:'Harmonic Drive, strain-wave reducers',v:50},
   {l:'Sony, image sensors',v:50}],
   note:'Adding this layer to a portfolio already holding ASML and TSMC does not diversify geopolitical risk. It adds a second, independent, oppositely-directed exposure — and both can be realised at once.'}};
document.querySelectorAll('[data-conc]').forEach(n=>{
  const d=CONC[+n.dataset.conc]; if(!d){n.remove();return;}
  n.innerHTML=CX.shareBars({t:d.t,q:'Share held by the single dominant node, where a number exists.',c:d.c,rows:d.rows,note:d.note});
});


put('gw-src',projectSourcePane('gw'));
put('hu-src',projectSourcePane('hu'));
fillAll();

/* ══════════════════════════════════════════════════════════════════════════
   The overview map, read by pointing at it. Hovering a layer lights that
   layer's outgoing arrows, reveals their labels — hidden otherwise, which is
   what keeps the diagram legible — and fills the panel beside the map with
   the layer's own thesis. Everything works on keyboard focus too.
   ══════════════════════════════════════════════════════════════════════════ */
/* Fill the map's mark slots from the shared set, so the icons have one source. */
(function(){
  document.querySelectorAll('#mapsvg .lic[data-icon]').forEach(g=>{
    g.innerHTML=LAYER_ICONS[+g.dataset.icon]||'';
  });
})();

(function(){
  const svg=document.getElementById('mapsvg'), info=document.getElementById('mapinfo');
  if(!svg||!info||!svg.querySelector('[data-from]')) return;

  const WORLD_TEXT='Not a layer, but the ground the stack is drawn from: where energy is '+
    'captured, where materials are extracted, and where embodied machines eventually do the work. '+
    'It feeds the base pair and takes the fleet’s work back.';
  const REST='<p class="mi-eyebrow">The map</p><h4>Eight layers, bottom to top</h4>'+
    '<p class="mi-lede">Each layer depends on the one beneath it. Energy and materials are the base '+
    'pair, drawn straight from the physical world; everything above is a claim on something dug up, '+
    'refined and powered.</p><p class="mi-hint">Point at any layer to read it here and light up the '+
    'arrows leaving it. Click to open the layer in full.</p>';

  function card(n){
    if(n===0) return '<p class="mi-eyebrow">Outside the stack</p><h4>The physical world</h4>'+
      `<p class="mi-lede">${WORLD_TEXT}</p>`;
    const L=LAYERS.find(x=>x.n===n); if(!L) return REST;
    return `<p class="mi-eyebrow">Layer ${L.n}</p><h4>${L.t}</h4>`+
      `<span class="chip ${L.mk}">${L.moat}</span>`+
      `<p class="mi-lede">${L.lede}</p>`+
      `<p class="mi-choke"><b>Binding constraint.</b> ${L.choke}</p>`+
      `<a class="mi-more" href="stack.html#layer-${L.n}">Open layer ${L.n} in full</a>`;
  }

  function highlight(n){
    svg.classList.toggle('hl', n!==null);
    if(n!==null) svg.style.setProperty('--hlc', n===0?'var(--accent)':`var(--l${n})`);
    svg.querySelectorAll('[data-from]').forEach(el=>{
      const on = n!==null && +el.dataset.from===n;
      el.classList.toggle('on', on);
      if(el.tagName.toLowerCase()!=='path') return;
      if(el.dataset.mk===undefined) el.dataset.mk=el.getAttribute('marker-end')||'';
      if(on) el.setAttribute('marker-end',`url(#ahL${n})`);
      else if(el.dataset.mk) el.setAttribute('marker-end',el.dataset.mk);
    });
  }

  let pinned=null;
  const show=n=>{ info.innerHTML=card(n); highlight(n); };
  const clear=()=>{ if(pinned!==null) return; info.innerHTML=REST; highlight(null); };

  const nodes=[...svg.querySelectorAll('a.node')].map(a=>[a,+a.getAttribute('href').slice(-1)]);
  const world=svg.querySelector('.worldnode');
  if(world) nodes.push([world,0]);
  nodes.forEach(([el,n])=>{
    el.addEventListener('mouseenter',()=>show(n));
    el.addEventListener('mouseleave',clear);
    el.addEventListener('focusin',()=>{pinned=n; show(n);});
    el.addEventListener('focusout',()=>{pinned=null; clear();});
  });
  info.innerHTML=REST;
})();
