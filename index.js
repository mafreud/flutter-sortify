const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');

async function run() {
  const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'))
  try {
    await exec.exec('flutter pub get');
    await installImportSorter(workingDirectory);
    await dartFix();
    await format(workingDirectory);
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function installImportSorter(workingDirectory){
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
  const args = ['deps'];
  await exec.exec('pub', args, options);
  const result = output.includes('import_sorter');
  if(result){
    console.log('import_sorter is already installed');
  } else{
    await exec.exec('flutter pub add import_sorter');
  }
}

async function dartFix() {
  await exec.exec('dart fix --apply');
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
  const args = ['status'];
  await exec.exec('pub run import_sorter:main -e');
  await exec.exec('git',args,options);
  const result = output.includes('nothing to commit, working tree clean');
  if(result){
    return;
  }
  let branchName = '';
  const triggerEvent = process.env.GITHUB_EVENT_NAME;
  console.log('triggerEvent',triggerEvent);
  if(triggerEvent==='push'){
    branchName = process.env.GITHUB_REF_NAME;
  }
  if(triggerEvent==='pull_request'){
    branchName = process.env.GITHUB_HEAD_REF;
  }

  await exec.exec('git add .');
  await exec.exec('git config --global user.email \'freud427@gmail.com\'');
  await exec.exec('git config --global user.name \'flutter-sortify\'');
  await exec.exec('git commit -m \'Sortify!\'');
  await exec.exec(`git push origin ${branchName}`);
  return;
}

run();