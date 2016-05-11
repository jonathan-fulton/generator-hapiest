'use strict';

const _ = require('lodash');
const FactoryCreateFileArgs = require('./factoryCreateFileArgs');

class FactoryCreateFileArgsFactory {
    /*
    static createFromPromptAnswers(context, fileInfoAnswers, propertiesAnswers) {
        return VoCreateFileArgsFactory.createFromJsObj({
            generatorContext: context,
            className: _.upperFirst(_.camelCase(fileInfoAnswers.className)),
            classProperties: propertiesAnswers,
            destinationDirectory: fileInfoAnswers.directory
        })
    }
    */

    static createFromJsObj(jsObj) {
        let args = {
            generatorContext: jsObj.generatorContext,
            destinationDirectory: jsObj.destinationDirectory,
            factoryClassName: _.upperFirst(_.camelCase(jsObj.factoryClassName)),
            factoryFunctions: jsObj.factoryFunctions,
            associatedVoClassName: jsObj.associatedVoClassName,
            associatedVoFilePath: jsObj.associatedVoFilePath
        };

        return new FactoryCreateFileArgs(jsObj);
    }
}

module.exports = FactoryCreateFileArgsFactory;