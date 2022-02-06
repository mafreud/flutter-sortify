const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');

// 1. 実行結果のアウトプットを取得したい

async function run() {
  try {
    await format();
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function format() {

  let myOutput = '';
let myError = '';

const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'))
const options = { cwd: workingDirectory };
options.listeners = {
  stdout: (data) => {
    myOutput += data.toString();
  },
  stderr: (data) => {
    myError += data.toString();
  }
};

  await exec.exec('flutter analyze');
  await exec.exec('pub run import_sorter:main -e');
  await exec.exec('git add .');
  await exec.exec('git config --global user.email \'freud427@gmail.com\'');
  await exec.exec('git config --global user.name \'flutter-sortify\'');
  await exec.exec('git commit -m \'Sortify!\'',options);
  console.log(myOutput);
  console.log(myError);
  await exec.exec(`git push origin ${process.env.GITHUB_REF_NAME}`);
  return
}

run();