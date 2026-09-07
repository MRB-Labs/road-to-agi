# Layer 7 — Data and Knowledge Infrastructure

## Role in the physical architecture

Layer 7 consists mainly of data assets and software systems running on Layer 4 hardware inside Layer 5. Data originates outside the data centre—from people, enterprises, instruments, networks and embodied systems—but is ingested, stored, processed and governed centrally or across distributed infrastructure.

## 1. Current chain

Data origin and rights → Collection/acquisition → Ingestion → Storage/cataloguing → Cleaning/filtering/deduplication → Annotation/enrichment → Governance/provenance → Dataset curation → Training, evaluation or retrieval use → Feedback

The original website compressed all of this into one “Data” card inside the model layer.

## 2. Main problems and missing components

### Data is underrepresented

Data is not only a training input. It supports evaluation, retrieval, monitoring, personalisation, simulation, safety investigations and operational improvement.

### Ownership, possession and rights are confused

An organisation can possess data without owning it or having the right to use it for model training. Track origin, licence, consent, purpose and retention separately.

### Missing components

- Data-source discovery and contracting
- Consent, licensing and intellectual-property controls
- Streaming and batch ingestion
- Databases, warehouses, object stores and data lakes
- Catalogues, metadata, lineage and provenance
- Cleaning, normalisation, filtering and deduplication
- Annotation, ranking and human feedback
- Dataset versioning and reproducibility
- Privacy, access control and retention
- Training mixture design and tokenisation/preprocessing
- Evaluation sets and contamination controls
- Retrieval indexes, search and vector systems
- Synthetic data, simulation and digital twins
- Robot/fleet telemetry and experience selection
- Archival, deletion and incident response

### Statements to change

- Do not call all collected information “training data.” Much of it should never enter training.
- Do not assume more data is automatically better. Relevance, diversity, rights, quality and mixture matter.
- Do not present proprietary data as an automatic moat. It becomes valuable only if it improves outcomes and can be lawfully and repeatedly used.
- Do not say sensor bandwidth alone determines what is stored. Selection depends on value, cost, privacy, connectivity, retention and safety needs.

## 3. Recommended structure and corrections

Origin/rights → Acquisition → Ingestion → Storage/catalogue → Quality processing → Annotation/enrichment → Governance/provenance → Curation/mixture design → Training/evaluation/retrieval → Monitoring/feedback → Retention/deletion

Separate four data products:

1. Training and post-training datasets
2. Evaluation and safety datasets
3. Retrieval-time enterprise knowledge
4. Operational sensor and experience data

## Physical containment

- Databases, storage systems and data pipelines run mainly inside Layer 5 on Layer 4.
- Data sources remain outside the enclosure.
- Local buffers and selected data may exist inside Layer 10.
- Layer 6 transports selected data between the edge and the centre.

## Connections to other layers

- **Layer 4:** supplies storage and processing hardware.
- **Layer 5:** houses and operates central data systems.
- **Layer 6:** transports source and sensor data.
- **Layer 8:** consumes curated training/evaluation data and produces outputs for monitoring.
- **Layer 9:** uses enterprise context, memory and retrieval.
- **Layer 10:** generates embodied experience and telemetry.

## Website wording

> Layer 7 converts external information and operational experience into governed, traceable data products for training, evaluation, retrieval and continuous improvement.

## Required verification

Every dataset claim should identify source, rights, collection period, processing, intended use, limitations, contamination risk and retention policy.

