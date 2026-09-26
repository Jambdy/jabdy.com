+++
title = "Questrade \u2192 Lunch Money"
description = "A small integration to get investment activity into the rest of the budget."
date = "2026-01-09"
tags = ["JavaScript", "AWS", "APIs"]
author = "James Abdy"
ai_generated = true
visual = "blue"
monogram = "A \u2192 B"
+++

This project imports Questrade investment account activity into Lunch Money. It fills a gap where the usual account connection was not available.

A scheduled Lambda reads trades, dividends, and cash transactions, maps them into Lunch Money’s transaction format, and checks for duplicates before importing them. Token refresh and API errors are part of the job too; otherwise it would work once and become another manual chore.

There is no frontend. The result shows up in the tool I already use to look at finances.

[Source on GitHub](https://github.com/Jambdy/questrade-lunchmoney-sync).
