const core = require('@actions/core');
const exec = require('@actions/exec');
// 1. 変更内容をコミット

async function run() {
  try {
    await format();
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function format() {
  await exec.exec('flutter analyze');
  await exec.exec('pub run import_sorter:main -e');
  const branchName = await exec.exec('git branch --show-current');
  console.log(branchName);
  await exec.exec('git add .');
  await exec.exec('git config --global user.email \'freud427@gmail.com\'');
  await exec.exec('git config --global user.name \'flutter-sortify\'');
  await exec.exec('git commit -m \'Sortify!\'');
  await exec.exec('git push origin actions-test');
  return
}

run();