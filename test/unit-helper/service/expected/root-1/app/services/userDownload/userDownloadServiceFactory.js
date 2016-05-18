'use strict';

const UserDownloadService = require('./userDownloadService');
const UserDownloadServiceDao = require('./dao/userDownloadServiceDao');

class UserDownloadServiceFactory {

   /**
    * @param {MysqlService} mysqlService
    * @param {Logger} logger
    *
    * @returns {UserDownloadService}
    */
    static create(mysqlService, logger) {
        const dao = new UserDownloadServiceDao(mysqlService, logger);
        return new UserDownloadService(dao, logger);
    }

}

module.exports = UserDownloadServiceFactory;