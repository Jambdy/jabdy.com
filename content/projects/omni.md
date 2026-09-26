+++
title = "Omni Life Manager"
description = "The spreadsheet replacement that grew into a collection of personal tools."
date = "2026-03-10"
tags = ["React", "Python", "AWS"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni.png"
visual = "lime"
monogram = "Day by day"
+++

Omni started as a replacement for a Google Sheet. I wanted a quicker way to record daily habits, weight, exercise, and notes, then browse the history without managing a spreadsheet on my phone.

The frontend is a React PWA. A Python backend runs on Lambda, stores records in DynamoDB, and uses Cognito for Google sign-in. Existing spreadsheet data could be imported instead of starting the history over.

It grew into the place where several smaller apps meet. Fitbit brings in sleep and activity. Omni Phone adds screen time, and Omni Nutrition sends daily food summaries. Monthly rollups make longer-term charts cheaper to load than reading every daily record again.

The point is to have the data together. Whether collecting more of it makes me behave any differently is a separate project.

[Open Omni](https://life.jabdy.com). Sign-in is required; the source is private.
