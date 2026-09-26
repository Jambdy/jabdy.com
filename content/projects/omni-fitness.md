+++
title = "Omni Fitness"
description = "A workout log that keeps up between sets, even without a connection."
date = "2026-05-11"
tags = ["React", "Local-first", "Android"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-fitness.png"
visual = "peach"
monogram = "Sets \u00d7 reps"
+++

I built Omni Fitness to log exercises, sets, weights, and reps without waiting for a server after every tap. The app writes locally to IndexedDB and syncs in the background.

It started with years of workout history imported from FitNotes. There is an exercise library, reusable workout templates, personal records, and a rest timer. A day’s log can become a template, which is less tedious than setting up the same workout twice.

The Android version uses Capacitor. Getting the rest timer to behave when the app was in the background took additional work, including a countdown in the notification shade and a completion notification that clears itself.

Most of this project is about small interactions. Logging the next set should take less attention than doing it.

[Open Omni Fitness](https://fitness.jabdy.com). Sign-in is required; the source is private.
