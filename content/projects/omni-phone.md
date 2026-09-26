+++
title = "Omni Phone"
description = "Android screen time collected automatically and synced into Omni."
date = "2026-06-06"
tags = ["Android", "Screen time", "Omni"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-phone.png"
icon_padded = true
visual = "blue"
monogram = "Screen / time"
+++

Omni Phone collects Android app usage and sends daily totals to the main Omni app. It saves the manual step of connecting a phone to a computer whenever I want to look at screen time.

The tricky part was measuring the time correctly. Daily usage buckets can overlap the period being requested. The collector now works from foreground events instead, so the total represents time spent in an app during the day being measured.

It also resolves package names into readable app labels and refreshes its login token so a nightly sync does not depend on opening the app first.

This is a small native companion to the web apps. The useful output is the per-app breakdown alongside the rest of my daily logs. The source is private.
