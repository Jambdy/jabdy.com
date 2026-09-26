+++
title = "Omni Life Manager"
description = "Daily habit tracking, health history, and summaries from the other Omni apps."
date = "2026-03-10"
tags = ["React", "Python", "AWS"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni.png"
visual = "lime"
card_summary = "A replacement for my daily tracking spreadsheet, with logs for habits, weight, exercise, and notes. It brings in Fitbit sleep and activity, food summaries, and phone usage so I can browse the information together."
+++

Omni is a personal tracking app that started as a replacement for a Google Sheet. It has a daily log for habits, weight, exercise, and notes, with history and charts for looking back over longer periods. The existing spreadsheet history was imported, so switching to the app did not mean losing the older records. A phone-friendly form is also a less awkward way to enter a day’s information than editing individual spreadsheet cells.

The daily log covers things such as drinks, flossing, exercise, and weight, along with free-form notes and journal entries. There are reminders to fill it in and views for reviewing previous days. The aim is to make keeping a consistent record reasonably convenient. Collecting all this information has proved easier than reliably doing something useful with it.

Omni also brings together information from several of the other projects on this site. Fitbit supplies sleep and activity, [Omni Phone](/projects/omni-phone/) sends screen-time data, and [Omni Nutrition](/projects/omni-nutrition/) provides daily food summaries. This makes it possible to look at habits and activity in the same place instead of opening a different app for every question.

The app is a React and TypeScript progressive web app, with a Python backend on AWS Lambda, DynamoDB storage, and Google sign-in through Cognito. It is a personal tool with a private repository. [Open Omni](https://life.jabdy.com); sign-in is required.
