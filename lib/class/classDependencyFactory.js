'use strict';

const ClassDependency = require('./classDependency');

class ClassDependencyFactory {

    /**
     * @param {object} obj
     * @param {string} obj.variableName
     * @param {string} obj.requireString
     *
     * @returns {ClassDependency}
     */
    static createFromJsObj(obj) {
        const newArgs = {
          variableName: obj.variableName,
          requireString: obj.requireString
        };
            
        return new ClassDependency(newArgs);
    }

    /**
     * @param {{variableName: string, requireString: string}[]} jsObjArr
     * @returns {ClassDependency[]}
     */
    static createFromJsObjArr(jsObjArr) {
        const dependencies = [];
        jsObjArr.forEach(obj => {
            dependencies.push(ClassDependencyFactory.createFromJsObj(obj));
        });
        return dependencies
    }

}

module.exports = ClassDependencyFactory;