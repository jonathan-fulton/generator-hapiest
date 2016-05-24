'use strict';

const MysqlDao = require('hapiest-mysql/lib/mysqlDao');

class UserDownloadDao extends MysqlDao {

   /**
    * @param {int} id
    *
    * @returns {Promise.<UserDownload>}
    */
    getOneById(id) {
       return super.getOneById(id);
    }

   /**
    * @param {object} whereClause
    *
    * @returns {Promise.<UserDownload>}
    */
    getOne(whereClause) {
       return super.getOne(whereClause);
    }

   /**
    * @param {object} whereClause
    *
    * @returns {Promise.<UserDownload[]>}
    */
    getAll(whereClause) {
       return super.getAll(whereClause);
    }

}

module.exports = UserDownloadDao;