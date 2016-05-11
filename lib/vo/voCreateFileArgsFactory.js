'use strict';

const _ = require('lodash');
const VoCreateFileArgs = require('./voCreateFileArgs');
const VoClassProperty= require('./voClassProperty');

class VoCreateFileArgsFactory {

    /**
     * @returns {VoCreateFileArgs}
     */
    static createFromPromptAnswers(context, fileInfoAnswers, propertiesAnswers) {
        return VoCreateFileArgsFactory.createFromJsObj({
            generatorContext: context,
            className: _.upperFirst(_.camelCase(fileInfoAnswers.className)),
            classProperties: propertiesAnswers,
            destinationDirectory: fileInfoAnswers.directory
        })
    }

    /**
     * @returns {VoCreateFileArgs}
     */
    static createFromJsObj(jsObj) {
        let args = {
            generatorContext: jsObj.generatorContext,
            className: jsObj.className,
            classProperties: [],
            destinationDirectory: jsObj.destinationDirectory
        };

        (jsObj.classProperties || []).forEach(property => {
            const classProperty = new VoClassProperty({name: property.name, type: property.type});
            args.classProperties.push(classProperty);
        });

        return new VoCreateFileArgs(jsObj);
    }
}

module.exports = VoCreateFileArgsFactory;