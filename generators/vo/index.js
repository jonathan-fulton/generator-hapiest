'use strict';

const _ = require('lodash');
const Async = require('async');
const Path = require('path');

const generators = require('yeoman-generator');
const inquirer = require('../../lib/customInquirer');

const VoService = require('../../lib/vo/voService');
const VoCreateFileArgsFactory = require('../../lib/vo/VoCreateFileArgsFactory');
const FactoryService = require('../../lib/factory/factoryService');
const FactoryCreateFileArgsFactory = require('../../lib/factory/factoryCreateFileArgsFactory');

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
        }, {
            type: 'confirm',
            name: 'createFactory',
            message: 'Create corresponding factory?',
            default: true
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
                const properties = results.promptProperties;

                const createVoArgs = VoCreateFileArgsFactory.createFromPromptAnswers(this, answers, properties);
                const voFilePath = VoService.createFile(createVoArgs);
                
                if (answers.createFactory) {
                    const createFactoryArgs = FactoryCreateFileArgsFactory.createFromJsObj({
                        generatorContext: this,
                        destinationDirectory: createVoArgs.destinationDirectory,
                        factoryClassName: createVoArgs.className + 'Factory',
                        factoryFunctions: ['createFromJsObj'],
                        associatedVoClassName: createVoArgs.className,
                        associatedVoFileName: Path.basename(voFilePath, '.js'),
                        associatedVoProperties: properties
                    });
                    
                    FactoryService.createFile(createFactoryArgs);
                }

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
            name: 'name',
            message: 'Property (blank to end)'
        }, {
            type: 'input',
            name: 'type',
            message: 'Property type',
            default: 'any'
        }];

        inquirer.prompt(prompt, (answers) => {
           if (answers.name === '') {
               next(null, properties);
           } else {
               properties.push({
                   name: answers.name,
                   type: answers.type
               });
               Internals.promptProperties(properties, next);
           }
        });
    }
}