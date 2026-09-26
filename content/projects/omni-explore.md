+++
title = "Omni Explore"
description = "A shared map for places worth saving and things worth identifying."
date = "2026-09-11"
tags = ["React", "Maps", "Gemini"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-explore.png"
visual = "lime"
monogram = "Explore"
+++

I wanted one map for places to revisit and things I found along the way. Omni Explore lets me save a place, photograph a tree or bird, and have Gemini suggest an identification.

Each observation has the same basic information: location, title, photos, notes, and a kind. The details depend on what it is. A tree can have a scientific name; a restaurant can have a cuisine. Adding another kind does not require rebuilding the map or changing the database layout.

Saved places live in layers, which also control visibility and sharing. There is a searchable library and a nature collection for browsing observations without hunting for individual pins.

The frontend is a React PWA over Google Maps. A Python API runs on Lambda, with DynamoDB for observations and S3 for photos.

[Open Omni Explore](https://explore.jabdy.com). Sign-in and access are required; the source is private.
