'use strict';

const VO = require('hapiest-vo');

class MochaTestDependency extends VO {

   /**
    * @param {object} obj
    * @param {string} obj.variableName
    * @param {string} obj.requireString
    * @param {string} obj.postRequireString - can be arbitrary string that gets insterted ...require('blah'){here};
    */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

   /**
    * @returns {string}
    */
    get variableName() {
        return this.get('variableName');
    }

   /**
    * @returns {string}
    */
    get requireString() {
        return this.get('requireString');
    }

    /**
     * @returns {string}
     */
    get postRequireString() {
        return this.get('postRequireString');
    }

}

module.exports = MochaTestDependency;