'use strict';

const _ = require('lodash');
const FactoryCreateFileArgs = require('./factoryCreateFileArgs');
const VoClassProperty = require('../vo/voClassProperty');

class FactoryCreateFileArgsFactory {

    static createFromJsObj(jsObj) {
        let args = {
            generatorContext: jsObj.generatorContext,
            destinationDirectory: jsObj.destinationDirectory,
            factoryClassName: _.upperFirst(_.camelCase(jsObj.factoryClassName)),
            factoryFunctions: jsObj.factoryFunctions,
            associatedVoClassName: jsObj.associatedVoClassName,
            associatedVoFilePath: jsObj.associatedVoFilePath
        };

        const associatedVoProperties = [];
        (jsObj.associatedVoProperties || []).forEach(property => associatedVoProperties.push(new VoClassProperty(property)));
        args.associatedVoProperties = associatedVoProperties;

        return new FactoryCreateFileArgs(args);
    }
}

module.exports = FactoryCreateFileArgsFactory;