'use strict';

const VO = require('hapiest-vo');

class UserDownloadServiceCreateArgs extends VO {

   /**
    * @param {object} obj
    * @param {string} obj.firstName
    * @param {string} obj.lastName
    * @param {string} obj.email
    */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

   /**
    * @returns {string}
    */
    get firstName() {
        return this.get('firstName');
    }

   /**
    * @returns {string}
    */
    get lastName() {
        return this.get('lastName');
    }

   /**
    * @returns {string}
    */
    get email() {
        return this.get('email');
    }

}

module.exports = UserDownloadServiceCreateArgs;