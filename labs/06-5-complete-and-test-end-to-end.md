# Module 6.5: Add human approval and complete the end-to-end scenario

**Optional, self-paced extension. Estimated time:** 60-90 minutes, including
up to about 25 minutes for automatic recovery.

Modules 3-5 build intake, impact assessment, policy guidance, Agent Feed
handoff, and governed execution. The starter app, however, has a read-only
approval form, and Module 3 deliberately leaves the recovery action unset.
This extension closes those gaps without adding another flow or agent.

You will make the existing Recovery Decision form usable for a workshop
human approval, persist the exact action being reviewed, and complete the
email-to-recovery scenario using the case created in Module 3.

**Work only in your assigned DEV environment.** Module 6 remains a separate
deployment exercise. If you already completed it, the changes below are new
DEV customizations; they do not change the managed installation in TARGET.
This extension does not redeploy or replay anything in TARGET.

## What changes, and what stays the same

| Component | In this extension |
| --- | --- |
| Recovery Decision Main form | Enable the existing human-decision fields and relabel their section. |
| Case and current decision | Record the matching Split Shipment proposal and the human's approval details. |
| Agent Feed | Keep the existing notification and related-case link. Completing a Feed item is still not approval. |
| Existing cloud flows and agents | Reuse the implementations from Modules 3-5, including their approval, duplicate-execution, and evidence guards. |
| Control Tower Home | Leave it read-only. Use native record forms for approval and authoritative state during this exercise. |

> [!IMPORTANT]
> This is a **workshop-only, manually recorded human approval**, not an
> implementation of the secured approval service mentioned by the starter
> page. Form editability does not enforce authorization or validate the
> approver, rationale, or exposure on the server. Use only your authorized
> workshop account. Do not change security roles, column security, or tenant
> policies, and do not present this design as production approval security.

## Before you start

- Complete [Module 3](03-build-intake-and-impact-cloud-flows.md),
  [Module 4](04-build-policy-and-supervision.md), and
  [Module 5](05-configure-recovery-and-cua.md), including their checkpoints.
  Module 2's optional Supplier Recovery Offers are not inputs to this run.
- Your workshop account and DEV environment must still be available, with
  permission to edit and publish the existing unmanaged solution's form.
- The DEV solution is **PPCC Agentic Operations Control Tower**
  (`PPCCAgenticOperationsControlTower`), not the Business Skills library or
  a managed TARGET solution.
- The Business Skill is available in DEV, whether it remains in the main
  solution or was moved into the library in Module 6.
- **Disruption Commander**, **Disruption Approval Handoff Agent**, and
  **Carrier Operations Agent** are published. The Handoff agent is connected
  to Commander and associated with the app's Agent Feed.
- The four existing cloud flows are **On**:
  **Order Disruption Cloud Flow**, **Supplier Disruption Impact Assessment
  Cloud Flow**, **Approved Recovery Execution Workflow**, and
  **Invoke Carrier Operations**.
- The existing Dataverse, Outlook, Microsoft Copilot Studio, Power Apps MCP,
  and hosted-browser connections are authenticated for the workshop account.
  Module 5's prepared-adapter inspection and direct Computer Use test passed.
  Do not repeat that direct test here.

If an existing flow is Off, check its connections and the corresponding
module's configuration before selecting **Turn on** on its details page.
Turning on an existing flow is not permission to select **Run**, resubmit a
run, or manually invoke the carrier adapter. If the prepared adapter differs
from Module 5 or will not activate, stop for facilitator help; do not rebuild
it or weaken its guards.

**One approval, then observe.** After recording Approved, do not approve
again, flip the decision back to Pending, resubmit a flow, manually submit
the carrier form, change case statuses, or send communications.

## Task 1: Identify the existing email-to-case scenario

Continue the **same case created by Module 3's test email**. That email and
its intake/assessment runs are the beginning of this end-to-end test; this
extension supplies the missing approval and completes recovery.

Do not use Module 2's seeded demonstration case merely because it has the
same supplier and product. Do not send another notice for this exercise.
In particular, a deployed TARGET intake flow may watch the same mailbox and
subject filter; this DEV-only test must not accidentally start a TARGET run.

1. Open <https://make.preview.powerapps.com> with your workshop account.
2. Select **Dev-USER-&lt;UserId&gt;** and play
   **PPCC Agentic Operations Control Tower**.
3. Select **Agent feed** > **Needs attention** and open the item created in
   Module 4. Open its related **Disruption Case** link.
4. On the native case form, verify **Source = Supplier Notice** and
   **Source Reference** matches the reference in your Module 3 email, for
   example `SUPF-2026-1046` if that was your test.
   A seeded reference beginning `PPCC-ControlTower:` is not that email case.
5. Record the case number and open **Related** > **Recovery Decisions**.
   Open its current Pending decision and record the decision number. Select
   **Control Tower Recovery Decision** from the form selector if needed;
   do not use the generic **Information** form.
6. Confirm there is exactly one current decision for this case, with
   **Is Current Decision = Yes** and **Approval State = Pending**.
   Requested Action and Assigned Approver may still be blank at this point.
7. In Power Automate, find the successful Module 3 intake run for that email
   reference. Confirm its created case ID is the case you opened. Find the
   successful assessment run for the same case, not just the latest run.
8. Review the native case and its related Impacted Orders:

   | Check | Expected workshop evidence |
   | --- | --- |
   | Supplier and product | Supplier F / Northwind Traders Clam Chowder |
   | Delay | 14 days |
   | Affected orders | 0915, 0920, and 0935; closed order 0906 excluded |
   | Line exposures | 482.50, 289.50, and 96.50 |
   | Distinct order count and total | 3 orders / USD 868.50 |
   | Case status | Decision Pending |
   | Previous recovery | No related recovery PO, carrier operation/attempt, or execution evidence |

9. Confirm the actual case and decision currencies are the prepared
   **US Dollar (USD)** record. If Currency is not visible on the native
   form, use the existing table-data editor in the maker portal and show
   the existing **Currency** column. Do not create a column or change a
   currency binding to make the figures pass. A `$` symbol alone is not
   verification of USD.
10. Review Commander's evidence and policy `lab-1` from Module 4. If needed,
    ask the read-only **Disruption Commander** to explain this exact case,
    its Split Shipment recommendation, alternatives, and approval boundary.
    Do not invoke the Handoff agent from preview chat to create another
    Feed item.

If the case, currency, count, or total differs, a decision is already
Approved, multiple decisions are current, or recovery records already
exist, stop. Do not edit the source orders, delete evidence, or create a
replacement case to force another carrier attempt.

**Expected result:** one identified email, intake run, assessment run, case,
current Pending decision, and related Feed item, with no previous recovery.

## Task 2: Make the existing human-decision form editable

This is the additional build work. Change the existing form in DEV; do not
create a replacement form, app, table, flow, or agent.

1. In the DEV maker portal, select **Solutions** and open
   **PPCC Agentic Operations Control Tower**.
2. Open **Objects** > **Tables** > **Recovery Decision** > **Forms**.
3. Edit the Main form named **Control Tower Recovery Decision**.
4. In the designer's tree view, select the **Human decision** tab and its
   **Recorded authorization - secured service required** section.
5. Change that section's displayed label to **Workshop human approval**.
   Keep its existing identity and layout.
6. Select each existing column listed below. In the column's
   **Properties** > **Display options**, clear **Read-only**:

   | Form column | Logical name |
   | --- | --- |
   | Approval State | `ppcc_approvalstate` |
   | Approver | `ppcc_approverid` |
   | Decision Time | `ppcc_decisiontime` |
   | Approved Exposure Snapshot | `ppcc_approvedexposure` |
   | Decision Notes | `ppcc_decisionnotes` |

   **Read-only** is not the designer's **Lock** property. Lock prevents
   removing a control; it is not what makes the record value editable.
   Do not use **Edit table column** to change schema or security settings.
7. Keep **Decision Number** read-only. Preserve the Proposal tab, all
   existing fields, relationships, other forms, and app navigation.
8. Select **Save and Publish** and wait for success.
9. Refresh the running DEV app and reopen the decision from Task 1 on
   **Control Tower Recovery Decision** > **Human decision**.
10. Confirm the section now says **Workshop human approval**, and all five
    fields are editable. **Leave Approval State Pending.** Do not test
    editability by changing it to Approved.

The designer steps use the documented
[form-column Read-only property](https://learn.microsoft.com/en-us/power-apps/maker/model-driven-apps/add-move-or-delete-fields-on-form#column-properties).
The form does not automatically fill or validate these human-decision
values; you will review and enter them explicitly.

**Expected result:** the same native decision form now supports a manual
workshop approval. Agent Feed remains a review notification, and agents
have not gained an approval-writing tool.

## Task 3: Persist the exact proposal while it is still Pending

A recommendation in a chat or Feed summary is not the persisted action
that Module 5's router reads. Prepare both records before approval.

1. Open the identified Disruption Case on **Control Tower Disruption Case**.
2. On **Impact and recommendation**, review the existing evidence and set
   **Recommended Action = Split Shipment** for this workshop scenario.
   This records the proposed action; it does not authorize execution.
3. Save the case. Do not manually change its Disruption Status or exposure.
4. Open the same current Recovery Decision through
   **Related** > **Recovery Decisions**.
5. On **Proposal**, set:

   | Field | Value |
   | --- | --- |
   | Requested Action | Split Shipment |
   | Assigned Approver | Your authorized workshop user; verify the account, not just a matching display name |
   | Decision Source | Human |

6. Confirm **Disruption Case** still points to the case from Task 1 and
   **Is Current Decision** remains **Yes**. Do not change a different
   decision's Current flag to make it eligible.
7. Leave **Recommendation Rationale** unchanged. Module 4 monitors changes
   to that field; editing it to refresh the Feed card would start another
   Handoff run.
8. On **Human decision**, verify **Approval State = Pending**, then save.
9. Reopen or refresh both records and confirm the two action fields are
   actually saved as Split Shipment and the decision remains Pending.

The existing Feed summary may predate these proposal-field updates. Use the
linked case and current decision as the source of truth; do not retrigger
the Handoff merely to rewrite the card.

**Expected result:** a current Pending decision requests the same Split
Shipment action recorded on its case. No recovery has been authorized.

## Task 4: Review, record the human decision, and approve once

This is the consequential step. Keep the same case and decision numbers
visible in your notes; do not rely on whichever record opens first.

1. From the Feed item's related case, open the identified current decision.
   Review the case, its three affected orders, USD 868.50 exposure, and
   matching Split Shipment actions.
2. Confirm again that no earlier recovery has started. The case's Related
   Purchase Order must be empty, and its related carrier and evidence lists
   must be empty.
   Module 5 also checks for a case-specific PO numbered `CL` followed by
   the first six characters of the case GUID with hyphens removed. If that
   PO already exists, stop rather than delete it or approve again.
3. If you choose to authorize this exact workshop action, open
   **Human decision** and enter:

   | Field | Value |
   | --- | --- |
   | Approver | Your authorized workshop user, matching Assigned Approver |
   | Decision Time | Current date and time in your workshop user's time zone |
   | Approved Exposure Snapshot | 868.50, in the already-verified USD currency |
   | Decision Notes | Your specific reason for approving Split Shipment after reviewing this case's evidence |

4. Leave **Approval State = Pending** while entering these values. Save,
   then read them back. The rationale belongs in **Decision Notes**, not
   Recommendation Rationale.
5. Check the execution prerequisites one last time:

   | Requirement | Saved state |
   | --- | --- |
   | Current decision | Yes |
   | Decision Requested Action | Split Shipment |
   | Case Recommended Action | Split Shipment |
   | Approval State before this step | Pending |
   | Prior successful Carrier Response evidence | None for this case |

6. Change **Approval State** to **Approved** last and immediately select
   **Save** once. The app can autosave; if Approved has already been saved,
   do not force another save or state change to try to start a second run.
7. Confirm the saved decision shows Approved. If saving reports an error,
   first inspect the stored state and flow history; do not click repeatedly.

Saving `ppcc_approvalstate` is the event monitored by
**Approved Recovery Execution Workflow**. You do not select Run on that
flow or on **Invoke Carrier Operations**. Do not manually set the case to
Approved for Execution, In Execution, or Resolved.

The starter **Control Tower Home** still describes its original read-only
approval path and has no custom approval dialog. This extension uses the
newly editable **native decision form** instead; it does not add the
separately secured service mentioned by that page. Inspect saved state on
the native forms rather than treating Home's Pending-only approval guidance
or a Feed-item completion as the business decision.

**Expected result:** one human-recorded Approved transition starts the
existing guarded execution path for the identified case.

## Task 5: Follow the automatic recovery and verify the evidence

Allow up to about 25 minutes for the bounded agent call, transcript
availability wait, and evidence persistence. A running flow is not a reason
to approve again. If it exceeds that allowance, inspect its actual run
status rather than assuming another attempt is safe.

1. In DEV Power Automate, open **Approved Recovery Execution Workflow** >
   **Run history**. Open the run for this decision ID and approval time,
   not just the newest run.
2. Check that **Governed Decision Router** follows True. Its saved decision
   must be Approved, current, and request Split Shipment matching the case,
   with no prior succeeded Carrier Response evidence.
3. Observe the existing deterministic path:
   - one case-specific PO and a related PO detail are created;
   - the detail uses the Module 5 fixture quantity of 40;
   - linked Dataverse review Tasks are completed;
   - the two communication draft evidence rows are created;
   - the case moves to In Execution and the child adapter is invoked.
4. Follow **Invoke Carrier Operations** in the parent run. The adapter must
   return **`CARRIER_VERIFIED`** and a nonempty **`activityId`** before the
   parent creates **Create CP7** and runs **Resolve case after CP7**.
   A Succeeded parent run alone is not proof: a guard-mismatch no-op can
   also finish successfully without executing recovery.
5. Refresh the native Disruption Case form. On **Triage**, confirm
   **Disruption Status = Resolved**. On **Execution and closure**, confirm
   Closed On is populated and the Resolution Summary reports verified
   recovery.
6. Open that case's related **Execution Evidence** and identify:

   | Evidence | Required result |
   | --- | --- |
   | Carrier Response, with `CP7-` Evidence Number | Execution State Succeeded; Result Summary contains `CP7-ACTION` and `CARRIER_VERIFIED` |
   | CP7 correlation | Nonempty External Correlation ID; Evidence Link contains `flowsession:` followed by that same Activity GUID |
   | Customer draft, with `DRAFT-CUSTOMER-` Evidence Number | Communication evidence; draft-only text; no external message sent |
   | Executive draft, with `DRAFT-EXEC-` Evidence Number | Communication evidence; draft-only text; no external message sent |

7. Confirm each evidence row references **both** this Disruption Case and
   this Recovery Decision. Open the case's Carrier Operation and its
   attempt: there must be one operation and one successful attempt, with
   the verified Activity ID retained as the operation's External Operation
   ID. Do not confuse a case, operation, attempt, or conversation ID with
   the CUA Activity GUID.
8. Open <https://copilotstudio.preview.microsoft.com> in DEV, then
   **Agents** > **Carrier Operations Agent** > **Activity**.
9. Open the **Automated** activity corresponding to CP7's Activity GUID.
   Use the Activity details/identifier, not simply its position in the list.
   If the UI does not expose enough information to match that GUID, stop
   for a read-only facilitator lookup of the exact `flowsessions` record;
   do not substitute the latest activity or Module 5's direct fixture test.
10. Select **Register Shipping Contact** > **ExecuteCUA** and inspect
    **Session replay**. In this same correlated session, verify the page
    starts with **Submissions: 0**, ends with **Submissions: 1**, and Submit
    was selected once. A Completed activity without replay evidence is
    insufficient. If the counter starts nonzero or the replay is missing,
    do not reset the page or submit again.
11. Reopen the native case and decision to confirm their final saved states.
    Do not infer a new failure from a stale Home page or an outstanding
    Feed item. Completing regular Dataverse Tasks does not necessarily
    complete the separate Agent Feed item.

This is simulated recovery: the fixture PO line does not prove all 90
exposed units were fulfilled, the carrier test form is not a real shipment,
and successful creation of a draft is not evidence that an email was sent.

## If the run does not reach the expected result

| Observation | Inspect; do not retry execution |
| --- | --- |
| Human-decision fields are still locked | Confirm the exact form and DEV environment, its Read-only properties, successful publication, and a refreshed app. Do not change security settings to get past the problem. |
| Approved is saved but no parent run appears | Check the existing flow is On, its connection is healthy, and its trigger monitors `ppcc_approvalstate`. Preserve the saved decision and diagnose before another action. |
| Parent succeeds but no recovery occurs | Inspect the router and existing-PO branch. Check saved action values, Current flag, prior CP7, and the case-specific PO. Do not flip approval or delete prior records. |
| Adapter returns ambiguity, fails, or times out | Preserve the operation/attempt ledger, diagnostics, and parent run ID. The case should remain In Execution with a technical Needs Attention task, not Resolved. Do not call the agent or adapter again. |
| Case is Resolved but matching CP7 or replay is missing | Treat the test as failed and investigate the evidence path. Do not manually create success evidence or change statuses to make the checklist pass. |
| Home shows missing/stale decision information or an unverified currency label | Inspect native forms and actual currency records. Do not create another decision or case to repair a display issue. |

A browser-started attempt is never automatically safe to repeat. Any
recovery after a failed or ambiguous attempt needs a separately reviewed
plan; it is not another step in this happy-path exercise.

## Completion checkpoint

- The same Module 3 email, intake run, assessment run, case, and decision
  are traceable through the completed scenario.
- The existing DEV decision form supports workshop human approval; Agent
  Feed still provides review and navigation, not approval authority.
- The saved case and decision actions match Split Shipment, with a current
  decision, manually recorded human approval details, and one Approved
  transition.
- The existing Module 5 parent and adapter completed one governed recovery.
- The case is Resolved with a matching succeeded CP7, one carrier operation
  and attempt, and a correlated replay proving one submission.
- Two communication drafts remain unsent.
- No new execution flow, approval-writing agent tool, TARGET customization,
  or TARGET replay was introduced.

You have completed the additional approval build and the DEV end-to-end
scenario. The original Module 6 deployment exercise remains separate.
