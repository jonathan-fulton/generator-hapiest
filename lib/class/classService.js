'use strict';

const _ = require('lodash');
const Path = require('path');
const ClassRenderer = require('./classRenderer');

class ClassService {

    /**
     * @param {ClassCreateFileArgs} createFileArgs
     * @returns {string} - path to file
     */
    static createFile(createFileArgs) {
        const destinationPath = Path.join(createFileArgs.destinationDirectory, _.lowerFirst(createFileArgs.class.name)+'.js');
        const output = ClassRenderer.render(createFileArgs.class);
        createFileArgs.generatorContext.fs.write(destinationPath, output);
        return destinationPath;
    }
    
}

module.exports = ClassService;