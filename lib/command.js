const { exec } = require('child_process');
const chalk = require('chalk');
const { bindNodeCallback } = require('rxjs');

module.exports = (str) => {
  bindNodeCallback(exec)(str, {
    cwd: process.cwd(),
  })
    .subscribe({
      next: (info) => {
        const msg = info.join('');
        if (msg !== '') {
          console.log(msg);
        }
      },
      error: (error) => {
        console.log(chalk.red(error));
      },
    });
};
