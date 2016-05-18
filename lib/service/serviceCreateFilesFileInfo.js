'use strict';

const VO = require('hapiest-vo');

class ServiceCreateFilesFileInfo extends VO {

    /**
     * @param {object} obj
     * @param {string} obj.fileName
     * @param {string} obj.destinationDirectory
     * @param {string} obj.className
     */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    
    /**
     * @returns {string}
     */
    get fileName() {return this.get('fileName');}
    
    /**
     * @returns {string}
     */
    get destinationDirectory() {return this.get('destinationDirectory');}

    /**
     * @returns {string}
     */
    get className() {return this.get('className');}
    
}

module.exports = ServiceCreateFilesFileInfo;