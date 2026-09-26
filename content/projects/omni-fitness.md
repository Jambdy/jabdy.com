+++
title = "Omni Fitness"
description = "Workout logging with exercise history, reusable routines, and rest timers."
date = "2026-05-11"
tags = ["React", "Local-first", "Android"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-fitness.png"
visual = "peach"
card_summary = "A workout tracker with sets, weights, reps, personal records, and templates. It keeps years of imported FitNotes history and supports offline logging, with an Android version for use at the gym."
+++

Omni Fitness is a workout tracker for recording exercises, weights, repetitions, and sets. It includes an exercise library and a calendar of previous workouts, with years of history imported from FitNotes. That makes it possible to look back at an exercise’s progress without keeping the old app around just for its records.

Workouts can be saved as templates and reused, or a completed day can become the starting point for a new routine. The app tracks personal records and lets exercises in the current log be reordered. These are fairly ordinary workout-tracker features, but having them together means less setup when repeating a routine and a useful reference for what happened last time.

There is a rest timer, including a countdown in the Android notification shade, so it can be checked while the app is in the background. Logging works locally and syncs afterward, which is useful when the gym connection is unreliable. The main goal is to make recording a workout easy enough that I will actually keep doing it.

The app uses React and TypeScript, with Capacitor for Android and a Python backend on AWS Lambda backed by DynamoDB. [Open Omni Fitness](https://fitness.jabdy.com). Sign-in is required, and the repository is private.
