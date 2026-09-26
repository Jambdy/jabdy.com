+++
title = "Omni Nutrition"
description = "Food logging through search, barcodes, or a description of what I ate."
date = "2026-03-11"
tags = ["React", "Gemini", "Nutrition"]
author = "James Abdy"
ai_generated = true
visual = "peach"
monogram = "kcal"
+++

Omni Nutrition is a calorie and macro tracker. It supports food search through OpenFoodFacts, barcode scanning, custom foods, and recipes.

For meals that are easier to describe than look up, Gemini turns a natural-language entry into a food log. That is convenient, though it still leaves the usual problem of estimating what actually went into a meal.

Daily summaries sync to the main Omni app. Fitbit activity provides the other side of the energy-balance view, so food and activity do not have to stay in separate apps.

The stack is React, Python Lambda, and DynamoDB, with the same sign-in system as the other Omni apps.

[Open Omni Nutrition](https://nutrition.jabdy.com). Sign-in is required; the source is private.

<figure class="article-image">
<img src="/img/projects/nutrition.jpg" alt="Public sign-in screen at nutrition.jabdy.com" loading="lazy" width="1200" height="750">
<figcaption>Live site, September 2026. The app requires sign-in, so this capture shows its public entry screen.</figcaption>
</figure>
