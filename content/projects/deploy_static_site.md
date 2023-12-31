+++
title = "Deploy Static Website"
description = "Use GitHub Actions to deploy static website to AWS"
tags = [
"AWS",
"Personal Project"
]
date = 2023-09-17
author = "James Abdy"
+++

This website is a static website built using Hugo ([instruction to create site] (https://gohugo.io/getting-started/quick-start/)). Static websites can be hosted from AWS S3 buckets ([instructions to set up S3 static site] (https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)). In this post, I'll briefly review how to deploy the site to S3 using GitHub Actions.

## Setup GitHub Actions

Create a repository in GitHub and upload the Hugo files. To set up Github Actions, add a directory called .github/workflows. Next add a yaml file to the directory (ex. deploy.yml). The action will be triggered when a push to the main branch occurs with the code below:

~~~
on:
  push:
    branches: [main]
~~~

There is a Hugo Setup Action that can be used to help build the Hugo static site. This site is built with Hugo version 0.41, but 'latest' can also be used.

~~~
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.41'
~~~ 

This step calls the command to build the Hugo site:

~~~
      - name: build
        run: hugo
~~~

The site content generated by the build command is put in the /public directory. These are the files that need to be uploaded to the S3 bucket. This can be done with the "aws s3 sync" command as shown below:

~~~
      - name: Upload to S3
        run: |
          aws s3 sync ./public s3://jabdy.com
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: 'us-east-1'
~~~

The name of the S3 bucket is jabdy.com. The AWS credentials for the account can be set as GitHub secrets as shown in the screenshot below (AWS credentials should never be hardcoded in repositories). 

<img class="center" style="width:800px" src="/img/deploy_static_site/github_secrets.png">

A potential enhancement would be to use this action to implement the AWS credentials: https://github.com/aws-actions/configure-aws-credentials. This implementation would be more secure as the credentials would have a limited lifespan.

The complete GitHub Actions yaml file for this repo is:

~~~
name: Build and deploy site to AWS
on:
  push:
    branches: [main]
jobs:
  build_deploy:
    name: Build site and deploy to AWS
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.41'
      - name: build
        run: hugo
      - name: Upload to S3
        run: |
          aws s3 sync ./public s3://jabdy.com
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_DEFAULT_REGION: 'us-east-1'
~~~

## Conclusion

GitHub Actions are a quick/cheap way to enable continuous deployment for static sites. There is no cost to use GitHub actions for public repositories. 

[Link to GitHub project] (https://github.com/Jambdy/jabdy.com)   

## References

https://docs.github.com/en/actions/quickstart

https://github.com/peaceiris/actions-hugo

https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions