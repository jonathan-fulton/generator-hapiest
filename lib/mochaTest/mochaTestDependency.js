'use strict';

const VO = require('hapiest-vo');

class MochaTestDependency extends VO {

   /**
    * @param {object} obj
    * @param {string} obj.variableName
    * @param {string} obj.requireString
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

}

module.exports = MochaTestDependency;