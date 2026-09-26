+++
title = "Omni Finance"
description = "Household budgets, spending trends, net worth, and retirement scenarios."
date = "2026-04-20"
tags = ["React", "Lunch Money", "AWS"]
author = "James Abdy"
ai_generated = true
icon = "/img/projects/omni-finance.png"
visual = "forest"
card_summary = "A dashboard around Lunch Money for reviewing shared spending and longer-term finances. It includes transaction ownership, budget comparisons, account history, and retirement projections in one place."
+++

Omni Finance is a household finance dashboard built around the transaction data in Lunch Money. It adds views for shared spending, budgets, investments, and longer-term planning. Lunch Money remains the source for transactions, while this app provides a way to organize and review them around the questions I want to answer.

Transactions can be tagged by owner or marked as shared. Budget views compare spending with targets, and trend views make it possible to look across months and years instead of only the current month. Amazon order imports add more useful descriptions to purchases that otherwise appear as fairly uninformative Amazon charges. There is also a discretionary spending view for comparing the portions assigned to each person.

Beyond spending, the app includes account snapshots, net worth, and investment information. A retirement view projects possible outcomes from assumptions about saving, spending, and withdrawals. It is useful for exploring how those assumptions change the picture, even if changing a number in a form does not make retirement arrive any sooner.

The frontend uses React and TypeScript. The backend uses Python on AWS Lambda, DynamoDB, and integrations with the financial data sources. [Open Omni Finance](https://finance.jabdy.com). Sign-in is required, and the repository is private.
