'use strict';

const VO = require('hapiest-vo');

class MochaTestBlock extends VO {

   /**
    * @param {object} obj
    * @param {string} obj.functionName
    * @param {string} obj.description
    * @param {Array.<MochaTestBlock>|string} obj.callbackBody
    * @param {boolean} obj.passDoneToCallback
    */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

   /**
    * @returns {string}
    */
    get functionName() {
        return this.get('functionName');
    }

   /**
    * @returns {string}
    */
    get description() {
        return this.get('description');
    }

   /**
    * @returns {Array.<MochaTestBlock|string>}
    */
    get callbackBody() {
        return this.get('callbackBody');
    }

   /**
    * @returns {boolean}
    */
    get passDoneToCallback() {
        return this.get('passDoneToCallback');
    }

}

module.exports = MochaTestBlock;