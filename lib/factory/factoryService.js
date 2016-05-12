'use strict';

const _ = require('lodash');
const Path = require('path');

class FactoryService {

    /**
     * @param {FactoryCreateFileArgs} createArgs
     * @returns {string} path to file created
     */
    static createFile(createArgs) {
        
        const templateParameters = {
            voClassName: createArgs.associatedVoClassName,
            voFileLocationForRequire: './' + Path.basename(createArgs.associatedVoFilePath, '.js'),
            voClassProperties: createArgs.associatedVoProperties,
            factoryClassName: createArgs.factoryClassName,
            factoryFunctions: createArgs.factoryFunctions
        };

        const factoryFileName = _.lowerFirst(createArgs.factoryClassName) + '.js';
        const directory = createArgs.destinationDirectory;
        const destinationPath = Path.join(directory, factoryFileName);

        const context = createArgs.generatorContext;
        const templateFilePath = Path.resolve(__dirname,'./templates/factoryTemplate.js');

        context.fs.copyTpl(templateFilePath, destinationPath, templateParameters);

        return destinationPath;
    }

}

module.exports = FactoryService;
