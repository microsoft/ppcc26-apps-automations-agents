---
layout: page
title: "Get ready"
permalink: /setup/
description: "A quick checklist before you start the connected workshop."
---

## Use your assigned workshop environment

This workshop uses facilitator-provided infrastructure. It is **not** a
self-service environment provisioning guide. Ask your facilitator for the
credential-provider URL and your workshop access details.

### Before the session

- Have a device that can connect to the workshop VM using Remote Desktop.
- Have access to the company email address used for workshop registration.
- Keep the workshop instructions open on your own device while you work on the VM.
- If Remote Desktop is unavailable on your device, ask a proctor for an alternative.

### What your facilitator provides

- A Microsoft Entra workshop account and Temporary Access Pass or workshop password.
- A workshop VM with Visual Studio Code and workshop tools.
- GitHub sign-in through the workshop identity provider.
- Assigned **Dev**, **Test**, and **Prod** Power Platform environments.
- The workshop mailbox used in Module 3, infrastructure, data, connections, app
  shell, Pipeline, and low-level carrier adapter.

These requirements come from Module 1. Follow its steps to retrieve credentials,
connect to your VM, sign in, and verify your environment.

<a class="button button-dark" href="{{ '/labs/01-open-and-orient/' | relative_url }}">Open Module 1: access and verification →</a>

## Check before continuing

- You can sign in to the VM and open Visual Studio Code.
- GitHub Copilot is connected using the assigned workshop identity.
- You can select your assigned **Dev** environment.
- You can open the Control Tower app and inspect the business data.

Module 1 is the authoritative step-by-step checklist. Later modules list their
own prerequisites.

## Keep credentials private

Never share credentials or include them in screenshots, notes, GitHub issues,
commits, or chat messages. Paste them only into the sign-in prompt that needs them.

## Do not pre-import catch-up solutions

The cloud-flow catch-up resource is intended for **during or after Module 3**,
and only with facilitator guidance. It is not a prerequisite.

[Read the solution-resource guidance]({{ '/solutions/' | relative_url }}).

## Need help?

Ask a proctor for account, access, VM, or environment issues. For documentation
problems, [report an issue on GitHub](https://github.com/{{ site.repository }}/issues/new)
without including credentials or personal workshop data.
