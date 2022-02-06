const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');

// 1. 変更内容をコミット

async function run() {
  try {
    const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'))
    await format(workingDirectory);

  } catch (error) {
    core.setFailed(error.message);
  }
}

async function format(workingDirectory) {
  let output = '';

  const options = { cwd: workingDirectory };
  options.listeners = {
    stdout: (data) => {
      output += data.toString();
    },
    stderr: (data) => {
      output += data.toString();
    }
  };
  await exec.exec('flutter analyze');
  await exec.exec('pub run import_sorter:main -e');
  await exec.exec('git add .');
  await exec.exec('git config --global user.email \'freud427@gmail.com\'');
  await exec.exec('git config --global user.name \'flutter-sortify\'');
  await exec.exec('git commit -m \'Sortify!\'');
  await exec.exec('git status');

  return;
}

run();