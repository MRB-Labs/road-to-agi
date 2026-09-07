# Layer 9 — Agentic Software and Applications

## Role in the physical architecture

Layer 9 turns model outputs into controlled digital or physical work. Cloud agent runtimes and applications execute on Layer 4 inside Layer 5. Local agent, planning, safety and control software can execute on edge Layer 4 inside Layer 10.

## 1. Current chain

Model access → Data platform → Orchestration and agents → Applications → Security and identity → Observability

## 2. Main problems and missing components

### Cross-cutting systems are presented as final stages

Security, identity, evaluation and observability must operate throughout the system. They are not downstream products purchased after the application.

### The tool and integration layer is missing

Agents become useful by accessing APIs, enterprise systems, databases, browsers, code environments, machines and other tools. Permissions and transaction boundaries are fundamental.

### “Agent” is too broad

Differentiate:

- Model wrapper or assistant
- Deterministic workflow with model steps
- Tool-using agent
- Multi-agent system
- Long-running autonomous process
- Real-time embodied controller

### Missing components

- Model gateways and routing
- Retrieval and context assembly
- Short- and long-term memory
- Connectors, APIs and tool protocols
- Planning, task decomposition and workflow state
- Durable execution, queues and retries
- Sandboxes and constrained code execution
- Human approval, override and escalation
- Identity, machine identity and secrets
- Authorisation and least-privilege access
- Evaluation, tracing and observability
- Cost, latency and reliability management
- Application UI and user experience
- Enterprise integration and systems of record
- Deployment, support and change management

### Statements to change

- Do not say agents eliminate applications. Agents usually operate through application interfaces and business systems.
- Do not assume autonomy is always better. Deterministic workflows and human review may be preferable for high-consequence tasks.
- Do not say seat-based software is necessarily displaced. Pricing may combine seats, usage, transactions, outcomes and service components.
- Do not make universal accounting claims about model API expenditure.

## 3. Recommended structure and corrections

Model access/routing → Context, retrieval and memory → Connectors/tools → Planning and orchestration → Secure execution/workflow state → Human oversight → Application/UX → Enterprise integration → Operations and continuous improvement

Across the whole chain, show a control plane containing:

- Identity and permissions
- Cybersecurity and secrets
- Policy and guardrails
- Evaluation and testing
- Tracing and observability
- Audit and compliance
- Cost and performance management

## Central versus edge placement

### Inside Layer 5

Enterprise agents, retrieval services, orchestration, cloud tools, applications and monitoring.

### Inside Layer 10

Local planning, safety logic, control coordination and limited tool use. Time-critical or safety-critical functions should not depend entirely on cloud latency or availability.

## Connections to other layers

- **Layer 7:** provides enterprise context, memory and governed knowledge.
- **Layer 8:** provides reasoning, language, perception and planning capabilities.
- **Layer 6:** connects agents with users, services and machines.
- **Layer 10:** receives local agent/control capability and returns operational results.

## Website wording

> Layer 9 combines models with data, memory, tools, permissions and workflows so AI can perform useful, observable and controlled work.

## Required verification

Claims of autonomy should state the task, environment, time horizon, success rate, human intervention rate, failure severity and evaluation method.

