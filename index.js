const core = require('@actions/core');
const exec = require('@actions/exec');
const path = require('path');

async function run() {
  const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'))
  try {
    await exec.exec('flutter analyze');
    await installImportSorter(workingDirectory);
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
  const args = ['deps | grep import_sorter'];
  await exec.exec('pub', args, options);
  const result = output.includes('import_sorter');
  if(result){
    console.log('import_sorter is already installed');
  } else{
    await exec.exec('flutter pub add import_sorter');
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
  const args = ['status'];
  await exec.exec('pub run import_sorter:main -e');
  await exec.exec('git',args,options);
  const result = output.includes('nothing to commit, working tree clean');
  if(result){
    console.log('nothing to commit');
    return;
  }
  await exec.exec('git add .');
  await exec.exec('git config --global user.email \'freud427@gmail.com\'');
  await exec.exec('git config --global user.name \'flutter-sortify\'');
  await exec.exec('git commit -m \'Sortify!\'');
  await exec.exec(`git push origin ${process.env.GITHUB_REF_NAME}`);
  return
}

run();