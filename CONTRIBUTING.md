# Contributing

These instructions will get you a copy of the project up and running on your
local machine for development and testing purposes. You'll also find information
on making a pull request.

## Overview

[Prerequisites](#prerequisites)  
[Installing](#installing)  
[Making Changes](#making-changes)  
[Documentation](#documentation)  
[Testing](#testing)  
[Making a Pull Request](#making-a-pull-request)  

## Prerequisites

For this project, you'll need to have Node, Git, and Firebase set up on your
local machine.

- [Setup Firebase CLI](https://firebase.google.com/docs/cli)
- [Install Node](https://nodejs.org/en/download/)
- [Install Git](https://git-scm.com/downloads)

## Installing

Follow the steps below to get your development enviroment set up.

1. Open the terminal and and run the following: `git clone https://github.com/chad-app/chadcloud.git`.

2. Run `npm install` to install the project dependencies.

## Making Changes

1. Retreive the configuration files from an administrator.
2. Run `npm run dev` to start the server. Nodemon will automatically restart the
   server as you make your changes.
3. Make your changes in the `functions` directory. Configuration settings can be
   updated under the `config` and `functions/config` directories.
4. Run `npm run serve` to build and view your changes in a local production Firebase environment.

## Documentation

Following [JSDoc](http://usejsdoc.org/) standards, be sure to document any functions, classes, and other
code you write. It will be reviewed by a reviewer during your code review, and
your pull request will be denied if any code is improperly documeted.

For an overview of our JavaScript style guide, go to https://standardjs.com.

## Testing

When you're ready to test your changes, you have two options:

1. Run `npm test` in your project directory. This run your tests, as well as all
  the tests in the tests in the `tests` directory.

2. Run `jest <test_pattern>`. This will run your test file alone.

- Example: `jest firebase`

For generating test data, use [Mockaroo](https://mockaroo.com/).

## Making a Pull Request

**Note: Before creating a new branch and creating a pull request for your
changes, make sure your build passes all unit tests. If you need help, please
create a test file and leave a comment in the test body, making note of any
issues in their respective files. Make sure to label your pull request "help wanted."**

If you're ready to have your changes reviewed, make sure your code is well
documented and create a branch for your changes.

Branch Naming Convention: `<your_initials>/`, followed by: `feature-`, `issue-`, `hotfix-`, or `release-`.

For example:

```bash
git checkout -b `ld/feature-docs`
git commit -am "added documentation"
git push
```

If you need to make additional changes, checkout your branch (if
necessary), commit, and then push your new changes.

When you're ready to make pull request, make sure to use [this template][1].

[1]: .github/PULL_REQUEST_TEMPLATE/pull_request_template.md
