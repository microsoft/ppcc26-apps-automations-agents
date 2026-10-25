# Build intelligent business processes with apps, automations, and agents

Hands-on workshop for the **Power Platform Community Conference 2026
(PPCC26)**. Over six modules, you build an **Agentic Operations Control
Tower** on Microsoft Power Platform that detects a supplier delay, calculates
its business impact, recommends a recovery, waits for a person to approve it,
and then executes the approved recovery, including a browser-only step
completed by a Computer Use agent.

## The scenario

Northwind Traders receives an email from Supplier F: shipments of
**Northwind Traders Clam Chowder** are delayed. Three open customer orders are
at risk. The operations team needs to know the exposure, choose a recovery
action, and register a new carrier contact on a portal that has no API.

Throughout the workshop, you keep one authority boundary:

| The system may prepare | A person must decide | The system may execute after approval |
| --- | --- | --- |
| Detect the delay, calculate impact, apply policy, rank work, and draft communications. | Approve, reject, or request revision for one exact recovery action. | Update Dataverse, register the carrier contact with Computer Use, write evidence, and resolve the case. |

## Modules

| Module | You build | Time |
| --- | --- | --- |
| [1. Open the environment and understand the mission](labs/01-open-and-orient.md) | Retrieve credentials, connect to the VM, download this repository, sign in to GitHub Copilot, and inspect the business data in your Dev environment. | 30 min |
| [2. Extend the Control Tower with App Builder](labs/02-build-control-tower.md) | A Supplier Recovery Offer table, form, comparison view, and navigation entry, created with App Builder and GitHub Copilot. Optional. | 35–40 min |
| [3. Create supplier-delay intake and live impact](labs/03-build-intake-and-impact-cloud-flows.md) | Two Power Automate cloud flows that classify the supplier email with a prompt, create the disruption case, and calculate its impact. | 60 min |
| [4. Create policy, bounded reasoning, and human supervision](labs/04-build-policy-and-supervision.md) | A Business Skill, the **Disruption Commander** agent, and an approval handoff agent that alerts a person in the Agent feed. | 60 min |
| [5. Create the Carrier agent and governed recovery flow](labs/05-configure-recovery-and-cua.md) | A Copilot Studio agent with a restricted Computer Use tool, and the cloud flow that executes only an approved recovery. | 90 min |
| [6. Approve, deploy, and replay](labs/06-run-deploy-and-replay.md) | Approve the recovery in Dev, deploy the solutions to a managed target with Power Platform Pipelines, and replay the scenario there. | 90 min |

Complete the modules in order. Each one builds on the records and components
created by the previous one.

## What you need

The facilitator provides everything required for the workshop:

- a Microsoft Entra workshop account and Temporary Access Pass,
- a workshop virtual machine (VM) with Visual Studio Code and the workshop tools,
- a GitHub account with GitHub Copilot, signed in through the workshop identity provider,
- **Dev**, **Test**, and **Prod** Power Platform environments named
  `Dev-USER-<UserId>`, `Test-USER-<UserId>`, and `Prod-USER-<UserId>`, with the
  **PPCC Agentic Operations Control Tower** solution and Northwind sample
  data installed in Dev.

You don't need to install anything on your own device other than a Remote
Desktop client. Start with [Module 1](labs/01-open-and-orient.md).

## Repository contents

| Folder | Contents |
| --- | --- |
| [`labs`](labs) | The six module guides, screenshots, and the prompts and instructions you paste into agents. |
| [`setup`](setup) | Facilitator scripts: `Install-Prerequisites.ps1` prepares a VM, and `Seed-ControlTowerDemo.ps1` loads the Northwind and Control Tower demo data. Also includes an optional Flow MCP prompt for Module 3. |
| [`solutions`](solutions) | The **PPCC Agentic Operations Control Tower** solution package and a catch-up cloud flow solution for Module 3. Use the catch-up solution only when a facilitator asks you to. |

## Products used

Power Apps (model-driven apps and App Builder), Microsoft Dataverse,
Power Automate cloud flows and prompts, Microsoft Copilot Studio agents and
Computer Use, Power Platform Pipelines, and GitHub Copilot in Visual Studio
Code.

## Security

Workshop credentials are personal and temporary. Never include them in
screenshots, issues, commits, or chat messages. To report a security issue,
see [SECURITY.md](SECURITY.md).
