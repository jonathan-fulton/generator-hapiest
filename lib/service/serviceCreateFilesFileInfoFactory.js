'use strict';

const ServiceCreateFilesFileInfo = require('./serviceCreateFilesFileInfo');

class ServiceCreateFilesFileInfoFactory {

    /**
     * @param {object} obj
     * @param {string} obj.fileName
     * @param {string} obj.destinationDirectory
     * @param {string} obj.className
     *
     * @returns {ServiceCreateFilesFileInfo}
     */
    static createFromJsObj(obj) {
        const newArgs = {
            fileName: obj.fileName,
            destinationDirectory: obj.destinationDirectory,
            className: obj.className
        };
            
        return new ServiceCreateFilesFileInfo(newArgs);
    }

}

module.exports = ServiceCreateFilesFileInfoFactory;