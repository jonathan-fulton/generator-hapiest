'use strict';

const _ = require('lodash');
const Path = require('path');

const ClassFactory = require('../class/classFactory');
const ClassServiceCreateFileArgsFactory = require('../class/classCreateFileArgsFactory');
const ClassService = require('../class/classService');

class FactoryService {

    /**
     * @param {FactoryCreateFileArgs} createArgs
     * @returns {string} path to file created
     */
    static createFile(createArgs) {
        
        const factoryParameters = {
            factoryClassName: createArgs.factoryClassName,
            factoryFunctions: createArgs.factoryFunctions,
            associatedVoClassName: createArgs.associatedVoClassName,
            associatedVoFileName: createArgs.associatedVoFileName,
            associatedVoProperties: createArgs.associatedVoProperties
        };
        const classObj = ClassFactory.createFactoryClass(factoryParameters);

        const createFileArgs = ClassServiceCreateFileArgsFactory.create({
            class: classObj,
            generatorContext: createArgs.generatorContext,
            destinationDirectory: createArgs.destinationDirectory
        });

        return ClassService.createFile(createFileArgs);
    }

}

module.exports = FactoryService;
