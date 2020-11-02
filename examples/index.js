const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');
const inquirer = require('inquirer');
const textDemo = require('./text');
const imageDemo = require('./image');
const videoDemo = require('./video');
const animateDemo = require('./animate');

const initCommand = () => {
  inquirer
    .prompt([
      {
        type: 'rawlist',
        message: 'Please select the demo you want to run:',
        name: 'val',
        choices: [
          {
            name: 'Picture animation video',
            value: 'image',
          },
          {
            name: 'Multiple text combinations',
            value: 'text',
          },
          {
            name: 'Animation effect display',
            value: 'animate',
          },
          {
            name: 'Video animation case',
            value: 'video',
          },
          {
            name: 'Clear all caches and videos',
            value: 'clear',
          },
        ],
      },
    ])
    .then(runDemo);
};

const runDemo = answer => {
  switch (answer.val) {
    case 'image':
      printRestartInfo();
      imageDemo();
      break;

    case 'text':
      printRestartInfo();
      textDemo();
      break;

    case 'animate':
      printRestartInfo();
      animateDemo();
      break;

    case 'video':
      printRestartInfo();
      videoDemo();
      break;

    case 'clear':
      clearAllFiles();
      break;
  }
};

const printRestartInfo = () =>
  console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));

const clearAllFiles = () => {
  fs.remove(path.join(__dirname, './output'));
  fs.remove(path.join(__dirname, './cache'));
};

initCommand();
