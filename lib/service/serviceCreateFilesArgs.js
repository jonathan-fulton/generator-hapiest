'use strict';

const VO = require('hapiest-vo');

class ServiceCreateFilesArgs extends VO {

    /**
     * @param {object} obj
     * @param {Base} obj.generatorContext
     * @param {string} obj.serviceName
     *
     * @param {boolean} obj.isDataService
     *
     * @param {boolean} obj.includeCreateOperation
     * @param {boolean} obj.includeReadOperation
     * @param {boolean} obj.includeUpdateOperation
     * @param {boolean} obj.includeDeleteOperation
     *
     * @param {VoClassProperty[]} obj.createArgsVoProperties
     * @param {VoClassProperty[]} obj.coreVoProperties
     *
     * @param {int} obj.chanceSeed - used for testing purposes
     */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    /**
     * @returns {Base}
     */
    get generatorContext() {return this.get('generatorContext');}
    
    /**
     * @returns {string}
     */
    get serviceName() {return this.get('serviceName');}
    
    /**
     * @returns {boolean}
     */
    get includeCreateOperation() {return this.get('includeCreateOperation');}
    
    /**
     * @returns {boolean}
     */
    get includeReadOperation() {return this.get('includeReadOperation');}
    
    /**
     * @returns {boolean}
     */
    get includeUpdateOperation() {return this.get('includeUpdateOperation');}
    
    /**
     * @returns {boolean}
     */
    get includeDeleteOperation() {return this.get('includeDeleteOperation');}
    
    /**
     * @returns {boolean}
     */
    get includeCreateArgsVO() {return this.get('includeCreateArgsVO');}

    /**
     * @returns {boolean}
     */
    get includeCoreVO() {return this.get('includeCoreVO');}

    /**
     * @returns {VoClassProperty[]}
     */
    get createArgsVoProperties() {return this.get('createArgsVoProperties');}

    /**
     * @returns {VoClassProperty[]}
     */
    get coreVoProperties() {return this.get('coreVoProperties');}

    /**
     * @returns {int}
     */
    get chanceSeed() {return this.get('chanceSeed');}
    
}

module.exports = ServiceCreateFilesArgs;