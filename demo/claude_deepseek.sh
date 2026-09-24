#!/bin/bash
/mnt/e/code/.code_setup/cmd_startup/startup_templates/sync_template.sh
exec /mnt/e/code/.code_setup/cmd_startup/startup/claude_deepseek.sh "$@"
