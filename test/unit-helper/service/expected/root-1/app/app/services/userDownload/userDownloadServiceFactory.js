'use strict';

const UserDownloadService = require('./userDownloadService');
const UserDownloadDaoFactory = require('./dao/userDownloadDaoFactory');

class UserDownloadServiceFactory {

   /**
    * @param {MysqlService} mysqlService
    * @param {Logger} logger
    *
    * @returns {UserDownloadService}
    */
    static create(mysqlService, logger) {
        const dao = UserDownloadDaoFactory.create(mysqlService, logger);
        return new UserDownloadService(dao, logger);
    }

}

module.exports = UserDownloadServiceFactory;