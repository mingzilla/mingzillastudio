#!/bin/bash
# Link private_skills into this project's .claude/skills, or into a .claude/skills__<name>
# sibling - an on-demand dir Claude Code never loads, so its skills cost no upfront context.
#
# GENERATED - _all.sh rewrites this file from
#   private_skills/.claude/skills/private_skills__manage_project_links/templates/link_from_lib.sh
# so an edit here is lost on the next run. Change the template instead.
#
# WHAT gets linked lives in link_from_lib.yaml, next to this file. That yaml is yours:
# _all.sh writes it once and never overwrites it. Edit that, not this.
#
# Rerunnable: drops every symlink in this dir, then rebuilds. This script and the
# yaml are real files, so links::clean leaves them alone. A merged skill is rendered
# from the yaml on every run, and a real dir already sitting at its name is refused
# and named rather than deleted - delete it yourself, then rerun.
set -euo pipefail

ROOT="${PRIVATE_SKILLS_ROOT:-/mnt/e/code/upskill__skills_lib/private_skills}"

source "$ROOT/.claude/skills/private_skills__manage_project_links/scripts/links_lib.sh"

links::sync_from_yaml  # reads the yaml in this script's own dir, then gitignores + reports
