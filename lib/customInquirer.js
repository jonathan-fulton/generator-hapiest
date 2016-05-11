'use strict';

// Note, requires v0.12.0 instead of v1.0.0+ b/c inquirer-directory doesn't have a Promisified interface
const inquirer = require('inquirer');
inquirer.registerPrompt('directory', require('inquirer-directory'));

module.exports = inquirer;
