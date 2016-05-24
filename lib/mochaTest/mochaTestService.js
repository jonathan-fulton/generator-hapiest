'use strict';

const Path = require('path');
const MochaTestRenderer = require('./mochaTestRenderer');

class MochaTestService {

    /**
     * @param {MochaTestCreateFileArgs} createFileArgs
     * @returns {string} - path to the file
     */
    static createFile(createFileArgs) {
        const testFileName = Path.basename(createFileArgs.associatedFilePath,'.js');
        const destinationPath = Path.join(createFileArgs.destinationDirectory, `test-${testFileName}.js`);
        const output = MochaTestRenderer.render(createFileArgs.test);
        createFileArgs.generatorContext.fs.write(destinationPath, output);
        return destinationPath;
    }

}

module.exports = MochaTestService;
