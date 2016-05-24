'use strict';

const VO = require('hapiest-vo');

class UserDownload extends VO {

   /**
    * @param {object} obj
    * @param {int} obj.id
    * @param {string} obj.firstName
    * @param {string} obj.lastName
    * @param {string} obj.email
    * @param {int} obj.numSignupAttempts
    * @param {Date} obj.dateCreated
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

   /**
    * @returns {int}
    */
    get numSignupAttempts() {
        return this.get('numSignupAttempts');
    }

   /**
    * @returns {Date}
    */
    get dateCreated() {
        return this.get('dateCreated');
    }

}

module.exports = UserDownload;