# Supplier Recovery Offers - Lab 2 requirements

Use with [Module 2 - control tower extension instructions](../../02-build-control-tower.md).
This file contains the complete requirements for this lab; advanced work
outside its scope is not mandatory.

## Outcome and scope

Extend the installed **PPCC Agentic Operations Control Tower** app with:

- One new Supplier Recovery Offer table related to the existing Disruption Case.
- One new Main form.
- One new public comparison view.
- A useful default **Active Supplier Recovery Offers** view containing the
  six comparison fields, while retaining the separate comparison view for
  its saved ship-date/cost sorting.
- One navigation entry in the existing app, showing a meaningful Fluent-style
  SVG icon for the new table.
- Exactly two illustrative Supplier Recovery Offer rows, created by app-builder
  as part of the approved build.

Analysts compare two illustrative supplier offers before a separate recovery
decision. Offers are information only, never approval or execution.

This is an isolated training exercise using workshop data, not a
production-ready extension or certification of API-level validation.

Track **app-builder completion** separately from the **participant walkthrough**.
The builder must complete and verify its supported scope; the participant
then explores the view and form and discusses the business tradeoff below.
This lighter walkthrough does not waive builder verification or safety gates.

## Fixed authoring decisions

Use these decisions as supplied design input, not a new requirements interview.
Follow required skill reviews and obtain explicit approval before writes.
Ask only when a genuine ambiguity, unsupported core requirement, or mismatch
prevents safe implementation.

### Educational-lab issue handling

Aim for the specified design, but keep the lab moving when the core business
capability works. The core is a usable offer table, form, and comparison
view in the existing app, with the two approved offers correctly linked to
the seeded case and USD. Approval, preservation, and relationship-safety
gates remain mandatory.

Treat cosmetic differences, missing descriptions, icon limitations,
nonessential form spacing, exact column order/saved sorting, and default-view
configuration as non-blocking when the form is readable and the comparison
still shows the case, status, dates, quantities, and costs. Record the exact
limitation and supported fallback in the plan or final report; do not
silently claim a missing feature is implemented. Continue within the
approved scope rather than repeatedly asking to fix minor polish or adding
custom code/API patches.

Pause for facilitator help only for a wrong target/identity, conflicting
existing work that risks overwrite or duplication, missing core capability,
or failed/unverified preservation, case/currency binding, or relationship
safety. A minor warning is not a reason to halt otherwise supported work.
New writes outside the approved scope still require explicit approval.

### Intended design

| Item | Requirement |
| --- | --- |
| Environment | Facilitator-assigned DEV URL supplied in the prompt; never TARGET |
| Identity | Prepared workshop author account with System Administrator access in this isolated DEV |
| Solution | Existing unmanaged `PPCCAgenticOperationsControlTower`, at the facilitator-approved installed version |
| Publisher | Reuse the solution's existing publisher and `ppcc` prefix |
| App | Existing PPCC Agentic Operations Control Tower; discover its actual identity |
| Case | Existing Disruption Case table; discover its actual identity |
| UI | Standard record form/view, Main-form creation; meaningful Fluent-style SVG table icon, also visible in the existing app's navigation |
| Offer icon | A document with a price tag, representing a supplier's recovery offer; not an approval/checkmark or execution symbol |
| Low-risk polish | Purposeful descriptions on new components, readable multiline Analyst Notes, and sample notes explaining the date/cost tradeoff; no additional participant steps |
| Access | Use the existing administrator account; no role creation, role grants, or app-role changes |
| Business data | App-builder creates exactly the two illustrative offers below after explicit build approval and relationship-safety verification; no other sample rows or seed-record edits |

The facilitator prepares authentication, tools, USD currency, the base
solution, and the seeded Pending case before the exercise. Record the
actual environment, identity, solution version, app ID, and case ID in the
generated plan; do not ask the participant to choose a different architecture.

Retrieve the existing app fresh. If the offer table already exists, inspect
the existing work and receipt to determine whether it can be safely resumed.
If it conflicts with the requested build or the workspace belongs to another
environment, report the state and obtain a reviewed resume plan. Do not
overwrite earlier work or create another table.
When resuming a planning-only run, preserve its artifacts before refreshing
the download in the same workspace, reapply only the reviewed extension
intent, and regenerate the preview, lint, and dry run. A previous dry run or
approval of these requirements is not build approval.

## Data model

Create one user-owned table:

- Display name: **Supplier Recovery Offer**.
- Plural name: **Supplier Recovery Offers**.
- Logical name: `ppcc_supplierrecoveryoffer`.

| Column | Logical name | Type | Requirement |
| --- | --- | --- | --- |
| Offer Name | `ppcc_name` | Primary text, maximum 100 characters | Required on the Main form; explicit text, no autonumber |
| Disruption Case | `ppcc_disruptioncaseid` | Lookup to the existing Disruption Case | Optional in metadata and on the Main form; app-builder binds both illustrative offers to the same verified seeded Disruption Case |
| Promised Ship Date | `ppcc_promisedshipdate` | Date/time column with date-only display | Required on the Main form |
| Recoverable Quantity | `ppcc_recoverablequantity` | Whole number, minimum 1 | Required on the Main form |
| Incremental Cost | `ppcc_incrementalcost` | Currency, precision 2, minimum 0 | Required on the Main form; explicit entry, including zero |
| Offer Status | `ppcc_offerstatus` | Local Choice | Required on the Main form; explicit selection |
| Analyst Notes | `ppcc_analystnotes` | Multiline text | Optional |

Set Business Required metadata for the required fields where supported, and
verify actual form behavior. Do not represent that metadata as server-level
rejection of omitted/null values from every API path.

### Descriptions and field guidance

Author meaningful descriptions with the new table, all seven columns, Main
form, comparison view, and icon web resource through supported App Spec
properties. Describe purpose and boundaries, not just repeat display names.
Do not rewrite descriptions on existing Control Tower components.

Use the following column guidance:

| Column | Description |
| --- | --- |
| Offer Name | Short descriptive name distinguishing this alternative from other offers. |
| Disruption Case | Optional link to the disruption being evaluated; both workshop examples use the same seeded case. |
| Promised Ship Date | Supplier's proposed ship date, not an arrival date or evidence that shipment occurred. |
| Recoverable Quantity | Units offered for recovery under this alternative; alternative offers are not additive commitments. |
| Incremental Cost | Additional cost for this alternative, not total order value; workshop examples use USD. Zero means no additional cost. |
| Offer Status | Analyst comparison status only. Shortlisted is not approval and does not authorize execution. |
| Analyst Notes | Comparison assumptions and date/cost tradeoffs; not a supplier commitment or execution evidence. |

The table and form descriptions must explain that offers support comparison
before a separate Recovery Decision. The view description must explain that
it compares all Active offers, including Not Selected, by ship date then
cost. Describe the icon's purpose on its web resource.
Metadata descriptions provide durable context for people and future agents;
do not promise that every description renders as an on-screen tooltip.
Include them in the existing plan and metadata readback, not a separate
participant exercise. On an existing deployment, report description updates
the supported builder does not apply; do not use an API patch or recreate
components to backfill this polish.

Disruption Case is intentionally optional for this lab.
Leave its requirement level as None and keep the lookup visible and
navigable. An offer without a case is permitted by the data model, but
does not satisfy the illustrative exercise. Do not add a business rule,
script, plug-in, or other validation to enforce this association.
Production enforcement of the case association is deferred.

Create the case-to-offers 1:N relationship as referential/non-parental:
offer operations must not cascade changes to the case. Read back and report
the actual delete behavior. Production Restrict Delete hardening is deferred;
participants must not delete cases during this exercise. If the supported
builder cannot create a referential/non-parental link, report a core blocker
rather than substitute a parental relationship.
An absent cascade-setting field in the spec is not by itself proof of a
parental relationship. A supported default may be used if its actual policy
is read back and meets the requirement. Report the full cascade policy,
including the direction of parent-to-child effects; `IsHierarchical: false`
alone is insufficient. If the actual policy cannot be verified, leave this
safety gate unverified and stop before creating any illustrative offers.

Use genuine DateOnly behavior if supported by the selected tooling. Otherwise,
retain date-only display and report the actual storage behavior as a training
limitation. Do not add a custom validator or change existing date columns.

Use standard Owner, Active/Inactive state, and platform currency support;
do not create duplicate ownership, state, or currency columns. The prepared
environment must support USD, and both illustrative offers must use USD.

Offer Status has exactly three labels:

1. Received
2. Shortlisted
3. Not Selected

Shortlisted is not approval. Do not add Approved, Accepted, Executed, or
Succeeded. Automatic defaults are not required: sample rows supply the name,
cost, and Received status explicitly; users must enter these when using New.

Do not add Response Date, autonumber, Proposed Recovery Action, copied
supplier/product data, revenue-at-risk, approval fields, or execution fields.
There is no cross-date validation rule in this reduced model.

## Main form

Create one Main form named **Supplier Recovery Offer**:

| One tab: Offer | Fields, in order |
| --- | --- |
| Summary section | Offer Name, Disruption Case, Offer Status |
| Offer Details section | Promised Ship Date, Recoverable Quantity, Incremental Cost, Analyst Notes |

Keep Analyst Notes last in Offer Details. Give it the section's full width
and a three-row multiline area using supported field spans. Preserve the
one-tab/two-section layout and field order; do not add a control, script,
web resource, or section to achieve this layout. Show it in the existing
preview and check readability during MF-02, without another acceptance step.

Keep the case lookup navigable. Use the Main form for creation; do not author
Quick Create. No custom commands, true form header, dashboard,
generative page, or existing case-form edit is required.

## Public view and app navigation

Update the platform-generated **Active Supplier Recovery Offers** default
view through supported app-builder authoring so it includes Offer Name,
Disruption Case, Offer Status, Promised Ship Date, Recoverable Quantity,
and Incremental Cost. Retain its Active-state filter. This makes the initial
list useful without requiring a view switch. Exact column order, removal of
existing columns such as Created On, and saved date/cost sorting are not
requirements for this default view.

This is a deliberate, reviewed exception to stock-view preservation for the
Supplier Recovery Offer table only. Use supported existing-view column
updates or default-view enrichment, not a direct API patch. If enrichment
also changes this table's Inactive view, disclose its exact scope in the
plan and obtain explicit approval before applying it; that additional change
is not implicitly authorized. Preserve all views on other tables. If the
requested Active-view fields cannot be applied through supported tooling,
report a non-blocking limitation and direct the participant to the authored
comparison view with the useful fields. Do not patch the stock view through
an unsupported path.

Create one public view named **Supplier Recovery Offers**:

- Filter: state equals Active.
- Columns, in order: Offer Name, Disruption Case, Offer Status,
  Promised Ship Date, Recoverable Quantity, Incremental Cost.
- Sort: Promised Ship Date ascending, then Incremental Cost ascending.

All three Offer Status values remain visible while the record is Active.
This is a comparison list, not the original spec's Open Offers status filter.
Retain this authored view even though the default Active view has useful
fields: its saved column order and ship-date/cost sorting are the reason for
the separate view.

Add **Supplier Recovery Offers** under the existing Control Tower navigation,
including the table, new Main form, and new view in the app. Exact placement
between existing entries is not a completion gate. Do not remove or reorder
existing navigation.

Give the new table a meaningful Fluent-style SVG icon depicting a document
with a price tag. Record that depiction as `iconDescription` in the App Spec
before creating the SVG; use the supported app-builder table-icon and
navigation-icon configuration. The **Supplier Recovery Offers** navigation
entry should display that icon rather than the generic stock table icon.
Include the icon web resource and its table/navigation references in the existing
solution. Preserve the app icon and every existing table/navigation icon.
If the supported tooling cannot apply the icon, report a non-blocking
limitation and retain the stock icon. Do not spend the lab repairing icon
polish or change existing icons.

The navigation entry must open the offer table, and the named comparison
view must be included and selectable in the app. Automatically opening that
view is not an app-builder completion gate. If the builder cannot set it as
default, record manual follow-up MF-01 rather than block the supported build.
Do not modify stock views as a default-selection workaround. The only
requested stock-view edit is the Active-view field enrichment above;
automatic default selection remains optional, and no second authored view
is required.
Platform-generated forms/views are not additional authored deliverables;
do not delete or deactivate them merely to make the catalog count one.

Include all new components and necessary app/navigation changes in the
existing unmanaged `PPCCAgenticOperationsControlTower` solution.

## Preservation and authority

Preserve existing tables, relationships, forms, views, charts, processes,
roles, app-role associations, records, and the landing page. Do not rebuild
an existing form from a partial downloaded definition.
The narrowly scoped Supplier Recovery Offer default-view enrichment above
is the explicit exception to view preservation; it does not authorize
rewriting unrelated views or removing the existing comparison view on resume.

The reviewed dry run must distinguish new feature changes from necessary
maintenance writes. If the tool re-uploads the existing landing page, preserve
its ID, source, configuration, bindings, membership, and navigation, and
verify them afterward. If a supported path cannot preserve them, stop and
report the exact blocker; do not remove the page from the spec to bypass it.

No offer create/edit/status operation may approve or change a Recovery
Decision, change disruption/approval/execution state, create or advance a
Carrier Operation or Carrier Attempt, send communications, start execution,
or create Execution Evidence. No approval/execution buttons or automation.
The two approved new offer rows are the only business-data additions in this
module; creating them must not modify the seeded records.

## App-builder completion and participant walkthrough

Before any environment writes, show the complete proposed extension, tool
limitations, preservation plan, participant walkthrough, and actual dry-run plan.
Distinguish new feature writes from app/sitemap, page/manifest, icon, and
publish maintenance. Include the two sample-data writes, exact resolved case
and USD currency, and concrete promised ship dates in that review.
Show the offer icon's depiction, web-resource addition, and table/navigation
assignments as new feature changes, not existing app-icon maintenance.
Show the offer Active-view column update as an intentional feature change,
including any additional default-view enrichment effects requiring approval.
Obtain explicit build approval; do not treat a requirements revision or an
acknowledged tooling gap as that approval.

After approval, use the supported app-builder build/publish path. Apply the
schema-only data stage without sample rows first, then read back the full
relationship cascade policy. Create the offers only after that safety gate
passes, using the supported sample-data phase in the full build.
Verify the new table/columns, required levels and numeric limits, form definition
and membership, default Active-view fields/filter and app availability,
comparison-view columns/filter/sort and membership, navigation, solution
membership, relationship policy, actual date behavior, and preservation.
Read back the offer icon web resource and table/navigation assignments;
leave opening the published view and form to the participant walkthrough.
Read back both sample rows, their case/currency bindings, dates, quantities,
costs, Received status, and Active state. Compare protected business state
with the pre-build baseline; do not create additional test offers.

App-builder completion requires the core capability, both sample rows, and
the safety/preservation checks to pass. Verify and report the other requested
details, but allow completion with documented non-blocking limitations under
the issue-handling guidance above. Participant review is a short business-use
walkthrough, not a requirement to test New-form validation or change statuses. Seeded rows
and metadata checks do not certify every published form interaction.
Report **"app-builder portion complete; participant walkthrough pending"**
only when supported deployment and core verification actually pass. Add
**"with noted limitations"** when minor issues remain. Otherwise report the
failed or unverified core/safety items; a builder success message is not enough.

Use the following IDs to structure the short walkthrough. No formal manual
test receipt or evidence checklist is required. Do not claim the participant
has reviewed the app based on metadata alone.

| ID | Owner | Participant walkthrough |
| --- | --- | --- |
| MF-01 | Participant | Open Supplier Recovery Offers and select the comparison view if needed. Look at the offers' dates, quantities, and costs. |
| MF-02 | Participant | Open an existing sample offer and explore its form, case link, details, and Analyst Notes. No edits or new records are needed. |
| MF-03 | Participant | Compare the earlier/higher-cost and later/lower-cost offers. Discuss which to investigate further and what additional information would help. No status changes are required. |
| MF-04 | Participant | Recognize that the offers capture alternatives, not approval or execution. Leave the recovery decision unchanged. |

Report two tooling limitations without adding deferred implementation:

- If genuine DateOnly behavior is not exposed, use date-only display and
  record the actual storage behavior. This allowed fallback is not a core
  blocker; do not convert storage behavior or add validation without review.
- If cascade controls are not exposed, read back the supported default.
  MF-01 does not waive the referential/non-parental safety gate or authorize
  manual relationship changes. Stop if the actual policy is unsafe or cannot
  be verified. Restrict Delete hardening remains deferred.

Record app-builder issue candidates separately from the participant walkthrough.
Future ADO filing does not authorize workarounds, role changes, unsupported
API patches, or modifications to the builder.

## Illustrative data and acceptance

Use the seeded Supplier F / Clam Chowder case, with a Pending Recovery
Decision. The prepared fixture must have at least 30 affected units.
Do not edit seeded Northwind, case, decision, carrier, or evidence records.

App-builder must include the following two rows in the reviewed App Spec
`sampleData` section and create them through the supported build's
`--sample-data` option, not a separate data loader or direct API write.
Sample data must contain only Supplier Recovery Offer rows; do not add parent
case, currency, Northwind, decision, carrier, or evidence rows to seed them.

Before approval, uniquely resolve the existing seeded case and active USD
currency. Bind both offers to those actual records through supported tooling.
Resolve the VM's current calendar date and record it, the VM time zone, and
the resulting +3-day and +7-day dates in the plan; use those concrete dates
in the sample data. Do not silently recompute approved dates on a retry.
If case/currency binding cannot be expressed safely through the supported
sample-data path, stop and report the limitation rather than inventing a
relationship, editing seed data, or using an unsupported patch.

After approval and the relationship-safety gate, app-builder creates:

| Field | Offer 1 | Offer 2 |
| --- | --- | --- |
| Offer Name | Faster partial recovery | Lower-cost recovery |
| Disruption Case | Same seeded Supplier F case | Same seeded Supplier F case |
| Promised Ship Date | Reviewed VM date +3 days | Reviewed VM date +7 days |
| Recoverable Quantity | 30 | 30 |
| Incremental Cost | USD 120.00 | USD 40.00 |
| Offer Status | Received | Received |
| Analyst Notes | Workshop example only; not a supplier commitment. Earlier ship date at higher incremental cost. | Workshop example only; not a supplier commitment. Later ship date at lower incremental cost. |

Both rows must be Active. These are alternatives, not additive fulfillment
commitments. Record the created row IDs and actual calendar dates in the
build receipt and read them back before declaring app-builder completion.
Participants inspect and compare these rows rather than entering duplicates.

On a retry or an already-built environment, inspect existing offers and the
previous receipt first. Do not blindly rerun sample insertion, duplicate rows,
delete offers, or reset a participant's status changes. Missing, partial,
ambiguous, or conflicting sample data requires a reviewed resume plan and
explicit approval before further writes.

The participant exercise is complete after the short MF-01 through MF-04
walkthrough: open the new view and form, compare the two illustrative offers,
and understand that these records do not approve or execute recovery.
Manual invalid-value tests, status changes, and technical evidence collection
are not required participant work.

The builder must verify the published core extension, sample data,
relationship safety, and preservation, and report failed or unverified
checks explicitly. Non-blocking polish/tooling limitations are reported,
not treated as failed core completion. A builder
success message alone is not verification. The walkthrough does not certify
production readiness or every form/API validation path. More detailed
interaction testing may be performed separately by the facilitator.

## Optional work and later modules

After the participant walkthrough and successful builder verification,
separately review an optional task:

- If rehearsed successfully with the installed skill version, prefer the
  authored **Supplier Recovery Offer** Main form using supported default-form
  configuration. Retain stock forms and existing app form membership; do not
  rewrite undeclared forms or change access. A user's remembered form may
  override the default. If the preference cannot be applied safely, retain
  manual form selection. This is not a build or acceptance gate and is
  separate from default-view configuration.
- Add an **Offers by Disruption** view: Active rows; the same columns with
  Disruption Case first; sort by case, ship date, then cost.
- Use the supported form designer to add a related Supplier Recovery Offers
  grid to the existing case form, showing this variant's comparison view and
  related records only. Preserve all original form content and identity.

Production API validation, Restrict Delete certification, auditing,
multi-persona access, shared Recovery Action reuse, extra statuses, and
autonumber are outside this variant. Do not generate a plug-in, business rule,
security redesign, or extra approval gates to implement those deferred items.

Keep all additions in the full solution for later managed deployment;
no checker/export/TARGET deployment is required in Module 2.
Business rows and OAuth credentials are not transported in that solution.
