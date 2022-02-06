const core = require('@actions/core');
const github = require('@actions/github');
const path = require('path');
const exec = require('@actions/exec');
const fs = require('fs');

try {
  const workingDirectory = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('working-directory'))
  console.log(workingDirectory);
  await format(workingDirectory);
//   // `who-to-greet` input defined in action metadata file
//   const nameToGreet = core.getInput('who-to-greet');
//   console.log(`Hello!! ${nameToGreet}!`);
//   const time = (new Date()).toTimeString();
//   core.setOutput("time", time);
//   // Get the JSON webhook payload for the event that triggered the workflow
//   const payload = JSON.stringify(github.context.payload, undefined, 2)
//   console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
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
  
    const args = ['format', '--output=none'];
    const lineLength = core.getInput('line-length');
  
    if (lineLength) {
      args.push('--line-length');
      args.push(lineLength);
    }
  
    args.push('.');
  
    await exec.exec('dart', args, options);
    
    let warningCount = 0;
    const lines = output.trim().split(/\r?\n/);
  
    for (const line of lines) {
      if (!line.endsWith('.dart')) continue;
      const file = line.substring(8); // Remove the "Changed " prefix
  
      console.log(`::warning file=${file}::Invalid format. For more details, see https://dart.dev/guides/language/effective-dart/style#formatting`);
      warningCount++;
    }
  
    return warningCount;
  }