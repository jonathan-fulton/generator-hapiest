'use strict';

const _ = require('lodash');
const FactoryCreateFileArgs = require('./factoryCreateFileArgs');
const VoClassPropertyFactory = require('../vo/voClassPropertyFactory');

class FactoryCreateFileArgsFactory {

    /**
     * @param {object} obj
     * @param {Base} obj.generatorContext
     * @param {string} obj.destinationDirectory
     * @param {string} obj.factoryClassName
     * @param {string[]} obj.factoryFunctions
     * @param {string} obj.associatedVoClassName
     * @param {string} obj.associatedVoFileName
     * @param {{name: string, type: string}[]} obj.associatedVoProperties
     *
     * @returns {FactoryCreateFileArgs}
     */
    static createFromJsObj(obj) {
        const associatedVoProperties = VoClassPropertyFactory.createFromArrOfJsObj(obj.associatedVoProperties);
        const newArgs = {
            generatorContext: obj.generatorContext,
            destinationDirectory: obj.destinationDirectory,
            factoryClassName: _.upperFirst(_.camelCase(obj.factoryClassName)),
            factoryFunctions: obj.factoryFunctions,
            associatedVoClassName: obj.associatedVoClassName,
            associatedVoFileName: obj.associatedVoFileName,
            associatedVoProperties: associatedVoProperties
        };
        
        return new FactoryCreateFileArgs(newArgs);
    }
}

module.exports = FactoryCreateFileArgsFactory;