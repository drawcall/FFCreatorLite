const path = require('path');
const fs = require('fs-extra');
const colors = require('colors');
const inquirer = require('inquirer');

const printRestartInfo = () =>
  console.log(colors.green(`\n --- You can press the s key or the w key to restart! --- \n`));

const clearAllFiles = () => {
  fs.remove(path.join(__dirname, './output'));
  fs.remove(path.join(__dirname, './cache'));
};

const choices = [
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
    name: 'Scene transition effect',
    value: 'transition',
  },
  {
    name: 'Video animation demo',
    value: 'video',
  },
  {
    name: 'Push live rtmp stream',
    value: 'live',
  },
  {
    name: 'Clear all caches and videos',
    value: 'clear',
    func: clearAllFiles,
  },
  new inquirer.Separator(),
];

const runDemo = answer => {
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    if (choice.value === answer.val) {
      if (answer.val !== 'clear') printRestartInfo();
      choice.func();
      break;
    }
  }
};

const initCommand = () => {
  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i];
    choice.name = `(${i + 1}) ${choice.name}`;
    if (choice.type !== 'separator' && choice.value)
      choice.func = choice.func || require(path.join(__dirname, `./${choice.value}`));
  }

  inquirer
    .prompt([
      {
        type: 'list',
        message: 'Please select the demo you want to run:',
        name: 'val',
        choices,
        pageSize: choices.length,
        validate: function(answer) {
          if (answer.length < 1) {
            return 'You must choose at least one topping.';
          }
          return true;
        },
      },
    ])
    .then(runDemo);
};

initCommand();
