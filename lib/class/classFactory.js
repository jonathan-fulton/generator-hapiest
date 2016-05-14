'use strict';

const Class = require('./class');
const ClassDependencyFactory = require('./classDependencyFactory');
const ClassMethodFactory = require('./classMethodFactory');

class ClassFactory {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {{variableName: string, requireString: string}[]} obj.dependencies
     * @param {{name: string, type: string, args:{name: string, type: string}[], body: string, returnType: string}[]} obj.methods
     *
     * @returns {Class}
     */
    static createFromJsObj(obj) {
        const newArgs = {
          name: obj.name,
          dependencies: ClassDependencyFactory.createFromJsObjArr(obj.dependencies),
          methods: ClassMethodFactory.createFromJsObjArr(obj.methods)
        };
            
        return new Class(newArgs);
    }

}

module.exports = ClassFactory;