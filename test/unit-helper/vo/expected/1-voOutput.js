'use strict';

const VO = require('hapiest-vo');

class MyObj extends VO {

   /**
    * @param {object} obj
    * @param {int} obj.id
    * @param {string} obj.name
    */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

   /**
    * @returns {int}
    */
    get id() {
        return this.get('id');
    }

   /**
    * @returns {string}
    */
    get name() {
        return this.get('name');
    }

}

module.exports = MyObj;