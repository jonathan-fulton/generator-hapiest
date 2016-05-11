'use strict';

const _ = require('lodash');
const Path = require('path');

class VoService {

    /**
     * @param {VoCreateFileArgs} createArgs
     * @returns {string} path to file created
     */
    static createFile(createArgs) {
        const className = _.upperFirst(_.camelCase(createArgs.className));
        const fileName = _.lowerFirst(className) + '.js';
        const directory = createArgs.destinationDirectory;
        const destinationPath = Path.join(directory, fileName);

        const context = createArgs.generatorContext;
        const templateFilePath = Path.resolve(__dirname,'./templates/voTemplate.js');

        const templateParameters = {
            voClassName: createArgs.className,
            voClassProperties: createArgs.classProperties
        };

        context.fs.copyTpl(templateFilePath, destinationPath, templateParameters);

        return destinationPath;
    }
    
}

module.exports = VoService;
