'use strict';

const _ = require('lodash');

const ServiceCreateFilesAllFileInfo = require('./serviceCreateFilesAllFileInfo');
const ServiceCreateFilesFileInfoFactory = require('./serviceCreateFilesFileInfoFactory');

class ServiceCreateFilesAllFileInfoFactory {

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
     *
     * @returns {ServiceCreateFilesAllFileInfo}
     */
    static createFromJsObj(obj) {
        const newArgs = {
            service: obj.service,
            serviceFactory: obj.serviceFactory,
            serviceDao: obj.serviceDao,
            serviceDaoFactory: obj.serviceDaoFactory,
            serviceCreateArgsVo: obj.serviceCreateArgsVo,
            serviceCreateArgsVoFactory: obj.serviceCreateArgsVoFactory,
            serviceCoreVo: obj.serviceCoreVo,
            serviceCoreVoFactory: obj.serviceCoreVoFactory,
            serviceTest: obj.serviceTest
        };
            
        return new ServiceCreateFilesAllFileInfo(newArgs);
    }

    /**
     * @param {ServiceCreateFilesArgs} createArgs
     *
     * @returns {ServiceCreateFilesAllFileInfo}
     */
    static createFromCreateArgs(createArgs) {
        const context = createArgs.generatorContext;
        const serviceFolderName = _.lowerFirst(createArgs.serviceName);
        const serviceFolderPath = context.destinationPath('app/services/' + serviceFolderName);
        const serviceTestFolderPath = context.destinationPath('test/unit/app/services');

        const serviceClassName = createArgs.serviceName + 'Service';
        const serviceFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceClassName),
            destinationDirectory: serviceFolderPath,
            className: serviceClassName
        });

        const serviceFactoryClassName = serviceClassName + 'Factory';
        const serviceFactoryFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceFactoryClassName),
            destinationDirectory: serviceFolderPath,
            className: serviceFactoryClassName
        });

        const serviceDaoClassName = createArgs.serviceName + 'Dao';
        const daoFolderPath = serviceFolderPath + '/dao';
        const serviceDaoFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceDaoClassName),
            destinationDirectory: daoFolderPath,
            className: serviceDaoClassName
        });

        const serviceDaoFactoryClassName = createArgs.serviceName + 'DaoFactory';
        const serviceDaoFactoryFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceDaoFactoryClassName),
            destinationDirectory: daoFolderPath,
            className: serviceDaoFactoryClassName
        });

        const serviceCreateArgsVoClassName = serviceClassName + 'CreateArgs';
        const serviceCreateArgsVoFolderPath = serviceFolderPath + '/create';
        const serviceCreateArgsVoFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceCreateArgsVoClassName),
            destinationDirectory: serviceCreateArgsVoFolderPath,
            className: serviceCreateArgsVoClassName
        });

        const serviceCreateArgsVoFactoryClassName = serviceClassName + 'CreateArgsFactory';
        const serviceCreateArgsVoFactoryFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceCreateArgsVoFactoryClassName),
            destinationDirectory: serviceCreateArgsVoFolderPath,
            className: serviceCreateArgsVoFactoryClassName
        });

        const serviceCoreVoClassName = createArgs.serviceName;
        const serviceCoreVoFolderPath = serviceFolderPath + '/get';
        const serviceCoreVoFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceCoreVoClassName),
            destinationDirectory: serviceCoreVoFolderPath,
            className: serviceCoreVoClassName
        });

        const serviceCoreVoFactoryClassName = serviceCoreVoClassName + 'Factory';
        const serviceCoreVoFactoryFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceCoreVoFactoryClassName),
            destinationDirectory: serviceCoreVoFolderPath,
            className: serviceCoreVoFactoryClassName
        });

        const serviceTestClassName = null;
        const serviceTestFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: 'test-' + _.lowerFirst(serviceFileInfo.fileName),
            destinationDirectory: serviceTestFolderPath,
            className: serviceTestClassName
        });

        return ServiceCreateFilesAllFileInfoFactory.createFromJsObj({
            service: serviceFileInfo,
            serviceFactory: serviceFactoryFileInfo,
            serviceDao: serviceDaoFileInfo,
            serviceDaoFactory: serviceDaoFactoryFileInfo,
            serviceCreateArgsVo: serviceCreateArgsVoFileInfo,
            serviceCreateArgsVoFactory: serviceCreateArgsVoFactoryFileInfo,
            serviceCoreVo: serviceCoreVoFileInfo,
            serviceCoreVoFactory: serviceCoreVoFactoryFileInfo,
            serviceTest: serviceTestFileInfo
        })
    }
}

module.exports = ServiceCreateFilesAllFileInfoFactory;