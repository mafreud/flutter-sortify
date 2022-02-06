const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const exec = require('@actions/exec');
const fs = require('fs');

async function run() {
    try {
        const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'));
        console.log(workingDirectory);
    }
    catch (error) {
      core.setFailed(error.message);
    }
  }
run();


