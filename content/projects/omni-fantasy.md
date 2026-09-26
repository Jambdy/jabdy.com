+++
title = "Omni Fantasy"
description = "An AI fantasy football manager, with the league rules enforced in code."
date = "2026-09-13"
tags = ["Python", "Gemini", "AWS"]
author = "James Abdy"
ai_generated = true
visual = "forest"
monogram = "4th & AI"
+++

I built a fantasy football manager that can suggest lineup changes and waiver moves for an ESPN league. It reads the actual scoring rules, roster, opponents, and available players before asking Gemini what to do.

The model handles the judgment calls. Python handles slot eligibility, roster limits, and whether a proposed move is legal. A confident explanation does not make an extra starting running back fit in the lineup.

Scheduled runs check the lineup around game days, with a separate window for roster changes. Every proposal goes into a journal, including rejected moves and advice that was never applied. A weekly grading job compares the proposed lineup against what actually happened.

That last part is the interesting bit. Getting an AI to offer fantasy advice is easy. Keeping a record of whether the advice helped is more useful.

The source is private.
