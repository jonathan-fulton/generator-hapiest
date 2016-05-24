'use strict';

const MochaTestDependency = require('./mochaTestDependency');

class MochaTestDependencyFactory {

   /**
    * @param {object} obj
    * @param {string} obj.variableName
    * @param {string} obj.requireString
    * @param {string} obj.postRequireString
    *
    * @returns {MochaTestDependency}
    */
    static createFromJsObj(obj) {
        const newArgs = {
            variableName: obj.variableName,
            requireString: obj.requireString,
            postRequireString: obj.postRequireString
        };

       return new MochaTestDependency(newArgs);
    }

    /**
     * @param {Array.<object>} objArr
     * @returns {MochaTestDependency[]}
     */
    static createFromJsObjArr(objArr) {
        const results = [];
        objArr.forEach(obj => results.push(MochaTestDependencyFactory.createFromJsObj(obj)));
        return results;
    }

}

module.exports = MochaTestDependencyFactory;