'use strict';

const ClassCreateFileArgs = require('./classCreateFileArgs');
const ClassFactory = require('./classFactory');

class ClassCreateFileArgsFactory {

    /**
     * @param {object} obj
     * @param {Class} obj.class
     * @param {Base} obj.generatorContext
     * @param {string} obj.destinationDirectory
     *
     * @returns {ClassCreateFileArgs}
     */
    static create(obj) {
        const newArgs = {
          class: obj.class,
          generatorContext: obj.generatorContext,
          destinationDirectory: obj.destinationDirectory
        };
            
        return new ClassCreateFileArgs(newArgs);
    }

}

module.exports = ClassCreateFileArgsFactory;