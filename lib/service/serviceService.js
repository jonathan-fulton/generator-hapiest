'use strict';

const _ = require('lodash');

const ClassFactory = require('../class/classFactory');
const ClassCreateFileArgsFactory = require('../class/classCreateFileArgsFactory');
const ClassService = require('../class/classService');

const ServiceCreateAllFileInfoFactory = require('./serviceCreateFilesAllFileInfoFactory');

class ServiceService {

    /**
     * @param {ServiceCreateFilesArgs} createArgs
     */
    static createFiles(createArgs) {
        const allFileInfo = ServiceCreateAllFileInfoFactory.createFromCreateArgs(createArgs);
        const createFiles = new CreateFiles(allFileInfo, createArgs);

        createFiles.createServiceFile();
        createFiles.createServiceFactoryFile();
        createFiles.createServiceDaoFile();
        createFiles.createServiceDaoFactory();
        createFiles.createCreateArgsVoFile();
        createFiles.createCreateArgsVoFactoryFile();
        createFiles.createCoreVoFile();
        createFiles.createCoreVoFactoryFile();
    }
    
}

module.exports = ServiceService;

class CreateFiles {

    /**
     * @param {ServiceCreateFilesAllFileInfo} allFileInfo
     * @param {ServiceCreateFilesArgs} createArgs
     */
    constructor(allFileInfo, createArgs) {
        this._allFileInfo = allFileInfo;
        this._createArgs = createArgs;
    }

    createServiceFile() {
        const dependencies = [];
        const methods = [];

        methods.push({
            name: 'constructor',
            type: 'instance',
            args: [
                {name: 'dao', type: this._allFileInfo.serviceDao.className},
                {name: 'logger', type: 'Logger'}
            ],
            body:
`        this._dao = dao;
        this._logger = logger;`
        });

        methods.push({name: 'create', type: 'instance', args: [{name:'createArgs', type:'*'}],
            returnType: 'Promise.<int,Error>',
            body:
`        return this._dao.create(createArgs)
            .catch(err => {
                this._logger.error(err.message, {createArgs: createArgs, err:err});
                throw new Error('${this._allFileInfo.service.className}.create failed');
            });`
        });

        methods.push({name: 'getById', type: 'instance', args: [{name: 'id', type: 'int'}]
            , returnType: 'Promise.<' + this._allFileInfo.serviceCoreVo.className+ ',Error>'
            , body:
`        return this._dao.getOneById(id)
            .catch(err => {
                this._logger.error(err.message, {id: id, err:err});
                throw new Error('${this._allFileInfo.service.className}.getById failed');
            });`
        });

        methods.push({name: 'updateById', type: 'instance', args: [{name: 'id', type: 'int'}, {name: 'updateArgs', type: 'createArgs'}]
            , returnType: 'Promise.<int,Error>'
            , body:
                `        return this._dao.updateById(id, updateArgs)
            .catch(err => {
                this._logger.error(err.message, {id: id, updateArgs: updateArgs, err:err});
                throw new Error('${this._allFileInfo.service.className}.updateById failed');
            });`
        });

        methods.push({name: 'deleteById', type: 'instance', args: [{name: 'id', type: 'int'}]
            , returnType: 'Promise.<int,Error>'
            , body:
                `        return this._dao.deleteById(id)
            .catch(err => {
                this._logger.error(err.message, {id: id, err:err});
                throw new Error('${this._allFileInfo.service.className}.deleteById failed');
            });`
        });

        this._createFile({
            className: this._allFileInfo.service.className,
            dependencies: dependencies,
            methods: methods,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.service.destinationDirectory
        });
    }

    createServiceFactoryFile() {
        const dependencies = [];
        dependencies.push({variableName: this._allFileInfo.service.className, requireString: './'+this._allFileInfo.service.fileName});
        dependencies.push({variableName: this._allFileInfo.serviceDaoFactory.className, requireString: './dao/'+this._allFileInfo.serviceDaoFactory.fileName});

        const methods = [];
        methods.push({
            name: 'create',
            type: 'static',
            args: [{name: 'mysqlService', type: 'MysqlService'},{name: 'logger', type: 'Logger'}],
            returnType: this._allFileInfo.service.className,
            body:
`        const dao = ${this._allFileInfo.serviceDaoFactory.className}.create(mysqlService, logger);
        return new ${this._allFileInfo.service.className}(dao, logger);`
        });

        this._createFile({
            className: this._allFileInfo.serviceFactory.className,
            dependencies: dependencies,
            methods: methods,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceFactory.destinationDirectory
        });
    }

    createServiceDaoFile() {
        const dependencies = [{variableName: 'MysqlDao', requireString: 'hapiest-mysql/lib/mysqlDao'}];
        const methods = [{
            name: 'getOneById',
            type: 'instance',
            args: [{name: 'id', type: 'int'}],
            returnType: `Promise.<${this._allFileInfo.serviceCoreVo.className}>`,
            body:
`       return super.getOneById(id);`
        }, {
            name: 'getOne',
            type: 'instance',
            args: [{name: 'whereClause', type: 'object'}],
            returnType: `Promise.<${this._allFileInfo.serviceCoreVo.className}>`,
            body:
`       return super.getOne(whereClause);`
        }, {
            name: 'getAll',
            type: 'instance',
            args: [{name: 'whereClause', type: 'object'}],
            returnType: `Promise.<${this._allFileInfo.serviceCoreVo.className}[]>`,
            body:
`       return super.getAll(whereClause);`
        }];

        this._createFile({
            className: this._allFileInfo.serviceDao.className,
            dependencies: dependencies,
            methods: methods,
            extends: 'MysqlDao',
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceDao.destinationDirectory
        });
    }

    createServiceDaoFactory() {
        const dependencies = [
            {variableName: 'Dao', requireString: './' + this._allFileInfo.serviceDao.fileName},
            {variableName: 'MysqlDaoArgsFactory', requireString: 'hapiest-mysql/lib/mysqlDaoArgsFactory'},
            {variableName: 'VoFactory', requireString: '../get/' + this._allFileInfo.serviceCoreVoFactory.fileName}
        ];
        const methods = [];

        const tableName = _.snakeCase(this._allFileInfo.serviceCoreVo.className)+'s';
        methods.push({
            name: 'create',
            type: 'static',
            args: [{name: 'mysqlService', type: 'MysqlService'}, {name: 'logger', type: 'Logger'}],
            returnType: `${this._allFileInfo.serviceDao.className}`,
            body:
`       const daoArgs = MysqlDaoArgsFactory.createFromJsObj({
            mysqlService: mysqlService,
            createVoFromDbRowFunction: VoFactory.createFromDbRow,
            logger: logger,
            tableName: '${tableName}'
        });
        const dao = new Dao(daoArgs);
        return dao;`
        });

        this._createFile({
            className: this._allFileInfo.serviceDaoFactory.className,
            dependencies: dependencies,
            methods: methods,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceDaoFactory.destinationDirectory
        });
    }

    createCreateArgsVoFile() {
        const classObj = ClassFactory.createVoClass({
            className: this._allFileInfo.serviceCreateArgsVo.className,
            voProperties: this._createArgs.createArgsVoProperties
        });

        this._createFileFromClass({
            class: classObj,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceCreateArgsVo.destinationDirectory
        });
    }

    createCreateArgsVoFactoryFile() {
        const factoryClass = ClassFactory.createFactoryClass({
            factoryClassName: this._allFileInfo.serviceCreateArgsVoFactory.className,
            factoryFunctions: ['createFromJsObj'],
            associatedVoClassName: this._allFileInfo.serviceCreateArgsVo.className,
            associatedVoFileName: this._allFileInfo.serviceCreateArgsVo.fileName,
            associatedVoProperties: this._createArgs.createArgsVoProperties
        });

        this._createFileFromClass({
            class: factoryClass,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceCreateArgsVoFactory.destinationDirectory
        });
    }

    createCoreVoFile() {
        const classObj = ClassFactory.createVoClass({
            className: this._allFileInfo.serviceCoreVo.className,
            voProperties: this._createArgs.coreVoProperties
        });

        this._createFileFromClass({
            class: classObj,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceCoreVo.destinationDirectory
        });
    }

    createCoreVoFactoryFile() {
        const factoryClass = ClassFactory.createFactoryClass({
            factoryClassName: this._allFileInfo.serviceCoreVoFactory.className,
            factoryFunctions: ['createFromJsObj'],
            associatedVoClassName: this._allFileInfo.serviceCoreVo.className,
            associatedVoFileName: this._allFileInfo.serviceCoreVo.fileName,
            associatedVoProperties: this._createArgs.coreVoProperties,
            addCreateFromDbFunctions: true
        });

        this._createFileFromClass({
            class: factoryClass,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceCoreVoFactory.destinationDirectory
        });
    }

    /**
     * @param {{className: string, extends: string|null, dependencies: array, methods: array, context: Base, destinationDirectory: string}} args
     */
    _createFile(args) {
        const classObj = ClassFactory.createFromJsObj({
            name: args.className,
            extends: args.extends,
            dependencies: args.dependencies,
            methods: args.methods
        });

        this._createFileFromClass({class: classObj, context: args.context, destinationDirectory: args.destinationDirectory});
    }

    /**
     * @param {{class: Class, context: Base, destinationDirectory: string}} args
     * @private
     */
    _createFileFromClass(args) {
        const createFileArgs = ClassCreateFileArgsFactory.create({
            class: args.class,
            generatorContext: args.context,
            destinationDirectory: args.destinationDirectory
        });

        ClassService.createFile(createFileArgs);
    }

}