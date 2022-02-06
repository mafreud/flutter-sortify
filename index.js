const core = require('@actions/core');
const exec = require('@actions/exec');
// 1. ブランチ名のハードコーディングを修正


async function run() {
  try {
    await format();
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function format() {
  await exec.exec('flutter analyze');
  const result = await exec.exec('pub run import_sorter:main -e');
  console.log(`result: ${result}`);
  await exec.exec('git add .');
  await exec.exec('git config --global user.email \'freud427@gmail.com\'');
  await exec.exec('git config --global user.name \'flutter-sortify\'');
  await exec.exec('git commit -m \'Sortify imports!\'');
  await exec.exec(`git push origin ${process.env.GITHUB_REF_NAME}`);
  return
}

run();