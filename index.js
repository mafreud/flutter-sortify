const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');

// 1. async - awaitを使えるようにする
// 2. Cultyaでも動くか確認
// 3. flutter analyzeを実行

async function run() {
  try {
    const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'))
    const result = await format(workingDirectory);
    console.log(result);

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
  await exec.exec('pwd');
  await exec.exec('ls');
  console.log('flutter pub get');
  await exec.exec('flutter pub run get');
  console.log('sort imports');
  const result = await exec.exec('flutter pub run import_sorter:main -e');
  

  return result;
}

run();