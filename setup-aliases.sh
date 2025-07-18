#!/bin/bash
# Octopus TMS Shell Aliases Setup
# Add these to your ~/.bashrc or ~/.zshrc file

# Quick Octopus TMS development
alias octi='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "$(cat .claude-prompt)"'

# Testing focused mode
alias octi-test='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "Focus on test quality. Run ./gradlew test, npm run test, and npm run test:e2e before marking tasks complete."'

# Module-specific development
alias octi-b='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "Working on Broker module. Check broker package structure and focus on load management features."'
alias octi-s='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "Working on Shipper module. Focus on shipment requests and warehouse integration."'
alias octi-c='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "Working on Carrier module. Focus on fleet management and load execution."'

# Frontend development
alias octi-ui='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "Frontend focus: React 19.1, TypeScript, Tailwind CSS. Check web/src/main/webapp/app structure."'

# Database work
alias octi-db='cd ~/Desktop/octopus-tms-b && claude --append-system-prompt "Database work: PostgreSQL 14, local instance, no Docker. Remember Flyway is temporarily disabled."'

# Quick commands
alias octi-run='cd ~/Desktop/octopus-tms-b && ./gradlew bootRun -Dspring.profiles.active=local'
alias octi-ui-run='cd ~/Desktop/octopus-tms-b && npm run devserver'
alias octi-build='cd ~/Desktop/octopus-tms-b && ./gradlew clean build'
alias octi-e2e='cd ~/Desktop/octopus-tms-b && npm run test:e2e'
alias octi-screenshot='cd ~/Desktop/octopus-tms-b && npm run screenshots'

# To install these aliases, run:
# source ~/Desktop/octopus-tms-b/setup-aliases.sh
# Or add to your shell config:
# echo "source ~/Desktop/octopus-tms-b/setup-aliases.sh" >> ~/.zshrc