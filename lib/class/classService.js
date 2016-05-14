'use strict';

const _ = require('lodash');
const Path = require('path');
const ClassRenderer = require('./classRenderer');

class ClassService {

    /**
     * @param {ClassCreateFileArgs} createFileArgs
     */
    static createFile(createFileArgs) {
        const destinationPath = Path.join(createFileArgs.destinationDirectory, _.lowerFirst(createFileArgs.class.name)+'.js');
        const output = ClassRenderer.render(createFileArgs.class);
        createFileArgs.generatorContext.fs.write(destinationPath, output);
    }
    
}

module.exports = ClassService;