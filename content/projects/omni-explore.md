+++
title = "Omni Explore"
description = "Save places, share maps, and identify plants and animals from photos."
date = "2026-09-11"
tags = ["React", "Maps", "Gemini"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-explore.png"
visual = "lime"
card_summary = "A map for collecting places to visit and things found along the way. Save locations with photos and notes, organize them into shared layers, and use photo identification to build a collection of nature observations."
+++

Omni Explore is a map-based app for saving places and recording things found outdoors. A saved location can include a title, photos, notes, and tags, so it can hold more context than a bare pin. It is useful for keeping track of places to return to, organizing locations for a trip, or remembering what was interesting about somewhere after leaving it.

Places are organized into layers that can be shown, hidden, and shared. That lets a collection of locations stay together without putting every saved place on the map at once. A searchable library provides another way to browse the same information, and a saved item can be shown on the map when its location matters. Shared layers let more than one person contribute to the same collection.

The photo identification feature uses Gemini to suggest what a photographed plant or animal might be. The observation keeps its location and photos alongside the suggested identification, and a nature collection makes it possible to browse the finds together. It is a way to put a name to something encountered on a walk and keep a record of it, rather than leave another unidentified tree photo in the camera roll.

The frontend is a React and TypeScript progressive web app using Google Maps. A Python API runs on AWS Lambda, with DynamoDB for saved records and S3 for photos. [Open Omni Explore](https://explore.jabdy.com). Sign-in and access are required, and the repository is private.
