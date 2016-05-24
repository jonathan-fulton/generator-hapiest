'use strict';

const VoClassPropertyFactory = require('../vo/voClassPropertyFactory');
const ServiceCreateFilesArgs = require('./serviceCreateFilesArgs');

class ServiceCreateFilesArgsFactory {

    /**
     * @param {object} obj
     * @param {Base} obj.generatorContext
     * @param {string} obj.serviceName
     * @param {boolean} obj.includeCreateOperation
     * @param {boolean} obj.includeReadOperation
     * @param {boolean} obj.includeUpdateOperation
     * @param {boolean} obj.includeDeleteOperation
     * @param {boolean} obj.includeCreateArgsVO
     * @param {boolean} obj.includeCoreVO
     * @param {{name: string, type: string}[]} [obj.createArgsVoProperties]
     * @param {{name: string, type: string}[]} [obj.coreVoProperties]
     * @param {int} [obj.chanceSeed]
     *
     * @returns {ServiceCreateFilesArgs}
     */
    static createFromJsObj(obj) {

        const createArgsVoProperties = VoClassPropertyFactory.createFromArrOfJsObj(obj.createArgsVoProperties || []);
        const coreVoProperties = VoClassPropertyFactory.createFromArrOfJsObj(obj.coreVoProperties || []);

        const newArgs = {
            generatorContext: obj.generatorContext,
            serviceName: obj.serviceName,
            includeCreateOperation: obj.includeCreateOperation,
            includeReadOperation: obj.includeReadOperation,
            includeUpdateOperation: obj.includeUpdateOperation,
            includeDeleteOperation: obj.includeDeleteOperation,
            includeCreateArgsVO: obj.includeCreateArgsVO,
            includeCoreVO: obj.includeCoreVO,
            createArgsVoProperties: createArgsVoProperties,
            coreVoProperties: coreVoProperties,
            chanceSeed: obj.chanceSeed
        };
            
        return new ServiceCreateFilesArgs(newArgs);
    }

}

module.exports = ServiceCreateFilesArgsFactory;