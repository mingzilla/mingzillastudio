#!/bin/bash
set -euo pipefail

ROOT="${PRIVATE_SKILLS_ROOT:-/mnt/e/code/upskill__skills_lib/private_skills}"

source "$ROOT/.claude/skills/private_skills__manage_project_links/scripts/links_lib.sh"

links::sync_from_yaml
