const core = require('@actions/core');
const github = require('@actions/github');

// 1. async - awaitを使えるようにする

async function hello() {
  return await Promise.resolve("Hello");
};

hello();