'use strict';

class UserDownloadService {

   /**
    * @param {UserDownloadServiceDao} dao
    * @param {Logger} logger
    */
    constructor(dao, logger) {
        this._dao = dao;
        this._logger = logger;
    }

   /**
    * @param {*} createArgs
    *
    * @returns {Promise.<int,Error>}
    */
    create(createArgs) {
        return this._dao.create(createArgs)
                .then(newId => newId)
                .catch(err => {
                    this._logger.error(err.message, {createArgs: createArgs, err:err});
                    throw new Error('UserDownloadService.create failed');
                });
    }

   /**
    * @param {int} id
    *
    * @returns {Promise.<UserDownload,Error>}
    */
    get(id) {
        return this._dao.get(id)
                .then(userDownload => userDownload)
                .catch(err => {
                    this._logger.error(err.message, {id: id, err:err});
                    throw new Error('UserDownloadService.get failed');
                });
    }

}

module.exports = UserDownloadService;