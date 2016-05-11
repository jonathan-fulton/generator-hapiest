'use strict';

const _ = require('lodash');
const Async = require('async');
const Path = require('path');
const generators = require('yeoman-generator');
const inquirer = require('../../lib/customInquirer');

module.exports = generators.Base.extend({
    constructor: function() {
        generators.Base.apply(this, arguments);
    },

    prompting: function() {
        const done = this.async();

        var prompts = [{
            type: 'input',
            name: 'className',
            message: 'Name for the VO class (CamelCase):'
        }, {
            type: 'directory',
            name: 'directory',
            message: 'Select the directory to save your VO:',
            basePath: '.'
        }];

        const self = this;
        Async.auto({
            prompt: (next) => {
                inquirer.prompt(prompts, (answers) => {
                    next(null, answers);
                });
            },
            promptProperties: ['prompt', (results, next) => {
                Internals.promptProperties([], next);
            }],
            createVOFile: ['promptProperties', (results, next) => {
                const answers = results.prompt;
                const className = _.upperFirst(_.camelCase(answers.className));
                const fileName = _.lowerFirst(className) + '.js';
                const directory = answers.directory;
                const destinationPath = Path.join(directory, fileName);
                const properties = results.promptProperties;
                const templateParameters = {
                    voClassName: className,
                    voClassProperties: properties
                };
                self.log(answers);
                self.log(templateParameters);
                self.log(destinationPath);

                self.log("TemplateRoot: " + self.sourceRoot());
                self.log("DestinationRoot: " + self.destinationRoot());

                self.template('baseVO.js', destinationPath, templateParameters);
                next();
            }]
        }, (err, results) => {
            done();
        });
    }
});

class Internals {

    /**
     * @param {array} properties
     * @param {func} next
     */
    static promptProperties(properties, next) {
        const prompt = [{
            type: 'input',
            name: 'propertyName',
            message: 'Property (blank to end)'
        }, {
            type: 'input',
            name: 'propertyType',
            message: 'Property type',
            default: 'any'
        }];

        inquirer.prompt(prompt, (answers) => {
           if (answers.propertyName === '') {
               next(null, properties);
           } else {
               properties.push({
                   propertyName: answers.propertyName,
                   propertyType: answers.propertyType
               });
               Internals.promptProperties(properties, next);
           }
        });
    }
}