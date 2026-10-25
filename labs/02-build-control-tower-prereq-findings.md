# Lab 02 Prerequisite Check and Instruction Findings

Source: `labs\02-build-control-tower.md`. Initial check on the lab VM on
2026-10-21; VM status updated 2026-10-22 after setup. Incremental update plan
added 2026-10-23 from the team sync with Olivier.
Checklist progress reviewed 2026-10-23 after the participant-document updates.
Proctor testing feedback received 2026-10-23 is recorded separately below;
its tested lab revision and VM/tool versions were not supplied.

The VM results below are historical observations, not a readiness sign-off
for all workshop VMs.

## VM prerequisite results

| Prerequisite | Initial | Current | Detail |
| --- | --- | --- | --- |
| PAC CLI | Pass | Pass | 2.13.1 (.NET 10.0.13) |
| Azure CLI | Pass | Pass | 2.91.0 |
| GitHub Copilot CLI | Pass | Pass | 1.0.101 |
| Git | Pass | Pass | Installed |
| Requirements spec | Pass | Pass | `labs\prompts\module2\supplier-recovery-offer-extension-app-spec.md` exists |
| Node.js / npm | **Fail** | Pass | Installed via winget: Node v24.20.0, npm 11.19.0 |
| model-apps plugin (app-builder) | **Fail** | Installed; app-builder unverified | Check `/skills` after restarting Copilot |
| PAC authentication | **Fail** | Pass | Connected to `Dev-USER-2435243` at `https://org6135c330.crm.dynamics.com/` |
| Azure CLI login | **Fail** | Pass | Same account and tenant as PAC, via `az login --use-device-code` |
| Seeded case, unmanaged solution, USD currency | Unverified | Unverified | Check in make.powerapps.com (Step 1) |


## Verified commands to connect to DEV

These work on the VM. Get the DEV URL from <https://make.powerapps.com>:
select the environment, then **Settings > Session details** and copy the
**Instance url**.

```powershell
pac auth create --environment <INSTANCE-URL>
pac auth list
pac org who
```

`pac org who` should show the assigned DEV URL. Then sign in to Azure CLI with
the same workshop account. Plain `az login` can hang on a browser account
picker that never appears, so use device code:

```powershell
az login --use-device-code
az account show --query "{Account:user.name,Tenant:tenantId}" --output table
```

Open the URL it prints, enter the code, and sign in. The tenant and account
should match what `pac org who` shows. If login reports that a tenant such as
`CloudLabs.AI User` has no subscriptions, ignore it; Dataverse only needs the
tenant. Add `--allow-no-subscriptions` only if `az account show` fails.

## Install the model-apps plugin

Source: the plugin README at
<https://github.com/microsoft/power-platform-skills/blob/main/plugins/model-apps/README.md>.
At the Copilot prompt, run:

```text
/plugin marketplace add microsoft/power-platform-skills
/plugin install model-apps@power-platform-skills
```

If either command says the marketplace or plugin is already installed,
continue to the next step. Then restart Copilot and confirm **app-builder**
appears in `/skills`.

Node.js LTS is required by all skills in this plugin. Install it first:

```powershell
winget install OpenJS.NodeJS.LTS
```

This installed v24.20.0 on this VM. Open a new terminal afterwards so `node`
is on the PATH, and verify with `node -v`. Restart Copilot as well, because a
running session keeps its old PATH. This explains why the lab lists
Node.js as a prerequisite.

### Troubleshooting: `node` not recognized after install

Symptom: `node -v` fails in a new VS Code terminal, and invoking a skill
(for example `app-builder`) is denied with
`Denied by preToolUse hook from "model-apps@power-platform-skills" (hook errored)`.

Cause: the plugin's hooks run `node -e ...`. VS Code terminals inherit the PATH
of the VS Code process, which started before Node.js was installed. Opening a
new terminal tab is not enough, even though `C:\Program Files\nodejs\` is
already on the system PATH.

Fix:

1. Close **all** VS Code windows and reopen the workspace.
2. Run `node -v` in the new terminal.
3. Start a fresh Copilot CLI session from that terminal.

Stopgap without restarting: `$env:Path += ";C:\Program Files\nodejs"`.

Verified: after a full VS Code restart, `node` is on the PATH and `node -v`
returns v24.20.0.

## Issues found in the instructions

These are the initial findings. The checklist below records current progress;
the new tool checks and repair appendix partially address issues 3-4 and
address issue 5 by explaining Node.js's role in plugin hooks/scripts.
Azure login recovery is now in an end-of-lab appendix; Copilot first-launch
sign-in and folder-trust guidance is in Step 2. No automated prerequisite checker is
planned; required-tool and plugin verification is final-VM readiness work
under L02-19.
For issue 7, the author reported on October 23 that testing fits the
approximate 35-40 minute estimate. The lab now explicitly permits continuing
to other modules and completing Module 2 later; the estimate is not a
completion deadline. Later proctor feedback reports 44 minutes for agent
execution alone; the estimate needs reconsideration as described below.

1. **Unspecified plugin version.** The prerequisites require a "rehearsed
   compatible version" of the model-apps plugin. The version and install
   source are not named anywhere in the lab.
2. **Misplaced section.** "Continuing a run stopped during planning" sits
   in the middle of Step 3, before Step 4. A fresh run could mistake it for
   a required step.
3. **Not-logged-in case not covered.** Step 2 says to stop for facilitator
   help on a PAC/Azure mismatch. It does not cover having no PAC profile or
   no `az` login.
4. **No prerequisite check.** Participants only find missing tools when
   commands fail. The lab has no checklist or script for them to run first.
5. **Node.js is not tied to a step.** It is listed as a prerequisite but is
   not used by any command in the lab.
6. **Long, repetitive prompt.** The Step 3 prompt repeats several
   constraints, such as preservation and no-approval rules, that also appear
   in the spec.
7. **Optimistic timing.** The 35-40 minute estimate may not cover the
   multiple review gates plus the manual checks MF-01 to MF-04.

## October 23 feedback and scope

Planning source: `Meetings\2026-10\2026-10-23 PPCC Workshop Team Sync - Lab
updates with Olivier.md` (planning notes outside this repository). The notes
summarize the earlier two-person call, not the later full-team meeting.
The plan also carries forward the findings above and the October 23 review
of `setup\Install-Prerequisites.ps1` and a proposed VM validator. The
validator proposal was not adopted; the agreed approach is final-VM checks.

The meeting confirmed ZIP download/extraction as the participant path and
called for business framing, explicit shell/authentication/environment
instructions, skill discovery, and readable plan review. Olivier reported
that the main generation prompt worked; this is a usability/setup revision,
not a new app design or permission to relax the build safety gates.

`Lab manual run issues.docx` was referenced in the meeting but has not been
reviewed for this plan. Its detailed feedback remains an explicit input to
collect. The call did not settle the shell/elevation policy, exact generated
plan filename, rehearsed versions, or VM readiness.

## October 23 proctor testing feedback

Source: five observations supplied from proctor testing of Module 2,
referencing `labs\02-build-control-tower.md` on `main`. The report uses the
older Step 2 title, "Start Copilot in the workshop checkout." Confirm the
tested revision before treating the latest documentation changes as tested.
No transcript, VM identity, CLI/plugin versions, or detailed timing breakdown
was supplied. These observations do not replace the still-unread
`Lab manual run issues.docx` under L02-01.

The feedback references below map to the existing L02 checklist; they are
not additional checklist IDs and do not change its totals. "Partially
addressed" means related instructions have changed, not that the proctor
has verified the fix.

| Feedback | Reported location and observation | Status / mapped items | What needs to be addressed and closure evidence |
| --- | --- | --- | --- |
| P02-01 | Step 1, item 3: Carrier Operations, Carrier Attempt, and Execution Evidence were not loaded after **Import Command Center Data**; the proctor reports the agent extension is missing. | Open; L02-20, L02-22 | Determine whether the tables/app components are missing, records are empty, or access/navigation is unavailable. Verify the expected starting state and whether solution provisioning or data import owns it; do not assume rerunning data import installs the extension. Document that an empty record baseline is acceptable only if confirmed as intended, and provide facilitator restoration/escalation for genuinely missing components. Close with a verified starting state and unambiguous Step 1 guidance; do not create replacement records or execute recovery to populate the baseline. |
| P02-02 | Step 2, item 1: What should the facilitator do when the DEV URL is incorrect? The proctor suggests `pac env select --environment <EnvId>`. | Documentation addressed; final-VM verification pending under L02-19/L02-21 | Step 2 now links Module 1's portal selection, recopies the assigned DEV Instance url, and reuses the existing PAC profile select/create and identity checks for a wrong active target. Missing/inaccessible/incorrectly assigned DEV goes to the proctor after workshop account/tenant checks; changes in Test/Prod must be reported, not undone. Generated files from another environment must not be reused. No additional environment-switch command is required or endorsed. Close when recovery is verified on the final VM with the assigned DEV and workshop identity confirmed. |
| P02-03 | Step 2, item 1: How can a user check that a skill exists? The proctor has only been able to use `/skills info`. | Partially addressed; L02-14 documentation, L02-19/L02-21 verification | Reproduce discovery with the actual Copilot CLI/plugin version and confirm what `/skills` and the reported `/skills info` interaction display. Current prose identifies model-apps/app-builder and gives restart/Esc/escalation guidance, but that UI path is not verified. Correct the instructions if needed; do not assume search/filter controls or command syntax. Close when a first-time user can confirm app-builder availability and return to the normal prompt on the tested VM. |
| P02-04 | Step 4, item 1: The proposed plan does not consistently use the same table format or contain the same information. | Documentation addressed; planning-run verification pending under L02-15/L02-21 | Step 3 now requests seven named headings in `review-plan.md`, coverage of every Step 4 criterion, actual dry-run results, and explicit verified versus pending checks. Step 4 explains opening it, treats the table as review criteria rather than mandatory formatting, and requests missing information before approval without blocking on cosmetic differences. Close when a planning run demonstrates a usable, current review file with the required content before Dataverse writes. |
| P02-05 | Completion and optional work, item 1: Agent execution took **44 minutes**. | Open; author plans a Sonnet 5.5 timing run; L02-21 timing evidence, L02-22 estimate wording | Record this as one observed agent-execution duration, not total participant time. The author plans to run with Sonnet 5.5 before deciding on revised wording; no result is available yet. Capture the actual model/version used, agent execution time, participant review time, and interruptions separately. Compare with the proctor's observation without attributing differences to the model alone. Reconsider the 35-40 minute overall estimate using the results; retain later completion without blocking other modules and do not shorten approval/safety gates to meet a time target. Close when the estimate and caveat acknowledge the available evidence. |

Priority: resolve the prepared-app baseline and wrong-DEV recovery first,
then verify skill discovery and the review file. Revisit the duration
wording using the proctor's evidence. Root causes and successful recovery
are not yet established by this report.

## Incremental update plan (in progress)

The original planned doc changes are consolidated below. Check off each
stable item ID only after its change and acceptance condition are satisfied.
Each batch can be reviewed separately; unchecked items are not completed
merely because they appear in this plan.

Primary target: `labs\02-build-control-tower.md`. Related Module 1 or setup
changes should be narrowly scoped and coordinated with their owners.
Completed documentation items do not establish VM readiness or a successful
end-to-end rehearsal.

### Progress as of October 23

**15 complete, 2 partially addressed, 5 not yet addressed.** Partially
addressed items remain unchecked until their remaining requirements are met.
These totals include the separate slide-deck/speaker-notes item L02-18;
that optional presentation work is not a participant-lab blocker.

| Item | Status | Evidence / remaining work |
| --- | --- | --- |
| L02-02 | Complete | "Before you start" links to Module 1; Step 2 opens the extracted folder, checks the requirements file, and handles nested ZIP folders without requiring a clone. |
| L02-03 | Complete | "Overview" explains the delivery/cost tradeoff and each app component's purpose; "How this fits the workshop" preserves the comparison/approval boundary. |
| L02-04 | Complete | Step 2 explains VS Code folder/terminal opening and PowerShell selection. Use the VM's installed PowerShell without a specific version or elevation requirement; final-VM confirmation is tracked under L02-19. |
| L02-05 | Complete | "Repair missing tools" runs the setup script, requires Copilot first, identifies the PAC/.NET dependency, and explains Node's runtime purpose. Installation/fallback verification is tracked under L02-19 rather than adding more participant steps. |
| L02-06 | Complete | The repair appendix links/runs the script, explains Copilot/PAC limits, distinguishes installation from authentication/DEV/skill readiness, and retains facilitator escalation. No fuller installer-internals explanation is needed in the participant lab; final-VM checks remain under L02-19. |
| L02-07 | Complete | The repair appendix covers restarting VS Code or standalone PowerShell, starting fresh Copilot, and checking tool commands in the new terminal. Final-VM verification remains under L02-19. |
| L02-08 | Complete (disposition) | No participant-facing version baseline or separate baseline reference is required, consistent with the other labs' prepared-VM approach. Actual tool/plugin version capture and compatibility verification remain under L02-19; this does not claim a tested or pinned setup. |
| L02-09 | Complete (disposition) | No prerequisite checker exists or will be added under this plan. Retain the lab's manual commands and rely on final-VM tool/plugin checks under L02-19; those checks remain pending. |
| L02-10 | Complete | Step 2 explains DEV selection and Settings > Session details > Instance url, distinguishes it from an app URL, and reuses it in the build prompt. |
| L02-11 | Complete | Step 2 lists/selects/creates PAC profiles and verifies the DEV connection. Wrong-DEV recovery links Module 1 portal selection, repeats profile setup/checks, escalates assignment/access or persistent identity failures, and prevents cross-environment workspace reuse. Final-VM confirmation remains under L02-19/L02-21. |
| L02-12 | Complete | Step 2 links missing-login recovery to "Repair Azure sign-in." The appendix covers tenant-scoped workshop sign-in, subscriptionless tenants, permitted device-code fallback, identity rechecks, and facilitator escalation. Final-VM confirmation remains under L02-19. |
| L02-13 | Complete | Step 2 explains first-launch folder trust, `/login` with the workshop GitHub account, the Module 1 account reference, CLI versus VS Code sign-in, and facilitator help. Folder trust is explicitly separate from build approval; final-VM confirmation remains under L02-19. |
| L02-14 | Complete | Step 2 identifies app-builder as provided by model-apps, covers restart and Esc, and links missing-skill recovery to the repair appendix and facilitator plugin verification. Exact search/filter controls remain a final-VM check under L02-19; no unverified controls are documented. |
| L02-15 | Partial | Step 3 explicitly requests workspace `review-plan.md` before approval, with seven named headings, every Step 4 criterion, actual dry-run results, and verified versus pending checks. Step 4 explains opening/refreshing it and reviewing equivalent information rather than matching table formatting. Actual file generation and fidelity still need confirmation under L02-21. |
| L02-16 | Complete | Step 3 delegates detailed design to the spec and explicitly continues past documented minor limitations when the core use case works. The spec and review checkpoint distinguish non-blocking polish from mandatory approval, preservation, binding, and relationship-safety gates. Prompt behavior will be confirmed under L02-21. |
| L02-17 | Complete | Interrupted-run guidance is now the end section "Resume an interrupted run," linked from failure guidance. Fresh runs proceed from Step 3 to Step 4; backup, environment binding, duplicate prevention, and renewed approval are retained. |
| L02-22 | Partial | ZIP paths, requirements path, preview maker portal, and Module 1 handoff are aligned; timer wording is removed and later completion is allowed. Final consistency reconciliation remains open, including proctor feedback P02-01 through P02-05. P02-05 reports 44 minutes of agent execution alone, so the earlier 35-40 minute estimate needs reconsideration; final-VM rehearsal stays under L02-21. |

### Next actions for `labs\02-build-control-tower.md`

**Two lab-document items remain.** Confirm L02-15 during rehearsal and
complete the L02-22 consistency review. These can proceed independently.
Include the mapped actions in
[October 23 proctor testing feedback](#october-23-proctor-testing-feedback);
the two-item count is not a count of individual unresolved observations.

| Item | Specific remaining action | Close when |
| --- | --- | --- |
| L02-15 (partial) | During L02-21, confirm the explicitly requested `review-plan.md` is generated before Dataverse writes, opens as documented, and accurately reflects the current proposal and actual dry-run results. Adjust instructions only if the run shows a gap. | The requested file-based review path works and its fidelity is verified; no built-in artifact filename is assumed. |
| L02-22 (partial) | Review links/anchors, requirements references, command order, and consistency between the lab, Module 1, and the spec. Resolve the proctor's baseline/recovery wording gaps, distinguish review criteria from output formatting, and reconsider the estimate using the reported 44-minute agent run. Record contradictions and resolutions. | The desk review and feedback dispositions are recorded. Later completion, the lighter walkthrough, and minor-issue progression remain supported; no new duration test is required. |

### Source review and final-VM readiness

**Four supporting items remain.** These are not additional participant
instructions. L02-01 can proceed now; L02-19 through L02-21 need the final
VMs, with readiness and baseline checks before the full rehearsal.

| Item | Specific remaining action | Close when |
| --- | --- | --- |
| L02-01 | Read `Lab manual run issues.docx` and map new feedback to existing IDs or record its disposition. | The document has actually been read and relevant findings are accounted for. |
| L02-19 | On final VMs, capture actual tool/plugin versions and manually verify compatibility, model-apps/app-builder, Node hooks, installed PowerShell, normal-terminal permissions, and facilitator recovery paths. Resolve P02-02 wrong-DEV recovery and P02-03 actual skill discovery. | Results and recovery owners are recorded; no participant-facing baseline reference, checker script, preset PowerShell version, or assumed elevation is introduced. |
| L02-20 | Verify DEV permissions, the existing unmanaged solution/app, active USD, and the seeded Pending Supplier F case with at least 30 affected units. Investigate P02-01's missing carrier/evidence baseline and confirm the provisioning versus data-import responsibility. | The required baseline, including expected empty versus missing carrier/evidence components, is confirmed or delivery gaps are escalated, without replacement data or role changes during the lab. |
| L02-21 | Rehearse the ZIP-to-VS Code journey, authentication, skill discovery, readable plan review, approved build, minor-issue handling, interrupted-run recovery where needed, and the short view/form walkthrough. | Actual results and unresolved issues are recorded. Builder safety checks remain distinct from the participant's business-use walkthrough. |

Optional presentation work is held in
[Slide deck and speaker notes](#slide-deck-and-speaker-notes), not in the
participant-lab backlog. L02-08 is closed by the decision not to require
a participant-facing version baseline; version capture and compatibility
verification remain under L02-19. L02-09 is closed by the decision to use
final-VM verification, not by claiming a checker or successful VM test exists.

**One optional presentation item remains:** L02-18 in the separate section
below. Including it in a deck or explicitly deciding to omit it both resolve
that item; it does not block the lab.

**Completed:** L02-02 through L02-14, L02-16, and
L02-17. Do not reopen these solely because final-VM confirmation is pending.

No new per-tool installation instructions, specific PowerShell version,
blanket elevation requirement, timer, or formal participant acceptance test
is required by the current agreed scope. Add further guidance only where
the remaining review or final-VM testing establishes a need.

Other completed participant-document cleanup: removed the facilitator-only
rehearsal section and moved tool repair to the end with a linked note at the
start. These changes do not complete the remaining rehearsal/readiness work.

Participant-review scope updated October 23: the lab and requirements spec
now use MF-01 through MF-04 for a short view/form and offer-comparison
walkthrough, not a formal manual acceptance test. Invalid-value tests,
status changes, and participant evidence collection are no longer required.
Builder verification, explicit approval, preservation, relationship safety,
and sample-data checks remain required.

Educational-lab progression updated October 23: cosmetic differences,
descriptions, icon application, exact layout/sorting, and default-view
enrichment are non-blocking if the form and comparison remain usable.
Report limitations instead of repeatedly stopping or expanding the scope.
Wrong targets, conflicting writes, failed core capability, and unverified
preservation/data-binding/relationship safety still require help before
unsafe work proceeds.

### Batch 1: Resolve source feedback and participant handoff

- [ ] **L02-01 - Review the written manual-run feedback.** Obtain and read
      Olivier's `Lab manual run issues.docx`; map each relevant finding to
      an item here or add a new item. Acceptance: record the review date and
      disposition of any feedback not covered by this plan.
- [x] **L02-02 - Align with Module 1's ZIP workflow.** Link to Module 1's
      "Download the workshop files" instructions instead of requiring a
      clone. Use its extracted/renamed
      `C:\github\ppcc26-apps-automations-agents` path consistently, explain
      how to open that folder, and verify the extension requirements file
      exists. Acceptance: a ZIP-only participant can reach Step 2 without
      Git clone or a nested `-main` folder/path mismatch. Do not remove Git
      from tool prerequisites solely because content arrives as a ZIP.
- [x] **L02-03 - Add business purpose and expected outcome.** Explain the
      analyst's earlier-delivery/higher-cost versus later-delivery/lower-cost
      comparison before introducing schema terminology. Review Rasika's
      introduction as a style reference if available. Acceptance: the
      opening explains why the exercise matters and that offers neither
      approve recovery nor start execution.

### Batch 2: Make setup before the exercise actionable

L02-02 establishes the working directory used by this batch. Use the VM's
installed PowerShell and normal terminal; final-VM compatibility and
permissions checks remain under L02-19.

- [x] **L02-04 - Specify the host and shell.** Step 2 explains how to open
      the extracted folder in VS Code, create a terminal, and select
      PowerShell. No specific PowerShell version or elevation requirement
      is imposed: the installed PowerShell worked on the early VMs, and
      the lab author reported no elevation was needed. Acceptance: a
      less-technical participant can open the right terminal and identify
      its shell without guessing. Documentation complete; confirm on the
      final VMs under L02-19 and add requirements only if testing shows
      they are needed.
- [x] **L02-05 - Document tool installation and recovery order.** The
      repair appendix links and runs the setup script, requires Copilot
      before plugin installation, identifies the PAC/.NET dependency, and
      explains that Node runs plugin hooks/scripts. Acceptance: participants
      have the setup-script path and facilitator escalation without added
      per-tool installation instructions. Documentation complete; verify
      preinstalled tools and facilitator recovery paths on the final VMs
      under L02-19, including PAC installation when .NET SDK is absent.
- [x] **L02-06 - Explain the setup script's limits.** The repair appendix
      links to `setup\Install-Prerequisites.ps1` for recovery before starting
      the exercise, provides normal-terminal invocation instructions, and
      directs participants to the facilitator if setup fails or is blocked.
      It explains that Copilot must be installed first, PAC installation
      depends on the upstream installer/.NET SDK, and installation does not
      confirm PAC authentication, the DEV connection, or app-builder
      availability. Acceptance met: "script finished" is distinct from
      "ready for Lab 02"; facilitator escalation remains during the build.
      Final-VM verification stays under L02-19, not as additional installer
      internals in the participant lab.
- [x] **L02-07 - Add PATH and session restart instructions.** After tool
      installation, close all VS Code windows and reopen the workspace
      where needed; a new terminal tab can retain the old host PATH. For
      standalone PowerShell, reopen the terminal. Restart Copilot after
      plugin installation. Acceptance: verify `node`, `pac`, and `copilot`
      from the terminal that will launch the lab, without relying on a
      session-only PATH workaround. Documentation complete; final-VM
      verification remains under L02-19.
- [x] **L02-08 - Resolve the plugin/tool baseline proposal.** Follow the
      other labs' prepared-VM approach without requiring a participant-facing
      version baseline or a separate baseline reference. Actual tool/plugin
      version capture and compatibility verification remain under L02-19,
      with installation/update handling kept in facilitator readiness work.
      Closed by scope decision, not by claiming a rehearsed or pinned setup.
- [x] **L02-09 - Resolve prerequisite-checker proposal.** No checker exists,
      and an automated validator is not required for the participant lab.
      Retain the documented manual version/help commands. Required-tool,
      plugin, and runtime verification is consolidated into L02-19 on the
      final VMs. Closed by scope decision; final-VM execution is still pending.

### Batch 3: Complete identity, environment, and skill discovery

These steps depend on the working tools/terminal from Batch 2. Keep GitHub
authentication distinct from the workshop Entra account used by PAC/Azure.

- [x] **L02-10 - Show how to find the environment URL.** In the assigned DEV
      at make.preview.powerapps.com, use **Settings > Session details > Instance
      url**. Explain that this is the environment/organization URL, not an
      app launch URL, presenter URL, or managed TARGET. Acceptance: the
      participant knows exactly what replaces `<MY-DEV-URL>`.
- [x] **L02-11 - Add PAC profile setup and verification.** Include
      `pac auth list`, `pac auth create --environment <INSTANCE-URL>` when
      needed, selection of the correct existing profile, and `pac org who`.
      The lab already has `pac org who`; expand it rather than treating it
      as absent. Acceptance: both no-profile and wrong-active-profile cases
      have a clear path, and the assigned DEV/account is verified.
- [x] **L02-12 - Cover Azure login failures and identity matching.** Add
      the missing-login recovery path and workshop account/tenant selection;
      the `az account show` identity check is already present.
      Provide facilitator-approved guidance for a
      browser picker that does not appear, device-code restrictions, and
      a Dataverse-only tenant without subscriptions. Acceptance: PAC and
      Azure are checked against the assigned identity/tenant; unresolved
      or mismatched logins stop before the build.
      Documentation complete in "Repair Azure sign-in"; confirm the
      supported sign-in route on final VMs under L02-19.
- [x] **L02-13 - Add Copilot first-launch sign-in and folder trust.**
      Explain `copilot`, `/login` when authentication is needed, the
      authorized GitHub account, and its distinction from PAC/Azure login.
      Explain the folder-trust prompt and approve only the verified workshop
      folder, without blanket permission bypasses. Align with Module 1's
      existing VS Code sign-in guidance; do not assume extension sign-in
      proves CLI sign-in. Acceptance: first launch reaches an authenticated
      Copilot prompt in the intended folder. Documentation complete;
      confirm the first-launch experience on final VMs under L02-19.
- [x] **L02-14 - Complete app-builder discovery and missing-skill help.**
      Step 2 identifies app-builder as provided by model-apps and covers
      `/skills`, restart after plugin installation, Esc to dismiss the panel,
      and returning to Step 3. Missing-skill guidance links to tool/plugin
      repair and facilitator verification if it remains unavailable.
      Acceptance: a first-time user can identify the skill and knows the
      missing-skill recovery/escalation path. Documentation complete;
      confirm actual UI controls and recovery on final VMs under L02-19.

### Batch 4: Make plan review readable without changing the build contract

The main build and review require successful identity/skill checks from
Batch 3. The readability edits can be drafted independently.

- [ ] **L02-15 - Provide a file-based plan-review path.** Rehearse how to
      obtain and open the explicitly requested workspace `review-plan.md`
      in VS Code. Steps 3-4 now request the file before approval and explain
      opening/previewing it and refreshing a missing or stale proposal.
      Step 3 requests seven named headings covering every Step 4 criterion;
      Step 4 distinguishes required content from cosmetic formatting.
      This is a requested deliverable, not an assumed skill artifact.
      Confirm generation before Dataverse writes and fidelity to the current
      proposal, actual dry-run results, and verified versus pending checks
      during L02-21.
      Acceptance: participants can inspect the scope and Step 4 checks
      without reading a long terminal response, before approving writes.
- [x] **L02-16 - Shorten the primary prompt.** Remove repetition already
      covered by the authoritative requirements while retaining the target,
      existing app/solution/workspace, approval gates, preservation, and
      sample-data/relationship safety requirements. Acceptance: the prompt
      still yields the required reviewed extension and MF-01 through MF-04
      participant walkthrough; readability is not achieved by weakening the
      scope or safety rules. Documentation is aligned with the spec;
      confirm actual prompt behavior in the L02-21 rehearsal.
- [x] **L02-17 - Move recovery out of the fresh-run path.** Relocate
      "Continuing a run stopped during planning" to an appendix explicitly
      labelled for interrupted runs only, with a link from failure guidance.
      Acceptance: Step 3 flows directly to Step 4 for a new participant,
      while recovery retains workspace/environment binding, backup,
      duplicate-prevention, and fresh-approval requirements.

### Batch 5: Coordinate facilitator readiness

These operational items are separate from participant documentation and can
start in parallel with the edits. Suggested coordination follows the meeting;
no delivery completion or deadline is assumed.

- [ ] **L02-19 - Sample VM consistency and confirm delivery.** Coordinate
      with Warren and Spektra on outstanding access/readiness, test multiple
      assigned VMs for Git/Node/model-apps and the other required tools, and
      record remaining gaps plus the recovery owner. Acceptance: readiness
      evidence comes from actual machines, not a request to preinstall
      tools. Never put credentials or access tokens in this document.
      Final-VM follow-up for L02-04: record the installed PowerShell version
      and verify the lab commands work in the documented VS Code terminal.
      Test the setup/recovery path where needed without elevation; record
      any administrator prompt or permission failure. Add version or
      installation-only elevation guidance only if these tests establish
      a need. These checks remain pending and do not reopen the completed
      host/shell documentation by themselves.
      Final-VM follow-up for L02-05: verify Git, Node.js LTS/npm, PAC,
      Azure CLI, Copilot CLI, and model-apps are available and working.
      Confirm Node can run the App Builder hooks/scripts. Verify the
      facilitator's recovery paths for missing Copilot and PAC, including
      a PAC installation option without .NET SDK, and confirm Copilot is
      installed before plugin setup. Keep these checks in the readiness
      work rather than adding per-tool installation steps to the lab.
      Final-VM follow-up for L02-08: capture actual tool/plugin versions and
      verify compatibility on the prepared VMs. Record relevant setup/update
      behavior and recovery guidance for facilitators; the setup script's
      upstream `main` and update behavior do not establish a pinned baseline.
      No participant-facing baseline reference is required.
      Final-VM follow-up for L02-09: manually run required tools and check
      their outputs/exit codes, confirm model-apps is installed and
      app-builder is discoverable, and exercise its Node-backed hooks.
      Record actual versions and any failures for facilitator recovery;
      do not require unrelated plugins or introduce a checker script.
      Final-VM follow-up for L02-14: confirm the actual `/skills`
      search/filter controls before documenting them, and verify the
      missing-model-apps installation/restart/escalation path.
      Final-VM follow-up for L02-12: confirm the supplied workshop tenant ID,
      browser sign-in and subscriptionless behavior, permitted device-code
      fallback, and Azure/PAC identity matching. Record any policy
      restrictions and the facilitator-supported recovery route.
      Final-VM follow-up for L02-13: confirm the workshop GitHub sign-in
      and folder-trust prompts in the installed CLI, including account
      access and returning to the normal Copilot prompt.
- [ ] **L02-20 - Verify the prepared application baseline.** Confirm assigned
      DEV access, the intended System Administrator role, the full unmanaged
      solution/app, active USD, and the Supplier F / Clam Chowder case with
      Pending decision and at least 30 affected units. Acceptance: record
      a safe readiness result and stop/escalate if data or permissions are
      missing; do not create replacements or change roles during the lab.

### Batch 6: Rehearse the revised participant journey and close findings

End-to-end closure depends on Batches 1-5, including resolution or explicit
disposition of the written feedback. Do not mark doc-only edits as a
successful lab run.

- [ ] **L02-21 - Run a first-time participant rehearsal.** Use the ZIP path,
      intended VS Code/PowerShell host, actual sign-in/trust flow, skill
      discovery, file-based plan review, approved build, and MF-01 through
      MF-04. Include missing-tool/login and stale-PATH recovery checks.
      For L02-15, confirm `review-plan.md` is written before Dataverse writes,
      covers every Step 4 criterion including the two concrete sample offers,
      accurately reflects the current proposal and actual dry-run results,
      distinguishes verified from pending checks, and can be opened/previewed
      using the Step 4 instructions. This also verifies P02-04; formatting
      need not match the lab's table.
      Acceptance: capture interruptions and evidence; retain all existing
      approval, protected-state, relationship, and duplicate-prevention
      gates, and keep app-builder completion separate from the participant
      walkthrough. Detailed interaction tests are separate facilitator work,
      not a participant completion requirement.
- [ ] **L02-22 - Reconcile the participant docs.** Timing wording is
      partially addressed: timer instructions are removed and Module 2
      may be finished later without blocking other modules. Reconsider the
      35-40 minute estimate using P02-05's reported 44-minute agent execution;
      do not treat that execution time as a full participant duration.
      Address the mapped proctor feedback P02-01 through P02-04. Complete the
      final review of Module 1 links, shell/path examples, setup guidance,
      and requirements references. Acceptance: participant instructions
      are consistent and distinguish later completion from completing the
      participant walkthrough and the builder's verification. Final-VM
      rehearsal remains under L02-21 rather
      than a prerequisite for publishing an approximate duration.

## Screenshot checklist for new workshop VMs

Capture these from the new workshop VMs when available, then add each image
beside the corresponding instruction in `labs\02-build-control-tower.md`.
This supporting checklist is separate from the 22 L02 items and their totals;
screenshots do not establish successful readiness or build verification.

- [ ] **Step 2 - Workshop folder and PowerShell terminal.** Show VS Code
      Explorer with `labs`, `setup`, and `solutions` directly under the
      workshop folder, the requirements file visible, and a PowerShell
      terminal. Make the terminal versus Copilot distinction clear.
- [ ] **Step 2 - Find the Instance URL.** Show Settings > Session details
      with Instance url highlighted. Link to Module 1's existing
      environment-picker screenshot rather than duplicating it.
- [ ] **Step 2 - Confirm the PAC connection.** Show example `pac auth list`
      and `pac org who` output, highlighting the selected profile and DEV
      URL that participants must compare.
- [ ] **Step 2 - Discover app-builder.** First verify the actual skill UI
      on the new VM, then capture the working discovery interaction showing
      app-builder and its model-apps provider. Align the instructions with
      the observed behavior; do not illustrate assumed controls.
- [ ] **Step 4 - Open the review plan.** Show `review-plan.md` selected in
      the extension workspace in VS Code Explorer with its Markdown preview
      open. Label the content/layout as illustrative, not an exact template
      participants must match.
- [ ] **Step 5 - Compare the two offers.** Show Supplier Recovery Offers
      navigation, the comparison-view picker, and both sample offers with
      their dates, quantities, and costs readable.
- [ ] **Step 5 - Open an offer form.** Show the case link, offer details,
      and Analyst Notes. Label the layout as an example rather than a
      requirement for identical generated presentation.
- [ ] **Optional Step 1 - Capture the starting baseline.** Only after
      P02-01 is resolved, capture the verified starting case/decision and,
      where useful, the expected carrier/evidence baseline. Do not depict
      missing components or unconfirmed empty records as a valid state.
- [ ] **Review and integrate the images.** Use cropped, readable captures,
      descriptive alt text and captions, and store captures under
      `labs\images\module2`, following the other modules' structure. Mask account/tenant
      identifiers and exclude credentials, tokens, and sign-in codes.
      Identify example URLs/dates as examples and tell participants to use
      their own assigned values. Avoid screenshots of the long prompt,
      routine installation commands, or variable agent progress output.

## Slide deck and speaker notes

Keep presentation-only items here rather than adding them to
`labs\02-build-control-tower.md`. Their completion is separate from the
participant documentation and final-VM readiness. The current lab has no
Cowork or future maker-experience instructions to remove.

- [ ] **L02-18 - Optional future-experience messaging.** Decide whether to
      include a short Cowork/maker-integrated direction discussion in the
      slide deck or speaker notes, or explicitly omit it. If included,
      distinguish the current rehearsed CLI workflow from future direction
      without promising availability or dates not established by the
      meeting. Acceptance: record the presentation location or the decision
      to omit; no participant-lab section or setup/build step is needed.
