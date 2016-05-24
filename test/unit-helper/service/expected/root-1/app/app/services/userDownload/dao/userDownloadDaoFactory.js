'use strict';

const Dao = require('./userDownloadDao');
const MysqlDaoArgsFactory = require('hapiest-mysql/lib/mysqlDaoArgsFactory');
const VoFactory = require('../get/userDownloadFactory');

class UserDownloadDaoFactory {

   /**
    * @param {MysqlService} mysqlService
    * @param {Logger} logger
    *
    * @returns {UserDownloadDao}
    */
    static create(mysqlService, logger) {
       const daoArgs = MysqlDaoArgsFactory.createFromJsObj({
            mysqlService: mysqlService,
            createVoFromDbRowFunction: VoFactory.createFromDbRow,
            logger: logger,
            tableName: 'user_downloads'
        });
        const dao = new Dao(daoArgs);
        return dao;
    }

}

module.exports = UserDownloadDaoFactory;