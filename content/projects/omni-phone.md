+++
title = "Omni Phone"
description = "Automatic Android screen-time collection for the Omni dashboard."
date = "2026-06-06"
tags = ["Android", "Screen time", "Omni"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-phone.png"
icon_padded = true
visual = "blue"
card_summary = "An Android companion that records time spent in each app and syncs daily usage to Omni. It runs in the background so screen-time history does not depend on manually connecting the phone or exporting reports."
+++

Omni Phone is a small Android app that collects screen-time information and sends it to [Omni](/projects/omni/). It records how much time was spent in individual apps each day, so phone usage can be reviewed alongside the rest of the daily history. The app labels the entries with recognizable app names rather than Android package identifiers.

The collection and sync run in the background. Once configured, the phone does not need to be connected to a computer, and the app does not need to be opened for each upload. The login is refreshed for later syncs, which is useful for something intended to quietly maintain a record instead of become another daily task.

In Omni, the data provides a daily total and an app-by-app breakdown. This gives a more specific answer to where screen time went than a single number for the whole phone. I cannot claim that displaying the breakdown reduces it, but it makes the amount harder to ignore.

The collector is a native Android app written in Kotlin, using Android’s usage information and background work support. It syncs with the existing Omni backend rather than providing another standalone dashboard. The repository is private.
