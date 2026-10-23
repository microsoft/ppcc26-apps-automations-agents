# Flow MCP prompt

Use this prompt if you want to try the Power Automate plugin and FlowAgent tools to build or correct the first flow in [Module 3](../labs/03-build-intake-and-impact-cloud-flows.md): **Order Disruption Cloud Flow**. Replace the environment placeholders before pasting the prompt into your coding agent. The workshop solution, connections, and published classification prompt must already exist. Review the proposed plan before approving changes. The flow will remain off; this exercise does not run it.

## Prompt

```text
Build or correct "Order Disruption Cloud Flow" using the Power Automate
plugin and FlowAgent tools.

TARGET
- Environment: <YOUR_ENVIRONMENT_NAME>
- Environment ID: <YOUR_ENVIRONMENT_ID>
- Solution display name: PPCC Agentic Operations Control Tower
- Solution unique name: PPCCAgenticOperationsControlTower
- Final flow state: Stopped / Off

Find the existing flow first and edit it rather than creating a duplicate.
Create a new flow only if none exists. If multiple candidates exist,
ask me which one to edit.

If reference JSON is supplied, use it only for business logic and
action structure. Do not import it or reuse its environment-specific IDs.
Do not recreate tables, modify choices, enable activities, or replace
the existing AI prompt.

SETTLED DECISIONS - DO NOT ASK ME TO RECONFIRM
- Use PPCCAgenticOperationsControlTower, not any other solution.
- Use the existing custom Task-to-Disruption Case lookup:
  ppcc_disruptioncaseid_Task.
- Do not use Task's standard Regarding relationship.
- Disruption Status = New, numeric value 100000000.
- Source = Supplier Notice, numeric value 100000001.
- Supplier Name is stored in nwind_company.
- Use the saved prompt's published structured JSON output.
- Create/save the flow turned off. Do not enable or execute it.

DEPENDENCIES AND METADATA
Use the existing schema:
- Products entity set: nwind_productses
  Primary key: nwind_productsid
  Matching columns: nwind_productcode and nwind_productname
- Suppliers entity set: nwind_supplierses
  Primary key: nwind_suppliersid
  Matching column: nwind_company
- Disruption Cases entity set: ppcc_disruptioncases
  Primary key: ppcc_disruptioncaseid
- Tasks entity set: tasks

Confirm these against current metadata. Ask only if a required
dependency is actually missing or conflicts with these decisions.
Do not ask whether to introduce alternative schema or choice labels.

PROMPT DISCOVERY AND CONTRACT
Locate the existing prompt named "Classify supplier notification".
Use "Classify supplier notice" as the flow action's display name.

Do not assume msdyn_aiconfigurations records have the prompt's display name.
If necessary:
1. Find the named prompt in msdyn_aimodels.
2. Discover and follow its active run-configuration lookup.
3. Use that configuration ID as the prompt action's recordId,
   not the AI model ID.

Inspect the published runtime contract:
Inputs:
- EmailBody
- EmailSubject

Structured output:
- classification
- productCode
- productName
- supplier
- delayDays
- noticeReference
- reason

Read these fields from:
responsev2/predictionOutput/structuredOutput

Do not add Parse JSON or parse the prompt's text output.
If the current published contract lacks structuredOutput, stop
and report that specific blocker rather than silently changing design.

Call get_operation_details directly for aibuilderpredict_customprompt
if connector search does not list the virtual operation.
If a schema resolver is unavailable, inspect the published configuration
contract and disclose any remaining uncertainty. Do not execute the
prompt just to inspect its schema.

REQUIRED FLOW STRUCTURE - NO ADDITIONAL ACTIONS

When a new email arrives (V3)
  -> Classify supplier notice
  -> Route supplier notice (Switch)

Case value: SupplierDelay
Case display name: Supplier delay
  1. Find product
  2. Find supplier
  3. Create disruption case
  4. Create case review task

Case value: Other
Case display name: General update
  Terminate with status Succeeded

Default
  Create notification review task

Use these internal action names:
- Classify_supplier_notice
- Route_supplier_notice
- Find_product
- Find_supplier
- Create_disruption_case
- Create_case_review_task
- Create_notification_review_task

TRIGGER
- Outlook operation: OnNewEmailV3.
- Monitor the connected mailbox's Inbox.
- Subject filter: PPCC Cloud Flow Lab.
- Resolve the actual Inbox folder ID.
- Use the notification-backed trigger shape:
  OpenApiConnectionNotification.
- Preserve the required splitOn behavior for individual emails.
  splitOn is not an Apply to each action.
- If generic operation metadata disagrees with the Outlook trigger
  Swagger, inspect the trigger-specific contract before authoring.

CLASSIFY SUPPLIER NOTICE
- Use the saved prompt and its resolved active configuration ID.
- EmailBody = trigger email body.
- EmailSubject = trigger email subject.
- Switch directly on structuredOutput/classification.

FIND PRODUCT
Use Dataverse List rows, operation ListRecords.
- Entity set: nwind_productses.
- Select columns: nwind_productsid.
- Filter rows:
  nwind_productcode equals structuredOutput/productCode
  AND
  nwind_productname equals structuredOutput/productName.
- Build an OData filter using the actual prompt outputs.
- Escape apostrophes in each extracted value by replacing a single
  apostrophe with two apostrophes.
- Do not retrieve all products and filter them locally.

FIND SUPPLIER
Use Dataverse List rows, operation ListRecords.
- Entity set: nwind_supplierses.
- Select columns: nwind_suppliersid.
- Filter rows:
  nwind_company equals structuredOutput/supplier.
- Escape apostrophes in the extracted value for OData.
- Run only after Find_product succeeds.

CREATE DISRUPTION CASE
Use Dataverse CreateRecord against ppcc_disruptioncases.

Map:
- ppcc_title:
  Supplier delay - <structuredOutput/productName>
- ppcc_delaydays:
  structuredOutput/delayDays
- ppcc_disruptionstatus:
  100000000
- ppcc_source:
  100000001
- ppcc_impactedordercount:
  0
- ppcc_revenueatrisk:
  0
- ppcc_reportedon:
  utcNow()
- ppcc_sourcereference:
  structuredOutput/noticeReference
- ppcc_recommendationsummary:
  Supplier-delay impact assessment pending. No recovery is approved.

Product lookup binding value:
concat(
  'nwind_productses(',
  first(body('Find_product')?['value'])['nwind_productsid'],
  ')'
)

Supplier lookup binding value:
concat(
  'nwind_supplierses(',
  first(body('Find_supplier')?['value'])['nwind_suppliersid'],
  ')'
)

Use the verified connector lookup parameter names for ppcc_productid
and ppcc_supplierid. Preserve @odata.bind where the connector contract
requires it; do not blindly strip that suffix.

Run only after Find_supplier succeeds.

CREATE CASE REVIEW TASK
Use Dataverse CreateRecord against tasks.
- Subject:
  Review supplier disruption impact
- Description:
  Review the order impact and pending recovery recommendation.
  Completing this task is not approval.
- Custom Disruption Case lookup navigation property:
  ppcc_disruptioncaseid_Task
- Lookup binding value:
  concat(
    'ppcc_disruptioncases(',
    outputs('Create_disruption_case')?['body/ppcc_disruptioncaseid'],
    ')'
  )

Use the connector's verified lookup parameter syntax.
Run only after Create_disruption_case succeeds.

DEFAULT BRANCH
Create one Dataverse Task:
- Subject: Review supplier notification
- Description: include the email subject, structured classification,
  and structured reason.

STRICT STRUCTURE CONSTRAINTS
- Zero Apply to each / Foreach actions.
- No "Exactly one product and supplier" condition.
- No lookup-review branch.
- No Compose, variables, Filter array, or Parse JSON actions.
- Do not use item() or items() references.
- Do not use array dynamic-content tokens for lookup IDs.
- Use first(...) expressions to produce scalar lookup IDs.
- Do not change the design to introduce additional safety branches.
- Do not add recovery execution or approvals.

When correcting the existing flow, move required actions out of
unwanted loops/conditions before removing those containers.
Repair all expressions and runAfter references.

SOLUTION MEMBERSHIP
Resolve the existing PPCC Agentic Operations Control Tower solution
using its unique name PPCCAgenticOperationsControlTower and retrieve
its actual ID; do not infer the ID from the display name.

Ensure the saved workflow and its two connection references belong
to this solution. Creation in Active Solution alone is not sufficient.

Add existing components only when missing. When adding connection
references, do not pass DoNotIncludeSubcomponents=true.

APPROVAL AND COMPLETION
Present one consolidated creation/edit plan for approval before saving.
Do not ask separate questions about the settled decisions above.

Validate the definition and report unresolved blockers honestly.
After saving, read the persisted definition and solution membership.

Confirm:
- SupplierDelay contains exactly the four required sequential actions.
- All runAfter dependencies are correct.
- There are zero Foreach actions anywhere.
- No references remain to removed loops or conditions.
- The Task uses the approved custom lookup.
- The choice values are 100000000 and 100000001.
- The workflow and both connection references are in
  PPCCAgenticOperationsControlTower.
- The flow is Stopped / Off.

Return the flow ID and designer link.
Distinguish definition validation from runtime testing.
Do not claim runtime success: do not enable or run the flow.
```
