'use strict';

const generators = require('yeoman-generator');
const Async = require('async');

const inquirer = require('../../lib/customInquirer');
const ServiceCreateFilesArgsFactory = require('../../lib/service/serviceCreateFilesArgsFactory');
const ServiceService = require('../../lib/service/serviceService');

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
    },

    prompting: function() {
        const done = this.async();
        const self = this;

        Async.auto({
            serviceName: Async.apply(Internals.promptForServiceName),
            createArgsVoProperties: ['serviceName', (results, next) => Internals.promptForCreateArgsVoProperties(next)],
            coreVoProperties: ['createArgsVoProperties', (results, next) => Internals.promptForCoreVoProperties(next)]
        }, (err, results) => {
            const createFilesArgs = ServiceCreateFilesArgsFactory.createFromJsObj({
                generatorContext: self,
                serviceName: results.serviceName,
                includeCreateOperation: true,
                includeReadOperation: true,
                includeUpdateOperation: true,
                includeDeleteOperation: true,
                includeCreateArgsVO: true,
                includeCoreVO: true,
                createArgsVoProperties: results.createArgsVoProperties,
                coreVoProperties: results.coreVoProperties
            });
            ServiceService.createFiles(createFilesArgs);
            done();
        })
    }
});

class Internals {

    static promptForServiceName(done) {
        const prompts = [{
            type: 'input',
            name: 'serviceName',
            message: 'Service Name: '
        }];

        inquirer.prompt(prompts, (answers) => {
            done(null, answers.serviceName);
        });
    }

    static promptForCreateArgsVoProperties(done) {
        Internals._promptForVoProperties('CreateArgs', done);
    }

    static promptForCoreVoProperties(done) {
        Internals._promptForVoProperties('CoreVo', done);
    }

    static _promptForVoProperties(vo, done) {
        const properties = [];
        let curProperty = null;

        Async.doWhilst((next) => {
           Internals._promptForVoProperty(vo, (err, property) => {
                curProperty = property;
                if (curProperty) {
                    properties.push(curProperty);
                }
                next(err);
            });
        }, () => !!curProperty, (err) => done(err, properties));
    }

    static _promptForVoProperty(vo, done) {
        Async.auto({
            propertyName: Async.apply(Internals._promptForVoPropertyName, vo),
            propertyType: ['propertyName', (results, next) => {
                if (results.propertyName === '') {
                    return next();
                }
                Internals._promptForVoPropertyType(vo, results.propertyName, next);
            }]
        }, (err, results) => {
            if (results.propertyName === ''){
                done(err);
            } else {
                done(err, {name: results.propertyName, type: results.propertyType});
            }
        });
    }

    static _promptForVoPropertyName(vo, done) {
        const prompts = [{
            type: 'input',
            name: 'propertyName',
            message: `(${vo}) Property name: `
        }];

        inquirer.prompt(prompts, (answers) => {
            done(null, answers.propertyName);
        });
    }

    static _promptForVoPropertyType(vo, propertyName, done) {
        const prompts = [{
            type: 'input',
            name: 'propertyType',
            message: `(${vo}) (${propertyName}) type: `
        }];

        inquirer.prompt(prompts, (answers) => {
            done(null, answers.propertyType);
        });
    }
}