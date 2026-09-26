+++
title = "Podium"
description = "Ranked lists, tier lists, and brackets for opinions that needed more structure."
date = "2026-07-21"
tags = ["React", "Python", "Gemini"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/podium.png"
visual = "lavender"
monogram = "1 / 2 / 3"
+++

Podium is a place to rank things. It supports ordered lists, tiers, brackets, and ratings, depending on how seriously I want to take an opinion about a sandwich or a film.

Items can pull images from Wikipedia, use an uploaded image, or start from a list generated with Gemini. The image lookup turned out to need more care than expected: finding the right film is different from finding an album with the same name. The list title helps disambiguate the search, and a retry can try another image before moving on to another subject.

There is also an IMDb library import, so I can build lists from films I have already rated instead of remembering them all from scratch.

It uses a React frontend, a Python Lambda backend, and DynamoDB. The source is private.

[Open Podium](https://podium.jabdy.com). Sign-in is required.
