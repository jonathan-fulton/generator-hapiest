'use strict';

const UserDownloadServiceCreateArgs = require('./userDownloadServiceCreateArgs');

class UserDownloadServiceCreateArgsFactory {

   /**
    * @param {object} obj
    * @param {string} obj.firstName
    * @param {string} obj.lastName
    * @param {string} obj.email
    * @param {int} obj.numSignupAttempts
    *
    * @returns {UserDownloadServiceCreateArgs}
    */
    static createFromJsObj(obj) {
        const newArgs = {
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email,
            numSignupAttempts: obj.numSignupAttempts
        };

       return new UserDownloadServiceCreateArgs(newArgs);
    }

}

module.exports = UserDownloadServiceCreateArgsFactory;