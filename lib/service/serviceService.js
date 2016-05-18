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
        createFiles.createServiceDaoSqlFactory();
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

        if (this._createArgs.includeCreateOperation) {
            methods.push({name: 'create', type: 'instance', args: [{name:'createArgs', type:'*'}],
                returnType: 'Promise.<int,Error>',
                body:
`        return this._dao.create(createArgs)
                .then(newId => newId)
                .catch(err => {
                    this._logger.error(err.message, {createArgs: createArgs, err:err});
                    throw new Error('${this._allFileInfo.service.className}.create failed');
                });`
            });
        }

        if (this._createArgs.includeReadOperation) {
            methods.push({name: 'get', type: 'instance', args: [{name: 'id', type: 'int'}]
                , returnType: 'Promise.<' + this._allFileInfo.serviceCoreVo.className+ ',Error>'
                , body: 
`        return this._dao.get(id)
                .then(${this._allFileInfo.serviceCoreVo.fileName} => ${this._allFileInfo.serviceCoreVo.fileName})
                .catch(err => {
                    this._logger.error(err.message, {id: id, err:err});
                    throw new Error('${this._allFileInfo.service.className}.get failed');
                });`
            });
        }

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
        dependencies.push({variableName: this._allFileInfo.serviceDao.className, requireString: './dao/'+this._allFileInfo.serviceDao.fileName});

        const methods = [];
        methods.push({
            name: 'create',
            type: 'static',
            args: [{name: 'mysqlService', type: 'MysqlService'},{name: 'logger', type: 'Logger'}],
            body:
`        const dao = new ${this._allFileInfo.serviceDao.className}(mysqlService, logger);
        return new ${this._allFileInfo.service.className}(dao, logger);`,
            returnType: this._allFileInfo.service.className
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
        const dependencies = [
            {variableName: 'SqlFactory', requireString: './'+this._allFileInfo.serviceDaoSqlFactory.fileName},
            {variableName: this._allFileInfo.serviceCoreVoFactory.className, requireString: './'+this._allFileInfo.serviceCoreVoFactory.fileName}
        ];
        const methods = [];

        methods.push({name:'constructor', type:'instance',
            args:[{name:'mysqlService', type:'MysqlService'},{name:'logger', type:'Logger'}],
            body:
`        this._mysqlService = mysqlService;
        this._sqlFactory = new SqlFactory(this._mysqlService.clean.bind(this._mysqlService));`
        });

        if (this._createArgs.includeCreateOperation) {
            methods.push({name: 'create', type: 'instance', args: [{name: 'createArgs', type: '*'}],
                returnType: 'Promise.<int,Error>',
                body:
`            return Promise.resolve()
                .then(() => this._sqlFactory.getCreateSql(createArgs))
                .then(createSql => Promise.all([this._mysqlService.insertQuery(createSql)]))
                .then(result => result.insertedId)
                .catch(err => {
                    this._logger.error(err.message, {createArgs: createArgs, err:err});
                    throw new Error('${this._allFileInfo.serviceDao.className}.create failed');
                });`
            });
        }

        if (this._createArgs.includeReadOperation) {
            methods.push({name: 'get', type: 'instance', args: [{name: 'id', type: 'int'}],
                returnType: 'Promise.<'+this._allFileInfo.serviceCoreVo.className+',Error>',
                body:
`           return Promise.resolve()
                .then(() => this._sqlFactory.getSelectSql(id))
                .then(selectSql => Promise.all([this._mysqlService.selectOne(selectQuery)]))
                .then((result) => ${this._allFileInfo.serviceCoreVoFactory.className}.create(result))
                .catch(err => {
                    this._logger.error(err.message, {id: id, err:err});
                    throw new Error('${this._allFileInfo.serviceDao.className}.get failed');
                });`
            });
        }

        this._createFile({
            className: this._allFileInfo.serviceDao.className,
            dependencies: dependencies,
            methods: methods,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceDao.destinationDirectory
        });
    }

    createServiceDaoSqlFactory() {
        const dependencies = [{variableName: 'Squel', requireString: 'squel'}];
        const methods = [];

        // @TODO: add squel query builder dependency

        methods.push({name:'constructor', type:'instance',
            args:[{name:'cleanFunction', type:'function(any)'}],
            body:
`        this._clean = cleanFunction;`
        });

        const tableName = _.snakeCase(this._allFileInfo.serviceCoreVo.className) + 's';
        const propToDbFieldMapping = {};
        this._createArgs.createArgsVoProperties.forEach(prop => {
            propToDbFieldMapping[prop.name] = _.snakeCase(prop.name);
        });

        if (this._createArgs.includeCreateOperation) {

            let cleanedParams = '';
            let dbFieldRow = '';
            this._createArgs.createArgsVoProperties.forEach((prop,index) => {
                cleanedParams +=
`        const clean_${prop.name} = this._clean(createArgs.${prop.name});` + "\n";

                dbFieldRow +=
`                   ${propToDbFieldMapping[prop.name]}: clean_${prop.name}`
                + (index < this._createArgs.createArgsVoProperties.length - 1 ? ",\n" : '');
            });

            methods.push({name: 'getCreateSql', type: 'instance', args: [{name: 'createArgs', type: this._allFileInfo.serviceCreateArgsVo.className}],
                returnType: 'string',
                body:
`${cleanedParams}
        const sql = 
            Squel.insert().into('${tableName}')
                .setFields({
${dbFieldRow}
                })
                .toString();
        return sql;`
            });
        }

        if (this._createArgs.includeReadOperation) {
            methods.push({name: 'getSelectSql', type: 'instance', args: [{name: 'id', type: 'int'}],
                returnType: 'string',
                body:
`        const clean_id = this._clean(id);
        const sql = 
                Squel.select().from('${tableName}')
                    .where(\`id = \$\{clean_id\}\`)
                    .toString();
        return sql;`
            });
        }

        this._createFile({
            className: this._allFileInfo.serviceDaoSqlFactory.className,
            dependencies: dependencies,
            methods: methods,
            context: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceDaoSqlFactory.destinationDirectory
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