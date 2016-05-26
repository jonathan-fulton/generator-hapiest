'use strict';

const _ = require('lodash');
const UserDownload = require('./userDownload');

class UserDownloadFactory {

   /**
    * @param {object} obj
    * @param {int} obj.id
    * @param {string} obj.firstName
    * @param {string} obj.lastName
    * @param {string} obj.email
    * @param {int} obj.numSignupAttempts
    * @param {Date} obj.dateCreated
    *
    * @returns {UserDownload}
    */
    static createFromJsObj(obj) {
       const newArgs = _.cloneDeep(obj);
       return new UserDownload(newArgs);
    }

   /**
    * @param {object} dbRow
    * @param {int} dbRow.id
    * @param {string} dbRow.first_name
    * @param {string} dbRow.last_name
    * @param {string} dbRow.email
    * @param {int} dbRow.num_signup_attempts
    * @param {Date} dbRow.date_created
    *
    * @returns {UserDownload}
    */
    static createFromDbRow(dbRow) {
        const newArgs = {};
        Object.keys(dbRow).forEach(column => {
            newArgs[_.camelCase(column)] = dbRow[column];
        });
        return UserDownloadFactory.createFromJsObj(newArgs);
    }

   /**
    * @param {Object[]} dbRows
    *
    * @returns {UserDownload[]}
    */
    static createFromDbRows(dbRows) {
        const results = [];
        dbRows.forEach(dbRow => results.push(UserDownloadFactory.createFromDbRow(dbRow)));
        return results;
    }

}

module.exports = UserDownloadFactory;