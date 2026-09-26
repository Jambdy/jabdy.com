+++
title = "Omni Nutrition"
description = "A food diary with calorie and macro totals, recipes, and barcode scanning."
date = "2026-03-11"
tags = ["React", "Gemini", "Nutrition"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-nutrition.png"
visual = "peach"
card_summary = "Log food through search, a barcode, or a plain-language description. Custom foods and recipes cover repeated meals, while daily summaries connect the food diary with activity and the main Omni app."
+++

Omni Nutrition is a food diary for keeping track of calories and macronutrients. Food can be entered through a search, a barcode scan, or a description of a meal. The search uses OpenFoodFacts, while custom foods provide a way to save items that are missing from the database or need different information.

Recipes make repeated meals easier to log without entering each ingredient again. For meals that are simpler to describe than look up, Gemini can turn a natural-language entry into a food log. That is convenient when there is no exact packaged item to select, though the result still depends on how accurately the meal and its portions are described.

The app sends daily summaries to [Omni](/projects/omni/), so food totals can sit alongside the rest of the daily record. Fitbit activity is also available for looking at food intake and activity together. The purpose is to reduce the amount of repeated entry needed to maintain a useful log, rather than make food tracking another project in itself.

It is a React and TypeScript web app with a Python backend on AWS Lambda and DynamoDB storage. It shares Google sign-in with the other Omni apps. [Open Omni Nutrition](https://nutrition.jabdy.com). Sign-in is required, and the repository is private.
