'use strict';

const SqlFactory = require('./userDownloadServiceDaoSqlFactory');
const UserDownloadFactory = require('./userDownloadFactory');

class UserDownloadServiceDao {

   /**
    * @param {MysqlService} mysqlService
    * @param {Logger} logger
    */
    constructor(mysqlService, logger) {
        this._mysqlService = mysqlService;
        this._sqlFactory = new SqlFactory(this._mysqlService.clean.bind(this._mysqlService));
    }

   /**
    * @param {*} createArgs
    *
    * @returns {Promise.<int,Error>}
    */
    create(createArgs) {
            return Promise.resolve()
                .then(() => this._sqlFactory.getCreateSql(createArgs))
                .then(createSql => Promise.all([this._mysqlService.insertQuery(createSql)]))
                .then(result => result.insertedId)
                .catch(err => {
                    this._logger.error(err.message, {createArgs: createArgs, err:err});
                    throw new Error('UserDownloadServiceDao.create failed');
                });
    }

   /**
    * @param {int} id
    *
    * @returns {Promise.<UserDownload,Error>}
    */
    get(id) {
           return Promise.resolve()
                .then(() => this._sqlFactory.getSelectSql(id))
                .then(selectSql => Promise.all([this._mysqlService.selectOne(selectQuery)]))
                .then((result) => UserDownloadFactory.create(result))
                .catch(err => {
                    this._logger.error(err.message, {id: id, err:err});
                    throw new Error('UserDownloadServiceDao.get failed');
                });
    }

}

module.exports = UserDownloadServiceDao;