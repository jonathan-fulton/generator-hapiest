'use strict';

const UserDownload = require('./userDownload');

class UserDownloadFactory {

   /**
    * @param {object} obj
    * @param {int} obj.id
    * @param {string} obj.firstName
    * @param {string} obj.lastName
    * @param {string} obj.email
    * @param {Date} obj.dateCreated
    *
    * @returns {UserDownload}
    */
    static createFromJsObj(obj) {
        const newArgs = {
            id: obj.id,
            firstName: obj.firstName,
            lastName: obj.lastName,
            email: obj.email,
            dateCreated: obj.dateCreated
        };

       return new UserDownload(newArgs);
    }

   /**
    * @param {object} dbRow
    * @param {int} dbRow.id
    * @param {string} dbRow.first_name
    * @param {string} dbRow.last_name
    * @param {string} dbRow.email
    * @param {Date} dbRow.date_created
    *
    * @returns {UserDownload}
    */
    static createFromDbRow(dbRow) {
        const newArgs = {
            id: dbRow.id,
            firstName: dbRow.first_name,
            lastName: dbRow.last_name,
            email: dbRow.email,
            dateCreated: dbRow.date_created
        };
            
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