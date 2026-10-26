# Module 6: Deploy the Control Tower

**Estimated time:** 30 minutes.

Deploy two managed solutions with Power Platform Pipelines: the Business
Skills library first, then the main Control Tower solution through the same
pipeline and target stage. This module covers solution preparation,
deployment, and installation checks only; it does not include DEV recovery
testing or a TARGET scenario replay. Pipeline run times vary.

Screenshots show examples. Use your assigned environments and solution versions.

## Before you start

- Your facilitator has released this exercise after Modules 1–5.
- You have your assigned demo mailbox and demo account for TARGET connections.
- Your access card identifies DEV, TARGET, and the assigned pipeline/stage.
- TARGET has no workshop solutions, sample data, or pre-created connections.

Do not approve Recovery Decisions, send disruption notices, or run the carrier
agent during this module. Deployment does not authorize recovery.

## Task 1: Create the Skill library

The Skill is a prerequisite, so its library must arrive before the app and
agents that use it. Solution membership changes what ships, not which policy
your DEV agents use.

Select **Solutions** whenever you switch between the two solutions below.

1. Open <https://make.preview.powerapps.com> in DEV.
2. Select **Solutions**.
3. Open **PPCC Agentic Operations Control Tower**.
4. Find its **Publisher** on **Overview**.
5. Return to **Solutions**.
6. Select **New solution**.
7. Enter these values:

   | Field | Value |
   | --- | --- |
   | Display name | `PPCC Control Tower Business Skills` |
   | Name | `PPCCControlTowerBusinessSkills` |
   | Publisher | The same existing publisher as the main solution |
   | Version | `1.0.0.0` |
   | Set as your preferred solution | Off |

   ![Example New solution form before selecting Create: library names, the existing publisher, version 1.0.0.0, and preferred solution off.](images/module6/guide-05-create-library.png)

8. Select **Create**.
9. Open **PPCC Agentic Operations Control Tower**.
10. Select **Objects**.
11. Select **Business Skill**.
12. Open **More commands** on the existing `ppcc-order-disruption-triage` row.
13. Point to **Advanced**.
14. Select **Add to solution**.

    ![Open the Skill row's More commands menu, then Advanced and Add to solution.](images/module6/guide-06-add-to-solution.png)

15. In **Select where you want to add the component**, choose
    **PPCC Control Tower Business Skills**.
16. Select **Save**.
17. Open **PPCC Control Tower Business Skills**.
18. Select **Objects**.
19. Select **Business Skill**.
20. Confirm the original Skill is listed before continuing.
21. Open **PPCC Agentic Operations Control Tower**.
22. Select **Objects**.
23. Select **Business Skill**.
24. Select that same original Skill row.
25. Select **Remove**.
26. Select **Remove from this solution**, never **Delete from this environment**.

    ![Choose Remove from this solution rather than deleting the Skill from the environment.](images/module6/guide-07-remove-membership.png)

27. Confirm that the Skill no longer appears in main.
28. Open the DEV **PPCC Agentic Operations Control Tower** app.
29. Select **Agent feed** to confirm it is still present.

**Expected result:** the same Skill is in the library, not main; DEV Feed remains.
If a required row or control is unavailable, stop—do not delete the Skill
or disconnect Feed.

## Task 2: Increase both solution versions

1. Open **PPCC Control Tower Business Skills** in DEV **Solutions**.
2. Select **Overview**.
3. Select **Edit details**.
4. In **Solution settings**, change **Version** to `1.0.0.1`.
5. Select **Update**.
6. Open **PPCC Agentic Operations Control Tower**.
7. Select **Overview**.
8. Select **Edit details**.

   ![Select Edit details on the main solution Overview.](images/module6/guide-08-edit-details.png)

9. Increase the last number in **Version** by one, for example `1.1.0.0` to `1.1.0.1`.

   ![Change the main solution Version in the Solution settings pane.](images/module6/guide-09-version.png)

10. Select **Update**.

**Expected result:** both versions increased; they do not need to match.

## Task 3: Deploy the Skill library FIRST

1. Open **PPCC Control Tower Business Skills** in DEV.
2. Select **Pipelines**.
3. Select the assigned pipeline.
4. Select **Deploy here** on your assigned TARGET stage.
5. Check DEV, TARGET, and **Now** on **Destination**.
6. Select **Next**.
7. Wait for validation to finish.
8. Select **Next** if an empty **Connections** page appears.
9. Check the library name and new version on **Summary**.
10. Select **Deploy** once.
11. Open **Run history**.
12. Wait for this deployment to show **Succeeded**.
13. Switch the maker portal to TARGET.
14. Open **Solutions**.
15. Confirm **PPCC Control Tower Business Skills** is **Managed**.

**Expected result:** the Skill library is installed; main is not installed yet.

## Task 4: Deploy main SECOND through the SAME pipeline

1. Switch the maker portal back to DEV.
2. Open **PPCC Agentic Operations Control Tower**.
3. Select **Pipelines**.
4. Select the same assigned pipeline.
5. Select **Deploy here** on the same TARGET stage.
6. Check the destination on **Destination**.
7. Select **Next**.
8. Wait for validation.
9. On **Connections**, open the first connector's selector.
10. Select **New connection** / **Create new** from this deployment wizard.
11. Confirm TARGET in the connection window, then sign in with your assigned demo account.
12. Return to the wizard.
13. Select the connection you just created.
14. Repeat steps 9–13 for each connector family:

    | Connector family | Connection to create here |
    | --- | --- |
    | Microsoft Dataverse | Your TARGET connection |
    | Microsoft Copilot Studio | Your TARGET connection |
    | Power Apps MCP Server | Your TARGET connection |
    | Office 365 Outlook | Your assigned demo mailbox connection |
    | Computer use | **Connect to hosted browser** |

15. Map the second Dataverse binding to the Dataverse connection just created.
16. Confirm all **six bindings** across the **five connector families** are mapped.
17. Select **Next**.
18. On **Environment variables**, find **PPCC Intake Subject Prefix**.
19. Enter **PPCC-TARGET** as its TARGET value.
20. Select **Next**.
21. Check main's name, new version, TARGET, and prefix on **Summary**.
22. Select **Deploy** once.
23. Open **Run history**.
24. Wait for this deployment to show **Succeeded**.

**Expected result:** main follows the library through the same pipeline.
Create connections only inside this deployment; reuse only one created earlier
in this same attempt. Complete MFA attended if requested. Never choose
**Connect to machine** or enter a machine password. If the wizard cannot
create a required connection, stop—do not create one elsewhere.

## Task 5: Confirm both managed solutions in TARGET

1. Switch the maker portal to TARGET.
2. Select **Solutions**.
3. Confirm both library and main show **Managed**.

**Expected result:** both solutions are installed as managed solutions, with
successful pipeline runs and the configured TARGET connection bindings.
Stop here; sample-data loading and end-to-end recovery testing are outside
this module.

## Completion checkpoint

- The original Skill and DEV Feed were preserved.
- The library deployed managed FIRST, then main managed SECOND on the same pipeline.
- TARGET connections were created in that deployment, without app repairs.
- Both pipeline runs show **Succeeded**, and both solutions show **Managed** in TARGET.

You have completed the deployment of the Agentic Control Tower.
