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
     * @param {ServiceCreateFilesFileInfo} obj.serviceDaoSqlFactory
     * @param {ServiceCreateFilesFileInfo} obj.serviceCreateArgsVo
     * @param {ServiceCreateFilesFileInfo} obj.serviceCreateArgsVoFactory
     * @param {ServiceCreateFilesFileInfo} obj.serviceCoreVo
     * @param {ServiceCreateFilesFileInfo} obj.serviceCoreVoFactory
     *
     * @returns {ServiceCreateFilesAllFileInfo}
     */
    static createFromJsObj(obj) {
        const newArgs = {
          service: obj.service,
          serviceFactory: obj.serviceFactory,
          serviceDao: obj.serviceDao,
          serviceDaoSqlFactory: obj.serviceDaoSqlFactory,
          serviceCreateArgsVo: obj.serviceCreateArgsVo,
          serviceCreateArgsVoFactory: obj.serviceCreateArgsVoFactory,
          serviceCoreVo: obj.serviceCoreVo,
          serviceCoreVoFactory: obj.serviceCoreVoFactory
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

        const serviceDaoClassName = serviceClassName + 'Dao';
        const daoFolderPath = serviceFolderPath + '/dao';
        const serviceDaoFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceDaoClassName),
            destinationDirectory: daoFolderPath,
            className: serviceDaoClassName
        });

        const serviceDaoSqlFactoryClassName = serviceClassName + 'DaoSqlFactory';
        const serviceDaoSqlFactoryFileInfo = ServiceCreateFilesFileInfoFactory.createFromJsObj({
            fileName: _.lowerFirst(serviceDaoSqlFactoryClassName),
            destinationDirectory: daoFolderPath,
            className: serviceDaoSqlFactoryClassName
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

        return ServiceCreateFilesAllFileInfoFactory.createFromJsObj({
            service: serviceFileInfo,
            serviceFactory: serviceFactoryFileInfo,
            serviceDao: serviceDaoFileInfo,
            serviceDaoSqlFactory: serviceDaoSqlFactoryFileInfo,
            serviceCreateArgsVo: serviceCreateArgsVoFileInfo,
            serviceCreateArgsVoFactory: serviceCreateArgsVoFactoryFileInfo,
            serviceCoreVo: serviceCoreVoFileInfo,
            serviceCoreVoFactory: serviceCoreVoFactoryFileInfo
        })
    }
}

module.exports = ServiceCreateFilesAllFileInfoFactory;