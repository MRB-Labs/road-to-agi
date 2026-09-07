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
const CDESC={"ABB": "Swiss-Swedish electrical group; switchgear, drives and data centre power distribution.", "AMD": "The credible second source in both server CPUs and AI accelerators.", "ASE": "Taiwan’s largest outsourced assembly and test house.", "ASML": "Sole maker of EUV lithography machines. No substitute exists at the leading edge.", "AT&S": "Austrian maker of IC substrates and high-end printed circuit boards.", "ATI Industrial": "Robotic end-effectors, tool changers and force-torque sensors.", "AWS": "Amazon’s cloud arm, and the largest renter of accelerator capacity.", "AWS Trainium": "Amazon’s in-house training accelerator, built to cut its merchant silicon bill.", "Adobe": "Creative and document software; an incumbent testing whether agents erode seat pricing.", "AgiBot": "Chinese humanoid developer shipping units at aggressive price points.", "Agility": "US humanoid maker; its Digit platform is in warehouse pilots.", "Air Liquide": "French industrial gases group supplying fab-grade bulk and specialty gases.", "Ajinomoto": "Makes the insulating build-up film used in nearly every high-end IC substrate.", "Alfa Laval": "Swedish heat exchanger specialist used in data centre cooling loops.", "Alibaba Qwen": "Alibaba’s open-weight model family, widely deployed across Chinese industry.", "Amazon": "Hyperscaler, accelerator designer, and the largest cloud operator.", "Amkor": "US-listed outsourced assembly and test provider, second to ASE.", "Amphenol": "High-speed connectors and cable assemblies inside and between racks.", "Anthropic": "Frontier model lab; developer of Claude.", "Applied Materials": "The broadest wafer fab equipment portfolio; leads deposition, implant and polishing.", "Apptronik": "US humanoid developer working with Mercedes-Benz on plant deployment.", "Arista": "High-speed data centre Ethernet switching, taking share from InfiniBand.", "Arm": "Licenses the instruction set behind most edge silicon and a rising share of server CPUs.", "Astera Labs": "Connectivity silicon that keeps PCIe and CXL links viable at rack scale.", "Aurubis": "Europe’s largest copper smelter and refiner.", "Azure": "Microsoft’s cloud, and the primary compute host for OpenAI.", "BHP": "Diversified miner; copper is the input that matters to this stack.", "BMW": "Carmaker running humanoid pilots on its own assembly lines.", "Baseten": "Inference hosting for teams that would rather not run a serving stack.", "Boliden": "Swedish miner and smelter of copper and zinc.", "Bosch": "Automotive-grade sensors and actuators, transferable to robotics volume.", "Boston Dynamics": "Hyundai-owned robotics developer; Atlas is the reference humanoid platform.", "Boyd": "Liquid cooling loops, cold plates and thermal assemblies.", "Broadcom": "Custom AI accelerators and the switch silicon most data centre networks are built on.", "Cadence": "One of two companies a modern chip can realistically be designed in.", "Cameco": "Canadian uranium miner; fuel for the reactors backing nuclear-powered halls.", "Carpenter Technology": "Specialty alloys for turbine hot sections and precision components.", "Caterpillar": "Standby generators and prime power for sites the grid cannot yet serve.", "ChatGPT": "OpenAI’s consumer surface, and the largest single distribution point for a model.", "China separation capacity": "The state-backed refining base that separates most of the world’s rare earths.", "Claude": "Anthropic’s model family, distributed through its own apps and cloud partners.", "Clayco": "US design-build contractor active in data centre construction.", "Cleveland-Cliffs": "The only domestic US producer of grain-oriented electrical steel.", "Coherent": "Optical transceivers, lasers and photonic components for rack-to-rack links.", "Confluent": "Streaming data platform; moves enterprise events to where models can use them.", "Constellation": "Operator of the largest US nuclear fleet; sells firm power to hyperscalers.", "Copilot": "Microsoft’s assistant surface, bundled through Windows and Office.", "CoreWeave": "Neocloud renting accelerator capacity at scale to labs and enterprises.", "Corning": "Optical fibre and specialty glass, including fibre for data centre interconnect.", "Credo": "Active electrical cables and SerDes that extend copper reach inside a rack.", "CrowdStrike": "Endpoint and workload security, extending into machine identity.", "Cummins": "Diesel and gas generating sets for backup and bridging power.", "DPR": "US contractor with a large mission-critical and data centre practice.", "Databricks": "Data and model platform where enterprises keep the context agents need.", "Datadog": "Observability; consumption pricing tracks agent volume rather than headcount.", "DeepSeek": "Chinese lab whose open-weight releases reset cost expectations for frontier training.", "Dell": "Servers and storage, and one of the largest integrators of accelerator racks.", "Digital Realty": "Wholesale data centre landlord leasing halls to hyperscalers and enterprises.", "Dynatrace": "Application observability and automated root-cause analysis.", "Eaton": "Power distribution, switchgear and uninterruptible supply for critical facilities.", "Enterprise APIs": "Model access sold as a metered API — a cost line, not an owned asset.", "Enterprises": "The end buyers of agent software, and the owners of the context it needs.", "Equinix": "The largest colocation and interconnection operator.", "Fabrinet": "Contract manufacturer that builds much of the world’s high-end optical hardware.", "Figure": "US humanoid developer with a BMW deployment and its own model stack.", "Fireworks": "Fast inference hosting for open-weight models.", "Foxconn": "The largest contract manufacturer; assembles servers and, increasingly, robots.", "Freeport-McMoRan": "The largest listed copper pure-play.", "Frontier labs": "The handful of organisations running training at the capability frontier.", "GE Vernova": "Heavy-duty gas turbines and grid equipment; delivery slots sold years forward.", "Gemini": "Google’s model family, distributed through Search, Workspace and Cloud.", "GlobalFoundries": "Foundry for mature and specialty nodes rather than the leading edge.", "Google": "Hyperscaler, frontier lab, and designer of its own accelerators.", "Google Cloud": "Google’s cloud arm; sells both its own TPU and merchant accelerator capacity.", "Google DeepMind": "Google’s frontier research and model organisation.", "Google TPU": "Google’s in-house training and inference accelerator, now several generations deep.", "Governments": "Sovereign buyers funding national compute and model programmes.", "Grafana": "Open-source dashboards and metrics for the systems agents run on.", "Green Harmonic": "Chinese harmonic reducer maker attacking Japanese pricing.", "HPE": "Servers, high-performance systems, and networking after the Juniper acquisition.", "Harmonic Drive Systems": "The incumbent in strain-wave reducers — the joint most humanoids depend on.", "Hemlock": "US producer of electronic-grade polysilicon; privately held.", "Hitachi Energy": "Transformers, HVDC and grid equipment; order books stretch years out.", "Hiwin": "Taiwanese maker of ball screws, linear guides and robot joints.", "Howmet": "Single-crystal superalloy castings for turbine hot sections.", "Hyperscalers": "The handful of buyers whose capital spending sets demand for the whole stack.", "Hyundai Mobis": "Hyundai’s components arm; actuators and modules for its robotics programmes.", "Ibiden": "Japanese maker of the high-layer-count IC substrates advanced packages need.", "InnoLight": "Chinese optical transceiver maker, dominant in high-speed volume.", "Intel Foundry": "Intel’s contract manufacturing arm, attempting to become a credible second source.", "Intuit": "Financial software; an incumbent testing agent pricing against seats.", "JL MAG": "The largest Chinese sintered rare earth magnet producer.", "JSR": "Japanese photoresist maker; one of a handful qualified at the leading edge.", "KLA": "Process control — metrology and inspection — at every stage of the fab.", "Kazatomprom": "The world’s largest uranium producer, state-controlled in Kazakhstan.", "Lam Research": "Etch and deposition; the key enabler as memory and logic go vertical.", "LangChain": "Framework for chaining model calls into applications and agents.", "Layer 8": "The models themselves, bought as an input by everything above.", "Licensed corpora": "Text, image and video licensed from publishers rather than scraped.", "Leader Drive": "Chinese harmonic reducer maker, one of the domestic challengers on price.", "Linde": "The largest industrial gases group; bulk and specialty gases for fabs.", "LiquidStack": "Immersion and direct-to-chip liquid cooling systems.", "Logistics operators": "Warehouse and fulfilment operators — the first real market for humanoid fleets.", "Lumentum": "Lasers and optical components for transceivers.", "Lynas": "The largest rare earth separator outside China.", "Lynas Malaysia": "Lynas’s Malaysian separation plant — the established non-Chinese capacity.", "MP Materials": "The only integrated US rare earth miner and separator.", "MYR Group": "Electrical contractor building transmission and substation infrastructure.", "Magnet motor makers": "The assemblers turning magnets and windings into finished motors.", "Maintenance depots": "The service network a deployed robot fleet needs and does not yet have.", "Marvell": "Custom silicon and data centre interconnect; the number two in custom accelerators.", "Mercor": "Marketplace supplying expert human data for model training and evaluation.", "Meta": "Hyperscaler consuming its own compute; publisher of the Llama open weights.", "Micron": "US memory maker, and the only non-Korean source of high-bandwidth memory.", "Microsoft": "Hyperscaler, OpenAI’s compute partner, and the largest enterprise software vendor.", "Microsoft Entra": "Microsoft’s identity platform, where machine identity is being defined.", "Mistral": "European frontier lab shipping both open-weight and hosted models.", "Mitsubishi Heavy": "Japanese heavy engineering; gas turbines and nuclear plant.", "Model labs": "The organisations that train and sell frontier models.", "MongoDB": "Document database widely used as the store behind agent applications.", "Mortenson": "US contractor with a large data centre and renewable construction practice.", "Motivair (Schneider)": "High-density liquid cooling, acquired by Schneider Electric.", "NSK": "Japanese precision bearings and ball screws.", "NVIDIA": "The dominant accelerator vendor; its software stack is why customers stay.", "NVIDIA Jetson": "NVIDIA’s edge compute module — the default brain in most robot prototypes.", "NVIDIA NVLink": "NVIDIA’s scale-up fabric for linking accelerators inside a rack.", "Nabtesco": "The incumbent in cycloidal reducers for heavy robot joints.", "Neo Performance": "Rare earth processor and magnet maker with non-Chinese capacity.", "Neoclouds": "Accelerator-first cloud providers renting the capacity hyperscalers do not.", "NextEra": "The largest US renewables developer; power purchase agreements for new halls.", "Nidec": "The largest precision motor maker, scaling into robot actuators.", "Nippon Steel": "Japanese steelmaker; electrical steel for transformer cores.", "OCI": "Oracle’s cloud, and a growing host for frontier training workloads.", "Okta": "Identity and access management, extending to non-human identities.", "On-robot selection": "Deciding on board which sensor data is worth transmitting at all.", "Open weights": "Freely downloadable model weights — the floor under API pricing.", "OpenAI": "Frontier lab; ChatGPT is the largest consumer distribution of a model.", "Oracle": "Enterprise software, and a cloud increasingly rented to model labs.", "POSCO": "Korean steelmaker; electrical steel and battery materials.", "Palo Alto Networks": "Network and cloud security across enterprise estates.", "Precision Castparts": "Berkshire-owned maker of superalloy castings and forgings.", "Prysmian": "The largest cable maker; high-voltage transmission and data centre cabling.", "Qualcomm": "Edge and mobile silicon, pushing into on-device inference.", "Quanta": "Taiwanese ODM assembling a large share of the world’s AI servers.", "Quanta Services": "US electrical infrastructure contractor building transmission and substations.", "Regal Rexnord": "Motors, gearing and power transmission components.", "Renishaw": "Precision encoders and metrology; position feedback for robot joints.", "Rio Tinto": "Diversified miner; copper, aluminium and lithium.", "Rosendin": "One of the largest US electrical contractors — the binding trade on site.", "SAP": "Enterprise resource planning, where much industrial process context lives.", "SK hynix": "The leading supplier of high-bandwidth memory to accelerator makers.", "SUMCO": "Japanese silicon wafer maker; one of a handful at leading-edge quality.", "Salesforce": "Enterprise applications; the clearest test of agents against seat pricing.", "Samsung": "Memory, foundry and consumer electronics conglomerate.", "Samsung Foundry": "Samsung’s contract manufacturing arm — the only other leading-edge logic source.", "Sanhua": "Chinese thermal components maker moving into robot actuators.", "Scale AI": "Data labelling and evaluation for model training.", "Schneider": "Schneider Electric’s data centre power and cooling business.", "Schneider Electric": "French electrical group; power distribution, UPS and cooling for data halls.", "ServiceNow": "Workflow automation, positioning agents as the execution layer for enterprise process.", "Shin-Etsu": "The largest silicon wafer maker, and a major photoresist supplier.", "Shinko": "Japanese IC substrate maker for high-end packages.", "Sibelco": "Belgian minerals group, and a source of high-purity quartz.", "Siemens": "German industrial group; electrification, automation and factory software.", "Siemens EDA": "Siemens’ chip design software arm, the third EDA vendor.", "Siemens Energy": "Gas turbines, grid technology and transformers.", "Snowflake": "Cloud data warehouse; enterprise context for retrieval and agents.", "Solvay": "Belgian chemicals group; rare earth processing and specialty materials.", "Sony": "Image sensors — the dominant supplier for the cameras robots see with.", "Sovereign programmes": "State-funded national compute and model efforts.", "Splunk (Cisco)": "Log analytics and security operations, now inside Cisco.", "Supermicro": "Server integrator that scaled fastest on accelerator rack demand.", "Surge": "Human data provider for model training and evaluation.", "Synopsys": "The largest design software vendor — the other half of the EDA duopoly.", "Synthetic generation": "Training data the labs produce themselves rather than collect.", "THK": "Japanese linear motion and ball screw maker.", "TSMC": "Manufactures the overwhelming majority of leading-edge logic.", "TSMC CoWoS": "TSMC’s advanced packaging line — the binding constraint on accelerator supply.", "Talen": "Independent power producer selling nuclear output directly to data centres.", "Temporal": "Durable execution framework for long-running agent workflows.", "Tesla": "Vehicle fleet, in-house silicon, and the Optimus humanoid programme.", "The Quartz Corp": "Norwegian-French producer of ultra-high-purity quartz.", "Together": "Inference and training hosting for open-weight models.", "Tokuyama": "Japanese producer of polysilicon and electronic materials.", "Tokyo Electron": "Coaters and deposition; a near monopoly in track systems.", "Transformer makers": "The transformer industry as a whole; lead times measured in years.", "Tuopu": "Chinese automotive components supplier moving into humanoid actuators.", "Turbine OEMs": "The three companies able to supply heavy-duty gas turbines at scale.", "Turner": "One of the largest US construction managers.", "UBTech": "Chinese humanoid maker shipping into education and industrial pilots.", "Unimicron": "Taiwanese IC substrate and printed circuit board maker.", "Unitree": "Chinese robot maker undercutting Western humanoid pricing sharply.", "Utilities": "The regulated utilities whose interconnection queues set the schedule.", "Vertiv": "Data centre power and thermal management; a primary liquid cooling supplier.", "Vistra": "Independent power producer with nuclear and gas capacity.", "Wacker Chemie": "German chemicals group; one of few electronic-grade polysilicon producers.", "Wafer makers": "The silicon wafer industry — a handful of firms at leading-edge quality.", "Wistron": "Taiwanese ODM building AI servers and modules.", "Zeiss SMT": "Makes the optics inside every EUV scanner — a monopoly upstream of ASML.", "Zscaler": "Cloud security; zero-trust access for users and workloads.", "xAI": "Frontier lab, training on its own Colossus cluster.", "Microsoft Maia": "Microsoft’s in-house AI accelerator, designed to run Azure and OpenAI workloads on its own silicon.", "Meta MTIA": "Meta’s in-house training and inference accelerator, built for its own ranking and model workloads.", "Tesla AI5": "Tesla’s next-generation inference chip for the vehicle fleet and Optimus.",
 "Fluence":"Grid-scale battery storage systems and the software that bids them into power markets.",
 "Infineon":"Europe\u2019s largest power semiconductor maker; motor drives, chargers and board-level conversion.",
 "Monolithic Power":"Power management silicon; has won significant content in accelerator board power delivery.",
 "Vicor":"High-density power conversion modules that step voltage down close to the processor.",
 "CATL":"The largest battery cell maker in the world, in both vehicles and grid storage.",
 "LG Energy Solution":"Korean cell maker supplying vehicles, storage and increasingly robotics platforms.",
 "Intel":"Host server CPUs, plus a foundry business trying to re-enter the leading edge.",
 "Seagate":"Hard drives \u2014 still the cost floor for the bulk capacity tier behind AI training data.",
 "Western Digital":"Hard drives and, through its flash heritage, a supplier into the storage tier.",
 "Kioxia":"NAND flash maker spun out of Toshiba; a major supplier of the storage tier.",
 "Cisco":"Switching, routing and, through Splunk, observability; the incumbent enterprise network vendor.",
 "Nokia":"Radio access, optical transport and \u2014 through Alcatel Submarine Networks \u2014 subsea cable systems.",
 "Ericsson":"Radio access networks; one of three vendors that can build a national mobile network.",
 "Ciena":"Coherent optical transport for metro, long-haul and data-centre interconnect.",
 "Fujikura":"Optical fibre, cable and the fusion splicers used to join it in the field.",
 "Sumitomo Electric":"Optical fibre and cable, plus compound semiconductor devices for optical links.",
 "NEC":"Submarine cable systems and optical transport; one of a very short list of subsea suppliers.",
 "Lumen":"US long-haul fibre routes, now selling dark fibre capacity to hyperscalers for AI traffic.",
 "Cloudflare":"Edge network, CDN and security sitting between users and origin infrastructure.",
 "Akamai":"The original CDN; content delivery, edge compute and security.",
 "AT&T":"US carrier; fibre routes, mobile access and enterprise connectivity.",
 "Verizon":"US carrier with the mobile access network that most connected devices ride on.",
 "Deutsche Telekom":"European carrier group, and through T-Mobile a large US access network.",
 "Starlink":"SpaceX\u2019s satellite constellation; connectivity where fibre and cell coverage do not reach.",
 "Zayo":"Privately held US fibre infrastructure operator selling dark fibre and wavelengths.",
 "SubCom":"Private submarine cable installer; one of three firms that can lay a transoceanic system.",
 "Huawei":"Chinese network equipment group; dominant in domestic radio, transport and subsea supply.",
 "Elastic":"Search and vector retrieval; the index layer under a large share of enterprise RAG.",
 "Palantir":"Data integration and operational decision platforms, heavily weighted to government.",
 "Pure Storage":"All-flash storage arrays sold into the high-throughput tier feeding training clusters.",
 "NetApp":"Enterprise storage and data management across on-premises and cloud.",
 "VAST Data":"Private storage platform built for the read bandwidth that large training runs demand.",
 "Fivetran":"Private managed data ingestion; moves source systems into warehouses on a schedule.",
 "Reddit":"Owns a large human conversation corpus and now licenses it explicitly for training.",
 "Shutterstock":"Stock media library that licenses rights-cleared images and video for model training.",
 "Thomson Reuters":"Professional legal, tax and news content \u2014 licensed, high-value proprietary text.",
 "Appen":"Data annotation and human feedback at scale, sold to model developers.",
 "Pinecone":"Private managed vector database used for retrieval at inference time.",
 "Collibra":"Private data governance and catalogue software; lineage, ownership and policy."
};

const PROC={"3": {"t": "Inside wafer fabrication", "lead": "One layer of a chip is built by this sequence, and the sequence is then repeated — dozens of times for a leading-edge part. Early layers carry the smallest features and need the most capable machines; later layers do not. Almost every step has a different owner, which is why no single company can supply a fab.", "steps": [["Deposition", "Applied Materials", "Material is laid down across the wafer, a film at a time."], ["Coat and develop", "Tokyo Electron", "The wafer is coated in light-sensitive photoresist, then developed after exposure. A near monopoly in coaters."], ["Lithography", "ASML", "The pattern is projected through a reticle onto the resist. The only source of EUV machines in the world."], ["Etch", "Lam Research", "Exposed material is removed to leave the pattern behind. The step that matters most as devices go vertical."], ["Ion implantation", "Applied Materials", "Ions are driven into the wafer to set its electrical properties."], ["Clean and polish", "Applied Materials", "Contaminants are washed off and the surface is polished flat enough to take the next layer."], ["Metrology and inspection", "KLA", "Wafers are measured and checked for defects throughout, and the results fed back to raise yield. Over half the market."]], "note": "Once the last layer is complete the wafer is cut into die and packaged — and for accelerators it is that packaging step, not any of the ones above, that is currently rationing supply.", "src": "Sequence and vendor positions per Generative Value, “A Primer on Semiconductor Capital Equipment” and “An Overview of the Semiconductor Industry”."}, "5": {"t": "What a hall is actually made of", "lead": "Roughly half to sixty per cent of a data centre’s cost is the IT it holds; the rest is the building that keeps it powered and cool. Power management is the largest line in that second half, which is why an electrical supply chain sits underneath a compute thesis.", "steps": [["Compute", "NVIDIA", "Accelerators and the CPUs beside them. The single largest line in the budget, and the one that depreciates fastest."], ["Networking", "Arista", "Switches, network cards and the fabric between racks. Ethernet has been taking share from InfiniBand."], ["Storage", "Dell", "Flash and disk for the training corpus and checkpoints. Small next to compute, but it gates utilisation."], ["Servers", "Supermicro", "Integration of silicon, memory, networking and cooling into a rack. ODMs increasingly sell direct to hyperscalers, bypassing the brands."], ["Power management", "Schneider Electric", "Distribution, generators and uninterruptible supply — the biggest facility cost of the lot."], ["Cooling", "Vertiv", "Chillers, air handlers and, increasingly, direct liquid to the chip."], ["Operator", "Equinix", "Whoever builds, hosts and manages the hall. Colocation lets a tenant rent space rather than build it."]], "note": "The split matters for who captures the spend: the IT half is concentrated in a handful of silicon vendors, while the facility half is spread across industrial companies with far longer order books and far less pricing power over their customers.", "src": "Cost split, segment structure and vendor positions per Generative Value, “A Primer on Data Centers”."}};

/* Value chains, restructured to the AUDIT brief.

   Two things changed from the earlier single-line chains. Layers are no
   longer one queue in which every stage buys from the stage on its left —
   most layers run several chains in parallel that converge, so each layer
   carries named branches. And every chokepoint now has to say what it
   affects, where, as of when, over what horizon, whether it is structural
   or cyclical, what can substitute and how long relief takes. A stage
   without that qualification does not get marked. */
const CHAIN={
1:{lead:'Four chains run in parallel here, not one. Fuel and grid capacity on one side; the electrical equipment that conditions power on another; the thermal system that removes the resulting heat on a third; and a miniature of all three inside every machine at the edge. They converge on the rack, but none of them buys from the others.',
 branches:[
  {t:'Energy resource and grid',w:'From a resource in the ground or a natural flow to an energised connection at the fence.',
   stages:[
   {t:'Resource and fuel supply',w:'Uranium, gas and the renewable resource itself. Enrichment matters more than mining: the fuel is abundant, the qualified conversion capacity is not.',n:['Cameco','Kazatomprom','Utilities'],c:1,note:'Enrichment, not extraction, is the narrow step',
    cq:{what:'Enriched uranium, including high-assay low-enriched fuel for advanced reactors',where:'Russia held roughly 44% of world enrichment capacity; Western replacement capacity is under construction',as_of:'2026',horizon:'Structural to the early 2030s',kind:'Structural',sub:'Existing LEU stockpiles and re-contracting can bridge conventional reactors; HALEU has no scaled Western source',lead:'New enrichment trains run five years or more',src:'World Nuclear Association; US Department of Energy'}},
   {t:'Generation',w:'Turning the resource into electrons. The binding item is not fuel but the turbine slot, and those are sold years forward.',n:['GE Vernova','Siemens Energy','Mitsubishi Heavy','Constellation','Vistra','NextEra'],c:1,note:'Heavy-duty turbine slots sold years forward',
    cq:{what:'Heavy-duty gas turbine deliveries',where:'Global; three OEMs hold effectively all heavy-duty capacity',as_of:'H1 2026',horizon:'Binding to roughly 2030',kind:'Structural — hot-section casting and skilled-labour capacity, not order book alone',sub:'Reciprocating engines and fuel cells cover smaller blocks at worse heat rates',lead:'Combined-cycle lead times about five years, up from 3.5 in 2023',src:'Company backlog disclosures; Wood Mackenzie'}},
   {t:'Storage and firming',w:'Batteries and other firming that turn an intermittent resource into something dispatchable. Increasingly sited behind the meter.',n:['Fluence','Tesla','CATL','LG Energy Solution'],note:'Firming is what makes a renewable resource bankable'},
   {t:'Market, tariff and contract',w:'Where power is actually bought: wholesale markets, utility tariffs and long-term purchase agreements. The commercial layer that decides who carries price risk.',n:['Constellation','Vistra','NextEra','Utilities'],note:'A PPA is a financing instrument as much as an energy one'},
   {t:'Transmission',w:'Moving bulk power to the region. High-voltage lines, and the transformers and switchgear that terminate them.',n:['Hitachi Energy','Prysmian','Quanta Services','MYR Group'],c:1,note:'Equipment lead times, not route capacity, set the pace',
    cq:{what:'Large power transformers and generator step-up units',where:'United States',as_of:'2026',horizon:'Two to three years',kind:'Cyclical capacity shortage on a structurally thin supplier base',sub:'Refurbished units and rerating existing assets, in limited volume',lead:'Average about 128 weeks; step-up units about 144',src:'Wood Mackenzie; utility procurement disclosures'}},
   {t:'Distribution',w:'The medium-voltage network between the transmission substation and the site. Frequently the forgotten constraint in siting studies.',n:['Utilities','MYR Group','Quanta Services'],note:'Nominal regional capacity is not deliverable capacity'},
   {t:'Grid interconnection',w:'The study, the agreement and the energisation date. A site without one is land, not capacity.',n:['Utilities'],c:1,note:'The genuinely scarce asset in the whole layer',
    cq:{what:'Executed and energised large-load interconnection agreements',where:'United States, worst in PJM and ERCOT',as_of:'2026',horizon:'Five to seven years in the slowest queues',kind:'Structural — process and equipment bound, not physics bound',sub:'Behind-the-meter generation and co-location at existing plants',lead:'Five to seven years for new queue entrants',src:'FERC and RTO queue reporting'}}]},
  {t:'Electrical equipment',w:'Processed metal at one end, a regulated voltage at the pin of a processor at the other.',
   stages:[
   {t:'Processed materials in',w:'Copper, aluminium and grain-oriented electrical steel arriving from layer 2. The input that gates transformer output.',n:['Cleveland-Cliffs','Nippon Steel','POSCO','Freeport-McMoRan'],note:'Grain-orientation annealing is the narrow step'},
   {t:'Transformers, switchgear and cable',w:'The manufactured products that step, protect and carry power. Long-lead, capital-intensive, and ordered before ground is broken.',n:['Hitachi Energy','Siemens Energy','Schneider Electric','Eaton','ABB','Prysmian'],c:1,note:'Ordered before the building is designed',
    cq:{what:'Data-centre specification medium-voltage switchgear',where:'North America and Western Europe',as_of:'2026',horizon:'Two to three years',kind:'Cyclical, on a supplier base that consolidated through the 2010s',sub:'Alternative topologies and lower-spec gear, at a reliability cost',lead:'Roughly two to three years',src:'Vendor lead-time guidance; Wood Mackenzie'}},
   {t:'Utility substation',w:'The step-down yard where the site meets the grid. Built by specialist contractors on the utility’s schedule.',n:['Quanta Services','MYR Group','Hitachi Energy'],note:'Built to the utility’s standard, not the tenant’s'},
   {t:'On-site medium-voltage distribution',w:'Distributing power around the campus at medium voltage, as close to the hall as the design allows.',n:['Schneider Electric','Eaton','ABB','Siemens'],note:'Distributing at higher voltage saves copper'},
   {t:'UPS and backup',w:'Ride-through and standby: static UPS, batteries, generators and, increasingly, on-site microgrids.',n:['Vertiv','Schneider Electric','Eaton','Cummins','Caterpillar'],note:'Generators are the last non-negotiable diesel in the stack'},
   {t:'Rack power',w:'Busway, rack PDUs and the shelf-level supplies. The point where the facility hands over to the IT equipment.',n:['Vertiv','Schneider Electric','Eaton','Amphenol'],note:'50–130 kW per rack, against 5–15 kW a decade ago'},
   {t:'Board and chip power conversion',w:'The last two conversions, from rack voltage to the fraction of a volt an accelerator actually runs at, at currents in the high hundreds of amps.',n:['Monolithic Power','Infineon','Vicor','STMicroelectronics'],note:'Conversion losses here are paid twice — once as power, once as heat'}]},
  {t:'Thermal',w:'A parallel chain that serves the same load. It does not buy from the electrical plant.',
   stages:[
   {t:'Cooling equipment and fluids',w:'Chillers, dry coolers, pumps, cold plates and the dielectric and water-glycol fluids they circulate.',n:['Vertiv','Boyd','Alfa Laval','LiquidStack','Motivair (Schneider)','Solvay'],note:'Fragmented — the top vendors hold roughly a third between them'},
   {t:'Heat capture at chip and server',w:'Cold plates and immersion at the package. Where liquid stopped being optional.',n:['Boyd','LiquidStack','Motivair (Schneider)','Vertiv'],note:'Density, not efficiency, forced the change'},
   {t:'Coolant distribution',w:'CDUs, manifolds and secondary loops moving heat from the rack to the facility.',n:['Vertiv','Boyd','Motivair (Schneider)'],note:'The interface between IT and facility responsibility'},
   {t:'Facility loop',w:'Primary loops, heat exchangers and the plant that carries heat to the outside of the building.',n:['Alfa Laval','Vertiv','Schneider Electric'],note:'Where water and electricity trade against each other'},
   {t:'Heat rejection or reuse',w:'Rejecting heat to air or water, or selling it into a district system. Reuse is a permitting argument as much as an energy one.',n:['Alfa Laval','Utilities'],note:'Reuse is worth more in policy than in revenue, so far'}]},
  {t:'Energy inside the machine',w:'The same four functions again, at the scale of a robot rather than a campus.',
   stages:[
   {t:'Energy source or charger',w:'Grid charging, swap stations or tethered supply. The duty cycle of a fleet is set here.',n:['Utilities','Tesla'],note:'Charging time is downtime'},
   {t:'Battery or fuel system',w:'Cells and packs. At 280–300 Wh/kg, close to the practical lithium-ion ceiling, run time is the binding design constraint.',n:['CATL','LG Energy Solution','Tesla'],note:'No commercial humanoid runs a full shift on one charge'},
   {t:'Power electronics',w:'Converting pack voltage for drives, compute and sensors, inside a mass and thermal budget.',n:['Infineon','STMicroelectronics','Monolithic Power'],note:'Efficiency here buys run time directly'},
   {t:'Motors, compute and sensors',w:'The loads themselves. Actuation dominates peak draw; compute dominates idle.',n:['Nidec','Sanhua','NVIDIA Jetson'],note:'Peak and average draw are set by different subsystems'},
   {t:'Thermal management',w:'Removing heat from a sealed, moving machine with no facility loop to hand it to.',n:['Boyd','Sanhua'],note:'The constraint that limits continuous torque'}]}]},
2:{lead:'One long chain from rock to qualified input, plus a grouping by where the material ends up. The audit’s correction matters here: extraction can be a chokepoint, and qualification is a gate that recurs rather than a final stage. Several of these materials are recovered as by-products, so supply cannot respond to their own price.',
 branches:[
  {t:'Resource to qualified material',w:'The full sequence, including the stages the earlier five-stage chain skipped.',
   stages:[
   {t:'Exploration and resource definition',w:'Finding and proving a deposit to a standard a financier will lend against. Decades of lead time before a tonne moves.',n:['BHP','Rio Tinto','Freeport-McMoRan','Lynas','MP Materials'],note:'Discovery to production runs 10–20 years'},
   {t:'Permitting and financing',w:'Approvals, community consent and capital. In Western jurisdictions this is usually longer than construction.',n:['MP Materials','Lynas','BHP'],c:1,note:'Where Western supply projects actually stall',
    cq:{what:'New mine and separation permits',where:'United States, Canada, Australia, European Union',as_of:'2026',horizon:'A decade or more',kind:'Structural — regulatory and social, not geological',sub:'Recycling and expanding existing permitted operations',lead:'Typically 7–15 years from application to production',src:'USGS; national permitting authorities'}},
   {t:'Extraction and recovery',w:'Mining, or recovery as a by-product of another metal. Gallium and germanium come out of aluminium and zinc processing, so they do not respond to their own price.',n:['BHP','Rio Tinto','Freeport-McMoRan','Cameco','Sibelco','The Quartz Corp','MP Materials','Lynas'],c:1,note:'Some of these cannot be produced to order at any price',
    cq:{what:'High-purity quartz for crucibles, and by-product gallium and germanium',where:'Spruce Pine, North Carolina for quartz; China for by-product refining',as_of:'2026',horizon:'Structural',kind:'Structural — geological for quartz, co-product economics for the metals',sub:'Synthetic quartz at higher cost; recovery from existing streams for the metals',lead:'Qualification of an alternative quartz source takes years',src:'USGS Mineral Commodity Summaries'}},
   {t:'Beneficiation and concentration',w:'Upgrading ore to a concentrate. Where recovery rates and reagent chemistry decide whether a deposit is economic.',n:['BHP','Rio Tinto','MP Materials','Lynas'],note:'Grade decides the economics, not tonnage'},
   {t:'Refining and separation',w:'Smelting, chemical conversion and — for rare earths — hundreds of sequential solvent-extraction stages. Separation, not mining, is the concentrated step.',n:['China separation capacity','Aurubis','Boliden','Lynas Malaysia','Solvay','Neo Performance'],c:1,note:'Separate the element from the process: China’s share is in separation',
    cq:{what:'Separated individual rare-earth oxides, particularly the heavy elements',where:'China holds the large majority of separation capacity; Lynas Malaysia and Solvay La Rochelle are the main non-Chinese routes',as_of:'2026',horizon:'Five years or more for meaningful Western share',kind:'Structural — process know-how accumulated over decades',sub:'Lynas and MP are scaling; recycling covers a small share',lead:'A new separation train takes years to commission and qualify',src:'USGS; company disclosures'}},
   {t:'High-purity processing',w:'Getting to electronic grade. Polysilicon, specialty gases, wet chemicals and photoresists, where the specification is measured in parts per billion.',n:['Wacker Chemie','Hemlock','Tokuyama','OCI','Shin-Etsu','SUMCO','Linde','Air Liquide','JSR'],c:1,note:'Purity, not volume, is the barrier',
    cq:{what:'Electronic-grade photoresists and specialty gases',where:'Japanese suppliers hold the majority of leading-edge resist chemistry',as_of:'2026',horizon:'Structural',kind:'Structural — qualification-bound',sub:'Second sources exist but need process requalification per fab and per node',lead:'Requalification measured in quarters to years',src:'SEMI; company disclosures'}},
   {t:'Precursors and engineered materials',w:'Turning a pure substance into the form the customer buys: wafers, alloys, magnet blocks, preforms, powders and fluids.',n:['Shin-Etsu','SUMCO','JL MAG','Neo Performance','Corning','Howmet','Carpenter Technology'],note:'The step where a commodity becomes a specified product'},
   {t:'Usable product form',w:'Castings, laminations, foils, films and cable. Where materials become the shapes the equipment makers consume.',n:['Cleveland-Cliffs','Nippon Steel','POSCO','Precision Castparts','Prysmian','Corning'],note:'Form, tolerance and finish are as specified as composition'},
   {t:'Customer and process qualification',w:'The gate. Qualification is customer-, process- and application-specific: a chemical approved for one wafer process is not approved for another.',n:['Wafer makers','Transformer makers','Turbine OEMs','Magnet motor makers'],c:1,note:'A gate that recurs, not a final stage',
    cq:{what:'Requalification of an alternative material source into a running process',where:'Global, per fab and per production line',as_of:'2026',horizon:'Persistent',kind:'Structural — a property of how the industry manages risk',sub:'None; the gate is the substitute mechanism',lead:'Months for commodity inputs, years at the leading edge',src:'SEMI; customer quality standards'}},
   {t:'Recycling and recovery',w:'Scrap, swarf and end-of-life recovery. Small today for most of these materials, and the only supply source that scales with the installed base rather than with new permits.',n:['Aurubis','Boliden','Neo Performance','Solvay'],note:'Grows with the installed base, not with permitting'}]},
  {t:'Where the material ends up',w:'The same chain, grouped by functional destination rather than by processing step.',
   stages:[
   {t:'Energy and grid materials',w:'Copper, aluminium, grain-oriented electrical steel, and the superalloys and castings inside a turbine hot section.',n:['Freeport-McMoRan','Cleveland-Cliffs','Nippon Steel','POSCO','Howmet','Carpenter Technology','Precision Castparts'],note:'Feeds layer 1’s equipment chain'},
   {t:'Semiconductor-grade inputs',w:'Quartz, polysilicon, wafers, gases, resists and the build-up film under every high-end substrate.',n:['Sibelco','The Quartz Corp','Wacker Chemie','Hemlock','Shin-Etsu','SUMCO','Linde','Air Liquide','JSR','Ajinomoto'],note:'Feeds layer 3'},
   {t:'Optical and communications materials',w:'Glass preforms, drawn fibre and the compound semiconductor substrates behind lasers and detectors.',n:['Corning','Fujikura','Sumitomo Electric','Shin-Etsu'],note:'Feeds layer 6'},
   {t:'Construction and cooling materials',w:'Structural steel, cement, copper, and the refrigerants and dielectric fluids in the thermal loop.',n:['Nippon Steel','POSCO','Freeport-McMoRan','Solvay'],note:'Feeds layer 5'},
   {t:'Battery and power-electronics materials',w:'Lithium, nickel, graphite and cobalt, plus the wide-bandgap substrates behind efficient conversion.',n:['BHP','CATL','LG Energy Solution','Sumitomo Electric'],note:'Feeds layers 1 and 10'},
   {t:'Robot structure, joint and sensor materials',w:'Bearing steels, magnet alloys, precision castings and the optical and tactile sensing materials.',n:['JL MAG','Neo Performance','Carpenter Technology','MP Materials','Lynas'],note:'Feeds layer 10'}]}]},
3:{lead:'Three branches converge on a finished device. Design and manufacturing inputs are parallel — EDA houses do not buy from equipment makers — and they meet at the fab. The audit’s correction stands: which step rations accelerators is a dated, conditional question, not a fixed answer.',
 branches:[
  {t:'Design',w:'From architecture to a mask set. Nothing physical is produced in this branch.',
   stages:[
   {t:'Research and architecture',w:'Choosing what to build: instruction set, memory hierarchy, interconnect topology and the power envelope everything else lives inside.',n:['Arm','NVIDIA','AMD','Broadcom','Intel'],note:'The decisions that are cheapest to change here'},
   {t:'EDA and core IP',w:'The tools and the licensed blocks. Two firms hold most of the flow, and the tools are export-controlled.',n:['Cadence','Synopsys','Siemens EDA','Arm'],c:1,note:'Two suppliers for a tool nobody can design without',
    cq:{what:'Leading-edge digital design and verification flows',where:'Cadence and Synopsys are US-headquartered and subject to US export control',as_of:'2026',horizon:'Structural',kind:'Structural — decades of tool and library ecosystem',sub:'Siemens EDA in parts of the flow; nothing complete',lead:'Replacing a flow is a multi-year programme',src:'Company disclosures; BIS rules'}},
   {t:'RTL and design implementation',w:'Writing and structuring the logic itself, against a process design kit from the intended foundry.',n:['NVIDIA','AMD','Broadcom','Marvell','Google TPU','AWS Trainium','Microsoft Maia','Meta MTIA','Tesla AI5'],note:'Where the custom-silicon programmes live'},
   {t:'Verification',w:'Proving the design does what was intended before committing to a mask set. Routinely the largest share of engineering hours.',n:['Cadence','Synopsys','Siemens EDA'],note:'A respin costs a quarter and a mask set'},
   {t:'Physical design',w:'Placement, routing, timing and power closure against the foundry’s rules.',n:['Cadence','Synopsys','TSMC'],note:'Where the design meets the process'},
   {t:'Tape-out and masks',w:'Committing the design to reticles. A leading-edge EUV mask set is a capital item in its own right.',n:['Zeiss SMT','TSMC','Samsung Foundry','Intel Foundry'],note:'The point of no return in the design cycle'}]},
  {t:'Manufacturing inputs',w:'Parallel inputs that arrive at the fab. None of them buys from another.',
   stages:[
   {t:'Wafers, chemicals and gases',w:'Substrates, resists, wet chemicals and bulk and specialty gases, all qualified to the specific process.',n:['Shin-Etsu','SUMCO','JSR','Linde','Air Liquide','Sibelco','The Quartz Corp'],note:'Qualified per process, not per product'},
   {t:'Lithography and patterning equipment',w:'The tools that define features. One supplier at the leading edge, and one optics supplier behind it.',n:['ASML','Zeiss SMT','Tokyo Electron'],c:1,note:'One EUV supplier; no substitute at the leading edge',
    cq:{what:'EUV lithography scanners, including High-NA',where:'ASML, Netherlands, with Zeiss optics from Germany; export-controlled to China',as_of:'2026',horizon:'Structural through the decade',kind:'Structural — no competing programme is close',sub:'Multi-patterning DUV at higher cost, yield loss and cycle time; not viable below a point',lead:'Output is set by Zeiss optics throughput; a new entrant is a decade away',src:'ASML disclosures; Dutch export-control notices'}},
   {t:'Deposition, etch, implant and clean',w:'The rest of the process module set. Broader supplier bases than lithography, but still concentrated.',n:['Applied Materials','Lam Research','Tokyo Electron'],note:'Broader competition than lithography, but not wide'},
   {t:'Process control, metrology and inspection',w:'Measuring what was built and finding defects. What converts installed capacity into yielded output.',n:['KLA','Applied Materials','Keyence'],c:1,note:'Yield learning is the real product',
    cq:{what:'Leading-edge optical and e-beam defect inspection',where:'KLA holds the majority position; US export-controlled',as_of:'2026',horizon:'Structural',kind:'Structural — data and algorithm advantage compounds with installed base',sub:'Partial alternatives at trailing nodes',lead:'Years to qualify an alternative into a running line',src:'Company disclosures; SEMI'}},
   {t:'Cleanroom, water and abatement',w:'The facility itself: ultrapure water, filtered air, gas delivery and the abatement of what comes out.',n:['Linde','Air Liquide','Utilities'],note:'A fab is a chemical plant with a clean box in it'}]},
  {t:'Production',w:'Front end, back end and the qualification that lets a part ship.',
   stages:[
   {t:'Front-end fabrication',w:'Building transistors and interconnect on the wafer. Capacity, utilisation, yield and lead time are four different numbers.',n:['TSMC','Samsung Foundry','Intel Foundry','GlobalFoundries'],c:1,note:'Leading-edge logic capacity is concentrated in one company and one island',
    cq:{what:'Leading-edge logic wafer capacity, 5nm-class and below',where:'Overwhelmingly Taiwan, with capacity being added in Arizona, Japan and Germany',as_of:'2026',horizon:'Structural, easing slowly as overseas fabs qualify',kind:'Structural, with a geographic concentration risk on top',sub:'Samsung and Intel Foundry at lower volume and different yield',lead:'A new fab is roughly three years to first output and longer to mature yield',src:'Company disclosures; SEMI'}},
   {t:'Memory fabrication',w:'A separate industry with its own cycle, converging with logic only in the package. HBM sold out well ahead of delivery.',n:['SK hynix','Micron','Samsung','Kioxia'],c:1,note:'Logic and memory are not one manufacturing input',
    cq:{what:'High-bandwidth memory stacks for accelerators',where:'SK hynix, Micron and Samsung; Korea and the United States',as_of:'2026',horizon:'Binding while accelerator demand outruns stack capacity',kind:'Cyclical capacity, on a structurally short supplier list',sub:'Lower-bandwidth memory, at a direct cost in delivered performance',lead:'Roughly two years to add qualified stack capacity',src:'Company disclosures'}},
   {t:'Wafer probe and sort',w:'Testing die on the wafer before anything expensive is done to them. Where yield is first observed.',n:['KLA','ASE','Amkor'],note:'Cheaper to discard a die here than a package later'},
   {t:'Substrates and interposers',w:'The carrier the die sit on. Build-up film has one dominant supplier, and substrate capacity has been a live constraint.',n:['Ibiden','Shinko','Unimicron','AT&S','Ajinomoto'],c:1,note:'One dominant supplier of the insulating build-up film',
    cq:{what:'Ajinomoto build-up film and the high-layer-count substrates that use it',where:'Ajinomoto, Japan, for the film; substrate fabrication in Japan, Taiwan and Austria',as_of:'2026',horizon:'Two to three years for meaningful new substrate capacity',kind:'Structural for the film; cyclical for substrate capacity',sub:'No qualified equivalent film at the leading edge',lead:'Substrate lines take about two years to add and qualify',src:'Company disclosures'}},
   {t:'Die stacking, bonding and advanced packaging',w:'Assembling logic and memory into one package. Capacity here has rationed accelerator output — but so, at times, have wafers, HBM, substrates and test.',n:['TSMC CoWoS','ASE','Amkor','Samsung'],c:1,note:'One of several binding steps, not the only one',
    cq:{what:'2.5D advanced packaging capacity of the CoWoS type',where:'Concentrated at TSMC in Taiwan, with OSAT capacity being qualified',as_of:'2026',horizon:'Easing as capacity is added through 2026–27',kind:'Cyclical capacity constraint',sub:'OSAT alternatives qualifying; some designs can use cheaper packaging at a performance cost',lead:'Roughly 12–18 months to add and qualify a line',src:'Company disclosures'}},
   {t:'Final test, burn-in and qualification',w:'Proving the packaged part meets specification over temperature and time. Test time is capacity.',n:['ASE','Amkor','KLA'],note:'Test time per part rose with package complexity'},
   {t:'Distribution',w:'Allocating finished devices to system builders and buyers. Allocation, not price, has been the rationing mechanism.',n:['NVIDIA','Broadcom','SK hynix','Micron'],note:'Allocation is the rationing mechanism, not price'}]},
  {t:'What comes out',w:'The device categories this layer delivers into the rest of the stack.',
   stages:[
   {t:'Accelerators and custom ASICs',w:'The parts that do the arithmetic, merchant and in-house.',n:['NVIDIA','AMD','Google TPU','AWS Trainium','Microsoft Maia','Meta MTIA','Tesla AI5','Broadcom','Marvell'],note:'Into layer 4'},
   {t:'Host CPUs and control processors',w:'The processors that feed the accelerators and run everything else.',n:['Intel','AMD','Arm','NVIDIA'],note:'Into layer 4'},
   {t:'HBM, DRAM and NAND',w:'Capacity and bandwidth. Frequently the actual limit on delivered performance.',n:['SK hynix','Micron','Samsung','Kioxia'],note:'Into layers 4 and 7'},
   {t:'Switch ASICs, DPUs, NICs and retimers',w:'The silicon that moves data between processors, racks and buildings.',n:['Broadcom','Marvell','NVIDIA','Astera Labs','Credo'],note:'Into layers 4 and 6'},
   {t:'Optical DSPs, drivers and detectors',w:'The silicon and compound-semiconductor devices behind every optical link.',n:['Broadcom','Marvell','Coherent','Lumentum','ams OSRAM'],note:'Into layer 6'},
   {t:'Sensors and edge-AI SoCs',w:'Image sensors, radar and lidar front ends, and the low-power inference parts they feed.',n:['Sony','ams OSRAM','Ambarella','Hailo','Qualcomm','NVIDIA Jetson','STMicroelectronics'],note:'Into layer 10'},
   {t:'Power management and motor control',w:'Conversion and drive silicon, in the rack and in the joint.',n:['Infineon','Monolithic Power','STMicroelectronics','Vicor'],note:'Into layers 1, 4 and 10'}]}]},
4:{lead:'This layer begins where layer 3 ends — with packaged devices, not with a foundry. Five component families arrive in parallel and converge at system integration. The old chain put foundry first and a buyer last; foundry belongs upstream, and the buyer is a commercial relationship rather than a manufacturing step.',
 branches:[
  {t:'Component families',w:'Five parallel inputs. They converge at integration; none of them is downstream of another.',
   stages:[
   {t:'Compute processors',w:'Accelerators, host CPUs and custom ASICs arriving as packaged parts.',n:['NVIDIA','AMD','Intel','Broadcom','Marvell','Google TPU','AWS Trainium','Microsoft Maia','Meta MTIA'],note:'More accelerators alone do not produce more useful compute'},
   {t:'Memory and storage',w:'HBM beside the processor, DRAM behind it, and the flash and disk tiers that hold the data. Capacity and bandwidth frequently bind before arithmetic does.',n:['SK hynix','Micron','Samsung','Kioxia','Seagate','Western Digital','Pure Storage'],c:1,note:'Bandwidth, not flops, is often the limit',
    cq:{what:'HBM stacks qualified to a specific accelerator',where:'Three suppliers; Korea and the United States',as_of:'2026',horizon:'Binding while accelerator shipments grow faster than stack capacity',kind:'Cyclical capacity on a short supplier list',sub:'Lower-bandwidth configurations, at a direct performance cost',lead:'About two years to add qualified capacity',src:'Company disclosures'}},
   {t:'Networking and optics',w:'NICs, DPUs, switch silicon, retimers, transceivers and cable. Copper over short reach, optics beyond it — the two are distance domains, not old and new.',n:['Broadcom','NVIDIA NVLink','Arista','Cisco','Astera Labs','Credo','Coherent','Lumentum','InnoLight','Fabrinet','Amphenol','Corning'],note:'Copper has not been displaced; it owns the short reach'},
   {t:'Power delivery and cooling interfaces',w:'The board-level conversion and the cold plates and manifolds that mate the server to the facility loop.',n:['Monolithic Power','Infineon','Vicor','Vertiv','Boyd','Motivair (Schneider)'],note:'Where layers 1 and 4 physically meet'},
   {t:'Mechanical, PCB and manufacturing integration',w:'Boards, connectors, trays, rails and the contract manufacturing that turns parts into product.',n:['Ibiden','AT&S','Amphenol','Foxconn','Quanta','Wistron'],note:'Real volume, structurally thin margins'}]},
  {t:'Integration to operating cluster',w:'From a board to a commissioned, useful machine.',
   stages:[
   {t:'Compute modules and accelerator boards',w:'Mounting devices onto boards and modules with their power and thermal interfaces.',n:['NVIDIA','Foxconn','Quanta','Wistron','Supermicro'],note:'Where the reference design becomes a product'},
   {t:'Server, storage and network equipment',w:'Complete machines: accelerator servers, storage appliances and switches.',n:['Supermicro','Dell','HPE','Foxconn','Quanta','Arista','Cisco','NetApp','Pure Storage'],note:'The unit an operator actually buys'},
   {t:'Scale-up interconnect',w:'The tight fabric inside a node or a rack — NVLink, PCIe and CXL. Where memory coherence and latency are won or lost.',n:['NVIDIA NVLink','Broadcom','Astera Labs','Credo'],c:1,note:'The proprietary fabric is a large part of the accelerator moat',
    cq:{what:'High-bandwidth scale-up fabric within a rack',where:'NVIDIA’s NVLink ecosystem, with open alternatives at earlier maturity',as_of:'2026',horizon:'Contested from 2026 onward as UALink and Ethernet-based alternatives ship',kind:'Structural, weakening — an ecosystem lock rather than a physical one',sub:'PCIe/CXL and emerging open fabrics, at a performance and software cost',lead:'Ecosystem maturity, not manufacturing, sets the pace',src:'Vendor specifications; consortium roadmaps'}},
   {t:'Scale-out network',w:'The cluster network across racks and halls — Ethernet or InfiniBand, and the topology that decides collective performance.',n:['Arista','Broadcom','NVIDIA','Cisco','Marvell'],note:'Topology and congestion, not link speed, set training throughput'},
   {t:'Rack integration',w:'Assembling racks with their power, cooling and cabling as a single delivered unit.',n:['Foxconn','Quanta','Wistron','Supermicro','Vertiv','Dell'],note:'Increasingly shipped as a rack, not as servers'},
   {t:'Cluster integration',w:'Wiring racks into one machine: fabric bring-up, storage attachment and the physical plant that supports it.',n:['NVIDIA','Arista','Dell','HPE','Supermicro'],note:'The point at which a room becomes a computer'},
   {t:'Firmware and software enablement',w:'Firmware, drivers, compilers, libraries and cluster management. The layer that decides how much of the hardware is reachable.',n:['NVIDIA','AMD','Broadcom','Intel','Arm'],c:1,note:'The software stack is a large part of why substitution is slow',
    cq:{what:'Mature accelerator software stacks — compilers, kernels and framework support',where:'CUDA and its ecosystem; alternatives exist and are improving',as_of:'2026',horizon:'Eroding gradually rather than breaking',kind:'Structural — accumulated ecosystem, not physical scarcity',sub:'ROCm, XLA, Triton and framework-level abstraction, at a porting cost',lead:'Porting a production workload is a quarters-long project',src:'Vendor documentation; published porting studies'}},
   {t:'Qualification and commissioning',w:'Burn-in, fabric validation and acceptance testing before the cluster carries work.',n:['NVIDIA','Dell','HPE','Supermicro'],note:'Delivered is not the same as productive'},
   {t:'Sale, lease or operated compute',w:'How the machine reaches a user: outright sale, lease, or capacity sold by the hour. A commercial route, not a manufacturing step.',n:['Hyperscalers','Neoclouds','CoreWeave','Sovereign programmes','Dell','HPE'],note:'The commercial boundary of the layer'}]},
  {t:'Where it is installed',w:'The same capability class at two physical scales. Not two separate value chains.',
   stages:[
   {t:'Central — inside layer 5',w:'Accelerator servers, storage and fabric installed in a data centre hall, sized for training and cloud inference.',n:['NVIDIA','Dell','Supermicro','Arista','SK hynix'],note:'Sized for throughput'},
   {t:'Edge — inside layer 10',w:'An SoC or edge accelerator with memory, local storage and real-time I/O, sized for latency and a power budget measured in watts.',n:['NVIDIA Jetson','Qualcomm','Ambarella','Hailo','STMicroelectronics'],note:'Sized for latency and watts'}]}]},
5:{lead:'A physical enclosure with a lifecycle, and a set of commercial models that are routinely confused with it. Operator and tenant are not construction stages. Layer 5 contains the on-site part of layer 1, central layer 4, and layers 7, 8 and 9 running on it — containment is not ownership, and different companies may own the land, the building, the plant, the hardware and the workload.',
 branches:[
  {t:'Site to operating facility',w:'The lifecycle, from a map to a decommissioning plan.',
   stages:[
   {t:'Market and site selection',w:'Choosing where to look: power availability, fibre routes, latency to users, tax treatment and political tolerance.',n:['Equinix','Digital Realty','Hyperscalers'],note:'The cheapest decision to get right'},
   {t:'Resource feasibility',w:'Whether power, water and fibre can actually be delivered here, on this schedule. Nominal grid capacity is not an energisation date.',n:['Utilities','Zayo','Lumen'],c:1,note:'Deliverable power, not nominal capacity',
    cq:{what:'Deliverable large-load power at a specific site and date',where:'United States; acute in Northern Virginia, Texas and parts of the Midwest',as_of:'2026',horizon:'Five to seven years in the slowest interconnection queues',kind:'Structural — process and equipment bound',sub:'Behind-the-meter generation, co-location at existing plants, and secondary markets',lead:'Five to seven years for a new queue position',src:'FERC and RTO queue data; utility disclosures'}},
   {t:'Site control',w:'Acquiring or optioning the land, and the rights that come with it.',n:['Digital Realty','Equinix','Hyperscalers'],note:'Land is cheap; land with power is not'},
   {t:'Grid, fibre and water commitments',w:'Executed agreements rather than letters of intent. The point at which a site becomes financeable.',n:['Utilities','Constellation','Vistra','Talen','NextEra','Zayo'],c:1,note:'The scarce asset in the whole layer',
    cq:{what:'Executed interconnection and long-term power agreements at scale',where:'United States and Western Europe',as_of:'2026',horizon:'Multi-year',kind:'Structural',sub:'On-site generation, in limited blocks and with its own permitting',lead:'Years, and the queue position is itself tradeable',src:'FERC filings; company disclosures'}},
   {t:'Permitting and environmental review',w:'Local approvals, water and noise limits, and increasingly community opposition as a live schedule risk.',n:['Utilities','Hyperscalers'],note:'A social licence question as much as a legal one'},
   {t:'Financing and contractual structure',w:'How the build is paid for — balance sheet, project finance, SPVs or lease structures. This is where the risk actually sits.',n:['Hyperscalers','Neoclouds','CoreWeave','Digital Realty'],note:'Project finance, not software, is the right toolkit here'},
   {t:'Architecture and engineering',w:'Designing the electrical topology, the thermal system and the redundancy that everything else follows from.',n:['Turner','DPR','Mortenson','Clayco'],note:'Redundancy topology sets the cost floor'},
   {t:'Civil construction and powered shell',w:'Ground works, structure and envelope. Fast relative to everything around it.',n:['Turner','DPR','Mortenson','Clayco'],note:'Rarely the critical path'},
   {t:'Electrical and mechanical installation',w:'Substation, switchgear, UPS, generators, chillers and the loops. Skilled electricians are the binding trade.',n:['Rosendin','Quanta Services','MYR Group','Vertiv','Schneider Electric','Eaton','Cummins','Caterpillar'],c:1,note:'Electricians, not concrete, are the binding trade',
    cq:{what:'Qualified data-centre electrical labour',where:'United States, concentrated in a few metros',as_of:'2026',horizon:'Persistent through the current build cycle',kind:'Structural — a training pipeline problem, not a wage problem',sub:'Prefabricated and skidded plant moves work to the factory',lead:'Apprenticeship pipelines run four to five years',src:'Contractor disclosures; trade body reporting'}},
   {t:'Network and IT fit-out',w:'Installing the compute, storage and fabric, and the carrier connections that reach it.',n:['NVIDIA','Supermicro','Dell','Arista','Cisco','Equinix'],note:'Where layer 4 physically enters layer 5'},
   {t:'Commissioning and load testing',w:'Proving the facility under load before it carries production work.',n:['Vertiv','Schneider Electric','Turner'],note:'Energised is not the same as commissioned'},
   {t:'Operations, maintenance and security',w:'Running the plant: monitoring, controls, fire systems, physical security and the people on site.',n:['Equinix','Digital Realty','AWS','Azure','Google Cloud','CoreWeave'],note:'The recurring business behind the capital event'},
   {t:'Refresh and expansion',w:'Replacing hardware on a cycle much shorter than the building, and adding halls against the same connection.',n:['Hyperscalers','Neoclouds','Dell','Supermicro'],note:'Useful life assumptions are load-bearing for reported earnings'},
   {t:'Repowering, retrofit and decommissioning',w:'Converting older air-cooled halls to density they were never designed for, or retiring them.',n:['Vertiv','Schneider Electric','Digital Realty'],note:'Floor area is not AI capacity'}]},
  {t:'Commercial structures',w:'Who owns what, and who carries which risk. Business models, not construction stages.',
   stages:[
   {t:'Hyperscale self-build',w:'Owns the building and the compute, financed from operating cash flow. The strongest position in the layer.',n:['AWS','Azure','Google Cloud','Meta','Oracle'],note:'Owns both halves, funds from cash flow'},
   {t:'Build-to-suit and wholesale',w:'Developed to a single tenant’s specification on a long lease. The developer carries construction risk, the tenant carries the term.',n:['Digital Realty','Equinix'],note:'Construction risk transferred, term risk retained'},
   {t:'Colocation',w:'Retail and wholesale space where interconnection density, not floor area, is the moat.',n:['Equinix','Digital Realty'],note:'Interconnection is the moat, not square metres'},
   {t:'GPU and neocloud services',w:'Owns compute, leases the building. Long debt, short contracts and depreciating collateral — the most levered structure in the layer.',n:['CoreWeave','Neoclouds'],c:1,note:'Long debt against short contracts and depreciating collateral',
    cq:{what:'Refinancing risk on accelerator-backed debt',where:'Primarily United States',as_of:'2026',horizon:'Acute at each refinancing point',kind:'Structural to the business model rather than to the technology',sub:'Longer customer contracts or equity funding, both of which change the returns',lead:'Immediate — it is a financing condition, not a supply one',src:'Company filings; rating agency commentary'}},
   {t:'Sovereign and public-private',w:'State-backed capacity built for jurisdictional control of compute rather than for return.',n:['Sovereign programmes','Governments'],note:'Built for control, priced accordingly'},
   {t:'Edge and telecom facilities',w:'Small distributed sites at aggregation points, where latency rather than scale is the reason to build.',n:['Equinix','AT&T','Verizon','Deutsche Telekom','Lumen'],note:'Latency is the product'}]},
  {t:'What the enclosure contains',w:'Physical containment, not ownership. These layers run inside this building.',
   stages:[
   {t:'On-site layer 1 plant',w:'Substation, switchgear, UPS, backup generation, chillers and the water system.',n:['Vertiv','Schneider Electric','Eaton','Cummins','Alfa Laval'],note:'Layer 1, inside the fence'},
   {t:'Central layer 4',w:'Accelerator racks, host CPUs, HBM, storage and the network fabrics. The execution engine for everything above.',n:['NVIDIA','SK hynix','Supermicro','Dell','Arista'],note:'The installed productive equipment'},
   {t:'Layer 7 data systems',w:'Databases, object storage, data lakes and the ingestion and governance systems around them.',n:['Snowflake','Databricks','VAST Data','Pure Storage','NetApp','AWS','Google Cloud','Azure'],note:'Runs on layer 4, inside layer 5'},
   {t:'Layer 8 training and cloud inference',w:'Pre-training, post-training, evaluation and model serving.',n:['OpenAI','Anthropic','Google DeepMind','Meta','xAI','Azure','AWS','Google Cloud'],note:'Weights are portable; the compute is not'},
   {t:'Layer 9 cloud agents and applications',w:'Agent runtimes, orchestration, enterprise applications and observability.',n:['Microsoft','ServiceNow','Salesforce','Datadog','Palantir'],note:'Some agents stay here; others deploy to the edge'}]}]},
6:{lead:'A new layer, and one the earlier map did not have. Connectivity was partly hidden inside compute silicon and partly missing altogether. It spans the rack, the building, the carrier network and the link to a machine in the field — and the audit’s warning applies throughout: link speed is not application performance, and an autonomous machine cannot assume the cloud is reachable.',
 branches:[
  {t:'Component to endpoint',w:'The manufacturing and deployment chain, from a laser die to a connected device.',
   stages:[
   {t:'Optical and electronic components',w:'Lasers, modulators, photodetectors, optical DSPs and the retimers that keep copper viable at higher rates.',n:['Coherent','Lumentum','Broadcom','Marvell','ams OSRAM','Credo','Astera Labs','Sumitomo Electric'],note:'Compound semiconductors, not silicon, do the light'},
   {t:'Fibre, preforms and cable',w:'Glass preforms drawn into fibre and cabled. A capital-intensive business with a long capacity cycle.',n:['Corning','Prysmian','Fujikura','Sumitomo Electric'],c:1,note:'Preform capacity moves on a multi-year cycle',
    cq:{what:'Optical fibre and cable supply against a step change in data-centre interconnect demand',where:'Global; preform capacity concentrated in the United States, Japan and China',as_of:'2026',horizon:'Two to three years to add capacity',kind:'Cyclical capacity on a concentrated base',sub:'Higher-count cables and better route utilisation defer new build',lead:'Roughly two years to commission new draw capacity',src:'Company disclosures; industry associations'}},
   {t:'Modules, transceivers and cables',w:'Packaging components into pluggable optics and active and passive copper assemblies. Copper still owns the short reach.',n:['InnoLight','Fabrinet','Coherent','Lumentum','Amphenol','Credo'],note:'Not every high-bandwidth link is optical'},
   {t:'Switching, routing and transport equipment',w:'The boxes: data-centre switches, carrier routers and coherent optical transport systems.',n:['Arista','Cisco','Nokia','Ciena','Broadcom','NEC','Huawei'],note:'Merchant switch silicon commoditised the box, not the software'},
   {t:'Data-centre and metro networks',w:'Interconnecting halls, campuses and buildings in a region, plus the carrier-neutral facilities where networks meet.',n:['Equinix','Digital Realty','Zayo','Lumen','Ciena'],c:1,note:'Metro fibre routes are effectively unrepeatable assets',
    cq:{what:'Metro dark fibre and conduit on established routes',where:'Major data-centre metros in the United States and Western Europe',as_of:'2026',horizon:'Structural',kind:'Structural — rights of way and construction permits, not manufacturing',sub:'Wavelength services over existing fibre, at a recurring cost',lead:'New metro builds take years and frequently cannot be permitted at all',src:'Operator disclosures; municipal permitting records'}},
   {t:'Long-haul and subsea backbone',w:'Transoceanic systems and terrestrial long-haul. Three firms in the world can lay a transoceanic cable, and hyperscalers now fund much of it.',n:['SubCom','NEC','Nokia','Lumen','Zayo'],c:1,note:'Three credible suppliers of transoceanic systems',
    cq:{what:'Submarine cable system supply and installation',where:'Global; SubCom, Alcatel Submarine Networks and NEC hold the non-Chinese market',as_of:'2026',horizon:'Structural',kind:'Structural — specialised ships and installation capability',sub:'Satellite for low bandwidth; nothing at transoceanic capacity',lead:'Three to four years from contract to service',src:'TeleGeography; supplier disclosures'}},
   {t:'Peering, exchange and content delivery',w:'Where networks exchange traffic and where content is cached close to users.',n:['Cloudflare','Akamai','Equinix','Lumen'],note:'Cheaper to move the content than the request'},
   {t:'Access network',w:'The last segment: fixed, Wi-Fi, private wireless, mobile and satellite. Three vendors can build a national mobile network.',n:['AT&T','Verizon','Deutsche Telekom','Ericsson','Nokia','Qualcomm','Starlink','Huawei'],note:'Coverage, not capacity, decides whether a fleet can operate'},
   {t:'Enterprise and embodied endpoint',w:'Gateways, on-machine radios, time synchronisation and deterministic networking at the edge of the network.',n:['Cisco','Qualcomm','NVIDIA Jetson','Starlink'],note:'The machine must stay safe when this link degrades'}]},
  {t:'What actually flows',w:'Three traffic classes with different directions, volumes and failure consequences.',
   stages:[
   {t:'Sensor and experience data, edge to centre',w:'Selected telemetry and experience travelling from layer 10 to layer 7. Selected, because uploading raw sensor streams is neither affordable nor lawful in most settings.',n:['On-robot selection','Starlink','AT&T','Verizon','Cloudflare'],note:'Selection happens on the machine, not in the cloud'},
   {t:'Models, policies and software updates, centre to edge',w:'Validated weights and software returning from layers 8 and 9 to the machine. Signed, staged and reversible, or it is a fleet-wide outage.',n:['Cloudflare','Akamai','Qualcomm','NVIDIA Jetson'],note:'An update path is also an attack surface'},
   {t:'Supervision, fleet control and tools',w:'Bidirectional traffic: teleoperation, human approval, tool calls and fleet coordination. The class with the tightest latency budget.',n:['Cisco','Verizon','AT&T','Starlink'],c:1,note:'Safety-critical control must not depend on this link',
    cq:{what:'Continuous low-latency connectivity for remote supervision of autonomous machines',where:'Varies by deployment; worst in rural, indoor-industrial and maritime settings',as_of:'2026',horizon:'Persistent',kind:'Structural — a physics and coverage limit, not a supply one',sub:'Local autonomy with a defined safe state; store-and-forward for non-critical traffic',lead:'Not resolvable by procurement; it is a design constraint',src:'IEEE and 3GPP latency work; operator coverage data'}}]}]},
7:{lead:'The second new layer. Data was a single card inside the model layer, which understated it: data supports evaluation, retrieval, monitoring, personalisation, simulation and safety investigation, not only training. The audit is firm on the distinction this layer exists to enforce — possessing data is not owning it, and owning it is not having the right to train on it.',
 branches:[
  {t:'Origin to governed data product',w:'The lifecycle, including the stages that decide whether data can lawfully be used at all.',
   stages:[
   {t:'Source discovery and rights',w:'Establishing where data comes from and what may be done with it: licence, consent, purpose and retention, tracked separately from possession.',n:['Reddit','Shutterstock','Thomson Reuters','Licensed corpora','Collibra'],c:1,note:'Possession, ownership and the right to train are three different things',
    cq:{what:'Clear, transferable rights to use third-party content for model training',where:'Divergent across the United States, European Union and United Kingdom',as_of:'2026',horizon:'Unresolved; active litigation and legislation in several jurisdictions',kind:'Structural — legal rather than technical',sub:'Licensed corpora, synthetic generation and first-party data',lead:'Court and legislative timelines, not procurement timelines',src:'Ongoing litigation; EU AI Act and national implementations'}},
   {t:'Acquisition and contracting',w:'Buying or licensing the data, and negotiating what happens when the licence ends.',n:['Reddit','Shutterstock','Thomson Reuters','Appen'],note:'Termination terms matter more than price'},
   {t:'Ingestion',w:'Streaming and batch movement from source systems into storage, at volumes that are themselves an infrastructure problem.',n:['Confluent','Fivetran','Databricks','Snowflake'],note:'Where schema drift becomes someone’s problem'},
   {t:'Storage and catalogue',w:'Object stores, lakes, warehouses and the metadata that makes them findable. Read bandwidth, not capacity, is what training runs starve on.',n:['AWS','Google Cloud','Azure','Snowflake','Databricks','VAST Data','Pure Storage','NetApp','Seagate'],c:1,note:'Training starves on read bandwidth, not on capacity',
    cq:{what:'Sustained read bandwidth into large training clusters',where:'Global; a design constraint in every large cluster',as_of:'2026',horizon:'Persistent as cluster size grows',kind:'Structural — a system-design constraint rather than a supply shortage',sub:'Caching tiers, data layout and format changes',lead:'Addressed by design, not by lead time',src:'Vendor architecture guides; published cluster designs'}},
   {t:'Quality processing',w:'Cleaning, normalisation, filtering and deduplication. More data is not automatically better data.',n:['Databricks','Snowflake','Scale AI'],note:'Deduplication changes model behaviour measurably'},
   {t:'Annotation and human feedback',w:'Labelling, ranking and preference collection. A large, genuinely human-labour-intensive industry.',n:['Scale AI','Surge','Mercor','Appen'],note:'Where a large part of post-training cost actually sits'},
   {t:'Governance, lineage and provenance',w:'Recording where every record came from, who may see it, and how long it is kept. The infrastructure that makes a rights claim auditable.',n:['Collibra','Palantir','Databricks','Snowflake'],c:1,note:'Provenance is what makes a data moat defensible rather than merely large',
    cq:{what:'End-to-end dataset lineage sufficient to evidence training rights',where:'Required in the European Union; expected by enterprise buyers elsewhere',as_of:'2026',horizon:'Tightening',kind:'Structural — regulatory and contractual',sub:'None; retrofitting lineage after the fact is largely infeasible',lead:'Years, because it has to be built in from ingestion',src:'EU AI Act; enterprise procurement standards'}},
   {t:'Curation and mixture design',w:'Choosing what actually goes into a training run, in what proportion. One of the least published and most consequential decisions in the stack.',n:['OpenAI','Anthropic','Google DeepMind','Meta','Synthetic generation'],note:'Mixture design is a bigger lever than raw volume'},
   {t:'Training, evaluation and retrieval use',w:'Where the data is consumed: training corpora, held-out evaluation sets with contamination controls, and retrieval indexes serving live queries.',n:['Elastic','Pinecone','MongoDB','Databricks','OpenAI','Anthropic'],note:'Evaluation data must never enter training'},
   {t:'Monitoring and feedback',w:'Capturing what the system did in production and feeding it back, subject to the same rights and retention rules as anything else.',n:['Datadog','Palantir','On-robot selection'],note:'Production output is itself data with a licence question'},
   {t:'Retention, deletion and incident response',w:'Deleting on schedule and on request, and being able to answer what was in a dataset after something goes wrong.',n:['Collibra','Palantir','AWS','Azure'],note:'Deletion is a capability, not a policy'}]},
  {t:'Four data products',w:'They share infrastructure and almost nothing else. Conflating them is the most common error in this layer.',
   stages:[
   {t:'Training and post-training datasets',w:'Corpora assembled for pre-training and alignment, where mixture, rights and deduplication dominate.',n:['Licensed corpora','Reddit','Shutterstock','Scale AI','Surge','Synthetic generation'],note:'Most collected data should never enter this'},
   {t:'Evaluation and safety datasets',w:'Held-out sets for measurement and red-teaming, whose whole value depends on never being trained on.',n:['Scale AI','Surge','Mercor','Frontier labs'],note:'Contamination destroys the asset silently'},
   {t:'Retrieval-time enterprise knowledge',w:'The corpus an agent consults at inference: documents, records and systems of record, governed by the customer’s own permissions.',n:['Elastic','Pinecone','MongoDB','Snowflake','Databricks','Palantir'],note:'Belongs to the customer, not to the model'},
   {t:'Operational sensor and experience data',w:'What fleets generate in the field, selected on the machine and returned for evaluation and retraining.',n:['On-robot selection','Tesla','Waymo','Scale AI'],note:'Selection criteria are value, cost, privacy, connectivity and safety'}]}]},
8:{lead:'Compute and data are parallel inputs to model development — neither is downstream of the other, which the old chain implied. Training and inference are also different markets with different workload shapes, hardware economics and customers. Weights are portable artifacts, so this layer runs in the data centre and, optimised, inside the machine at the edge.',
 branches:[
  {t:'Research to deployed capability',w:'The development chain. Compute and data enter it in parallel at the start.',
   stages:[
   {t:'Research and architecture',w:'Architecture selection and scaling experiments. Small spend, and the largest single determinant of what the run produces.',n:['OpenAI','Anthropic','Google DeepMind','Meta','xAI','Mistral','DeepSeek'],note:'The cheapest stage to be right in'},
   {t:'Compute preparation',w:'Securing and configuring the cluster: allocation, fabric topology, distributed-training software and checkpointing.',n:['NVIDIA','Google TPU','AWS Trainium','AMD','CoreWeave','Azure'],note:'A parallel input, not an upstream supplier of data'},
   {t:'Data and mixture preparation',w:'The curated corpora arriving from layer 7, with the mixture design that decides what the model actually learns.',n:['Scale AI','Surge','Mercor','Licensed corpora','Synthetic generation'],note:'A parallel input, not downstream of compute'},
   {t:'Pre-training',w:'The large run. Capital-intensive, long-duration and largely unrecoverable if the architecture choice was wrong.',n:['OpenAI','Anthropic','Google DeepMind','Meta','xAI','Mistral','DeepSeek','Alibaba Qwen'],note:'Where the capital is spent'},
   {t:'Post-training and alignment',w:'Supervised fine-tuning, preference-based training, reinforcement learning and tool-use training. Increasingly where capability differences are actually made.',n:['OpenAI','Anthropic','Google DeepMind','Scale AI','Surge','Mercor'],note:'Cheaper than pre-training, and increasingly decisive'},
   {t:'Evaluation, red-teaming and safety validation',w:'Measuring capability and failure modes before release, against held-out sets that must stay uncontaminated.',n:['Anthropic','OpenAI','Google DeepMind','Frontier labs'],note:'The gate before anything ships'},
   {t:'Optimisation and compilation',w:'Distillation, pruning, quantisation and compilation. What makes a model cheap enough to serve, and small enough to run on a machine.',n:['NVIDIA','Qualcomm','Hailo','Ambarella','Together'],note:'The step that makes edge inference possible at all'},
   {t:'Deployment and inference serving',w:'Engines, caching, batching and routing. A different business from training: latency-bound, utilisation-sensitive and continuously priced.',n:['Azure','AWS','Google Cloud','Together','Fireworks','Baseten','CoreWeave'],note:'Different workload shape, different economics'},
   {t:'Monitoring, rollback and retraining',w:'Watching production behaviour, responding to incidents, reverting and refreshing. The loop that keeps a deployed model current.',n:['Datadog','OpenAI','Anthropic','Google DeepMind'],note:'Rollback is a capability, not a plan'},
   {t:'Distribution and licensing',w:'How capability reaches a user: API, licence, embedded deployment or open weights. Distribution is one possible moat among several, not the only one.',n:['ChatGPT','Gemini','Copilot','Claude','Enterprise APIs','Open weights','Alibaba Qwen','DeepSeek'],note:'Performance, cost, feedback, ecosystem and trust are moats too'}]},
  {t:'Three deployment modes',w:'The same weights, three physical placements with different constraints.',
   stages:[
   {t:'Central training',w:'Large clusters inside layer 5. Throughput-bound, scheduled, and the only place the largest runs can happen.',n:['NVIDIA','Google TPU','AWS Trainium','CoreWeave','Azure'],note:'Throughput-bound'},
   {t:'Cloud inference',w:'Served from layer 5 across layer 6. Latency-sensitive, and priced per token in a market that has repriced repeatedly.',n:['Azure','AWS','Google Cloud','Together','Fireworks','Baseten'],note:'Latency-bound and continuously repriced'},
   {t:'Edge inference',w:'Optimised models running on layer 4 hardware inside layer 10, under hard power, thermal and latency budgets — and without assuming a network.',n:['NVIDIA Jetson','Qualcomm','Hailo','Ambarella','STMicroelectronics','Tesla FSD silicon'],note:'Must work when the link is gone'}]}]},
9:{lead:'Model outputs become controlled work here. The correction the audit insists on: security, identity, evaluation and observability are not final stages purchased after the application — they run across the whole layer as a control plane. And the tool and integration layer, which was missing entirely, is what makes an agent useful at all.',
 branches:[
  {t:'From model access to operated work',w:'The execution chain. Every stage in it is subject to the control plane below.',
   stages:[
   {t:'Model access and routing',w:'Gateways that choose which model handles which request, and hold the commercial relationship with the labs.',n:['OpenAI','Anthropic','Google','Open weights','Microsoft'],note:'Routing is where cost and quality are traded'},
   {t:'Context, retrieval and memory',w:'Assembling what the model sees: retrieved documents, short-term state and long-term memory, subject to the customer’s permissions.',n:['Elastic','Pinecone','MongoDB','Snowflake','Databricks'],note:'Reaches into layer 7, under the customer’s access rules'},
   {t:'Connectors and tools',w:'APIs, enterprise systems, browsers, code environments and machines. The stage that was missing, and the one that makes agents useful.',n:['Microsoft','Salesforce','SAP','ServiceNow','LangChain'],c:1,note:'Permissions and transaction boundaries are the design problem',
    cq:{what:'Safe, permissioned tool access into enterprise systems of record',where:'Enterprise deployments generally',as_of:'2026',horizon:'Early and unsettled',kind:'Structural — an authorisation and liability problem, not a capability one',sub:'Read-only integration and human approval before any write',lead:'Set by enterprise security review cycles, not by vendors',src:'Enterprise security frameworks; vendor documentation'}},
   {t:'Planning and orchestration',w:'Task decomposition, workflow state and coordination. Note that deterministic workflows with model steps are frequently preferable to autonomy.',n:['Microsoft','ServiceNow','LangChain','Temporal'],note:'Autonomy is a choice, not an upgrade'},
   {t:'Secure execution and workflow state',w:'Sandboxes, durable execution, queues and retries. Where a long-running process survives a failure without repeating an irreversible action.',n:['Temporal','Microsoft','Databricks'],note:'Retries are dangerous around side effects'},
   {t:'Human oversight',w:'Approval, override and escalation. For high-consequence tasks this is the control that makes deployment possible at all.',n:['ServiceNow','Microsoft','Palantir'],note:'The condition of deployment in regulated settings'},
   {t:'Application and interface',w:'The surface a person actually uses. Agents mostly operate through applications rather than replacing them.',n:['Salesforce','ServiceNow','Adobe','Intuit','SAP','Microsoft'],c:1,note:'Owning the workflow is where value is captured',
    cq:{what:'Ownership of the customer workflow and system of record',where:'Enterprise software generally',as_of:'2026',horizon:'Contested over the next several years',kind:'Structural — switching cost and integration depth',sub:'Agent-native challengers reaching the same systems through connectors',lead:'Enterprise replacement cycles run years',src:'Vendor disclosures; enterprise procurement patterns'}},
   {t:'Enterprise integration',w:'Wiring into systems of record, identity and change management. Where a pilot either becomes production or dies.',n:['SAP','ServiceNow','Salesforce','Palantir','Microsoft'],note:'The commonest place a pilot fails'},
   {t:'Operations and continuous improvement',w:'Running the deployed system: cost, latency, reliability and the evaluation loop that keeps quality from drifting.',n:['Datadog','Dynatrace','Grafana','Splunk (Cisco)'],note:'Quality drifts even when nothing is changed'}]},
  {t:'Control plane',w:'Cross-cutting. These operate across every stage above and across layers 7 to 10 — not after them.',
   stages:[
   {t:'Identity and permissions',w:'Human and machine identity, secrets and least-privilege access. An agent needs an identity of its own, with a smaller grant than the person it acts for.',n:['Okta','Microsoft Entra','CrowdStrike'],note:'Machine identity is the unsolved part'},
   {t:'Cybersecurity and guardrails',w:'Protecting the systems the agent reaches, and constraining what it may do when a tool call goes wrong or an input is hostile.',n:['CrowdStrike','Palo Alto Networks','Zscaler','Cloudflare'],note:'Prompt-borne instruction is an authorisation problem'},
   {t:'Evaluation and testing',w:'Continuous measurement of the deployed system, not just of the model. Runs before and after every change.',n:['Datadog','Frontier labs','Scale AI'],note:'The model is one component of a system that must be tested whole'},
   {t:'Tracing and observability',w:'Seeing what the system actually did, step by step, well enough to explain it afterwards.',n:['Datadog','Dynatrace','Splunk (Cisco)','Grafana'],note:'Non-determinism makes tracing mandatory, not optional'},
   {t:'Audit, compliance and cost control',w:'Evidence for regulators and auditors, and management of the spend the whole thing generates.',n:['ServiceNow','Palantir','Datadog','Microsoft'],note:'Usage is normally opex; some owned infrastructure and qualifying development is not'}]}]},
10:{lead:'Six component branches converge at machine integration, then a lifecycle chain runs from integration to refurbishment. Inside the machine, sensors feed edge compute, which feeds local models, which feed control software, which drives actuators — and the loop closes back through layers 6, 7 and 8. Two claims from the old chain are gone: not every actuator needs a rare-earth magnet, and no universal BOM percentage applies across robot types.',
 branches:[
  {t:'Component branches',w:'Six parallel subsystem inputs. They converge at integration; none is upstream of another.',
   stages:[
   {t:'Structure and precision mechanics',w:'Chassis, covers, sealing, bearings, gears, screws and reducers. The tolerance chain that decides repeatability.',n:['Harmonic Drive Systems','Nabtesco','THK','NSK','Hiwin','Green Harmonic','Leader Drive'],c:1,note:'Precision reducers are the genuine mechanical chokepoint',
    cq:{what:'High-precision strain-wave and cycloidal reducers',where:'Japanese suppliers hold the majority; Chinese suppliers scaling at lower price and rising quality',as_of:'2026',horizon:'Narrowing over three to five years',kind:'Structural — process capability and accumulated tolerance know-how',sub:'Chinese reducers at lower cost, with a repeatability trade; direct-drive designs avoid them entirely',lead:'Qualification of an alternative into a platform takes several quarters',src:'Company disclosures; International Federation of Robotics'}},
   {t:'Actuation, transmission and power electronics',w:'Motors, drives, brakes and joint modules. Many compact designs use permanent magnets; induction, reluctance, hydraulic and pneumatic actuation do not.',n:['Nidec','Sanhua','Tuopu','Hyundai Mobis','Regal Rexnord','Infineon','STMicroelectronics'],note:'Magnet dependence is a design choice, not a law'},
   {t:'Magnets and magnetic materials',w:'Where a design does use permanent magnets, this is the exposure — and it sits in separation and sintering, not in the ore.',n:['China separation capacity','JL MAG','Lynas','MP Materials','Neo Performance','Solvay'],c:1,note:'The exposure is separation and magnet-making, not mining',
    cq:{what:'Sintered NdFeB magnets containing dysprosium and terbium, and the separation technology behind them',where:'China holds most separation and magnet-making capacity, and controls export of the separation technology itself',as_of:'2026',horizon:'Five years or more for meaningful alternative capacity',kind:'Structural',sub:'Ferrite and non-permanent-magnet motor topologies, at a power-density cost; recycled magnet feedstock at small volume',lead:'Years to build and qualify separation and sintering capacity',src:'USGS; Chinese export-control notices'}},
   {t:'Sensors and perception modules',w:'Cameras, lidar, radar, microphones, tactile arrays and the inertial, force, torque and position sensing that closes the control loop.',n:['Sony','ams OSRAM','Keyence','ATI Industrial','Renishaw','Bosch','STMicroelectronics'],note:'Proprioception matters as much as vision'},
   {t:'Edge compute, memory and communications',w:'The SoC or accelerator, memory, local storage, real-time I/O and the radios. Layer 4 and layer 6, at machine scale.',n:['NVIDIA Jetson','Qualcomm','Ambarella','Hailo','Tesla FSD silicon','STMicroelectronics'],note:'Layer 4 inside layer 10'},
   {t:'Battery, power and thermal',w:'Cells, packs, conversion, distribution and heat removal from a sealed moving machine. The subsystem that sets run time and continuous torque.',n:['CATL','LG Energy Solution','Tesla','Infineon','Boyd','Sanhua'],note:'280–300 Wh/kg is close to the practical ceiling'},
   {t:'End effectors and application tools',w:'Hands, grippers, tool changers and the task-specific tooling that decides what the machine can actually do.',n:['ATI Industrial','Renishaw','Sanhua','Symbotic'],note:'Where general-purpose hardware meets a specific job'}]},
  {t:'Integration and lifecycle',w:'From components to a fleet in service, and back again.',
   stages:[
   {t:'Subsystem modules',w:'Joint modules, sensor heads and compute units built as replaceable assemblies.',n:['Nidec','Harmonic Drive Systems','Tuopu','Sanhua','Hyundai Mobis'],note:'Modularity decides field serviceability'},
   {t:'Mechanical and electrical integration',w:'Building the machine: structure, harness, thermal path and the assembly process itself.',n:['Tesla','Figure','Agility','Apptronik','Unitree','UBTech','Boston Dynamics','AgiBot'],note:'Design for manufacture is where unit cost is set'},
   {t:'Firmware and real-time control',w:'Low-level control, drive tuning and the deterministic loops safety depends on.',n:['Tesla','Boston Dynamics','Bosch','STMicroelectronics'],note:'Hard real-time, and not negotiable'},
   {t:'Model and software integration',w:'Perception, world models, policies and the agent logic from layers 8 and 9, running locally.',n:['NVIDIA','Figure','Tesla','Boston Dynamics','Google DeepMind'],note:'Layers 8 and 9 inside layer 10'},
   {t:'Simulation and digital twins',w:'Synthetic environments for training and for validating changes before they touch a physical machine.',n:['NVIDIA','Siemens','Tesla','Waymo'],note:'Cheaper failures, and the only affordable coverage of rare events'},
   {t:'Factory test and calibration',w:'Per-unit calibration and quality control. Where a design that works becomes a fleet that works.',n:['Keyence','Renishaw','Tesla','UBTech'],note:'Per-unit calibration is a real cost line'},
   {t:'Safety validation and certification',w:'Functional safety, emergency systems, redundancy and, where it applies, third-party certification.',n:['Bosch','Boston Dynamics','Governments'],note:'The gate between a demonstration and a deployment'},
   {t:'Application deployment',w:'Putting machines into a specific workflow at a customer site, with the integration that requires.',n:['BMW','Amazon','Symbotic','Logistics operators','Deere'],note:'Deployment is an integration project, not a delivery'},
   {t:'Fleet operations and maintenance',w:'Monitoring, teleoperation, spares, repair and the intervention rate that decides the economics.',n:['Maintenance depots','Logistics operators','Amazon','Waymo'],note:'Intervention rate is the number that matters'},
   {t:'Experience-data selection',w:'Choosing on the machine what is worth keeping. Bandwidth, privacy, cost and retention force the choice locally.',n:['On-robot selection','Tesla','Waymo','Scale AI'],note:'Raw sensor streams are not uploaded'},
   {t:'Retraining and update',w:'Curated experience returning through layers 6, 7 and 8, and validated updates coming back. This is where the loop either closes or the thesis stops compounding.',n:['Frontier labs','Scale AI','NVIDIA','Tesla'],note:'The loop closes here, or it does not compound'},
   {t:'Refurbishment and recycling',w:'Second life for the machine, and recovery of magnets, cells and metals at end of life.',n:['Maintenance depots','Aurubis','Neo Performance'],note:'Recovered feedstock scales with the installed base'}]},
  {t:'Inside the machine',w:'The internal containment the audit requires, and the loop it closes.',
   stages:[
   {t:'Sensors',w:'Vision, tactile, audio, proprioception and environment sensing. The conversion of physical phenomena into data.',n:['Sony','ams OSRAM','Keyence','Bosch','ATI Industrial'],note:'The observe step'},
   {t:'Edge compute — layer 4',w:'SoC, memory, local storage and real-time I/O, under a power budget measured in watts.',n:['NVIDIA Jetson','Qualcomm','Ambarella','Hailo','Tesla FSD silicon'],note:'Layer 4, at machine scale'},
   {t:'Local models — layer 8',w:'Perception, world model and policy running locally, because a safety-critical loop cannot wait for the cloud.',n:['NVIDIA','Google DeepMind','Tesla','Figure'],note:'Layer 8, optimised and local'},
   {t:'Agent and control — layer 9',w:'Planning, tool use, safety supervision and control coordination on the machine itself.',n:['Boston Dynamics','Tesla','Figure','Apptronik'],note:'Layer 9, with a defined safe state'},
   {t:'Actuators',w:'Motors, drives, joints, wheels, grippers and effectors. Where the decision becomes a change in the physical world.',n:['Nidec','Harmonic Drive Systems','Tuopu','Sanhua','ATI Industrial'],note:'The act step'},
   {t:'Battery, power and thermal system',w:'Supports every block above it. Not a stage in the loop — a service to all of them.',n:['CATL','LG Energy Solution','Infineon','Boyd'],note:'Serves the whole internal chain'}]}]},
};

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
6:{lead:'Connectivity, optical components and network infrastructure. Route and subsea figures are the most stable numbers in this layer; component pricing is the least.',
 items:[
  ['TeleGeography','Submarine cable systems, routes, capacity and ownership','https://www.telegeography.com/'],
  ['International Telecommunication Union','Network standards, spectrum and access statistics','https://www.itu.int/'],
  ['IEEE 802.3 Ethernet Working Group','Ethernet rate standards and the physical layers behind them','https://www.ieee802.org/3/'],
  ['3GPP','Mobile access specifications, including latency and reliability targets','https://www.3gpp.org/'],
  ['Company disclosure — Corning, Ciena, Arista, Nokia, Ericsson, Equinix, Coherent','Segment revenue, capacity, backlog and customer concentration','https://www.sec.gov/edgar/search/']]},
7:{lead:'Data infrastructure, rights and annotation. The legal position is moving, so anything here about training rights is a snapshot rather than a settled fact.',
 items:[
  ['EU Artificial Intelligence Act','Training-data transparency and record-keeping obligations','https://artificialintelligenceact.eu/'],
  ['US Copyright Office','Registration guidance and reports on generative AI and training data','https://www.copyright.gov/'],
  ['NIST AI Risk Management Framework','Data governance, provenance and documentation practice','https://www.nist.gov/itl/ai-risk-management-framework'],
  ['Company disclosure — Snowflake, Elastic, Palantir, Pure Storage, Confluent, Reddit','Revenue, retention, licensing arrangements and customer concentration','https://www.sec.gov/edgar/search/'],
  ['Published cluster architectures','Storage throughput and data-pipeline design in large training systems','https://www.nist.gov/']]},
8:{lead:'Frontier models. This layer has the weakest public data in the report: capability rankings are contested, and no reliable market share series exists.',
 items:[
  ['Epoch AI','Training compute estimates, model release tracking and scaling analysis','https://epoch.ai/'],
  ['Stanford HAI AI Index','Annual measurement of capability, investment and deployment','https://hai.stanford.edu/ai-index'],
  ['LMArena','Community preference rankings across frontier models','https://lmarena.ai/'],
  ['Company and laboratory publications','Model cards, system cards and technical reports as published by each laboratory','https://epoch.ai/']]},
9:{lead:'Enterprise software and security. Share figures here come from vendor-funded analyst research and should be read as positional rather than precise.',
 items:[
  ['Gartner','Enterprise software, security and IT services market sizing','https://www.gartner.com/'],
  ['International Data Corporation','Security, data platform and observability share estimates','https://www.idc.com/'],
  ['Canalys','Cybersecurity channel and vendor share tracking','https://www.canalys.com/'],
  ['Company disclosure — CrowdStrike, Palo Alto, Snowflake, Datadog, ServiceNow, Salesforce','ARR, net revenue retention, remaining performance obligations','https://www.sec.gov/edgar/search/']]},
10:{lead:'Humanoids and precision components. The reducer capacity denominator behind the fiftyfold figure is a derivation, not a disclosed statistic, and is the number here most in need of independent verification.',
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
  if(t.length===1){
    const open=typeof TVSYM!=='undefined'&&TVSYM[name];
    return (open
      ? `<button type="button" class="co-name co-link" data-co="${_escAttr(name)}" title="${_escAttr(name)} — market information">${esc(name)}</button>`
      : `<span class="co-name">${esc(name)}</span>`)+
      `<span class="co-tick">${lnk(t[0][0],t[0][1])}</span>`;
  }
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
 'Frontier labs':[null,null,null],'Layer 8':[null,null,null],'Open weights':[null,null,null],
 'Enterprise APIs':[null,null,null],'Licensed corpora':[null,null,null],
 'Synthetic generation':[null,null,null],'On-robot selection':[null,null,null],
 'Sovereign programmes':[null,null,null],'Logistics operators':[null,null,null],
 'Maintenance depots':[null,null,null],'LangChain':[null,null,'United States'],
 'Temporal':[null,null,'United States'],'Grafana':[null,null,'United States'],
 'Together':[null,null,'United States'],'Fireworks':[null,null,'United States'],
 'Baseten':[null,null,'United States'],
 "Fluence":["FLNC","stocks/flnc","United States"],
 "Infineon":["ETR:IFX","quote/etr/ifx","Germany"],
 "Monolithic Power":["MPWR","stocks/mpwr","United States"],
 "Vicor":["VICR","stocks/vicr","United States"],
 "CATL":["SHE:300750","quote/she/300750","China"],
 "LG Energy Solution":["KRX:373220","quote/krx/373220","South Korea"],
 "Intel":["INTC","stocks/intc","United States"],
 "Seagate":["STX","stocks/stx","United States"],
 "Western Digital":["WDC","stocks/wdc","United States"],
 "Kioxia":["TYO:285A","quote/tyo/285a","Japan"],
 "Cisco":["CSCO","stocks/csco","United States"],
 "Nokia":["HEL:NOKIA","quote/hel/nokia","Finland"],
 "Ericsson":["STO:ERIC-B","quote/sto/eric-b","Sweden"],
 "Ciena":["CIEN","stocks/cien","United States"],
 "Fujikura":["TYO:5803","quote/tyo/5803","Japan"],
 "Sumitomo Electric":["TYO:5802","quote/tyo/5802","Japan"],
 "NEC":["TYO:6701","quote/tyo/6701","Japan"],
 "Lumen":["LUMN","stocks/lumn","United States"],
 "Cloudflare":["NET","stocks/net","United States"],
 "Akamai":["AKAM","stocks/akam","United States"],
 "AT&T":["T","stocks/t","United States"],
 "Verizon":["VZ","stocks/vz","United States"],
 "Deutsche Telekom":["ETR:DTE","quote/etr/dte","Germany"],
 "Starlink":[null,null,"United States"],
 "Zayo":[null,null,"United States"],
 "SubCom":[null,null,"United States"],
 "Huawei":[null,null,"China"],
 "Elastic":["ESTC","stocks/estc","United States"],
 "Palantir":["PLTR","stocks/pltr","United States"],
 "Pure Storage":["PSTG","stocks/pstg","United States"],
 "NetApp":["NTAP","stocks/ntap","United States"],
 "VAST Data":[null,null,"United States / Israel"],
 "Fivetran":[null,null,"United States"],
 "Reddit":["RDDT","stocks/rddt","United States"],
 "Shutterstock":["SSTK","stocks/sstk","United States"],
 "Thomson Reuters":["TRI","stocks/tri","Canada"],
 "Appen":["ASX:APX","quote/asx/apx","Australia"],
 "Pinecone":[null,null,"United States"],
 "Collibra":[null,null,"Belgium"]
};

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

/* Company marks. Listed companies from CompaniesLogo.com; private and
   unlisted ones from their own sites' icons. Both vendored into
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
,
 'AT&S':'ats',
 'AgiBot':'agibot',
 'Agility':'agilityrobotics',
 'Anthropic':'anthropic',
 'Apptronik':'apptronik',
 'Baseten':'baseten',
 'Bosch':'bosch',
 'Boston Dynamics':'bostondynamics',
 'Boyd':'boydcorp',
 'ChatGPT':'openai',
 'Claude':'anthropic',
 'DPR':'dpr',
 'Databricks':'databricks',
 'DeepSeek':'deepseek',
 'Figure':'figure',
 'Fireworks':'fireworks',
 'Grafana':'grafana',
 'Green Harmonic':'chinaharmonicdrive',
 'Hemlock':'hscpoly',
 'Hiwin':'hiwin',
 'InnoLight':'innolight',
 'JL MAG':'jlmag',
 'JSR':'jsr',
 'LangChain':'langchain',
 'Leader Drive':'leaderdrive',
 'LiquidStack':'liquidstack',
 'Mercor':'mercor',
 'Mistral':'mistral',
 'Mortenson':'mortenson',
 'Neo Performance':'neomaterials',
 'OCI':'oracle',
 'OpenAI':'openai',
 'Precision Castparts':'precast',
 'Rosendin':'rosendin',
 'Sanhua':'sanhuaeurope',
 'Scale AI':'scale',
 'ServiceNow':'servicenow',
 'Shinko':'shinko-el',
 'Sibelco':'sibelco',
 'Surge':'surgehq',
 'Temporal':'temporal',
 'Together':'together',
 'Turner':'turnerconstruction',
 'UBTech':'ubtrobot',
 'Unitree':'unitree',
 'Zeiss SMT':'zeiss',
 'xAI':'x'
};
/* Exchange-qualified TradingView symbols. US exchanges resolved from listing
   pages; the rest mapped from the report's own exchange prefixes to
   TradingView's codes (ETR->XETR, TYO->TSE, TPE->TWSE, EPA/EBR->EURONEXT,
   STO->OMXSTO, SWX->SIX, BIT->MIL). Entities absent here are private or
   not separately listed, and their logos stay non-interactive. */
const TVSYM={"ABB": "SIX:ABBN","AMD": "NASDAQ:AMD","ASE": "NYSE:ASX","ASML": "NASDAQ:ASML","AWS": "NASDAQ:AMZN","AWS Trainium": "NASDAQ:AMZN","Adobe": "NASDAQ:ADBE","Air Liquide": "EURONEXT:AI","Ajinomoto": "TSE:2802","Alfa Laval": "OMXSTO:ALFA","Alibaba Qwen": "NYSE:BABA","Amazon": "NASDAQ:AMZN","Ambarella": "NASDAQ:AMBA","Amkor": "NASDAQ:AMKR","Amphenol": "NYSE:APH","Applied Materials": "NASDAQ:AMAT","Arista": "NYSE:ANET","Arm": "NASDAQ:ARM","Astera Labs": "NASDAQ:ALAB","Aurubis": "XETR:NDA","Azure": "NASDAQ:MSFT","BHP": "NYSE:BHP","BMW": "XETR:BMW","Boliden": "OMXSTO:BOL","Boston Dynamics": "KRX:005380","Broadcom": "NASDAQ:AVGO","Cadence": "NASDAQ:CDNS","Cameco": "NYSE:CCJ","Carpenter Technology": "NYSE:CRS","Caterpillar": "NYSE:CAT","Cleveland-Cliffs": "NYSE:CLF","Coherent": "NYSE:COHR","Confluent": "NASDAQ:CFLT","Constellation": "NASDAQ:CEG","Copilot": "NASDAQ:MSFT","CoreWeave": "NASDAQ:CRWV","Corning": "NYSE:GLW","Credo": "NASDAQ:CRDO","CrowdStrike": "NASDAQ:CRWD","Cummins": "NYSE:CMI","Datadog": "NASDAQ:DDOG","Deere": "NYSE:DE","Dell": "NYSE:DELL","Digital Realty": "NYSE:DLR","Dynatrace": "NYSE:DT","Eaton": "NYSE:ETN","Equinix": "NASDAQ:EQIX","Fabrinet": "NYSE:FN","Foxconn": "TWSE:2317","Freeport-McMoRan": "NYSE:FCX","GE Vernova": "NYSE:GEV","Gemini": "NASDAQ:GOOGL","GlobalFoundries": "NASDAQ:GFS","Google": "NASDAQ:GOOGL","Google Cloud": "NASDAQ:GOOGL","Google DeepMind": "NASDAQ:GOOGL","Google TPU": "NASDAQ:GOOGL","HPE": "NYSE:HPE","Harmonic Drive Systems": "TSE:6324","Hitachi Energy": "TSE:6501","Hiwin": "TWSE:2049","Howmet": "NYSE:HWM","Hyundai Mobis": "KRX:012330","Ibiden": "TSE:4062","Intel Foundry": "NASDAQ:INTC","Intuit": "NASDAQ:INTU","KLA": "NASDAQ:KLAC","Kazatomprom": "LSE:KAP","Keyence": "TSE:6861","Lam Research": "NASDAQ:LRCX","Linde": "NASDAQ:LIN","Lumentum": "NASDAQ:LITE","Lynas": "ASX:LYC","Lynas Malaysia": "ASX:LYC","MP Materials": "NYSE:MP","MYR Group": "NASDAQ:MYRG","Marvell": "NASDAQ:MRVL","Meta": "NASDAQ:META","Meta MTIA": "NASDAQ:META","Micron": "NASDAQ:MU","Microsoft": "NASDAQ:MSFT","Microsoft Entra": "NASDAQ:MSFT","Microsoft Maia": "NASDAQ:MSFT","Mitsubishi Heavy": "TSE:7011","MongoDB": "NASDAQ:MDB","Motivair (Schneider)": "EURONEXT:SU","NSK": "TSE:6471","NVIDIA": "NASDAQ:NVDA","NVIDIA Jetson": "NASDAQ:NVDA","NVIDIA NVLink": "NASDAQ:NVDA","Nabtesco": "TSE:6268","NextEra": "NYSE:NEE","Nidec": "TSE:6594","Nippon Steel": "TSE:5401","Okta": "NASDAQ:OKTA","Oracle": "NYSE:ORCL","POSCO": "NYSE:PKX","Palo Alto Networks": "NASDAQ:PANW","Prysmian": "MIL:PRY","Qualcomm": "NASDAQ:QCOM","Quanta": "TWSE:2382","Quanta Services": "NYSE:PWR","Regal Rexnord": "NYSE:RRX","Renishaw": "LSE:RSW","Rio Tinto": "NYSE:RIO","SAP": "NYSE:SAP","SK hynix": "KRX:000660","STMicroelectronics": "NYSE:STM","SUMCO": "TSE:3436","Salesforce": "NYSE:CRM","Samsung": "KRX:005930","Samsung Foundry": "KRX:005930","Schneider": "EURONEXT:SU","Schneider Electric": "EURONEXT:SU","ServiceNow": "NYSE:NOW","Shin-Etsu": "TSE:4063","Shinko": "TSE:6967","Siemens": "XETR:SIE","Siemens EDA": "XETR:SIE","Siemens Energy": "XETR:ENR","Snowflake": "NYSE:SNOW","Solvay": "EURONEXT:SOLB","Sony": "NYSE:SONY","Splunk (Cisco)": "NASDAQ:CSCO","Supermicro": "NASDAQ:SMCI","Symbotic": "NASDAQ:SYM","Synopsys": "NASDAQ:SNPS","THK": "TSE:6481","TSMC": "NYSE:TSM","TSMC CoWoS": "NYSE:TSM","Talen": "NASDAQ:TLN","Tesla": "NASDAQ:TSLA","Tesla AI5": "NASDAQ:TSLA","Tesla FSD silicon": "NASDAQ:TSLA","Tokuyama": "TSE:4043","Tokyo Electron": "TSE:8035","Unimicron": "TWSE:3037","Vertiv": "NYSE:VRT","Vistra": "NYSE:VST","Wacker Chemie": "XETR:WCH","Waymo": "NASDAQ:GOOGL","Wistron": "TWSE:3231","Zscaler": "NASDAQ:ZS","ams OSRAM": "SIX:AMS",
 "Fluence":"NASDAQ:FLNC",
 "Infineon":"XETR:IFX",
 "Monolithic Power":"NASDAQ:MPWR",
 "Vicor":"NASDAQ:VICR",
 "CATL":"SZSE:300750",
 "LG Energy Solution":"KRX:373220",
 "Intel":"NASDAQ:INTC",
 "Seagate":"NASDAQ:STX",
 "Western Digital":"NASDAQ:WDC",
 "Kioxia":"TSE:285A",
 "Cisco":"NASDAQ:CSCO",
 "Nokia":"OMXHEX:NOKIA",
 "Ericsson":"OMXSTO:ERIC_B",
 "Ciena":"NYSE:CIEN",
 "Fujikura":"TSE:5803",
 "Sumitomo Electric":"TSE:5802",
 "NEC":"TSE:6701",
 "Lumen":"NYSE:LUMN",
 "Cloudflare":"NYSE:NET",
 "Akamai":"NASDAQ:AKAM",
 "AT&T":"NYSE:T",
 "Verizon":"NYSE:VZ",
 "Deutsche Telekom":"XETR:DTE",
 "Elastic":"NYSE:ESTC",
 "Palantir":"NASDAQ:PLTR",
 "Pure Storage":"NYSE:PSTG",
 "NetApp":"NASDAQ:NTAP",
 "Reddit":"NYSE:RDDT",
 "Shutterstock":"NYSE:SSTK",
 "Thomson Reuters":"NYSE:TRI",
 "Appen":"ASX:APX"
};

/* A logo is a button when we hold an exchange-qualified ticker for it, and a
   plain image otherwise, so unlisted entities never look interactive. */
const logoMark=(name,cls)=>{
  const f=LOGO[name]; if(!f) return '';
  const img=`<img class="${cls||'co-logo'}" src="assets/logos/${f}.png" alt="" loading="lazy" decoding="async">`;
  if(typeof TVSYM==='undefined'||!TVSYM[name]) return img;
  return `<button type="button" class="co-logo-btn" data-co="${_escAttr(name)}" `+
         `title="${_escAttr(name)} — market information" aria-label="${_escAttr(name)} — market information">${img}</button>`;
};
const _escAttr=x=>String(x).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

function chainChip(name){
  const c=(typeof CT!=='undefined')&&CT[name], mark=logoMark(name);
  const plate=mark||'<span class="co-logo is-blank" aria-hidden="true"></span>';
  const body=`${plate}<span class="cn-text"><span class="cn-name">${_esc(name)}</span>`+
    (c&&c[0]?`<span class="chip-tick">${_esc(c[0])}</span>`:'<span class="chip-tick is-priv">private</span>')+`</span>`;
  if(typeof TVSYM!=='undefined'&&TVSYM[name])
    return `<button type="button" class="chain-node is-link" data-co="${_escAttr(name)}" title="${_escAttr(name)} — market information">${body}</button>`;
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
const FLAG={"Australia": "🇦🇺", "Austria": "🇦🇹", "Belgium": "🇧🇪", "Finland": "🇫🇮", "Canada": "🇨🇦", "China": "🇨🇳", "France": "🇫🇷", "Germany": "🇩🇪", "Ireland": "🇮🇪", "Israel": "🇮🇱", "Italy": "🇮🇹", "Japan": "🇯🇵", "Kazakhstan": "🇰🇿", "Netherlands": "🇳🇱", "Norway": "🇳🇴", "South Korea": "🇰🇷", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Taiwan": "🇹🇼", "Thailand": "🇹🇭", "United Kingdom": "🇬🇧", "United States": "🇺🇸"};
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
    ? `<button type="button" class="vr-name is-link" data-co="${_escAttr(name)}" title="${_escAttr(name)} — market information">${_esc(name)}</button>`
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
  /* Where the chain is domiciled. A headcount of the named entities by country
     of listing or headquarters — read for where the chain touches ground, not
     for how much value sits in each place. */
  const tally={};
  chainAllStages(d).forEach(st=>st.n.forEach(n=>{
    const c=(typeof CT!=='undefined')&&CT[n]; const k=c&&c[2];
    if(k) tally[k]=(tally[k]||0)+1; }));
  const geo=Object.entries(tally).sort((a,b)=>b[1]-a[1]);
  if(!geo.length) return '';
  const total=geo.reduce((s,g)=>s+g[1],0);

  /* One hue per slice, walked around the layer palette so neighbours differ. */
  const HUES=[1,4,6,2,5,7,3,8];
  const colour=i=>`var(--l${HUES[i%HUES.length]})`;

  const R=78, r=46, C=100;          /* viewBox is 200 square */
  let angle=-Math.PI/2, arcs='';
  geo.forEach(([name,v],i)=>{
    const sweep=v/total*Math.PI*2, end=angle+sweep, big=sweep>Math.PI?1:0;
    const pt=(rad,a)=>[(C+rad*Math.cos(a)).toFixed(2),(C+rad*Math.sin(a)).toFixed(2)];
    const [x1,y1]=pt(R,angle),[x2,y2]=pt(R,end),[x3,y3]=pt(r,end),[x4,y4]=pt(r,angle);
    /* a full-circle slice cannot be drawn as one arc; split it in two */
    if(geo.length===1){
      arcs=`<circle cx="${C}" cy="${C}" r="${(R+r)/2}" fill="none" `+
           `stroke="${colour(0)}" stroke-width="${R-r}"/>`;
    } else {
      arcs+=`<path class="dn-seg" d="M${x1} ${y1} A${R} ${R} 0 ${big} 1 ${x2} ${y2} `+
            `L${x3} ${y3} A${r} ${r} 0 ${big} 0 ${x4} ${y4} Z" fill="${colour(i)}">`+
            `<title>${_esc(name)}: ${v} of ${total}</title></path>`;
    }
    angle=end;
  });

  const legend=geo.map(([name,v],i)=>{
    const pct=(v/total*100);
    return `<li>
      <span class="dn-key" style="background:${colour(i)}"></span>
      <span class="dn-flag" aria-hidden="true">${flagFor(name)}</span>
      <span class="dn-name">${_esc(name)}</span>
      <span class="dn-val">${v}</span>
      <span class="dn-pct">${pct<1?'<1':pct.toFixed(0)}%</span>
    </li>`;}).join('');

  return `<section class="chain-geo">
    <h4 class="mini-h">Where the chain is domiciled</h4>
    <p class="sub">Named entities by country of listing or headquarters &mdash; ${total} of them placed.</p>
    <div class="dn-wrap">
      <div class="dn-chart">
        <svg viewBox="0 0 200 200" role="img" aria-label="Share of named entities in this chain by country of domicile">
          ${arcs}
          <text class="dn-total" x="100" y="96" text-anchor="middle">${total}</text>
          <text class="dn-sub" x="100" y="114" text-anchor="middle">entities</text>
        </svg>
      </div>
      <ol class="dn-legend">${legend}</ol>
    </div>
    <p class="cap">DERIVED &mdash; a headcount, not a value-weighted measure. One monopolist counts the same as one of five competitors, so read it for where the chain touches ground, not for how much value sits in each country.</p>
  </section>`;
}

/* Every layer now carries named branches rather than one queue, because most
   of them genuinely run several chains in parallel that converge. A layer
   written the old way still renders: it is treated as a single unnamed
   branch. */
function chainBranches(d){
  return d.branches || [{t:null,w:null,stages:d.stages||[]}];
}
function chainAllStages(d){
  return chainBranches(d).flatMap(b=>b.stages);
}

/* The qualification a chokepoint claim has to carry before it is marked.
   Product, geography, date, horizon, character, substitutes, relief time and
   source — a stage without these does not get the amber. */
function chokeQual(cq){
  if(!cq) return '';
  const row=(k,v)=>v?`<div class="cqr"><dt>${k}</dt><dd>${_esc(v)}</dd></div>`:'';
  return `<details class="cq">
    <summary><span class="cq-tag">Chokepoint</span> What is constrained, where, and for how long</summary>
    <dl class="cq-grid">
      ${row('Affects',cq.what)}${row('Where',cq.where)}${row('As of',cq.as_of)}
      ${row('Horizon',cq.horizon)}${row('Character',cq.kind)}${row('Substitutes',cq.sub)}
      ${row('Time to relieve',cq.lead)}${row('Source',cq.src)}
    </dl>
  </details>`;
}

function chainPane(n,col){
  const d=(typeof CHAIN!=='undefined')&&CHAIN[n];
  if(!d) return '<p class="sub">Data unavailable from accessible sources.</p>';
  const branches=chainBranches(d);
  const multi=branches.length>1 && !!branches[0].t;

  const sid=(bi,si)=>`vc-${n}-${bi}-${si}`;

  const body=branches.map((b,bi)=>{
    const stages=b.stages.map((st,si)=>`
      <li id="${sid(bi,si)}" class="chain-stage" style="--stage:${col}">
        <div class="cs-head">
          <span class="cs-num">${si+1}</span>
          <div class="cs-title">
            <span class="chain-step">Stage ${si+1}</span>
            <h5>${_esc(st.t)}</h5>
          </div>
          <span class="cs-count">${st.n.length} named ${st.n.length===1?'supplier':'suppliers'}</span>
        </div>
        ${st.w?`<p class="cs-what">${_esc(st.w)}</p>`:''}
        ${st.c?chokeQual(st.cq):''}
        <ul class="vs-rows">${st.n.map(x=>chainRow(x,n)).join('')}</ul>
        ${st.note?`<p class="chain-note">${_esc(st.note)}</p>`:''}
      </li>`).join('');
    return `<section class="chain-branch"${b.t?` aria-label="${_esc(b.t)}"`:''}>
      ${b.t?`<div class="cb-head" style="--stage:${col}">
        <h4 class="cb-title">${_esc(b.t)}</h4>
        ${b.w?`<p class="cb-sub">${_esc(b.w)}</p>`:''}
      </div>`:''}
      <div class="chain-wrap"><ol class="chain-flow">${stages}</ol></div>
    </section>`;}).join('');

  const index=branches.map((b,bi)=>`
    <div class="vj-group">
      ${b.t?`<p class="vj-gh"><span class="vj-gn">${bi+1}</span>${_esc(b.t)}</p>`:''}
      <ol class="vj-jump">${b.stages.map((st,si)=>
        `<li><button type="button" class="vj${st.c?' is-choke':''}" data-jump="${sid(bi,si)}"`+
        `${st.c?' title="Chokepoint stage — qualified in the stage itself"':''}>`+
        `<span class="vj-n">${si+1}</span><b>${_esc(st.t)}</b>`+
        `<span class="vj-f">${_esc(st.w||(st.n.length+' named suppliers'))}</span>`+
        `</button></li>`).join('')}</ol>
    </div>`).join('');

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
    <section class="vc-index" id="vc-index-${n}" role="navigation" aria-label="Stages in this layer">
      <p class="vc-index-h">How the layer breaks down</p>
      <p class="vc-index-s">${multi
        ? 'This layer runs '+branches.length+' chains in parallel. Within a chain, each stage depends principally on the one before it; between chains, nothing does. Select any stage to jump to it. Amber marks a chokepoint, qualified where it is marked.'
        : 'Upstream to downstream. Each stage depends principally on the one before it &mdash; select any of them to jump to it. Amber marks a chokepoint, qualified where it is marked.'}</p>
      ${index}
    </section>
    <div class="chain-key">
      <span><i class="k-choke"></i>Chokepoint &mdash; open the stage for what is constrained, where, and for how long</span>
      <span><i class="k-flow"></i>Principal dependency within a chain; chains run in parallel</span>
      <span><i class="k-link"></i>Listed &mdash; opens on Stock Analysis</span>
    </div>
    ${body}
    <p class="vc-top-wrap"><button type="button" class="vc-top">Back to the stage index &uarr;</button></p>
    ${proc}
    ${chainDiagrams(d,col)}
    <p class="tnote">Companies are named for structural completeness of the chain, not as recommendations, and several are private, Chinese-listed or embedded inside much larger groups. Position within a stage does not imply ranking. A company can appear in more than one stage, more than one chain or more than one layer &mdash; layers 4, 8 and 9 deliberately appear in both the data centre and the machine at the edge. Product and platform names resolve to the parent listing, so Google TPU opens Alphabet and NVIDIA Jetson opens NVIDIA. Entities without a ticker are private, state-held, generic categories, or not separately listed.</p>`;
}


/* ══════════════════════════════════════════════════════════════════════════
   LAYER DESCRIPTION
   What the layer physically is, the engineering that governs it, and the
   economics that follow from that engineering. Written to be read before the
   thesis: the thesis argues, this explains. Figures repeated here are the
   same ones sourced elsewhere in the layer; the physics is textbook and is
   stated without citation.
   ══════════════════════════════════════════════════════════════════════════ */
const HOWTO={
1:{what:'A data centre does not consume computation, it consumes electricity and emits heat. This layer is the machinery that turns a fuel or a natural flow into firm, conditioned, always-on power delivered at the rack, and then removes the heat that power becomes.',
 physics:[
  ['Energy is conserved, so all of it becomes heat','Essentially every watt delivered to a rack leaves as heat. A 1 GW campus is a 1 GW heater. This is why the cooling plant scales with the compute and cannot be optimised away — it is thermodynamics, not engineering slack.'],
  ['Thermal capacity of air runs out around 30 kW a rack','Air has a volumetric heat capacity roughly 3,500 times lower than water. Past about 30 kW per rack the airflow required becomes impractical, which is why accelerator racks at 100 kW and above force direct-to-chip or immersion liquid cooling. The transition is a physical threshold, not a preference.'],
  ['Transmission loss scales with the square of current','Power is moved at high voltage and low current because resistive loss goes as I²R. Every step between the generator and the chip needs a transformer, and each transformer needs a core of grain-oriented electrical steel whose magnetic domains are aligned by a days-long annealing process.'],
  ['Firmness, not energy, is the scarce product','A model training run cannot pause at dusk. What the layer sells is availability — power at three in the morning — which is why nuclear and gas command a premium over solar with the same nameplate rating, and why a 4× overbuild plus storage is the honest comparison.'],
 ],
 econ:[['~60%','of a data centre’s lifetime non-IT cost is electricity and the plant to deliver it'],
  ['128 wk','quoted lead time for large power transformers'],
  ['5–7 yr','typical grid interconnection queue in constrained US markets'],
  ['2031','forward sold-out date for heavy-duty gas turbine slots']],
 money:'The economics are those of a regulated-ish utility bolted to a manufacturing bottleneck. Returns do not come from generating electrons, which are close to a commodity, but from owning the equipment that conditions and moves them — turbines, transformers, switchgear, UPS and cooling — where order books are years deep and pricing has been re-rated. The binding scarcity is calendar time, not capital.'},

2:{what:'Everything above this layer is rearranged rock. This layer covers the step between a natural deposit and an input a fab, a foundry or a turbine hall will accept — mining, smelting, refining, separation and qualification.',
 physics:[
  ['Separation cost rises as concentration falls','Pulling a dilute element out of a mixed ore is governed by the entropy of mixing: the more dilute the target, the more energy and the more stages are needed. This is why refining, not mining, is the concentrated step almost everywhere in this report.'],
  ['Rare earths are chemically almost identical','The lanthanides differ mainly in the filling of an inner 4f shell, which barely changes their outer chemistry. Separating neodymium from praseodymium therefore needs hundreds of sequential solvent-extraction stages, each with a separation factor barely above one. The difficulty is intrinsic, not political.'],
  ['Purity requirements are logarithmic','Electronic-grade polysilicon is specified at eleven nines — one impurity atom in 10¹¹. Each additional nine costs disproportionately more energy and process control, which is why a handful of plants worldwide can hit the top grades.'],
  ['Crystal structure is the product','Grain-oriented electrical steel, single-crystal turbine blades and semiconductor wafers are all sold on the arrangement of their atoms rather than their composition. That arrangement is produced by heat treatment schedules that are process knowledge, and process knowledge does not transfer with a licence.'],
 ],
 econ:[['86–90%','China share of rare earth refining'],['~48%','China share of copper smelting'],
  ['1','US producer of grain-oriented electrical steel'],['3–8 yr','to replicate a refinery, versus decades for a fab']],
 money:'Margins sit at the refining and qualification steps, not at the mine. A mine sells a commodity into a liquid market; a separation plant sells a qualified input into a supply chain that cannot switch without requalifying a whole product line. That switching cost, not the ore body, is the moat — and it is why an export ban on separation technology is far more consequential than a tariff on the metal.'},

3:{what:'The step that turns sand and gas into a working logic or memory die. It has three separable businesses: the software a chip is designed in, the machines a chip is built with, and the fabs that run those machines.',
 physics:[
  ['Resolution is set by wavelength and aperture','Printable feature size follows the Rayleigh criterion, CD = k₁·λ/NA. Getting smaller means shorter wavelength or a larger numerical aperture. The move from 193 nm deep ultraviolet to 13.5 nm extreme ultraviolet is the reason a single company sells the machine that defines the leading edge.'],
  ['EUV is absorbed by everything, including air','At 13.5 nm there is no transmissive lens material and no atmosphere to print through. The whole optical path is mirrors — multilayer molybdenum-silicon stacks — in vacuum, with the light generated by vaporising tin droplets with a laser. Every element of that is a separate near-monopoly.'],
  ['Chips are built one layer at a time','Deposit, coat with photoresist, expose, etch, implant, clean and polish, then repeat. A leading-edge die runs this cycle upwards of eighty times. The early layers are the critical ones, needing the most advanced machines; later layers do not, which is why mature-node equipment is a different market.'],
  ['Yield falls exponentially with defect density','Die yield goes roughly as e^(−D·A) with defect density D and die area A. Since accelerators are very large dies, tiny changes in particle contamination move economics sharply — which is why process control and metrology is its own multi-billion dollar segment.'],
  ['The bottleneck has moved to packaging','Now that a single die cannot get bigger, performance comes from bonding a logic die to stacks of memory on a silicon interposer. Advanced packaging, not lithography, is the current binding constraint on accelerator supply.'],
 ],
 econ:[['100%','ASML share of EUV lithography'],['>90%','TSMC share of leading-edge logic'],
  ['~$400m','list price of a High-NA EUV scanner'],['~80+','mask layers on a leading-edge die']],
 money:'Every segment here is a duopoly or a monopoly, and each one sells a tool or a service that its customer cannot design around inside a decade. Equipment vendors earn on installed base and service as much as on new tools, which smooths the cycle. The fab itself is the most capital-hungry business in the stack and the one with the least pricing freedom relative to its supplier — which is exactly why its suppliers are the better businesses.',
 src:'Process sequence and equipment positions follow Generative Value, “A Primer on Semiconductor Capital Equipment” and “An Overview of the Semiconductor Industry”.'},

4:{what:'The finished silicon a data centre actually buys: accelerators, the high-bandwidth memory beside them, and the networking fabric that makes many of them behave as one machine.',
 physics:[
  ['Compute is now limited by data movement, not arithmetic','Moving a number from memory costs orders of magnitude more energy than the multiply it feeds. Modern accelerator design is therefore mostly memory and interconnect design; the arithmetic units are the easy part.'],
  ['That is what high-bandwidth memory is for','HBM stacks DRAM dies vertically and connects them to the logic die through a very wide, very short bus on a silicon interposer. Width substitutes for clock speed, which is what keeps the power per bit tolerable.'],
  ['Training does not fit on one chip','A frontier run is split across tens of thousands of accelerators, so the fabric between them sits in the critical path. This is why scale-up links inside a rack and scale-out switching between racks are part of the compute purchase rather than an afterthought.'],
  ['Power density drives the physical design','Accelerator racks now draw an order of magnitude more than a traditional server rack, which is what pulls liquid cooling, busway and on-site electrical plant into the same buying decision.'],
 ],
 econ:[['85–90%','accelerator share held by the leading vendor'],['~50–60%','HBM share held by the leading supplier'],
  ['3','credible suppliers of high-bandwidth memory'],['~$3–4bn','cost of the silicon in a gigawatt-class build']],
 money:'The highest growth in the stack and the shortest moat half-life. The defensible asset is the software ecosystem rather than the transistor, because a buyer switching vendor rewrites its kernels. Memory is a genuine oligopoly with real pricing power while HBM is tight, but it is still a cyclical commodity business underneath. Custom silicon is the structural threat: every hyperscaler large enough to amortise a design team has started one.',
 src:'Market structure follows Generative Value, “A Primer on Data Centers”.'},

5:{what:'The building, the power and cooling plant inside it, and the operating business that rents the result. This layer converts capital and electricity into an hour of available compute.',
 physics:[
  ['A hall is a heat exchanger with a roof','The design problem is getting cold fluid to a few hundred thousand hot points and the heat back out. Everything else — floor loading, aisle layout, redundancy topology — follows from that.'],
  ['Water and power trade against each other','Evaporative cooling is efficient but consumes water; closed-loop and air-cooled designs save water and spend electricity. Siting is largely the negotiation of that trade against local constraints.'],
  ['Utilisation is the whole economic story','The asset is fixed cost. The difference between a good and a bad operator is how much of the installed capacity is sold and running, which is why lease structure and pre-leasing matter more than construction cost per megawatt.'],
  ['Latency sets geography, but training does not care','Inference wants to be near users; training only wants power and land. That split is why the map of new capacity looks nothing like the map of existing colocation.'],
 ],
 econ:[['~$30–35m','all-in capital cost per MW of critical IT load'],['~60%','of lifetime cost that is power-related'],
  ['1.1–1.3','achievable PUE for a modern liquid-cooled hall'],['5–7 yr','from land to energised at grid-constrained sites']],
 money:'Weak moats, heavy capital, and returns that depend on the contract rather than the technology. What is genuinely scarce is not the building but the interconnection agreement and the power contract behind it — a signed grid connection in a constrained market is the real asset. The operators earning best are those who secured power years before the demand arrived.',
 src:'Cost composition follows Generative Value, “A Primer on Data Centers”.'},

6:{what:'The communications layer that moves data, model updates and control traffic between racks, buildings, continents and machines in the field. It is the only path between the two physical enclosures in this stack — the data centre and the machine — which is why the loop cannot close without it.',
 physics:[
  ['Distance sets the medium, not fashion','Copper carries a high-rate signal for roughly a metre or two before loss and distortion make it uneconomic; optics take over beyond that. Both are current engineering, and copper has not been displaced — it owns the short reach inside a rack.'],
  ['Light does not go faster for being important','Round-trip latency is bounded by the speed of light in glass, roughly two thirds of c. A round trip to a data centre a thousand kilometres away costs about ten milliseconds before any equipment is involved, which is why a real-time control loop cannot live there.'],
  ['Link rate is not application throughput','Topology, congestion, protocol overhead, retransmission and the traffic pattern of the workload all sit between the headline number and what the application sees. Collective operations in training are especially sensitive to the slowest path, not the average one.'],
  ['The route is the asset, not the glass','Fibre is a manufactured commodity. The right of way it sits in was granted once, under permitting conditions that no longer apply, and cannot be reproduced by spending more.'],
 ],
 econ:[['3','non-Chinese suppliers of transoceanic cable systems'],['3–4 yrs','contract to service for a subsea build'],
  ['~10 ms','round trip per 1,000 km, before equipment'],['0','safety loops that may depend on this layer']],
 money:'Two businesses wearing one name. Route and facility owners — metro conduit, interconnection sites, subsea systems — are scarce infrastructure assets with long contracts and slow growth. The component and equipment tier is a cyclical hardware business where volumes rise at every speed transition and unit prices fall just as reliably. The common error is buying the second on the story of the first.'},
7:{what:'The data assets and the systems that govern them: ingestion, storage, cataloguing, cleaning, annotation, provenance, curation and retention. It feeds training, evaluation, retrieval and monitoring — four products that share infrastructure and almost nothing else.',
 physics:[
  ['Training starves on read bandwidth, not capacity','The engineering problem is sustained throughput into the cluster, so that accelerators are not idle waiting for the next batch. Storage under a training cluster is designed around a training loop’s access pattern, not a database’s.'],
  ['Deduplication changes the model, measurably','Repeated content in a corpus does not merely waste compute; it changes what the model learns and how it behaves. Curation is a capability, not a cleanup step.'],
  ['Contamination is silent and irreversible','If evaluation data reaches training, the measurement stops working and nothing in the output says so. This is why evaluation sets are handled as a separate product with separate controls.'],
  ['Lineage cannot be added afterwards','Once records from many origins are mixed into one corpus, no downstream tool can reconstruct which licence covered which record. Provenance is either recorded at ingestion or lost.'],
 ],
 econ:[['4','distinct data products on one infrastructure'],['5','fields tracked per record — origin, licence, consent, purpose, retention'],
  ['0','evaluation data that may enter training'],['rights','not volume, is what makes a corpus defensible']],
 money:'Three businesses with different economics. Platform and storage vendors are levered to cluster build-out and cycle with it. Annotation is a labour business with real scale and modest structural margins, exposed to how much of post-training stays human. Rights holders own the one asset here that appreciates as models improve — provided the courts leave the rights intact, which is the layer’s single largest open question.'},
8:{what:'The models themselves: the training runs that produce weights, and the inference systems that serve them. This layer buys almost everything below it and sells to almost everything above it.',
 physics:[
  ['Capability scales as a power law in compute','Loss falls roughly as a power of compute, data and parameters. Power laws are brutal: each increment of capability costs multiplicatively more, which is what turns model training into an infrastructure problem rather than a software one.'],
  ['A training run is one long synchronous computation','Weights must stay consistent across the whole cluster, so the slowest link and the least reliable node set the pace. At tens of thousands of accelerators, hardware failure is a routine event that the training system has to survive.'],
  ['Inference economics are the inverse of training','Training is a large fixed cost paid once; inference is a marginal cost paid per token, forever. As usage grows, serving efficiency — quantisation, batching, caching, distillation — matters more to margin than the training run did.'],
  ['Open weights put a floor under price','Once a competent model can be downloaded, the price of an equivalent API call cannot stay far above the cost of serving it. This is the single most important economic fact about the layer.'],
 ],
 econ:[['power law','capability versus compute — each step costs multiplicatively more'],
  ['~0','marginal cost of copying a trained weight file'],
  ['months','useful commercial life of a frontier lead'],['open','the pricing floor, and it is falling']],
 money:'The weakest durable moat in the stack relative to the capital consumed. Weights depreciate fast, switching cost for a buyer is a prompt rewrite, and the open-weight floor keeps compressing price. What is defensible is distribution, proprietary data and the integration into a workflow — none of which is the model itself. This layer is where the most money is spent and the least of it is likely to be kept.'},

9:{what:'The frameworks, tooling and applications that turn a model into something a business uses. It owns the customer relationship and almost none of the physical stack.',
 physics:[
  ['There is no physics here, and that is the point','This is the one layer with no material constraint, no lead time and no capital intensity. Its economics are therefore pure competition: nothing physical protects an incumbent.'],
  ['Context is the scarce input','A model is a commodity; the enterprise data, permissions and process knowledge fed to it are not. Value accrues to whoever owns the context, which is usually the existing system of record rather than the newcomer.'],
  ['Agents break seat-based pricing','If software does the work rather than helping a person do it, charging per person stops tracking value delivered. Every incumbent priced per seat is exposed to a repricing it does not control.'],
  ['Consumption pricing tracks the machine, not the headcount','Vendors already billing on usage — observability, data platforms, security — benefit mechanically as agent volume rises, without changing anything about how they sell.'],
 ],
 econ:[['0','material inputs and lead times in this layer'],['seats → usage','the repricing that decides who wins'],
  ['high','gross margin, and correspondingly low barrier to entry'],['the data','not the model, is the defensible asset']],
 money:'The layer where AI most plausibly destroys incumbent value rather than creating it. The bull case is that owning workflow and data makes an incumbent the natural agent vendor; the bear case is that agents collapse the seat count that the incumbent’s revenue is calculated from. Both can be true for different companies in the same category, which is why this layer resists a single directional view.'},

10:{what:'Machines that sense and act in the physical world — robots, vehicles, drones. It is where the stack stops being information and starts being mechanical, and where a Western portfolio’s geographic assumptions invert.',
 physics:[
  ['Actuation is a torque density problem','A useful humanoid joint needs high torque at low speed in a small mass. That means a motor plus a precision reducer — harmonic or cycloidal — and those reducers are ground to micron tolerances by a small number of mostly Japanese firms. This is the binding constraint, and it is mechanical.'],
  ['Permanent magnets set the performance ceiling','Torque density in a compact motor comes from neodymium-iron-boron magnets, with dysprosium or terbium added for heat resistance. That places the most Western-facing robotics thesis directly downstream of Chinese rare earth separation.'],
  ['Sensing returns an error signal reality actually generated','Text teaches a model what people have written about physics; sensors return what physics did. That data cannot be scraped or licensed, which is why fleet-scale operating history is the one genuinely non-replicable data asset in the report.'],
  ['Control must close the loop faster than the world moves','Manipulation needs latency budgets in milliseconds, which forces inference on board rather than in a data centre. That constrains the achievable model size, and pulls edge silicon and power budget into the design.'],
  ['Reliability compounds against you','A task with many sequential steps needs per-step reliability close to one to work end to end. This is why demonstrations generalise poorly to deployment, and why pilot-to-fleet timelines keep slipping.'],
 ],
 econ:[['~2–3','credible suppliers of precision reducers at volume'],['China','where the magnet supply chain terminates'],
  ['ms','the control latency budget that forces on-board inference'],['fleet-years','the data asset that cannot be bought']],
 money:'Structurally the most interesting and the least investable from a Western listing. The chokepoints are real — reducers, magnets, sensors — but they sit with Japanese component makers and Chinese material processors rather than with the humanoid developers attracting the capital. Treat this layer as a diagnostic for where the physical constraints bind, not as an allocation.'},
};


/* ══════════════════════════════════════════════════════════════════════════
   TAB INTROS
   Each pane opens with the same device the Materials pane already used: a
   short title and one line saying what is about to be shown, keyed to the
   layer's own colour. The wording is per-tab, not per-layer, because the
   question each tab answers is the same in every layer.
   ══════════════════════════════════════════════════════════════════════════ */
const TABINTRO={
 how:['What this layer is', null],   /* filled per layer from HOWTO[n].what */
 chain:['Who supplies whom',
   'The chain from raw input to finished output, stage by stage. Each row is one company and what it actually supplies at that stage, with its market capitalisation and position.'],
 materials:['Material foundation',null],
 thesis:['The investment argument',
   'What the layer is worth owning for, where the binding constraint sits, and the case set out in full. This is the opinionated tab — it argues rather than describes.'],
 companies:['Top companies in this layer',
   'Every company with material exposure to this layer, with its niche share, fundamentals, and the strongest case each side of the trade would make.'],
 risks:['What breaks the thesis',
   'The failure modes specific to this layer, what each would look like early, and the signals worth monitoring before they show up in a price.'],
};
function tabIntro(mode,col,layerTitle){
  const t=TABINTRO[mode]; if(!t||!t[1]) return '';
  return `<div class="tab-intro" style="--tint:${col}">
    <h4>${_esc(t[0])}</h4><p>${_esc(t[1])}</p></div>`;
}

function howPane(L,col){
  const d=HOWTO[L.n];
  if(!d) return '<p class="sub">Description unavailable.</p>';
  return `<div class="tab-intro" style="--tint:${col}">
      <h4>What this layer is</h4><p>${d.what}</p></div>
    <div class="how-stats">${d.econ.map(x=>`<div><b class="num">${_esc(x[0])}</b><span>${_esc(x[1])}</span></div>`).join('')}</div>
    <h4 class="mini-h">The engineering that governs the layer</h4>
    <p class="sub">Each of these is a physical constraint, not a market condition. They are why the layer has the shape it has.</p>
    <ol class="how-list">${d.physics.map((p,i)=>`<li style="--stage:${col}">
      <span class="how-n">${i+1}</span>
      <div><h5>${_esc(p[0])}</h5><p>${_esc(p[1])}</p></div></li>`).join('')}</ol>
    ${L.sub?`<h4 class="mini-h">How the layer breaks down</h4>
    <p class="sub">A structural view of the layer itself. The value chain tab shows the same layer as a supply flow, which is a different cut.</p>
    <div class="tw"><table class="dat">${tbl(L.sub)}</table></div>`:''}
    <div class="how-money" style="border-left-color:${col}">
      <h5>What that means for the money</h5><p>${_esc(d.money)}</p></div>
    ${d.src?`<p class="tnote">${_esc(d.src)}</p>`:''}
    <p class="tnote">Physical relationships stated here are standard engineering and are given without citation. Every figure repeated in this tab is sourced where it first appears elsewhere in the report; see Method for the register.</p>`;
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
      <p class="lede">Everything in the ten layers above is, in the end, rearranged pieces of this. Nothing in the stack is created — it is extracted, concentrated, purified and shaped, using energy that was itself captured from somewhere physical.</p>
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

  <div class="layer-verdict"><b>How to use this section.</b> Not as an allocation. Use it as a check on the two claims the rest of the report depends on: that a natural resource can actually be transformed into a usable input on the schedule the build-out assumes, and that machines can eventually operate in unstructured surroundings well enough to be worth their cost. If the first fails, layers 1 and 2 reprice upward and everything above them slips. If the second fails, layer 10 stays a pilot programme and the loop never closes.</div>

  <p class="tnote">This section is context rather than analysis: it carries no company list, no valuation and no rating, and it deliberately has no sub-views. The material chains summarised here are treated in full in layer 2, the energy conversions in layer 1, and the sensing and manipulation constraints in layer 10.</p>`;
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
 6:'<circle cx="10" cy="22" r="4"/><circle cx="34" cy="22" r="4"/><path d="M14 22 H30"/><path d="M11.6 18.1 Q22 7.5 32.4 18.1"/><path d="M11.6 25.9 Q22 36.5 32.4 25.9"/>',
 7:'<ellipse cx="22" cy="12" rx="13" ry="5"/><path d="M9 12 V32 A13 5 0 0 0 35 32 V12"/><path d="M9 22 A13 5 0 0 0 35 22"/>',
 8:'<path d="M14.6 12.8 L29.4 16.2"/><path d="M14.1 14.1 L29.9 24.9"/><path d="M14.6 21.2 L29.4 17.8"/><path d="M14.6 22.8 L29.4 26.2"/><path d="M14.1 29.9 L29.9 19.1"/><path d="M14.6 31.2 L29.4 27.8"/><circle cx="11" cy="12" r="2.9"/><circle cx="11" cy="22" r="2.9"/><circle cx="11" cy="32" r="2.9"/><circle cx="33" cy="17" r="2.9"/><circle cx="33" cy="27" r="2.9"/>',
 9:'<rect x="6" y="10" width="32" height="24" rx="3.2"/><path d="M6 17 H38"/><circle cx="10.6" cy="13.5" r="1.3"/><circle cx="14.8" cy="13.5" r="1.3"/><path d="M12 22.5 L16.5 26.5 L12 30.5"/><path d="M20 30.5 H30"/>',
 10:'<rect x="16" y="4.5" width="12" height="9.5" rx="3.2"/><circle cx="19.6" cy="9.3" r="1.3"/><circle cx="24.4" cy="9.3" r="1.3"/><path d="M22 14 V16.5"/><rect x="14" y="16.5" width="16" height="12" rx="3.2"/><path d="M14 19.5 H9.5 V26.5"/><path d="M30 19.5 H34.5 V26.5"/><path d="M18.5 28.5 V30.7"/><circle cx="18.5" cy="32.2" r="1.5"/><path d="M18.5 33.7 V36.5"/><path d="M16.2 36.5 H20.8"/><path d="M25.5 28.5 V30.7"/><circle cx="25.5" cy="32.2" r="1.5"/><path d="M25.5 33.7 V36.5"/><path d="M23.2 36.5 H27.8"/>'
};
/* A standalone mark. `wafer` is why each copy needs its own clip id. */
let __icn=0;
function layerIcon(n,cls){
  const id='wc'+(++__icn);
  const body=LAYER_ICONS[n].replace('url(#waferClip)','url(#'+id+')');
  return `<svg class="licon ${cls||''}" viewBox="0 0 44 44" aria-hidden="true" style="stroke:var(--l${n})">`+
    `<defs><clipPath id="${id}"><circle cx="22" cy="22" r="13.6"/></clipPath></defs>${body}</svg>`;
}

const C=Object.fromEntries(Array.from({length:10},(_,i)=>i+1).map(n=>[n,`var(--l${n})`]));

const LAYERS=[
{n:1,t:'Energy, power and utilities',moat:'Strong moat',mk:'good',
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

{n:2,t:'Raw and processed materials',moat:'Strong moat',mk:'good',
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
{n:3,t:'Semiconductor production ecosystem',moat:'Very strong moat',mk:'good',
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

{n:4,t:'Compute, memory and networking',moat:'Moderate, eroding',mk:'',
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

{n:5,t:'Data centres, cloud and edge',moat:'Weak, capital-driven',mk:'warn',
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

{n:6,t:'Connectivity and communications',moat:'Mixed — strong in routes, weak in boxes',mk:'mixed',
 sub:{h:['Domain','What it carries','Where the leverage sits'],r:[
 ['Scale-up fabric','Traffic inside a rack or node','Owned by layer 4; an ecosystem lock, not a physical one'],
 ['Scale-out cluster network','Traffic between racks in one hall','Merchant switch silicon commoditised the box, not the software'],
 ['Data-centre interconnect','Traffic between halls and campuses','Coherent optics and, increasingly, dark fibre ownership'],
 ['Metro and long-haul','Traffic between cities','Rights of way and conduit — effectively unrepeatable'],
 ['Subsea','Traffic between continents','Three credible suppliers and a fleet of specialised ships'],
 ['Access and satellite','Traffic to users and machines in the field','Coverage, not capacity, decides whether a fleet can operate']]},
 detail:[
 ['Why this is a layer and not a footnote',
  'The earlier map had no connectivity layer. Optics and switching sat inside compute silicon, carrier networks appeared nowhere, and the link between the data centre and a machine in the field was drawn as an arrow rather than as an industry. That understated something structural: <b>the stack has two enclosures, and everything that passes between them passes through this layer.</b> Training happens in one place, acting happens in another, and the traffic between them — telemetry up, weights and policies down, supervision both ways — is the mechanism by which the loop closes at all. A layer that carries the only path between the two halves of the thesis is not a footnote.'],
 ['The boxes commoditised; the routes did not',
  'Merchant switch silicon did to networking hardware roughly what it did to servers. When one supplier sells the same switching chip to every vendor, the box converges on a similar bill of materials and the differentiation moves to software, support and scale. That is a genuine margin story, and it is why the equipment tier of this layer is the least attractive part of it. <b>The physical routes went the other way.</b> Metro fibre and conduit run on rights of way that were granted once, under permitting regimes that are markedly less permissive now than when the routes were dug. A competitor with more capital cannot simply build a second one down the same street. The asset is not the glass; it is the permission to have put the glass there.'],
 ['Subsea is the narrowest supplier list in the report',
  'Three firms outside China can build and lay a transoceanic cable system: SubCom, Alcatel Submarine Networks inside Nokia, and NEC. The constraint is not the cable but the ships and the crews who can splice and bury at depth, and that fleet is small, ageing and slow to expand. Systems run three to four years from contract to service. What changed in this cycle is who pays: hyperscalers now fund and in several cases own private systems outright, rather than buying capacity from a consortium. <b>That is vertical integration into a genuine chokepoint, and it is the clearest signal of how strategically the buyers regard this layer.</b>'],
 ['The edge cannot assume the centre',
  'The audit is emphatic on this and it is worth stating as an engineering constraint rather than a preference. A machine that needs a round trip to a data centre to decide whether to stop is not safe, because the link will degrade — coverage gaps indoors, in tunnels, at sea, in a building with metal walls. <b>Safety-critical control has to run locally with a defined safe state, and connectivity has to be treated as an enhancement rather than a dependency.</b> This is why layers 4, 8 and 9 appear inside layer 10 at all. The commercial consequence is that connectivity quality shapes which autonomy features can be sold in which environment, and that constraint is not resolvable by procurement.'],
 ['How to hold this layer',
  'The layer splits cleanly into two investment characters and they should not be held for the same reason. The route and facility owners — metro fibre, carrier-neutral interconnection, subsea systems — are infrastructure assets with genuine scarcity, long contracts and slow growth. The component and equipment tier is a cyclical hardware business levered to data-centre capital expenditure, where optics volumes rise sharply with each interconnect generation and pricing falls just as reliably. <b>The mistake is buying the second while telling yourself the story of the first.</b> Transceiver demand is real and large; it is also a component market with new entrants at every speed transition.']],
 watch:[
 ['Hyperscaler-owned subsea announcements','Private systems rather than consortium capacity signal that buyers regard the route as strategic rather than procurable'],
 ['Optical transceiver pricing at each speed transition','Volume growth with falling unit prices is the normal state; margin compression at a transition is the earlier signal'],
 ['Dark fibre versus wavelength mix in metro markets','A shift toward outright fibre purchase by hyperscalers indicates they are pricing scarcity, not bandwidth'],
 ['Private wireless and satellite coverage in industrial settings','The practical limit on which autonomy features can be deployed where'],
 ['Merchant switch silicon share of port shipments','The cleanest proxy for how much of the equipment tier is left to differentiate on']],
 lede:'The communications layer that links racks, buildings, continents and machines. It was missing from the earlier map: optics sat inside compute silicon, carrier networks appeared nowhere, and the path between the data centre and the edge was drawn as an arrow.',
 why:'The stack has two physical enclosures — the data centre and the machine — and every exchange between them crosses this layer. Sensor and experience data travels up, validated weights and policies travel down, and supervision runs both ways. <b>Without this layer the loop does not close</b>, which is why it belongs beside the others rather than inside one of them.',
 choke:'The chokepoints are geographic rather than manufactured. Metro conduit sits on rights of way that would not be granted again, and three firms outside China can lay a transoceanic system. <b>Neither constraint is relieved by capital expenditure, which is precisely what makes them durable.</b>',
 facts:[['3','Non-Chinese suppliers of transoceanic cable systems'],['3–4 yrs','Contract to service for a subsea system'],['2','Firms that can build a national mobile network alongside Huawei'],['0','Safety-critical loops that may depend on this layer']],
 chart:{t:'Where the leverage sits, by domain',u:'relative durability of position, 1–5',b:[['Subsea systems',5],['Metro fibre and conduit',5],['Carrier-neutral interconnection',4],['Coherent optical transport',3],['Access networks',3],['Transceiver modules',2],['Switching hardware',2]],
  note:'DERIVED — a judgement, not a measurement. The pattern is consistent though: durability tracks whether the asset can be rebuilt by a competitor with capital. A cable route cannot; a transceiver line can, and repeatedly has been.'},
 co:[
 ['Corning','Optical fibre, cable and the glass behind it','The dominant Western fibre and preform maker; capacity added on multi-year cycles','Fibre and preform incumbent','A step change in data-centre interconnect demand lands on a capacity base that moves slowly','Fibre is cyclical and has repriced hard before; Chinese capacity competes at volume'],
 ['Ciena','Coherent optical transport for metro, long-haul and DCI','Sells into both carriers and, increasingly, hyperscalers directly','Coherent transport specialist','Data-centre interconnect is the fastest-growing use of coherent optics','Carrier capex is lumpy and hyperscalers negotiate hard'],
 ['Arista','Data-centre Ethernet switching','Has taken share as Ethernet displaced InfiniBand in AI clusters','Cluster networking share gainer','Ethernet-based AI fabrics play directly to its software and scale','Merchant silicon means the hardware differentiation is thin; customer concentration is high'],
 ['Nokia','Radio access, optical transport and, through ASN, subsea systems','One of three credible subsea suppliers and one of three radio vendors','Subsea and radio incumbent','Owns a position in the single narrowest supplier list in the report','The group as a whole is a low-growth telecom equipment business'],
 ['Ericsson','Radio access networks','One of three vendors able to build a national mobile network','Radio access incumbent','Access coverage is the practical limit on edge autonomy','Mobile capex cycles are long, and the AI build-out reaches it only indirectly'],
 ['Equinix','Carrier-neutral interconnection facilities','Interconnection density rather than floor area is the product','Interconnection incumbent','Where networks meet is genuinely difficult to replicate','Priced as an infrastructure asset, with the growth rate that implies'],
 ['Cloudflare','Edge network, content delivery and security','Sits between users and origin infrastructure at global scale','Edge distribution','Model and software distribution to fleets is a natural extension of the network','Competes against hyperscalers who own their own edges'],
 ['Coherent','Lasers, optical components and transceivers','A component supplier levered directly to interconnect volumes','Optical component supplier','Every speed transition increases optical content per rack','Component pricing falls at every transition; the margin story is volume, not price']],
 wrong:'The equipment tier could be commoditised faster and further than the route tier is protected. If co-packaged optics move transceiver function onto the switch package, an entire component category compresses into the silicon supplier’s margin. That would be good for Broadcom and bad for the module makers, and the timing is genuinely uncertain.'},
{n:7,t:'Data and knowledge infrastructure',moat:'Conditional — rights, not volume',mk:'mixed',
 sub:{h:['Data product','What it is for','Why it cannot be substituted by the others'],r:[
 ['Training and post-training sets','Building capability','Mixture design and rights dominate; most collected data should never enter here'],
 ['Evaluation and safety sets','Measuring capability','Value depends entirely on never having been trained on'],
 ['Retrieval-time enterprise knowledge','Answering with the customer’s own facts','Belongs to the customer, governed by the customer’s permissions'],
 ['Operational sensor and experience data','Improving deployed systems','Generated by fleets, selected on the machine, returned selectively'],
 ['Governance and lineage','Proving any of the above is lawful','Cannot be retrofitted once the data is already mixed in']]},
 detail:[
 ['Why data was understated as one card',
  'In the earlier map, data was a single box inside the model layer, positioned as a training input. That framing does three things wrong. It treats data as something consumed once, when in practice the same infrastructure serves evaluation, retrieval, monitoring, personalisation, simulation and post-incident investigation. It puts data downstream of compute, when the two are parallel inputs to model development and neither buys from the other. And it hides the part that actually decides whether a data position is worth anything, which is not the volume but <b>the rights, the lineage and the ability to use the same data repeatedly and lawfully.</b>'],
 ['Possession is not ownership, and ownership is not the right to train',
  'These are three separate states and the industry routinely collapses them into one. An enterprise can hold a customer’s records without owning them. It can own a corpus and still lack the licence to train a model on it. It can have a licence today that terminates in two years, at which point the trained weights raise a question no one has settled. <b>Origin, licence, consent, purpose and retention have to be tracked as separate fields against every record</b>, because a claim about any one of them tells you nothing about the others. Litigation across several jurisdictions is currently deciding how much of the existing corpus was ever usable, and the answers are arriving unevenly.'],
 ['Volume is the least interesting property',
  'More data is not automatically better. Deduplication changes model behaviour measurably; mixture design — what proportion of what kind of text, code, image and interaction — is a larger lever on final capability than raw token count, and it is among the least published decisions in the entire stack. The corollary matters for investors: <b>a proprietary corpus is not automatically a moat.</b> It becomes one only where it improves outcomes on tasks customers pay for, can be used repeatedly without fresh legal risk, and cannot be adequately approximated by synthetic generation or by a competitor’s different corpus. Most claimed data moats fail at least one of those three tests.'],
 ['The unglamorous constraint is read bandwidth',
  'The engineering problem in this layer is not storing the data. It is feeding it to a cluster fast enough that expensive accelerators are not idle. Large training runs starve on sustained read throughput rather than on capacity, which is why the storage tier under AI clusters looks different from ordinary enterprise storage — all-flash, high-parallelism, and designed around the access pattern of a training loop rather than of a database. <b>This is a system design constraint, not a supply shortage</b>, which means it is solved by architecture rather than relieved by lead time, and it is a genuine differentiator for the vendors who got the architecture right.'],
 ['How to hold this layer',
  'Three distinct businesses live here and they have little in common. Storage and platform vendors are infrastructure suppliers levered to cluster build-out, with the cyclicality that implies. Annotation and human feedback is a labour business with real scale and structurally modest margins, whose demand depends on post-training remaining labour-intensive. Rights holders — the owners of large, clean, licensable corpora — are the closest thing to a scarce asset in the layer, and the only part of it where the position improves rather than erodes as models get better at using data. <b>The governance tier is the one to watch</b>: it looks like a compliance cost today and is turning into the thing that determines whether a data asset can be used at all.']],
 watch:[
 ['Outcomes in the training-rights litigation','The single largest unresolved input to what the existing corpus is worth'],
 ['Licensing deals struck directly between labs and rights holders','Each one prices a corpus and sets a comparable for the rest'],
 ['Post-training labour intensity','If preference data becomes substantially more synthetic, the annotation businesses reprice'],
 ['Enterprise demand for lineage and provenance tooling','The clearest indicator that data governance is becoming a purchase rather than a policy'],
 ['Storage read-bandwidth architectures in published cluster designs','Where the genuine engineering differentiation in the storage tier shows up']],
 lede:'The data assets and the systems that govern them: ingestion, storage, cataloguing, cleaning, annotation, provenance and curation. It supports evaluation, retrieval and monitoring as much as training — and it was previously compressed into a single card inside the model layer.',
 why:'Model capability is produced by compute and data in parallel, not by compute acting on a data input. This layer is where the second of those two is manufactured, and where the question of whether it may lawfully be used at all is answered. <b>It runs on layer 4 hardware inside layer 5</b>, but its sources are outside the enclosure entirely — people, enterprises, instruments and fleets.',
 choke:'The binding constraint here is legal rather than physical. Clear, transferable rights to train on third-party content are contested across several jurisdictions simultaneously, and lineage sufficient to evidence those rights <b>cannot be retrofitted once data is already mixed into a corpus.</b> That is a chokepoint with no lead time to shorten.',
 facts:[['4','Distinct data products sharing this infrastructure'],['5','Fields that must be tracked separately per record'],['0','Evaluation data that may enter training'],['Read GB/s','The metric training clusters actually starve on']],
 chart:{t:'What decides whether a data position is a moat',u:'relative weight, 1–5',b:[['Usage rights and transferability',5],['Lineage and provenance',5],['Relevance to a paid task',4],['Mixture and curation skill',4],['Uniqueness of the corpus',3],['Raw volume',1]],
  note:'DERIVED — a judgement, not a measurement. The point of the ordering is that the property most often cited in company disclosures, raw volume, is the one that discriminates least between a data asset that is worth something and one that is not.'},
 co:[
 ['Snowflake','Cloud data warehouse and platform','The governed storage and query tier for a large share of enterprise data','Enterprise data platform','Agents need governed access to enterprise facts, and this is where they sit','Competes directly with the hyperscalers who host it'],
 ['Databricks','Lakehouse platform, ingestion and processing','Private; the main platform alternative for large-scale data engineering','Lakehouse platform','Owns the processing layer where training corpora are actually assembled','Private, and competing against both hyperscalers and Snowflake'],
 ['Palantir','Data integration and operational decision platforms','Heavily weighted to government and defence deployments','Integration and governance','Sells exactly the lineage, permissioning and audit that regulated buyers now require','Valued richly against a concentrated customer base'],
 ['Elastic','Search and vector retrieval','The index layer under a large share of enterprise retrieval','Retrieval index','Retrieval is how enterprise knowledge reaches a model without retraining','Vector search is a feature many platforms now include by default'],
 ['Reddit','Human conversation corpus, licensed for training','Licenses its corpus explicitly rather than tolerating scraping','Rights holder','One of few genuinely large corpora with a clean, transferable licence','Revenue concentration in a small number of licensees, on renewable terms'],
 ['Thomson Reuters','Professional legal, tax and news content','High-value proprietary text with unambiguous rights','Rights holder','Owns content whose provenance is not in question, in domains where errors are expensive','A publishing business first; AI licensing is incremental'],
 ['Scale AI','Data annotation and human feedback','A large supplier of post-training labour to model developers','Annotation at scale','Post-training is where capability differences are increasingly made','Labour-intensive economics, and exposed to synthetic preference data'],
 ['Pure Storage','All-flash storage arrays','Sold into the high-throughput tier feeding training clusters','High-throughput storage','Training starves on read bandwidth, and that is the product','Competes with hyperscaler-native storage and with cheaper capacity tiers'],
 ['Confluent','Streaming data ingestion','Moves event data from source systems into storage continuously','Streaming ingestion','Operational and sensor data arrives as streams, not as files','A platform component that cloud providers also offer natively']],
 wrong:'The rights position could resolve in the models’ favour. If courts broadly permit training on publicly available content, the value of a clean licensable corpus falls sharply, and the rights holders in this layer reprice down rather than up. The governance and lineage tier would survive that outcome — enterprise buyers want it regardless — but the licensing thesis would not.'},
{n:8,t:'AI models and inference',moat:'Weak moat',mk:'warn',
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

{n:9,t:'Agentic software and applications',moat:'Contested',mk:'warn',
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
 why:'A model in isolation produces text. Software gives it tools, memory, permissions and a place in a business process. But <b>this is where the thesis inverts</b>: in layers 1 to 8, AI creates demand and the exposed companies benefit. In layer 9, AI is currently a net destroyer of incumbent enterprise value, because agents replace the humans who generate per-seat revenue. "Invest in the companies creating the revolution" is precisely the wrong instruction here.',
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

{n:10,t:'Embodied AI and autonomous systems',moat:'Moderate moat',mk:'mixed',
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
  'A 6,000-square-metre robotic data collection facility opened in China in January 2026 is capable of generating three million high-quality data entries annually — comparable in scale to the entire Open X-Embodiment dataset, which aggregated the work of 22 institutions. <b>Consistent with layer 10, the data infrastructure for physical AI is being built fastest in China, and it accumulates.</b> Whatever one concludes about the synthetic data debate, this compounds the geopolitical asymmetry already flagged in the embodiment layer.'],
 ['How to actually use this layer',
  'Layer 10 is not a place to allocate capital. It is a place to check whether the thesis is still true. The infrastructure stack only compounds if the loop closes, and everything in layers 1 through 5 — the turbines, the transformers, the lithography monopolies, the memory oligopoly, the debt-financed data centres — is a derivative claim on physical-world value eventually materialising. <b>Its practical function in an investment process is diagnostic.</b> Two risks also point in opposite directions here and neither can be resolved from outside: synthetic data may substitute more completely than expected, evaporating collection moats; or model collapse from synthetic over-reliance may prove real, making real data more valuable. Sizing should reflect that genuine uncertainty rather than a view on which resolves.']
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
 choke:'<b>The geography inverts here.</b> Layers 3 and 4 concentrate in the Netherlands, Taiwan, Japan and Korea. Layer 10 concentrates in China, which holds 63% of humanoid component supply and over 70% of rare earth magnet production. Adding this layer to a semiconductor-heavy portfolio adds a second, oppositely-directed geopolitical exposure — it does not diversify the first.',
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
{t:'Rare earths',c:C[9],big:'86–90%',d:'Share of world rare earth refining in China. Separation requires hundreds of sequential solvent-extraction stages and a multi-decade process-knowledge lead. April 2025 controls on seven heavy rare earths have never been suspended.',s:'Enters at layers 1, 4 and 8'},
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
{t:'Geopolitics is not a footnote',d:'Layers 3 and 4 sit in Taiwan, Korea, the Netherlands and Japan. Layer 10 sits in China. These are independent exposures that can both be realised at once — adding one does not diversify the other.'},
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
6:{severity:"Moderate",summary:"A real but narrow material base. Silica preforms, germanium dopant and compound semiconductors carry the optical path; copper carries the short reach. The layer’s hard constraints are geographic rather than metallurgical — rights of way and a small fleet of cable ships — which is unusual and is why it behaves differently from the layers around it.",
 stats:[["3","Non-Chinese subsea system suppliers"],["2–3 yrs","New fibre draw capacity"],["Moderate","Material severity"],["Structural","Route scarcity"]],
 flow:["Silica + germanium + III–V materials","Preform + fibre + laser die","Modules, cable, transport systems","Routes, facilities and access networks"],
 items:[
  {n:"High-purity silica",role:"Optical fibre preforms",choke:"The glass is not scarce; drawing capacity moves on a multi-year cycle and is concentrated in a handful of producers.",geo:"United States / Japan / China",time:"2–3 years"},
  {n:"Germanium",role:"Core dopant that raises the refractive index of the fibre core",choke:"Recovered as a by-product of zinc processing, so supply does not respond to its own price. Chinese export controls apply.",geo:"China / by-product streams",time:"Structural"},
  {n:"Compound semiconductors",role:"Lasers, modulators and photodetectors",choke:"Indium phosphide and gallium arsenide substrates come from a short supplier list; silicon photonics substitutes for part of the range.",geo:"Japan / United States / Germany",time:"3–5 years"},
  {n:"Copper",role:"Short-reach cable inside racks and between adjacent racks",choke:"Not scarce as a metal; the constraint is inherited from layer 2 refining and shared with layer 1.",geo:"Global",time:"Inherited"},
  {n:"Rights of way",role:"Metro conduit and terrestrial long-haul routes",choke:"Not a material at all, and the hardest constraint in the layer. Granted once under permitting regimes that no longer apply.",geo:"Per municipality",time:"Effectively permanent"}],
 note:"The unusual feature of this layer is that its most durable constraint is not a material. A competitor with unlimited capital can build a transceiver line; it cannot obtain a second conduit down the same street, and it cannot conjure a cable-laying fleet."},
7:{severity:"None direct",summary:"No distinctive material base of its own. The layer inherits storage media and compute from layers 3 and 4, and electricity from layer 1. Its binding constraint is legal rather than physical — the right to use data — which behaves like a chokepoint in every respect except that no amount of lead time relieves it.",
 stats:[["0","Distinctive raw materials"],["3","Inherited inputs: storage, compute, power"],["Legal","Character of the binding constraint"],["Unresolved","Rights position"]],
 flow:["Storage media + compute + power","Ingestion and storage systems","Curation, annotation and governance","Governed data products"],
 items:[
  {n:"NAND flash and disk media",role:"The capacity and throughput tiers under training clusters",choke:"Inherited from layer 3. Read bandwidth is a design constraint rather than a supply shortage.",geo:"Korea / Japan / United States",time:"Inherited"},
  {n:"Compute",role:"Ingestion, processing, deduplication and indexing",choke:"Rented or owned; an economic dependency rather than a geological one.",geo:"Cloud / on-premises",time:"Flexible"},
  {n:"Electricity",role:"Continuous cost of holding and reprocessing large corpora",choke:"Inherited from layer 1 and usually buried inside cloud pricing.",geo:"Provider-specific",time:"Inherited"},
  {n:"Usage rights",role:"The condition on which any of the above may lawfully be used",choke:"Contested across jurisdictions, and lineage cannot be reconstructed after records are mixed. This is the layer’s real chokepoint.",geo:"US / EU / UK divergent",time:"Unresolved"}],
 note:"Treating this layer as material-free is right about the physics and wrong about the risk. The constraint that decides whether a corpus is an asset or a liability is a legal one, and it has the durability of a structural chokepoint without any of the usual relief mechanisms."},
8:{severity:"None direct",summary:"A model is information. It has no mine, refinery or qualified process material of its own—and that absence helps explain why model-layer moats are weaker than physical chokepoints below it.",
 stats:[["0","Distinctive raw materials"],["3","Inherited physical layers"],["$/token","Long-run energy exposure"],["Weak","Material barrier to entry"]],
 flow:["Electricity","Accelerator + HBM","Training / inference run","Model weights"],
 items:[
  {n:"Electricity",role:"The marginal physical input per token",choke:"Firm-power price and availability become cost of goods, not an externality.",geo:"Site-specific",time:"Inherited from layer 1"},
  {n:"Accelerators + HBM",role:"Embodied capital that produces the model",choke:"Inherits CoWoS, HBM and accelerator supply constraints from layers 3–4.",geo:"Taiwan / Korea / US",time:"Inherited"},
  {n:"Cooling + water",role:"Carries training heat out of the facility",choke:"Inherits facility thermal density and local water constraints.",geo:"Campus-specific",time:"Inherited"}],
 note:"Treat a model provider's electricity, compute and depreciation assumptions as physical inputs to gross margin. The absence of a unique material dependency is an analytical result, not a missing chapter."},
9:{severity:"None direct",summary:"Software and agents consume compute and electricity but introduce no distinctive material base. This makes distribution, workflow ownership, trust and switching cost—not scarcity—the only credible moats.",
 stats:[["0","Distinctive raw materials"],["2","Inherited inputs: compute + power"],["High","Substitution speed"],["Contested","Moat durability"]],
 flow:["Power + cloud compute","Model API / local model","Agent runtime + tools","Workflow outcome"],
 items:[
  {n:"Compute",role:"Inference and orchestration",choke:"Capacity can be rented, optimised or shifted between providers; dependency is economic rather than geological.",geo:"Cloud / local",time:"Flexible"},
  {n:"Electricity",role:"Indirect cost per completed task",choke:"Usually buried in cloud pricing, but decisive for scaled low-margin workloads.",geo:"Provider-specific",time:"Inherited"},
  {n:"Device hardware",role:"Local inference, sensors and secure credentials",choke:"Inherits semiconductors and batteries only where agents run at the edge.",geo:"Global electronics chain",time:"Inherited"}],
 note:"Layers 8 and 9 are the only layers without a material chokepoint and the two with the most contested moats. Physical scarcity is harder to compete away than software advantage."},
10:{severity:"Extreme",summary:"Embodiment reverses the infrastructure stack's geography. High-torque-density motors require rare-earth magnets, while precision reducers depend on metallurgy, heat treatment and micron-scale grinding capacity.",
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
6:{scores:[["Commoditisation",4],["Capex cyclicality",4],["Concentration",3],["Regulation",2]],items:[
 {t:"Co-packaged optics",d:"Moving transceiver function onto the switch package would compress an entire component category into the silicon supplier’s margin.",m:"Track design wins for co-packaged parts at each speed transition."},
 {t:"Transition pricing",d:"Every speed generation brings new entrants and falling unit prices; volume growth can coexist with margin compression.",m:"Track gross margin through a transition, not revenue."},
 {t:"Customer concentration",d:"A small number of hyperscalers now drive the majority of incremental demand, and they negotiate accordingly.",m:"Track disclosed customer concentration and contract duration."},
 {t:"Subsea capacity",d:"A short supplier list and a small ship fleet mean schedule slips propagate; buyers responding by building privately changes who captures the value.",m:"Track announced private systems versus consortium capacity."}],
 verdict:"The layer rewards owning routes and punishes owning boxes. Both are levered to the same build-out, which makes it easy to buy the wrong one for the right reason."},
7:{scores:[["Legal uncertainty",5],["Commoditisation",4],["Platform capture",4],["Labour substitution",3]],items:[
 {t:"Training-rights litigation",d:"Outcomes across several jurisdictions will decide how much of the existing corpus was ever usable, and whether licensed corpora reprice up or down.",m:"Track settlements and judgments, and the licence terms struck alongside them."},
 {t:"Retrofit impossibility",d:"Lineage cannot be reconstructed once records from many origins are mixed; a governance failure is not fixable after the fact.",m:"Track whether provenance is captured at ingestion or asserted afterwards."},
 {t:"Hyperscaler absorption",d:"Storage, ingestion, cataloguing and vector search are all features the cloud providers offer natively.",m:"Track net revenue retention where the platform competes with its own host."},
 {t:"Synthetic substitution",d:"If preference and instruction data become substantially synthetic, the annotation businesses lose their demand driver.",m:"Track disclosed synthetic share in post-training pipelines."}],
 verdict:"The layer’s value turns almost entirely on a question no engineer controls. Governance tooling survives either outcome; the licensing thesis does not."},
8:{scores:[["Commoditisation",5],["Capex dependency",5],["Regulation",3],["Concentration",3]],items:[
 {t:"Capability convergence",d:"Open and closed models can converge faster than providers build differentiated distribution.",m:"Track price per benchmark-adjusted token."},
 {t:"Efficiency shock",d:"Algorithmic gains can reduce training or inference demand per task faster than usage expands.",m:"Track total compute spend per completed workflow."},
 {t:"Weak pricing power",d:"Model APIs face routing, distillation and multi-model applications that arbitrage suppliers.",m:"Track net revenue retention after price cuts."},
 {t:"Evaluation failure",d:"Benchmarks can rise without reliability improving on economically valuable work.",m:"Track task completion and human-intervention rates."}],verdict:"Models are indispensable but may be a poor standalone profit pool. The investable question is who captures the surplus created by capability—not who temporarily leads a benchmark."},
9:{scores:[["Commoditisation",5],["Platform capture",5],["Security",4],["Regulation",4]],items:[
 {t:"Feature absorption",d:"Model or cloud platforms can bundle the agent feature before an application earns distribution.",m:"Track gross retention when foundation models ship substitutes."},
 {t:"Incumbent destruction",d:"Agents can reduce seats, clicks and transaction fees in the same software companies expected to monetise them.",m:"Track revenue per completed task, not per seat."},
 {t:"Permission failure",d:"Tool access turns hallucination into an action; delegation chains create identity and audit gaps.",m:"Track irreversible-action rate and override frequency."},
 {t:"Workflow lock-in",d:"Without proprietary data or control of the system of record, switching costs may remain near zero.",m:"Track depth of write access and embedded approvals."}],verdict:"Distribution wins this layer only when it becomes workflow ownership. A thin agent wrapper is a feature; a governed system of record with proprietary feedback can be a business."},
10:{scores:[["Timeline",5],["China exposure",5],["Price deflation",5],["Safety",4]],items:[
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
cap:{t:'Fleet demand as a share of current world output',u:'% of annual production, log scale',c:C[9],log:true,b:[['Precision reducers',5000],['NdFeB magnets',13],['Image sensors',1.2],['Battery cells',1.1],['Copper',0.2]],
 note:'Global precision reducer output is estimated at roughly 5 million units a year including all industrial robotics and machine tools. This estimate is the single figure in the analysis most in need of independent verification.'},
comp:{h:['Component','Per robot','Fleet total'],r:[
['Actuators, body and hands','45','450 million'],['Harmonic and RV reducers','25','250 million'],
['Planetary roller screws','12','120 million'],['Image sensors','8','80 million'],
['Force and torque sensors','6','60 million'],['Edge compute modules','1','10 million'],
['NdFeB magnet','3 kg','30,000 t'],['Copper','4 kg','40,000 t'],['Battery','2.0 kWh','20 GWh']]},
bom:{t:'Where the cost sits in a humanoid',u:'% of bill of materials',c:C[9],b:[['Actuators and joints',50],['Sensors and perception',33],['Hands and manipulation',17]],
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
data:{t:'Robot interaction data, billions of hours',u:'log scale',c:C[10],log:true,b:[['Exists globally today',0.0005],['Needed, low estimate',1],['Needed, high estimate',10],['10M fleet, per year',58.4]],
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
ramp:{t:'Cumulative units at 100% annual production growth',u:'millions, log scale',c:C[9],log:true,b:[['2026',0.02],['2028',0.14],['2030',0.62],['2032',2.54],['2034',10.22]],
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


/* ══════════════════════════════════════════════════════════════════════════
   ELEMENT PHOTOGRAPHS
   Specimen photographs for every element the collection carries — 90 of the
   118, from the Chemical Elements virtual museum via images-of-elements.com.
   Protactinium and curium are excluded: their source states no image-specific
   Creative Commons licence, so they are not ours to redistribute.

   A photograph shows one specimen, not a canonical appearance: allotrope,
   oxide film, container and lighting all change it, and several are gas
   discharge tubes whose glow is electrically excited. Each element's own entry
   says which it is, and the panel repeats that where it matters.

   ELMAP ties a material entry in the report to the element or elements that
   actually govern it. Entries with no single governing element, and fluorine,
   which has no usable specimen photograph, render without one.
   ══════════════════════════════════════════════════════════════════════════ */
const EL_HAVE=new Set(["Ac","Ag","Al","Am","Ar","As","Au","B","Ba","Be","Bi","Bk","Br","C","Ca","Cd","Ce","Cf","Cl","Co","Cr","Cs","Cu","Dy","Er","Es","Eu","Fe","Ga","Gd","Ge","H","He","Hf","Hg","Ho","I","In","Ir","K","Kr","La","Li","Lu","Mg","Mn","Mo","N","Na","Nb","Nd","Ne","Ni","Np","O","Os","P","Pb","Pd","Pr","Pt","Pu","Rb","Re","Rh","Ru","S","Sb","Sc","Se","Si","Sm","Sn","Sr","Ta","Tb","Tc","Te","Th","Ti","Tl","Tm","U","V","W","Xe","Y","Yb","Zn","Zr"]);
const ELMAP={"Copper": ["Cu"], "Copper smelting": ["Cu"], "Copper + underfill": ["Cu"], "ABF resin + copper foil": ["Cu"], "Grain-oriented electrical steel": ["Fe"], "Bearing + gear steels": ["Fe"], "Steel + concrete": ["Fe"], "Rhenium superalloys": ["Re"], "High-purity quartz": ["Si"], "Electronic-grade polysilicon": ["Si"], "Silicon interposers": ["Si"], "InGaAs + silicon": ["In", "Si"], "SiC + GaN": ["Si", "Ga"], "HALEU + zirconium": ["U", "Zr"], "Gallium + germanium": ["Ga", "Ge"], "Fibre + germanium dopant": ["Ge"], "Neon + helium": ["Ne", "He"], "NdFeB + Dy/Tb": ["Nd", "Dy"], "Rare earth separation": ["Nd", "Dy"], "Lithium + graphite": ["Li", "C"], "LFP cells + graphite": ["Li", "C"], "Aluminium + carbon fibre": ["Al", "C"], "Aluminium + silver": ["Al", "Ag"], "Indium + ruthenium": ["In", "Ru"], "Indium foil + diamond composites": ["In", "C"], "Tin + ruthenium + Mo/Si": ["Sn", "Ru"], "Photoresists + HF": ["F"]};
let ELDATA=null;
fetch('assets/elements/elements.json').then(r=>r.ok?r.json():null).then(d=>{ELDATA=d;}).catch(()=>{});

function elementShots(materialName){
  const syms=(ELMAP[materialName]||[]).filter(x=>EL_HAVE.has(x));
  if(!syms.length) return '';
  const shots=syms.map(x=>
    `<button type="button" class="el-shot" data-el="${x}" title="${x} — open element details">`+
    `<img src="assets/elements/${x}.jpg" alt="Specimen of element ${x}" loading="lazy" decoding="async" onerror="this.closest('.el-shot').remove()">`+
    `<span class="el-cap"><b>${x}</b><span data-elname="${x}">&nbsp;</span></span></button>`).join('');
  return shots?`<div class="el-shots">${shots}</div>`:'';
}

function materialPane(m,col){
  const isL2 = m.__n===2;
  const crossStack = isL2 && typeof MATTBL!=='undefined' ? `
    <h4 class="mini-h">Where each material enters the infrastructure stack</h4>
    <p class="sub">The five gating materials, read across the whole stack rather than one layer at a time.</p>
    <div class="mats mats-inline">${(typeof MATS!=='undefined'?MATS:[]).map(x=>
      `<article class="mat"><h4>${x.t}</h4><div class="big" style="color:${x.c}">${x.big}</div>`+
      `<p>${x.d}</p><p class="src">${x.s}</p></article>`).join('')}</div>
    <div class="tw"><table class="dat">${tbl(MATTBL)}</table></div>
    <p class="tnote">Material chokepoints behave differently from manufacturing ones. A refinery can be replicated in three to eight years; ASML\u2019s accumulated engineering cannot. Material constraints shape the near-term timing of bottlenecks but should not, on their own, underwrite a decade-long thesis. The exception is China\u2019s export ban on rare earth separation <em>technology</em> \u2014 licensing the metal is a tariff, banning the know-how is a moat.</p>` : '';

  return `<div class="material-hero" style="border-left:4px solid ${col}">
    <div><h4>Material foundation</h4><p>${m.summary}</p></div>
    <div class="severity-badge"><span>Constraint severity</span><b style="color:${col}">${m.severity}</b></div>
  </div>
  <div class="material-stats">${m.stats.map(x=>`<div><b class="num">${x[0]}</b><span>${x[1]}</span></div>`).join('')}</div>
  <div class="supply-flow">${m.flow.map((x,j)=>`<div class="flow-node"><small>${['Origin','Refine','Transform','Enters stack'][j]}</small><b>${x}</b></div>`).join('')}</div>
  <div class="material-cards">${m.items.map(x=>`<article class="material-card${elementShots(x.n)?' has-shot':''}">
    <div class="mat-top">${elementShots(x.n)}<div><h5>${x.n}</h5><div class="mat-role">${x.role}</div></div></div>
    <div><div class="mat-choke">${x.choke}</div><div class="mat-meta"><span class="micro-chip">${x.geo}</span><span class="micro-chip">Relief: ${x.time}</span></div></div>
  </article>`).join('')}</div>
  <div class="conc-wrap" data-conc="${m.__n}"></div>
  ${m.__n===3?`<div class="policy-rail" data-policy="${m.__n}"></div>`:''}
  <div class="material-note"><b>Investment reading.</b> ${m.note}</div>
  <p class="tnote">Element photographs: Chemical Elements &mdash; A Virtual Museum (images-of-elements.com), <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener noreferrer">CC BY 3.0</a>, retouched onto a neutral ground. Each shows one specimen rather than a canonical appearance &mdash; allotrope, oxide film, container and lighting all change how an element looks.</p>`+crossStack;
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
      <button class="layer-mode" data-mode="how" aria-selected="true">Layer description</button>
      <button class="layer-mode" data-mode="chain" aria-selected="false">Value chain</button>
      <button class="layer-mode" data-mode="materials" aria-selected="false">Layer materials</button>
      <button class="layer-mode" data-mode="thesis" aria-selected="false">Layer thesis</button>
      <button class="layer-mode" data-mode="companies" aria-selected="false">Top companies</button>
      <button class="layer-mode" data-mode="risks" aria-selected="false">Risks + signals</button>
    </div>
    <div class="layer-body">
      <div class="layer-pane" data-mode-pane="thesis">${tabIntro('thesis',col)}
        <div class="overview-lede"><div><p class="lede">${L.lede}</p><p class="why">${L.why}</p></div><div class="choke-card" style="border-left-color:${col}"><b>Binding constraint.</b> ${L.choke}</div></div>
        <div class="facts">${factgrid(L.facts)}</div>
        <div class="layer-diagnostic single">
          <div class="chartbox">${bars(ch)}</div>
        </div>
        <div class="essay-list">${L.detail.map((d,j)=>`<details class="essay" ${j===0?'open':''}><summary>${d[0]}</summary><p>${d[1]}</p></details>`).join('')}</div>
      </div>
      <div class="layer-pane on" data-mode-pane="how">${howPane(L,col)}</div>
      <div class="layer-pane" data-mode-pane="chain">${tabIntro('chain',col)}${chainPane(L.n,col)}</div>
      <div class="layer-pane" data-mode-pane="materials">${materialPane(mat,col)}</div>
      <div class="layer-pane" data-mode-pane="risks">${tabIntro('risks',col)}${riskPane(risk,L)}</div>
      <div class="layer-pane" data-mode-pane="companies">${tabIntro('companies',col)}<div class="tw"><table class="co">${cotbl(L.co,L.n)}</table></div><p class="tnote"><b>On the share column.</b> Each figure is the company\u2019s approximate share of the specific niche named beside it, not of the layer and not of any single market. Bases, definitions and measurement dates differ from row to row, so the column indicates order of magnitude and competitive position rather than a like-for-like ranking; <em>n/d</em> means no figure is stated here because none is reliable. Country is domicile of listing, which frequently differs from where the production risk actually sits. Inclusion maps exposure to the layer; it is not a buy recommendation. Read the bull and bear columns together.</p></div>
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

/* The tab a reader is on carries across layers: switching from Energy to
   Compute silicon while reading Layer thesis keeps you on Layer thesis, so the
   same view can be compared layer by layer. */
let CURRENT_MODE='how';
function selectLayerMode(panel,mode,remember=true){
  if(remember) CURRENT_MODE=mode;
  panel.querySelectorAll('.layer-mode').forEach(b=>b.setAttribute('aria-selected',b.dataset.mode===mode?'true':'false'));
  panel.querySelectorAll('[data-mode-pane]').forEach(v=>v.classList.toggle('on',v.dataset.modePane===mode));
  const pane=panel.querySelector('[data-mode-pane].on');
  if(pane) pane.scrollTop=0;
  fill();
}

/* Stage jumps and back-to-index scroll their own pane rather than navigating.
   They were anchor hashes, which the layer deep-link handler could not match
   and so fell through to selecting the physical world. Delegated from the
   document so it holds however the panes are built or rebuilt. */
document.addEventListener('click',e=>{
  const top=e.target.closest('.vc-top');
  if(top){
    const pane=top.closest('[data-mode-pane]');
    if(pane) pane.scrollTop=0;   /* smoothness is CSS scroll-behavior */
    return;
  }
  const jump=e.target.closest('.vj[data-jump]');
  if(!jump) return;
  const pane=jump.closest('[data-mode-pane]'), target=document.getElementById(jump.dataset.jump);
  if(!pane||!target) return;
  /* measured from rects: the pane is not the target's offsetParent */
  const delta=target.getBoundingClientRect().top-pane.getBoundingClientRect().top;
  pane.scrollTop=pane.scrollTop+delta-12;
});

function sel(i,focus){
  document.querySelectorAll('#rail .tab').forEach((t,j)=>{
    const on=j===i; t.setAttribute('aria-selected',on?'true':'false');
    const col=j>0&&LAYERS[j-1]?C[LAYERS[j-1].n]:'var(--accent)';
    t.style.borderLeftColor=on?col:'transparent';
    t.style.borderBottomColor=on?col:'transparent';});
  document.querySelectorAll('#panels .panel').forEach((p,j)=>{p.classList.toggle('on',j===i); p.hidden=j!==i});
  const shown=document.querySelectorAll('#panels .panel')[i];
  if(shown&&shown.querySelector(`.layer-mode[data-mode="${CURRENT_MODE}"]`)) selectLayerMode(shown,CURRENT_MODE,false);
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
    if(i<0){ sel(0); return; }   // no hash: open on the physical world, never on nothing
    sel(i);
    tabs[i].scrollIntoView({block:'nearest',inline:'nearest'});
  };
  tabs.forEach((tab,i)=>tab.addEventListener('click',()=>{
    history.replaceState(null,'','#layer-'+(i===0?0:LAYERS[i-1].n));
  }));
  window.addEventListener('hashchange',()=>{ if(/^#layer-\d+$/.test(location.hash)) apply(); });
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
      {l:'Energy and operations',v:0,c:LC(8)},{l:'Land and utility works',v:336,c:LC(10)}]},
    {label:'Annualised total cost',sub:'$8.51bn per year',totalLabel:'',segs:[
      {l:'Servers',v:5021,c:LC(4)},{l:'Facility',v:1387,c:LC(1)},{l:'Network',v:1167,c:LC(5)},
      {l:'Energy and operations',v:897,c:LC(8)},{l:'Land and utility works',v:39,c:LC(10)}]}],
  note:'Servers move from 56% of the cheque to 59% of the annual cost. Energy — the input every headline is about — is 7% of the annual bill and zero of the upfront one. Source: Epoch AI, May 2026; operations line aggregates energy, taxes, maintenance, labour and water.'
}));

put('cx-lead-gantt',CX.gantt({
  t:'Sequence and lead times, drawn from the same month zero',
  q:'Which activity, started today, finishes last? Not the building.',
  max:66,
  rows:[
    {l:'Long-lead equipment orders',a:0,b:3,c:LC(1),kind:'lead',strong:1,tag:'must be first'},
    {l:'Site and power strategy',a:0,b:12,c:LC(10)},
    {l:'Permitting and entitlement',a:6,b:24,c:LC(10)},
    {l:'Site works and foundations',a:12,b:24,c:LC(10)},
    {l:'Shell construction',a:18,b:36,c:LC(10),tag:'18 months'},
    {l:'Electrical installation',a:24,b:42,c:LC(1)},
    {l:'Mechanical and cooling',a:26,b:44,c:LC(8)},
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
    {x:2.5,y:11.5,r:36,c:LC(9),l:'Solar + storage',sub:'~110 km² · not firm alone',ly:52,tip:'~$11–12bn capex, ~110 km² of land'},
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
    {l:'Energy source',sub:'gas → nuclear',lo:3.13,hi:3.32,c:LC(8),loL:'$3.13',hiL:'$3.32'}],
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
    {n:'7-year life',v:[3.75,3.16,2.70,2.42,2.17],c:LC(8)}],
  marks:[{y:3.49,label:'cheapest custom contract, $3.49'},{y:4.26,label:'spot median, $4.26'}],
  note:'The 3-year line never crosses below the contract floor at any plausible utilisation. The 5-year line clears it only above roughly 65% occupancy. Break-even includes a 12% return on capital; market reference prices are B200 rates at 1 September 2026.'
}));

put('cx-capstack',CX.stack100({
  t:'Two capital structures, one asset',
  q:'Same building, same chips, different survival odds. The discount rate should not be the same.',
  key:[{l:'Equity and operating cash flow',c:LC(8)},{l:'Project debt and private credit',c:LC(4)},{l:'GPU-collateralised debt',c:LC(3)}],
  rows:[
    {label:'Hyperscaler-funded',sub:'balance-sheet capex',segs:[
      {l:'Equity and operating cash flow',v:75,c:LC(8)},{l:'Project debt and private credit',v:25,c:LC(4)},{l:'GPU-collateralised debt',v:0,c:LC(3)}]},
    {label:'Neocloud-funded',sub:'levered SPV',segs:[
      {l:'Equity and operating cash flow',v:20,c:LC(8)},{l:'Project debt and private credit',v:45,c:LC(4)},{l:'GPU-collateralised debt',v:35,c:LC(3)}]}],
  note:'ILLUSTRATIVE — midpoints chosen inside the disclosed ranges in the table above to show the shape of the difference, not a survey of actual deals. The structural point is not a percentage: a representative neocloud carries five-year loans against three-year customer contracts and fifteen-year leases, secured on an asset whose useful life is the single most contested assumption in the project.'
}));

/* ───────── Humanoid project charts ───────── */
put('cx-bom-donut',CX.donut({
  t:'Where the cost sits in one humanoid',
  q:'A mechatronics problem with an AI feature, not the reverse.',
  centre:['~50%','actuation'],
  data:[{l:'Actuators and joints',v:50,c:LC(9),vl:'50%'},{l:'Sensors and perception',v:33,c:LC(5),vl:'33%'},{l:'Hands and manipulation',v:17,c:LC(3),vl:'17%'}],
  note:'Morgan Stanley\u2019s teardown of an Optimus Gen 2-class robot put actuators at roughly 56% of a ~$55,000 bill of materials; independent 2026 estimates place high-precision joint actuators at 40–55% of hardware cost. Shares are analyst estimates, not disclosures.'
}));

put('cx-ramp',CX.lines({
  t:'The ramp required to reach ten million units',
  q:'What has to be true, year by year, for the fleet to exist?',
  x:['2026','2028','2030','2032','2034'],
  y:{min:0.01,max:20,ticks:[0.01,0.1,1,10],title:'cumulative units, log scale',fmt:t=>t<1?(t*1000).toFixed(0)+'k':t+'m'},log:true,
  series:[
    {n:'Annual production',v:[0.02,0.08,0.32,1.28,5.12],c:LC(5),dash:true},
    {n:'Cumulative fleet',v:[0.02,0.14,0.62,2.54,10.22],c:LC(9)}],
  marks:[{y:10,label:'10 million cumulative'}],
  note:'DERIVED — sustained 100% annual production growth applied to a 2026 base of roughly 20,000 units. Reaching the threshold requires doubling output every year for nine consecutive years. No hardware industry has sustained that, and none faced a component whose supply chain must grow fiftyfold.'
}));

put('cx-bottleneck',CX.scatter({
  t:'Bottleneck map: how bad, and how long to fix',
  q:'Position, not rank. Anything in the upper right is a decade-scale constraint, not a supply squeeze.',
  x:{min:0,max:13,ticks:[0,3,6,9,12],title:'years to relieve →',fmt:t=>t+'y'},
  y:{min:0,max:5.6,ticks:[1,2,3,4,5],title:'severity, 1 low → 5 high',fmt:t=>String(t)},
  points:[
    {x:10,y:5,r:22,c:LC(9),l:'Precision reducers',sub:'~50× expansion',ly:-32,tip:'8–12 years to relieve'},
    {x:11.5,y:4.6,r:16,c:LC(1),l:'Rare earth magnets',sub:'political, not industrial',ly:24,an:'middle',lx:0,tip:'13% of world output, export-controlled'},
    {x:8,y:4.3,r:14,c:LC(3),l:'Manipulation and tactile',sub:'research-dependent',ly:-22,tip:'Unsolved for unstructured work'},
    {x:4,y:3.4,r:12,c:LC(5),l:'Edge inference',sub:'3–5 years',ly:-22,tip:'Models outpace deployable hardware'},
    {x:1.5,y:3.9,r:11,c:LC(4),l:'Training data',sub:'self-resolving above 1m units',ly:-18,an:'end',lx:-16,tip:'Severe below 1m units'},
    {x:3,y:2.4,r:9,c:LC(8),l:'Battery runtime',sub:'workarounds exist',ly:22,tip:'Architectural, not chemical'},
    {x:7,y:2.0,r:9,c:LC(10),l:'Maintenance trade',sub:'5–10 years',ly:22,tip:'A trade that does not yet exist'},
    {x:1,y:1.0,r:7,c:LC(10),l:'Fleet electricity',sub:'not a constraint',ly:20,an:'start',lx:-6,tip:'~0.5% of US consumption'}],
  note:'Severity scores are the author\u2019s ranking, positioned against the time-to-relieve estimates in the table below. The reducer capacity denominator behind the fiftyfold figure is a derivation from industrial robot installation volumes, not a disclosed statistic, and is the single number here most in need of primary-source verification.'
}));

put('cx-energy-cmp',CX.shareBars({
  t:'Fleet energy in context',
  q:'Ten million robots against the infrastructure that trains them.',c:LC(9),
  max:100,
  rows:[
    {l:'Supporting AI training compute, 3–5 GW',v:100,vl:'~26 TWh',c:LC(4)},
    {l:'10m humanoid fleet, all charging',v:78,vl:'20.4 TWh',c:LC(9)},
    {l:'One 1 GW data centre',v:27,vl:'7.1 TWh',c:LC(5)},
    {l:'Fleet on-board compute, distributed',v:16,vl:'~1.3 GW',c:LC(10)}],
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
             {l:'Network infrastructure',v:4925,c:LC(5)},{l:'Land and utility works',v:336,c:LC(10)}];
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

/* Moat durability against material chokepoint strength.
   The scatter is the report's central heuristic, so each point explains itself
   on hover: why that moat score, why that chokepoint score, and what would
   move it. Positions are the author's assessment, not measured values. */
const MOATWHY={
1:{t:'Energy, power and utilities',moat:'Strong',cp:'High',
  m:'The moat is not in generating electricity, which is close to a commodity, but in the equipment that conditions and moves it. Turbine slots are sold to 2031 and large power transformers quote at 128 weeks, and neither queue can be jumped with capital. A buyer cannot switch supplier, because there is no third supplier to switch to.',
  c:'Grain-oriented electrical steel has one domestic US producer and needs a days-long grain-orientation anneal that is process knowledge rather than equipment. Turbine hot sections need single-crystal castings with rhenium recovered only as a copper by-product. Copper constrains volume; those two can stop a project outright.',
  w:'Moat falls if transformer and turbine capacity is genuinely built out — it is being added, but the additions are years behind the order book.'},
2:{t:'Raw and processed materials',moat:'Strong',cp:'Extreme',
  m:'Lower than semiconductors, and deliberately so. A separation plant sells a qualified input into a chain that cannot requalify quickly, which is real switching cost. But the moat is replicable on a three-to-eight-year horizon, because the barrier is capital, permitting and process tuning rather than accumulated physics.',
  c:'The most concentrated point in the report. China refines 86–90% of rare earths and smelts roughly 48% of copper, and the April 2025 licensing on seven heavy rare earths was never suspended. Separation is intrinsically hard — the lanthanides differ only in an inner shell — so the concentration reflects physics as much as policy.',
  w:'The export ban on separation <em>technology</em>, not the metal, is what turns a tariff into a moat. Watch the November 2026 expiry.'},
3:{t:'Semiconductor production ecosystem',moat:'Very strong',cp:'Extreme',
  m:'The strongest position in the analysis, and the only layer with no substitute and no workaround. One company sells EUV lithography; two sell the software a chip can be designed in; one manufactures the overwhelming majority of leading-edge logic. Each sells something the customer cannot design around inside a decade, and equipment vendors earn on installed base and service as well as new tools.',
  c:'Every input is a near-monopoly of its own: high-purity quartz from essentially two producers, electronic-grade polysilicon at eleven nines from four, photoresists from a handful of qualified Japanese suppliers, and the multilayer molybdenum-silicon optics inside every EUV scanner from a single firm.',
  w:'Nothing on a five-year view. The realistic threat is political — a Taiwan disruption — not competitive.'},
4:{t:'Compute, memory and networking',moat:'Moderate, eroding',cp:'High',
  m:'The highest growth in the stack and the shortest moat half-life. What defends the incumbent is the software ecosystem, not the transistor: switching vendor means rewriting kernels. That is a real cost but a falling one, and every hyperscaler large enough to amortise a design team has started its own accelerator programme.',
  c:'Real but not absolute. High-bandwidth memory has three credible suppliers, and advanced packaging — CoWoS specifically — is the current binding constraint on accelerator supply. Both are capacity problems being solved with capital, which is why this scores below the layers beneath it.',
  w:'Custom silicon taking share is the erosion to watch; HBM supply loosening is what would drop the chokepoint score.'},
5:{t:'Data centres, cloud and edge',moat:'Weak, capital-driven',cp:'Moderate',
  m:'Heavy capital, weak differentiation. Anyone with land, a balance sheet and a contractor can build a hall. What is genuinely scarce is not the building but the signed grid connection and power contract behind it — and that is an asset the operator secured years earlier, not a durable capability.',
  c:'Steel, concrete, copper and cooling plant are ordinary industrial inputs. The constraint is the interconnection queue and the transformer lead time, which belong to layer 1 rather than here.',
  w:'A moat exists only where power was locked in early. Where it was not, this is a commodity landlord business.'},
6:{t:'Connectivity and communications',moat:'Mixed',cp:'High in routes',
  m:'Two different moats under one name. Route and facility owners hold assets a competitor cannot rebuild at any price — metro conduit, interconnection density, subsea systems — and those are among the most durable positions in the report. The equipment tier has almost no moat at all, because merchant switch silicon gave every vendor the same bill of materials.',
  c:'Geographic rather than manufactured. Three firms outside China can lay a transoceanic cable, and the ships and crews are the constraint rather than the cable. Metro rights of way were granted once under permitting conditions that no longer apply.',
  w:'Judge each holding by whether a competitor with capital could reproduce the asset. If the answer is yes, it is a hardware cycle wearing infrastructure language.'},
7:{t:'Data and knowledge infrastructure',moat:'Conditional',cp:'Legal',
  m:'A data moat is conditional on three things at once: the data has to improve outcomes on a task somebody pays for, it has to be usable repeatedly without fresh legal risk, and it must not be adequately approximable by a competitor’s different corpus or by synthetic generation. Most claimed data moats fail at least one. Where all three hold — clean rights over content that is genuinely hard to substitute — the position strengthens as models improve.',
  c:'Not physical. Clear transferable rights to train on third-party content are contested in several jurisdictions simultaneously, and the lineage needed to evidence them cannot be added retrospectively. It has the durability of a structural chokepoint with none of the usual relief mechanisms.',
  w:'The property most often cited in disclosures — the size of the corpus — is the one that discriminates least between an asset and a liability.'},
8:{t:'AI models and inference',moat:'Weak',cp:'None',
  m:'The weakest durable moat relative to the capital consumed. Weights depreciate in months, switching cost for a buyer is a prompt rewrite, and open weights put a hard floor under what an equivalent API call can be priced at. What is defensible — distribution, proprietary data, workflow integration — is not the model.',
  c:'None. The layer consumes compute and electricity, both bought from below, and has no material input of its own. This is why it sits at the origin on the chokepoint axis.',
  w:'This layer spends the most and is likeliest to keep the least. Watch the gap between open-weight and frontier capability.'},
9:{t:'Agentic software and applications',moat:'Contested',cp:'None',
  m:'Higher than models despite no physical constraint, because incumbency in enterprise software is sticky: the data, permissions and process knowledge live in the system of record. But agents attack the pricing model directly — if software does the work rather than helping a person do it, per-seat pricing stops tracking value.',
  c:'None whatsoever. No material input, no lead time, no capital intensity. The layer is pure competition, which is exactly why nothing physical protects an incumbent.',
  w:'The layer where AI most plausibly destroys incumbent value rather than creating it. Vendors already billing on consumption benefit mechanically; those billing per seat do not.'},
10:{t:'Embodied AI and autonomous systems',moat:'Moderate',cp:'High',
  m:'The chokepoints are real but they sit with the component makers, not the humanoid developers attracting the capital. Precision reducers come from two or three Japanese firms at volume; the developers assembling them have little that is hard to copy. The one non-replicable asset is fleet-scale operating data, and almost nobody has it yet.',
  c:'Neodymium-iron-boron magnets with dysprosium or terbium for heat resistance, which places the most Western-facing robotics thesis directly downstream of Chinese separation capacity. Add precision reducers ground to micron tolerances and image sensors from a single dominant supplier.',
  w:'This layer is a diagnostic for where physical constraints bind, not an allocation. The geography inverts against a Western portfolio.'},
};

(function(){
  const el=document.getElementById('cx-matrix'); if(!el) return;
  const W=320,H=330,L=34,R=12,T=24,B=42, pw=W-L-R, ph=H-T-B;
  /* Ten layers now. Connectivity enters mid-field — its chokepoints are real
     but geographic rather than material — and data enters low on the x axis
     because its binding constraint is legal, which this axis does not measure. */
  const P=[[1,.62,.82,'Energy',0],[2,.86,.62,'Materials',0],[3,.94,.95,'Semis',0],[4,.58,.46,'Compute',0],
           [5,.32,.22,'Data centres',0],[6,.50,.62,'Connectivity',0],[7,.16,.52,'Data',0],
           [8,.05,.13,'Models',0],[9,.05,.37,'Software',0],[10,.78,.44,'Embodiment',0]];
  const px=v=>L+v*pw, py=v=>T+ph-v*ph;
  let g=`<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="var(--surface2)" rx="6"/>`;
  g+=`<line class="gr" x1="${L+pw/2}" y1="${T}" x2="${L+pw/2}" y2="${T+ph}"/>`+
     `<line class="gr" x1="${L}" y1="${T+ph/2}" x2="${L+pw}" y2="${T+ph/2}"/>`;
  P.forEach(([n,x,y,lab,dy])=>{
    const an=x<.15?'start':(x>.85?'end':'middle'), lx=x<.15?-13:(x>.85?13:0);
    g+=`<g class="mx-pt" data-layer="${n}" tabindex="0" role="button" aria-label="Layer ${n}, ${lab}">`+
       `<circle class="mx-hit" cx="${px(x).toFixed(1)}" cy="${py(y).toFixed(1)}" r="19" fill="transparent"/>`+
       `<circle class="mx-dot" cx="${px(x).toFixed(1)}" cy="${py(y).toFixed(1)}" r="13" fill="var(--l${n})"/>`+
       `<text x="${px(x).toFixed(1)}" y="${(py(y)+4).toFixed(1)}" text-anchor="middle" style="fill:var(--on-layer);font:600 11px var(--f);pointer-events:none">${n}</text>`+
       `<text class="cs" x="${(px(x)+lx).toFixed(1)}" y="${(py(y)+27+(dy||0)).toFixed(1)}" text-anchor="${an}" style="pointer-events:none">${lab}</text></g>`;
  });
  g+=`<text class="cs" x="${L}" y="${H-24}">weak or indirect</text>`+
     `<text class="cs" x="${L+pw}" y="${H-24}" text-anchor="end">extreme</text>`+
     `<text class="cs" x="${L+pw/2}" y="${H-8}" text-anchor="middle">material chokepoint →</text>`+
     `<text class="cs" x="${-(T+ph/2)}" y="12" transform="rotate(-90)" text-anchor="middle">moat durability →</text>`;

  const REST=`<p class="mx-eyebrow">The heuristic</p><h5>Where a physical chokepoint exists, a moat tends to exist above it</h5>`+
    `<p class="mx-lede">Layers 8 and 9 have no material chokepoint and the weakest moats. Layers 1, 2 and 3 have the strongest of both. `+
    `Materials sits high on chokepoint but below semiconductors on moat, because a refining monopoly can be rebuilt in three to eight years while accumulated engineering cannot. `+
    `Two layers sit awkwardly on this axis: connectivity, whose hardest constraints are geographic rather than material, and data, whose binding constraint is legal. `+
    `Both are plotted on materials alone, so both are understated here.</p>`+
    `<p class="mx-hint">Point at any layer to read why it sits where it does.</p>`;

  el.innerHTML=`<h4>Chokepoint and moat, layer by layer</h4>`+
    `<p class="cq">The correlation is the most useful heuristic in the analysis.</p>`+
    `<div class="dia-shell">`+
      `<div class="dia-chart">`+CX.wrap(`0 0 ${W} ${H}`,g,'Scatter of the ten layers positioned by material chokepoint strength against moat durability, showing a strong positive relationship')+`</div>`+
      `<aside class="dia-info" id="mx-info" aria-live="polite">${REST}</aside>`+
    `</div>`+
    `<figcaption class="cnote">Positions are the author’s assessment on both axes, not measured values. They encode the argument made in each layer rather than a dataset, and should be read as a ranking, not a measurement.</figcaption>`;

  const info=el.querySelector('#mx-info'), svg=el.querySelector('svg');
  const card=n=>{const d=MOATWHY[n]; if(!d) return REST;
    return `<p class="mx-eyebrow" style="color:var(--l${n})">Layer ${n}</p><h5>${d.t}</h5>`+
      `<div class="mx-scores"><span><b>Moat</b>${d.moat}</span><span><b>Chokepoint</b>${d.cp}</span></div>`+
      `<p class="mx-why"><b>Why the moat sits there.</b> ${d.m}</p>`+
      `<p class="mx-why"><b>Why the chokepoint sits there.</b> ${d.c}</p>`+
      `<p class="mx-watch" style="border-left-color:var(--l${n})">${d.w}</p>`;};
  let pinned=null;
  const show=n=>{info.innerHTML=card(n); svg.classList.add('mx-hl'); svg.style.setProperty('--mxc',`var(--l${n})`);
    svg.querySelectorAll('.mx-pt').forEach(p=>p.classList.toggle('on',+p.dataset.layer===n));};
  const clear=()=>{if(pinned!==null)return; info.innerHTML=REST; svg.classList.remove('mx-hl');
    svg.querySelectorAll('.mx-pt').forEach(p=>p.classList.remove('on'));};
  svg.querySelectorAll('.mx-pt').forEach(p=>{
    const n=+p.dataset.layer;
    p.addEventListener('mouseenter',()=>show(n));
    p.addEventListener('mouseleave',clear);
    p.addEventListener('focusin',()=>{pinned=n;show(n);});
    p.addEventListener('focusout',()=>{pinned=null;clear();});
  });
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
    {d:Date.UTC(2025,10,7),l:'One-year suspension',s:'7 Nov 2025',up:1,lv:1,an:'middle',c:LC(8)},
    {d:Date.UTC(2026,5,22),l:'MP Materials and USA Rare Earth listed',s:'22 Jun 2026',up:0,lv:1,an:'middle',c:LC(3)},
    {d:Date.UTC(2026,10,10),l:'Suspension expires',s:'10–27 Nov 2026',up:1,lv:2,an:'end',c:LC(3),flag:1}];
  let g=`<line class="ax" x1="${LP}" y1="${Y}" x2="${W-RP}" y2="${Y}" stroke-width="1.6"/>`;
  [2024,2025,2026].forEach(yr=>{ const x=px(Date.UTC(yr,0,1)).toFixed(1);
    g+=`<line class="gr" x1="${x}" y1="18" x2="${x}" y2="${H-30}"/><text class="cs" x="${x}" y="${H-12}" text-anchor="middle">${yr}</text>`; });
  const a=px(Date.UTC(2025,10,7)),b=px(Date.UTC(2026,10,10));
  g+=`<rect x="${a.toFixed(1)}" y="${Y-9}" width="${(b-a).toFixed(1)}" height="18" rx="4" fill="${LC(8)}" fill-opacity=".18"/>`+
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
 10:{t:'Concentration in the embodiment supply chain',c:LC(9),rows:[
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
  const REST='<p class="mi-eyebrow">The map</p><h4>Where each capability physically lives</h4>'+
    '<p class="mi-lede">Not a single queue. An industrial supply base feeds two physical enclosures: '+
    'the data centre, and the machine at the edge. Layers 4, 8 and 9 appear inside both, because the '+
    'same capability class runs at two scales. Layer 6 is the only path between them.</p>'+
    '<p class="mi-hint">Point at any layer to read it here and light up the arrows leaving it. '+
    'Click to open the layer in full.</p>';

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

  /* Parse the layer out of the href properly. Taking the last character
     worked while there were eight layers and breaks at ten: '#layer-10'
     ends in '0', which is the physical world. */
  const layerOf=a=>{const m=/#layer-(\d+)/.exec(a.getAttribute('href')||''); return m?+m[1]:null;};
  const nodes=[...svg.querySelectorAll('a.node')].map(a=>[a,layerOf(a)]).filter(p=>p[1]!==null);
  const world=svg.querySelector('.worldnode');
  if(world) nodes.push([world,0]);
  nodes.forEach(([el,n])=>{
    el.addEventListener('mouseenter',()=>show(n));
    el.addEventListener('mouseleave',clear);
    el.addEventListener('focusin',()=>{pinned=n; show(n);});
    el.addEventListener('focusout',()=>{pinned=null; clear();});
  });
  info.innerHTML=REST;
  lockPanelHeight(info,[REST,card(0),...LAYERS.map(L=>card(L.n))]);
})();

/* All layer source registers, rendered onto the Method page now that the
   per-layer Sources tab is gone. */
(function(){
  const host=document.getElementById('allsources');
  if(!host||typeof SOURCES==='undefined'||typeof LAYERS==='undefined') return;
  host.innerHTML=LAYERS.map(L=>`<details class="src-layer"${L.n===1?' open':''}>
    <summary>${layerIcon(L.n,'src-icon')}<span>Layer ${L.n} &middot; ${_esc(L.t)}</span></summary>
    <div class="src-layer-body">${sourcePane(L.n)}</div></details>`).join('');
})();

/* ══════════════════════════════════════════════════════════════════════════
   PANEL HEIGHT LOCK
   The reading panels beside the map and the loop stretch to their grid row, so
   a taller card grows the row and the page moves under the cursor mid-hover.
   Measure every state a panel can hold, off-layout in a hidden probe, and hold
   the tallest. Re-measured on resize, since the tallest state depends on width.
   ══════════════════════════════════════════════════════════════════════════ */
function lockPanelHeight(panel, states){
  if(!panel||!states.length) return;
  const measure=()=>{
    panel.style.minHeight='';
    const probe=document.createElement('div');
    probe.className=panel.className;
    probe.style.cssText='position:absolute;left:-9999px;top:0;visibility:hidden;'+
      'pointer-events:none;min-height:0;height:auto;width:'+panel.clientWidth+'px';
    (panel.parentElement||document.body).appendChild(probe);
    let tallest=0;
    for(const html of states){ probe.innerHTML=html; tallest=Math.max(tallest,probe.offsetHeight); }
    probe.remove();
    if(tallest) panel.style.minHeight=tallest+'px';
  };
  /* setTimeout rather than requestAnimationFrame: rAF does not fire while the
     tab is hidden, and the panel would then never get its height. */
  const run=()=>setTimeout(measure,60);
  run();
  window.addEventListener('load',run);
  let t; window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(measure,180);});
}

/* ══════════════════════════════════════════════════════════════════════════
   THE LOOP — each stage explains itself
   The four boxes are the argument the whole report rests on, so each one says
   what it actually means for an embodied system and what has to be true for
   the turn to complete.
   ══════════════════════════════════════════════════════════════════════════ */
const LOOPWHY={
observe:{t:'Observe',l:'Layer 10 · sensors',
  w:'Cameras, lidar, radar, force-torque sensors at the joints, encoders reporting where each limb actually is, and microphones. For an embodied system this is not data collection in the web sense — it is measurement of a physical state that nobody wrote down.',
  h:'A robot samples its own sensors on a control loop running in milliseconds, and almost all of that is discarded on board. What gets kept is what surprised the system: a grasp that slipped, a surface that was not where the model said it was, an intervention by a human operator. Selecting on board which data is worth transmitting is itself a hard problem, because bandwidth off a fleet is finite.',
  k:'The output is an error signal reality generated, not a description of reality someone wrote.'},
learn:{t:'Learn',l:'Layers 7 and 8 · data and models',
  w:'The captured experience is cleaned, labelled, aggregated across a fleet and turned into weights. This is where a data centre earns its place in a robotics thesis: the training run is the step that converts observation into capability.',
  h:'Raw sensor logs are time-aligned with the actions taken and the outcome, which is what makes them supervised data without anyone labelling them by hand. Vision-language-action models are then trained to map an observation and an instruction onto a motor command. The run is one long synchronous computation across tens of thousands of accelerators, so the fabric and the power behind it sit in the critical path.',
  k:'Fleet-scale experience cannot be bought, scraped or licensed — which is why it is the one genuinely non-replicable data asset in this report.'},
act:{t:'Act',l:'Layers 9 and 10 · agents and actuators',
  w:'The trained model is deployed back onto the machine and drives actuators — motors through precision reducers, grippers, wheels — or, in software, takes actions in a system of record. This is the step that touches something.',
  h:'Inference has to close the control loop faster than the world moves, which for manipulation means milliseconds. That forces the model on board rather than in a data centre, which constrains how large it can be and how much power it can draw. Torque comes from a motor and a harmonic or cycloidal reducer, which is why the binding constraint on this step is mechanical rather than computational.',
  k:'Reliability compounds against you: a task with many sequential steps needs per-step reliability close to one to work end to end.'},
change:{t:'Change',l:'The physical world',
  w:'The world is now in a state it would not otherwise have been in, and that new state is observable. This is the step that makes the loop a flywheel rather than a pipeline.',
  h:'Every action produces consequences the previous model had not seen — including its own mistakes, which are the most informative observations available. A fleet that has acted a billion times has generated a billion states no competitor can reconstruct, because they were caused by that fleet’s particular actions at that particular time.',
  k:'Each turn generates data that could not have existed before that turn. That is the whole compounding argument.'},
};

(function(){
  const svg=document.getElementById('loopsvg'), info=document.getElementById('loopinfo');
  if(!svg||!info) return;
  const REST='<p class="mx-eyebrow">The compounding loop</p>'+
    '<h5>Four steps, and the third one is why this is not just software</h5>'+
    '<p class="mx-lede">Read as a chain, the stack is a value chain. Close it &mdash; actuators change the world, '+
    'sensors observe the change &mdash; and it becomes a flywheel. Each turn produces training data that could not '+
    'have existed before that turn, which is what makes the thesis compound rather than merely grow.</p>'+
    '<p class="mx-hint">Point at any step to read what it means and how it works.</p>';
  const card=k=>{const d=LOOPWHY[k]; if(!d) return REST;
    return `<p class="mx-eyebrow">${d.l}</p><h5>${d.t}</h5>`+
      `<p class="mx-why"><b>What it means.</b> ${d.w}</p>`+
      `<p class="mx-why"><b>How it works.</b> ${d.h}</p>`+
      `<p class="mx-watch">${d.k}</p>`;};
  let pinned=null;
  const show=k=>{info.innerHTML=card(k); svg.classList.add('mx-hl');
    svg.querySelectorAll('.loop-node').forEach(n=>n.classList.toggle('on',n.dataset.stage===k));};
  const clear=()=>{if(pinned)return; info.innerHTML=REST; svg.classList.remove('mx-hl');
    svg.querySelectorAll('.loop-node').forEach(n=>n.classList.remove('on'));};
  svg.querySelectorAll('.loop-node').forEach(n=>{
    const k=n.dataset.stage;
    n.addEventListener('mouseenter',()=>show(k));
    n.addEventListener('mouseleave',clear);
    n.addEventListener('focusin',()=>{pinned=k;show(k);});
    n.addEventListener('focusout',()=>{pinned=null;clear();});
  });
  info.innerHTML=REST;
  lockPanelHeight(info,[REST,...Object.keys(LOOPWHY).map(k=>card(k))]);
})();

/* When the photographic globe loads, retire the drawn one beneath it. If the
   file is missing the image never fires load and the vector globe stays. */
(function(){
  const svg=document.getElementById('mapsvg'); if(!svg) return;
  const img=svg.querySelector('image.earth'); if(!img) return;
  const probe=new Image();
  probe.onload=()=>svg.classList.add('has-earth');
  probe.src=img.getAttribute('href');
})();

/* ══════════════════════════════════════════════════════════════════════════
   ELEMENT DETAIL DIALOG
   Selecting a specimen photograph opens what the collection records about that
   element, plus where it enters this report. Uses a native <dialog>, so Escape
   and the backdrop close it and focus is restored on its own.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  if(!document.querySelector('.el-shot')) return;

  const dlg=document.createElement('dialog');
  dlg.className='el-dialog';
  dlg.innerHTML='<div class="eld-body"></div>';
  document.body.appendChild(dlg);
  const body=dlg.querySelector('.eld-body');

  /* Which material entries in this report rest on a given element. */
  function usedIn(sym){
    const out=[];
    for(const [mat,syms] of Object.entries(ELMAP)) if(syms.includes(sym)) out.push(mat);
    return [...new Set(out)];
  }

  function render(sym){
    const e=ELDATA&&ELDATA[sym];
    if(!e){ body.innerHTML='<p class="eld-lede">Details for this element are still loading.</p>'; return; }
    const uses=usedIn(sym);
    body.innerHTML=
      `<button type="button" class="eld-close" aria-label="Close">&times;</button>`+
      `<div class="eld-head">`+
        `<img class="eld-shot" src="assets/elements/${sym}.jpg" alt="Specimen of ${e.name}">`+
        `<div>`+
          `<p class="eld-z">Element ${e.z}</p>`+
          `<h4 id="eld-title">${e.name} <span class="eld-sym">${sym}</span></h4>`+
          `<div class="eld-chips"><span>${e.cat}</span><span>${e.phase} at room temperature</span></div>`+
        `</div>`+
      `</div>`+
      (e.kind&&!/^Specimen photograph$/.test(e.kind)?`<p class="eld-warn">${e.kind}.</p>`:'')+
      (uses.length?`<div class="eld-uses"><p class="eld-h">Where it enters this report</p>`+
        `<ul>${uses.map(u=>`<li>${u}</li>`).join('')}</ul></div>`:'')+
      `<p class="eld-shows"><b>What the photograph shows.</b> ${e.note}</p>`;
    dlg.setAttribute('aria-label', e.name+' — element details');
  }

  document.addEventListener('click',e=>{
    const shot=e.target.closest('.el-shot');
    if(shot){ render(shot.dataset.el); dlg.showModal(); return; }
    if(e.target.closest('.eld-close')) dlg.close();
  });
  /* clicking the backdrop closes it */
  dlg.addEventListener('click',e=>{ if(e.target===dlg) dlg.close(); });

  /* fill the caption names once the index lands */
  const label=()=>{
    if(!ELDATA) return;
    document.querySelectorAll('[data-elname]').forEach(n=>{
      const e=ELDATA[n.dataset.elname]; if(e) n.textContent=e.name;
    });
  };
  const t=setInterval(()=>{ if(ELDATA){ label(); clearInterval(t); } },120);
  setTimeout(()=>clearInterval(t),8000);
})();

/* ══════════════════════════════════════════════════════════════════════════
   COMPANY DIALOG
   Every logo on the site opens the same modal: one component, driven by the
   exchange-qualified ticker in TVSYM. Quote, chart and fundamentals are
   TradingView's own embeddable widgets, which need no API key — the site is
   static on GitHub Pages, so there is nowhere to keep a secret. See the note
   in Method on what a fundamentals API would require.

   Widgets are created per open and torn down on close, because TradingView
   scripts write into their container on load and do not survive being moved.
   ══════════════════════════════════════════════════════════════════════════ */
/* TradingView's own range tabs, in the order the brief asked for. Each entry
   is label|resolution. */
const TV_RANGES=['1d|1','5d|15','1m|30','6m|120','ytd|1D','12m|1D','60m|1W','all|1M'];

function tvTheme(){
  const t=document.documentElement.getAttribute('data-theme');
  if(t) return t==='dark'?'dark':'light';
  return matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
}

(function(){
  let dlg=null, current=null;

  function build(){
    dlg=document.createElement('dialog');
    dlg.className='co-dialog';
    dlg.innerHTML=`<div class="cod-body">
      <button type="button" class="cod-close" aria-label="Close">&times;</button>
      <div class="cod-head"></div>
      <div class="cod-chart"></div>
      <div class="cod-stats"></div>
      <div class="cod-fund"></div>
      <p class="cod-foot"></p>
    </div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('click',e=>{ if(e.target===dlg) close(); });
    dlg.addEventListener('close',teardown);
    dlg.querySelector('.cod-close').addEventListener('click',close);
  }

  const widget=(host,src,cfg,h)=>{
    /* TradingView iframes can take ten seconds or more; say so rather than
       leaving an empty box. The iframe paints over this once it arrives. */
    host.innerHTML='<p class="cod-loading">Loading market data\u2026</p>';
    const wrap=document.createElement('div');
    wrap.className='tradingview-widget-container';
    const inner=document.createElement('div');
    inner.className='tradingview-widget-container__widget';
    if(h) inner.style.height=h;
    wrap.appendChild(inner);
    const sc=document.createElement('script');
    sc.type='text/javascript'; sc.async=true; sc.src=src;
    sc.text=JSON.stringify(cfg);
    wrap.appendChild(sc);
    host.appendChild(wrap);
  };

  function renderChart(){
    widget(dlg.querySelector('.cod-chart'),
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js',
      {symbols:[[current.name, current.sym+'|12M']], chartOnly:false,
       width:'100%', height:'100%', locale:'en', colorTheme:tvTheme(),
       autosize:true, showVolume:false, hideDateRanges:false, hideMarketStatus:false,
       hideSymbolLogo:false, scalePosition:'right', scaleMode:'Normal',
       chartType:'area', dateRanges:TV_RANGES, isTransparent:false});
  }

  function open(name){
    const sym=TVSYM[name]; if(!sym) return;
    if(!dlg) build();
    current={name,sym};
    const logo=logoFor(name,'cod-logo')||'';
    const [exch,tick]=sym.split(':');
    const ct=(typeof CT!=='undefined'&&CT[name])||null;
    dlg.querySelector('.cod-head').innerHTML=
      `<div class="cod-id">${logo}<div>
         <h4>${_esc(name)}</h4>
         <p class="cod-tick"><span class="cod-exch">${_esc(exch)}</span>${_esc(tick)}${ct&&ct[2]?` &middot; ${_esc(ct[2])}`:''}</p>
       </div></div>
       ${CDESC[name]?`<p class="cod-desc">${_esc(CDESC[name])}</p>`:''}
       <div class="cod-quote"></div>`;
    widget(dlg.querySelector('.cod-quote'),
      'https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js',
      {symbol:sym, width:'100%', locale:'en', colorTheme:tvTheme(), isTransparent:false}, '300px');
    renderChart();
    widget(dlg.querySelector('.cod-fund'),
      'https://s3.tradingview.com/external-embedding/embed-widget-financials.js',
      {symbol:sym, colorTheme:tvTheme(), displayMode:'compact', isTransparent:false,
       largeChartUrl:'', locale:'en', width:'100%', height:'300'},'300px');
    const fb=fundamentalsBlock(name);
    dlg.querySelector('.cod-stats').innerHTML=fb;
    dlg.querySelector('.cod-stats').hidden=!fb;
    dlg.querySelector('.cod-foot').innerHTML=
      `Quote, chart and financials by <a href="https://www.tradingview.com/symbols/${_esc(sym.replace(':','-'))}/" target="_blank" rel="noopener noreferrer">TradingView</a>`+
      `${ct&&ct[1]?` &middot; <a href="${SA}${ct[1]}/" target="_blank" rel="noopener noreferrer">full profile on Stock Analysis</a>`:''}`+
      `${(FUNDA&&FUNDA[name]&&FUNDA[name].site)?` &middot; <a href="${FUNDA[name].site}" target="_blank" rel="noopener noreferrer">investor site</a>`:''}`+
      `<br>Market data is delayed and shown for reference. Nothing here is a recommendation.`;
    dlg.setAttribute('aria-label', name+' — market information');
    dlg.showModal();
  }

  function close(){ if(dlg&&dlg.open){ dlg.close(); } teardown(); }
  function teardown(){
    /* only ever empties a closed dialog: tearing down a visible one leaves
       three blank boxes with no way back */
    if(!dlg||dlg.open) return;
    ['.cod-quote','.cod-chart','.cod-fund'].forEach(s=>{
      const el=dlg.querySelector(s); if(el) el.innerHTML='';
    });
  }

  /* Any logo anywhere opens it — chain chips, company tables, chain rows. */
  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-co]');
    if(!trigger) return;
    e.preventDefault();
    open(trigger.dataset.co);
  });

  /* Repaint the widgets when the theme changes underneath an open dialog. */
  const obs=new MutationObserver(()=>{ if(dlg&&dlg.open&&current) open(current.name); });
  obs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();

/* Escape closes whichever dialog is open. Native <dialog> does this itself only
   when it holds focus, which is not reliable in every embedding. */
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape') return;
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());
});

/* ══════════════════════════════════════════════════════════════════════════
   FUNDAMENTALS
   The figures TradingView's free widgets do not carry — beta, volume, average
   volume, the 52-week range, and the statement lines. Read from a static file
   refreshed by .github/workflows/fundamentals.yml, which holds the API key in
   Actions secrets; nothing here ever sees it. Absent data renders nothing
   rather than a dash, so a company with no entry simply shows the widgets.
   ══════════════════════════════════════════════════════════════════════════ */
let FUNDA=null, FUNDA_META=null;
fetch('assets/market/fundamentals.json')
  .then(r=>r.ok?r.json():null)
  .then(d=>{ if(!d) return; FUNDA=d.companies||{}; FUNDA_META=d; })
  .catch(()=>{});

const _fmtBig=v=>{
  if(v==null) return null;
  const a=Math.abs(v);
  if(a>=1e12) return (v/1e12).toFixed(2)+'T';
  if(a>=1e9)  return (v/1e9).toFixed(2)+'bn';
  if(a>=1e6)  return (v/1e6).toFixed(1)+'m';
  if(a>=1e3)  return (v/1e3).toFixed(1)+'k';
  return String(Math.round(v*100)/100);
};
const _fmtNum=(v,d=2)=>v==null?null:Number(v).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const _fmtPct=v=>v==null?null:(v*100).toFixed(1)+'%';

function fundamentalsBlock(name){
  const f=FUNDA&&FUNDA[name];
  if(!f) return '';
  const cur=f.currency||'';
  const rows=[
    ['Market cap', _fmtBig(f.marketCap)],
    ['P/E ratio', _fmtNum(f.pe)],
    ['EPS', _fmtNum(f.eps)],
    ['Beta', _fmtNum(f.beta)],
    ['Volume', _fmtBig(f.volume)],
    ['Avg. volume', _fmtBig(f.avgVolume)],
    ['52-wk high', _fmtNum(f.yearHigh)],
    ['52-wk low', _fmtNum(f.yearLow)],
  ].filter(r=>r[1]!=null);
  const fin=[
    ['Revenue', _fmtBig(f.revenue)],
    ['Net income', _fmtBig(f.netIncome)],
    ['Free cash flow', _fmtBig(f.freeCashFlow)],
    ['Gross margin', _fmtPct(f.grossMargin)],
  ].filter(r=>r[1]!=null);
  if(!rows.length&&!fin.length) return '';
  const grid=r=>`<div class="cod-grid">${r.map(([k,v])=>
    `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
  const stamp=f.quoteAt?new Date(f.quoteAt).toLocaleString(undefined,
    {dateStyle:'medium',timeStyle:'short'}):null;
  return (rows.length?`<h5 class="cod-h">Key statistics${cur?` <span>${cur}</span>`:''}</h5>${grid(rows)}`:'')+
    (fin.length?`<h5 class="cod-h">Latest annual results${f.fiscalYear?` <span>FY${f.fiscalYear}`+
      `${f.reportCurrency&&f.reportCurrency!==cur?' · '+f.reportCurrency:''}</span>`:''}</h5>${grid(fin)}`:'')+
    (stamp?`<p class="cod-stamp">Fundamentals as of ${stamp}`+
      `${FUNDA_META&&FUNDA_META.placeholder?' · sample data until the first scheduled refresh':''}</p>`:'');
}
