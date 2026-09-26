+++
title = "Podium"
description = "Create ranked lists, tier lists, brackets, and ratings, with a film library import."
date = "2026-07-21"
tags = ["React", "Python", "Gemini"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/podium.png"
visual = "lavender"
card_summary = "A place to organize rankings of films or anything else. Choose a list, tiers, ratings, or a tournament bracket; add images; or start from the films already rated in an imported IMDb library."
+++

Podium is an app for making rankings and lists. It supports ordered lists, tier lists, tournament brackets, and individual ratings, so the same subject can be approached in several ways. A straight ranking is useful when the order is already clear; a bracket turns it into a series of smaller comparisons. Whether this is a productive use of an evening depends on how much you care about the list.

Items can have images found through Wikipedia, uploaded directly, or added by URL. Gemini can also generate an initial set of items from a list title, which gives a starting point to edit instead of filling everything in manually. The list’s subject helps the image search distinguish between things with similar names.

The film library supports importing IMDb ratings. That lets a film list or bracket start from titles already watched and rated, instead of relying on whatever comes to mind at the time. Lists can also be shared, so the result is not limited to sitting in a personal spreadsheet.

The app uses a React and TypeScript frontend, a Python backend on AWS Lambda, DynamoDB, and S3 for images. [Open Podium](https://podium.jabdy.com). Sign-in is required, and the repository is private.
