'use strict';

const VO = require('hapiest-vo');

class ServiceCreateFilesAllFileInfo extends VO {

    /**
     * @param {object} obj
     * @param {ServiceCreateFilesFileInfo} obj.service
     * @param {ServiceCreateFilesFileInfo} obj.serviceFactory
     * @param {ServiceCreateFilesFileInfo} obj.serviceDao
     * @param {ServiceCreateFilesFileInfo} obj.serviceDaoFactory
     * @param {ServiceCreateFilesFileInfo} obj.serviceCreateArgsVo
     * @param {ServiceCreateFilesFileInfo} obj.serviceCreateArgsVoFactory
     * @param {ServiceCreateFilesFileInfo} obj.serviceCoreVo
     * @param {ServiceCreateFilesFileInfo} obj.serviceCoreVoFactory
     * @param {ServiceCreateFilesFileInfo} obj.serviceTest
     */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get service() {return this.get('service');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceFactory() {return this.get('serviceFactory');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceDao() {return this.get('serviceDao');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceDaoFactory() {return this.get('serviceDaoFactory');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceCreateArgsVo() {return this.get('serviceCreateArgsVo');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceCreateArgsVoFactory() {return this.get('serviceCreateArgsVoFactory');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceCoreVo() {return this.get('serviceCoreVo');}
    
    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceCoreVoFactory() {return this.get('serviceCoreVoFactory');}

    /**
     * @returns {ServiceCreateFilesFileInfo}
     */
    get serviceTest() {return this.get('serviceTest');}
    
}

module.exports = ServiceCreateFilesAllFileInfo;