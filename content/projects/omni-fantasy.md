+++
title = "Letting AI Call the Plays"
description = "Fantasy football lineup suggestions, roster moves, and reports on the results."
date = "2026-09-13"
tags = ["Python", "Gemini", "AWS"]
author = "James Abdy"
ai_generated = true
visual = "forest"
card_summary = "An ESPN fantasy football assistant that uses the league\u2019s actual rules, roster, and available players. It checks lineups around game days, considers roster changes, and keeps a record of whether its recommendations helped."
image = "/img/projects/omni-fantasy.svg"
image_alt = "Football playbook diagram with player positions and routes around a football."
+++

Omni Fantasy is an assistant for managing an ESPN fantasy football team. It reads the league’s scoring rules, current roster, opponents, and available players, then uses Gemini to suggest lineup and roster changes. This gives it the context of the actual league, including its roster restrictions, instead of asking for general advice about which players might have a good week.

Scheduled runs check the lineup around game days, while a separate run can consider additions and drops. The recommendations come with explanations, and the app can apply changes as well as produce a report. Before a move is submitted, the code checks whether the proposed lineup or roster is legal. Notifications summarize the decisions and flag failures that would prevent the scheduled runs from working.

The app keeps a journal of its proposals, including advice that was rejected or never applied. After the games, a grading report compares the suggested lineups with the results and looks at points left on the bench. That history is useful for separating a plausible explanation from advice that actually helped. I am not assuming the computer is better at fantasy football; this at least gives me a way to check.

This project is a Python application running on AWS Lambda with scheduled invocations, Gemini for recommendations, and S3 for the decision history. It has command-line tools and reports rather than a separate website. The repository is private.
