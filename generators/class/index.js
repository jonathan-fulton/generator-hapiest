'use strict';

const generators = require('yeoman-generator');
const Async = require('async');
const _ = require('lodash');
const Path = require('path');

const inquirer = require('../../lib/customInquirer');

const ClassService = require('../../lib/class/classService');
const ClassFactory = require('../../lib/class/classFactory');
const ClassCreateFileArgsFactory = require('../../lib/class/classCreateFileArgsFactory');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },

    prompting: function() {
        const done = this.async();
        const self = this;

        Async.auto({
            classNameAndDirectory: Async.apply(Internals.promptForClassNameAndDirectory),
            methods: ['classNameAndDirectory', (results, next) => Internals.promptForMethods(next)],
            dependencies: ['methods', (results, next) => Internals.promptForDependencies(next)]
        }, (err, results) => {

            const className = results.classNameAndDirectory.className;
            const directory = results.classNameAndDirectory.directory;
            const methods = results.methods;
            const dependencies = results.dependencies;

            const classObjArgs = {
                name: className,
                methods: methods,
                dependencies: dependencies
            };
            const classObj = ClassFactory.createFromJsObj(classObjArgs);

            const createArgs = ClassCreateFileArgsFactory.create({
                class: classObj,
                destinationDirectory: directory,
                generatorContext: self
            });

            ClassService.createFile(createArgs);

            done();
        });
    }
});

class Internals {
    /**
     * @param {function(err, {className: string, directory: string})} done
     */
    static promptForClassNameAndDirectory(done) {
        var prompts = [{
            type: 'input',
            name: 'className',
            message: 'Class name: '
        }, {
            type: 'directory',
            name: 'directory',
            message: 'Directory: ',
            basePath: '.'
        }];

        inquirer.prompt(prompts, (answers) => {
            done(null, {className: answers.className, directory: answers.directory});
        });
    }

    /**
     * @param {function(err, {className: string, directory: string}[])} done
     */
    static promptForMethods(done) {
        Internals.repeatPrompt(Internals.promptForMethod, done);
    }

    /**
     * @param {function(err, {name: string, type: string, returnType: string, body: string, args:{name: string, type: string}[]}[])} done
     */
    static promptForMethod(done) {
        Async.auto({
            methodName: (next) => {
                const namePrompt = [{
                    type: 'input',
                    name: 'methodName',
                    message: 'Method name (empty to quit): '
                }];
                inquirer.prompt(namePrompt, (answers) => {
                    if (answers.methodName === '') {
                        done(); // Exit everything - we're done!
                    } else {
                        next(null, answers.methodName);
                    }
                });
            },
            methodTypeAndReturnType: ['methodName', function(results, next) {
                const methodName = results.methodName;
                var prompts = [{
                    type: 'input',
                    name: 'returnType',
                    message: `${methodName} return type: `
                }, {
                    type: 'list',
                    name: 'methodType',
                    message: `${methodName} method type: `,
                    choices: ['instance', 'static', 'get', 'set'],
                    default: 'instance'
                }];

                inquirer.prompt(prompts, (answers) => {
                    next(null, {returnType: answers.returnType, methodType: answers.methodType});
                });
            }],
            args: ['methodTypeAndReturnType', (results, next) => {
                Internals.promptForMethodArguments(next);
            }]
        }, (err, results) => {
            const methodName = results.methodName;
            const returnType = results.methodTypeAndReturnType.returnType;
            const methodType = results.methodTypeAndReturnType.methodType;
            const args = results.args || {name: 'arg1', type: 'any'};

            const method = {
                name: methodName,
                type: methodType,
                args: args,
                returnType: returnType,
                body: ''
            };

            done(null, method);
        });
    }

    /**
     * @param {function(err, {name: string, type: string}[])} done
     */
    static promptForMethodArguments(done) {
        Internals.repeatPrompt(Internals.promptForMethodArgument, done);
    }


    static promptForMethodArgument(done) {
        Async.auto({
            argName: (next) => {
                const argNamePrompt = [{
                    type: 'input',
                    name: 'argName',
                    message: 'Argument (empty to quit): '
                }];
                inquirer.prompt(argNamePrompt, (answers) => {
                    if (answers.argName === '') {
                        done(); // Exit everything - we're done!
                    } else {
                        next(null, answers.argName);
                    }
                });
            },
            argType: ['argName', function(results, next) {
                const argName = results.argName;
                var prompts = [{
                    type: 'input',
                    name: 'argType',
                    message: `${argName} type: `
                }];

                inquirer.prompt(prompts, (answers) => {
                    next(null, answers.argType);
                });
            }]
        }, (err, results) => {
            const arg = {
                name: results.argName,
                type: results.argType
            };

            done(null, arg);
        });
    }

    /**
     * @param {function(err, {className: string, directory: string})} done
     */
    static promptForDependencies(done) {
        Internals.repeatPrompt(Internals.promptForDependency, done);
    }

    static promptForDependency(done) {
        Async.auto({
            requireString: (next) => {
                const requireStringPrompt = [{
                    type: 'input',
                    name: 'requireString',
                    message: 'Requires (empty to quit): '
                }];
                inquirer.prompt(requireStringPrompt, (answers) => {
                    if (answers.requireString === '') {
                        done(); // Exit everything - we're done!
                    } else {
                        next(null, answers.requireString);
                    }
                });
            },
            variableName: ['requireString', function(results, next) {
                const module = Path.basename(results.requireString);
                var prompts = [{
                    type: 'input',
                    name: 'variableName',
                    message: `${module} variable: `
                }];

                inquirer.prompt(prompts, (answers) => {
                    next(null, answers.variableName);
                });
            }]
        }, (err, results) => {
            const dependency = {
                variableName: results.variableName,
                requireString: results.requireString
            };

            done(null, dependency);
        });
    }

    /**
     * @param {function(function(err, any))} promptFunction
     * @param {function(err, Array)} done
     */
    static repeatPrompt(promptFunction, done) {
        const results = [];

        let result = null;
        Async.doWhilst((next) => {
                promptFunction((err, localResult) => {
                    result = localResult;
                    if (result) {
                        results.push(result);
                    }
                    next();
                })
            }, () => {return (result);}
            ,  (err) => {
                done(null, results);
            });
    }
}