'use strict';

const MochaTestCreateFileArgs = require('./mochaTestCreateFileArgs');

class MochaTestCreateFileArgsFactory {

   /**
    * @param {object} obj
    * @param {MochaTest} obj.test
    * @param {Base} obj.generatorContext
    * @param {string} obj.destinationDirectory
    * @param {string} obj.associatedFilePath
    *
    * @returns {MochaTestCreateFileArgs}
    */
    static createFromJsObj(obj) {
        const newArgs = {
            test: obj.test,
            generatorContext: obj.generatorContext,
            destinationDirectory: obj.destinationDirectory,
            associatedFilePath: obj.associatedFilePath
        };

       return new MochaTestCreateFileArgs(newArgs);
    }

}

module.exports = MochaTestCreateFileArgsFactory;