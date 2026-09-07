# Layer 8 — AI Models and Inference

## Role in the physical architecture

Layer 8 is a software capability executed on Layer 4 hardware. Central training and cloud inference run inside Layer 5. Smaller or optimised model instances can run inside Layer 10 on edge compute. Model weights are portable artifacts; they are not physically confined to one location.

## 1. Current chain

Compute → Data → Training → Serving and inference → Distribution

## 2. Main problems and missing components

### Inputs are shown as sequential stages

Compute and data are parallel inputs to model development. Neither is normally the downstream output of the other.

### “Training” is over-compressed

Separate architecture research, pre-training, post-training, tool-use training, evaluation, red-teaming, safety work and optimisation.

### Training and inference are different markets

They have different workload shapes, latency requirements, utilisation patterns, hardware economics, customers and scaling constraints.

### Missing components

- Research, architecture selection and scaling experiments
- Data-mixture design
- Distributed-training software
- Pre-training
- Supervised and preference-based post-training
- Reinforcement learning and environment interaction where relevant
- Tool-use and agentic capability training
- Evaluation, red-teaming and safety testing
- Checkpoint and model-registry management
- Distillation, pruning, quantisation and compilation
- Inference engines, caching, batching and routing
- Fine-tuning, adapters and domain specialisation
- Monitoring, incident response, rollback and retraining
- API, licence, embedded deployment and open-weight distribution
- Edge deployment and over-the-air model updates

### Statements to change

- “Capability leads are measured in months” requires a date, benchmark and definition of capability.
- “Price per token has fallen faster than any input cost” is time-sensitive and depends on model quality, workload and accounting boundary.
- “Distribution is the only durable moat” is an opinion, not a fact. Other possible moats include performance, inference efficiency, proprietary feedback, ecosystem, trust, integration and switching costs.
- Do not imply that a model independently performs useful work. Applications, tools, data access, permissions and workflow integration determine realised value.

## 3. Recommended structure and corrections

Research/architecture → Data and compute preparation → Pre-training → Post-training/alignment → Evaluation and safety validation → Optimisation/compilation → Deployment → Inference serving → Monitoring → Updates/retraining → Distribution/licensing

Show three deployment modes:

1. **Central training:** Layer 8 on large Layer 4 clusters inside Layer 5
2. **Cloud inference:** Layer 8 served from Layer 5 through Layer 6
3. **Edge inference:** optimised Layer 8 models running on Layer 4 hardware inside Layer 10

## Connections to other layers

- **Layer 4:** provides the execution hardware.
- **Layer 5:** houses central training and inference.
- **Layer 6:** carries requests, responses and model updates.
- **Layer 7:** supplies training, evaluation, retrieval and feedback data.
- **Layer 9:** turns model capability into applications and actions.
- **Layer 10:** runs local perception, world and policy models.

## Website wording

> Layer 8 converts curated data and computation into model capabilities, then deploys those capabilities through cloud inference or optimised edge inference.

## Required verification

For model comparisons, specify model version, date, benchmark, evaluation method, inference configuration, quality level and total cost.

