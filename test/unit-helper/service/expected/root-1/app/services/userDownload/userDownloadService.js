'use strict';

class UserDownloadService {

   /**
    * @param {UserDownloadDao} dao
    * @param {Logger} logger
    */
    constructor(dao, logger) {
        this._dao = dao;
        this._logger = logger;
    }

   /**
    * @param {UserDownloadServiceCreateArgs} createArgs
    *
    * @returns {Promise.<int,Error>}
    */
    create(createArgs) {
        return this._dao.create(createArgs)
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
    getById(id) {
        return this._dao.getOneById(id)
            .catch(err => {
                this._logger.error(err.message, {id: id, err:err});
                throw new Error('UserDownloadService.getById failed');
            });
    }

   /**
    * @param {int} id
    * @param {createArgs} updateArgs
    *
    * @returns {Promise.<int,Error>}
    */
    updateById(id, updateArgs) {
        return this._dao.updateById(id, updateArgs)
            .catch(err => {
                this._logger.error(err.message, {id: id, updateArgs: updateArgs, err:err});
                throw new Error('UserDownloadService.updateById failed');
            });
    }

   /**
    * @param {int} id
    *
    * @returns {Promise.<int,Error>}
    */
    deleteById(id) {
        return this._dao.deleteById(id)
            .catch(err => {
                this._logger.error(err.message, {id: id, err:err});
                throw new Error('UserDownloadService.deleteById failed');
            });
    }

}

module.exports = UserDownloadService;