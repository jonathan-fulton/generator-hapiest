'use strict';

const MochaTestDependency = require('./mochaTestDependency');

class MochaTestDependencyFactory {

   /**
    * @param {object} obj
    * @param {string} obj.variableName
    * @param {string} obj.requireString
    *
    * @returns {MochaTestDependency}
    */
    static createFromJsObj(obj) {
        const newArgs = {
            variableName: obj.variableName,
            requireString: obj.requireString
        };

       return new MochaTestDependency(newArgs);
    }

    /**
     * @param {} objArr
     * @returns {MochaTestDependency[]}
     */
    static createFromJsObjArr(objArr) {
        const results = [];
        objArr.forEach(obj => results.push(MochaTestDependencyFactory.createFromJsObj(obj)));
        return results;
    }

}

module.exports = MochaTestDependencyFactory;