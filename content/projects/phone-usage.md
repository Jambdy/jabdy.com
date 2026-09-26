+++
title = "Phone Usage Dashboard"
description = "A local dashboard for seeing where Android screen time goes."
date = "2025-10-15"
tags = ["Python", "Next.js", "Android"]
author = "James Abdy"
ai_generated = true
visual = "lavender"
monogram = "Hours / lost"
+++

Before the Omni Phone app, I built a local dashboard for Android usage data. A Python script connects over ADB, collects app usage statistics, and saves them as JSON.

A Next.js frontend reads those files and shows total screen time, per-app breakdowns, and charts. Everything stays on the computer; there is no cloud backend for this project.

The tradeoff is that collection requires connecting the phone and running the script. The later [Omni Phone](/projects/omni-phone/) project makes collection automatic, but this version keeps the setup simple and the data local.

[Source on GitHub](https://github.com/Jambdy/phone-usage).
