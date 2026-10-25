---
layout: page
title: "Solution resources"
permalink: /solutions/
description: "Know what is available and when to use workshop solution resources."
---

## Cloud-flow catch-up resource

**Do not import or deploy a catch-up solution before the workshop.**

The repository's ready-to-use cloud-flow folder is for participants who need
help catching up **during or after Module 3**. Build the flows yourself whenever
possible.

The available ZIP files below are discovered directly from the repository.
The catch-up folder's README currently says a package is not included, although
a ZIP is present. Confirm its readiness with your facilitator before importing.

- Confirm with your facilitator before using a catch-up solution.
- Complete the Module 3 prerequisites and use your assigned environment.
- Review any existing flows with your facilitator to avoid duplicate runs.
- Configure the required connections after import and follow the Module 3 tests.

[Read the source guidance](https://github.com/{{ site.repository }}/blob/{{ site.source_branch }}/solutions/CloudFlow-ReadytoUse%20solution/README.md)
or [open Module 3]({{ '/labs/03-build-intake-and-impact-cloud-flows/' | relative_url }}).

## Available packages

These links download the original files from GitHub; this site does not modify
or repackage them. The existence of a file is not an instruction to import it.

{% for package in site.data.solution_packages %}
- [{{ package.name }}]({{ package.url }}) ({{ package.size_kb }} KB){% if package.catch_up %} **Module 3 catch-up only; facilitator approval required.**{% else %} **Use only as directed by the lab or your facilitator.**{% endif %}
{% endfor %}

## Other workshop files

Use the files and import order identified by your facilitator and each lab.
The site does not invent a package order or provision environments.

[Browse the setup assets on GitHub](https://github.com/{{ site.repository }}/tree/{{ site.source_branch }}/setup)
and [browse solution resources on GitHub](https://github.com/{{ site.repository }}/tree/{{ site.source_branch }}/solutions).
