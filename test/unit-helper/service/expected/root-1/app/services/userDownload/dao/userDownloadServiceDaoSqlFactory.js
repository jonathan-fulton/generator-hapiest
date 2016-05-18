'use strict';

const Squel = require('squel');

class UserDownloadServiceDaoSqlFactory {

   /**
    * @param {function(any)} cleanFunction
    */
    constructor(cleanFunction) {
        this._clean = cleanFunction;
    }

   /**
    * @param {UserDownloadServiceCreateArgs} createArgs
    *
    * @returns {string}
    */
    getCreateSql(createArgs) {
        const clean_firstName = this._clean(createArgs.firstName);
        const clean_lastName = this._clean(createArgs.lastName);
        const clean_email = this._clean(createArgs.email);

        const sql = 
            Squel.insert().into('user_downloads')
                .setFields({
                   first_name: clean_firstName,
                   last_name: clean_lastName,
                   email: clean_email
                })
                .toString();
        return sql;
    }

   /**
    * @param {int} id
    *
    * @returns {string}
    */
    getSelectSql(id) {
        const clean_id = this._clean(id);
        const sql = 
                Squel.select().from('user_downloads')
                    .where(`id = ${clean_id}`)
                    .toString();
        return sql;
    }

}

module.exports = UserDownloadServiceDaoSqlFactory;