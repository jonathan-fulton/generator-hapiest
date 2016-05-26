'use strict';

const _ = require('lodash');
const Chance = require('chance');

const ClassFactory = require('../class/classFactory');
const ClassCreateFileArgsFactory = require('../class/classCreateFileArgsFactory');
const ClassService = require('../class/classService');

const MochaTestFactory = require('../mochaTest/mochaTestFactory');
const MochaTestServiceCreateArgsFactory = require('../mochaTest/mochaTestCreateFileArgsFactory');
const MochaTestService = require('../mochaTest/mochaTestService');

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

        createFiles.createServiceTestFile();
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

        methods.push({name: 'create', type: 'instance', args: [{name:'createArgs', type:`${this._allFileInfo.serviceCreateArgsVo.className}`}],
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

    createServiceTestFile() {
        const chance = this._createArgs.chanceSeed ? new Chance(this._createArgs.chanceSeed) : new Chance();

        const relativePathToServiceFolder = '../../../../app/services/' + _.lowerFirst(this._createArgs.serviceName);

        const createVoPropertyValues = {};
        const createVoPropertyUpdateValues = {};

        let createArgJsObj = "{\n";
        let updateArgJsObj = "{\n";
        this._createArgs.createArgsVoProperties.forEach((property,index) => {
            let value = `''`;
            let updateValue = `''`;
            const propertyType = _.lowerCase(property.type);
            if (propertyType === 'string') {
                value = `'${chance.string()}'`;
                updateValue = `'${chance.string()}'`;
            } else if (propertyType === 'int') {
                value = chance.integer({min: 1, max: 10000});
                updateValue = chance.integer({min: 1, max: 10000});
            } else if (propertyType === 'date') {
                value = chance.date();
                updateValue = chance.date();
            } else if (_.includes(['float','double','number'],propertyType)) {
                value = chance.floating();
                updateValue = chance.floating();
            }
            createVoPropertyValues[property.name] = value;
            createVoPropertyUpdateValues[property.name] = updateValue;

            createArgJsObj +=
`    ${property.name}: ${createVoPropertyValues[property.name]}` + (index < this._createArgs.createArgsVoProperties.length-1 ? ",\n" : '');
            updateArgJsObj +=
`           ${property.name}: ${createVoPropertyUpdateValues[property.name]}` + (index < this._createArgs.createArgsVoProperties.length-1 ? ",\n" : '');
        });
        createArgJsObj += "\n}";
        updateArgJsObj +=
`\n        }`;

        const createVoPropertiesObj = {};
        this._createArgs.createArgsVoProperties.map(property => createVoPropertiesObj[property.name] = property.type);

        const voVariable = _.lowerFirst(this._allFileInfo.serviceCoreVo.className);
        let shouldVoCheck =
`Should.exist(${voVariable});\n`;
        let shouldUpdateVoCheck =
`Should.exist(${voVariable});\n`;

        this._createArgs.coreVoProperties.forEach((property,index) => {

            if (createVoPropertiesObj.hasOwnProperty(property.name)) {
                shouldVoCheck +=
`        ${voVariable}.${property.name}.should.eql(${createVoPropertyValues[property.name]});`;
                shouldUpdateVoCheck +=
`        ${voVariable}.${property.name}.should.eql(${createVoPropertyUpdateValues[property.name]});`;
            } else {
                let type = 'String()';
                const propertyType = _.lowerCase(property.type);

                if (propertyType === 'string') {
                    type = 'String()';
                } else if (propertyType === 'int') {
                    type = 'Number()';
                } else if (propertyType === 'date') {
                    type = 'Date()';
                } else if (_.includes(['float','double','number'],propertyType)) {
                    type = 'Number()';
                }
                shouldVoCheck +=
`        ${voVariable}.${property.name}.should.be.a.${type};`;
                shouldUpdateVoCheck +=
`        ${voVariable}.${property.name}.should.be.a.${type};`;
            }

            shouldVoCheck += (index < this._createArgs.coreVoProperties.length-1 ? "\n" : '');
            shouldUpdateVoCheck += (index < this._createArgs.coreVoProperties.length-1 ? "\n" : '');
        });

        const createCallbackBody =
`const createArgs = ${this._allFileInfo.serviceCreateArgsVoFactory.className}.createFromJsObj(${createArgJsObj});
return service.create(createArgs)
    .then(id => {
        const getPromise = service.getById(id);
        return Promise.all([getPromise]).then(results => results[0]);
    })
    .then(${voVariable} => {
        ${shouldVoCheck}
    });`;

        const test = MochaTestFactory.createFromJsObj({
            dependencies: [
                {variableName: 'Should', requireString: 'should'},
                {variableName: 'Promise', requireString: 'bluebird'},
                {variableName: 'NodeConfig', requireString: 'config'},
                {variableName: 'databaseSetup', requireString: '../../../helpers/databaseSetupFactory', postRequireString: '.createFromNodeConfig(NodeConfig)'},
                {variableName: 'ServiceLocatorFactory', requireString: '../../../../app/services/serviceLocatorFactory'},
                {variableName: this._allFileInfo.serviceCoreVo.className, requireString: relativePathToServiceFolder + '/get/' + this._allFileInfo.serviceCoreVo.fileName},
                {variableName: this._allFileInfo.serviceCreateArgsVoFactory.className, requireString: relativePathToServiceFolder + '/create/' + this._allFileInfo.serviceCreateArgsVoFactory.fileName}
            ],
            setupCode:
`const serviceLocator = ServiceLocatorFactory.getServiceLocatorSingleton();
const service = serviceLocator.get${this._allFileInfo.service.className}();

const tablesToReplicate = ['table1','table2','table3'];
const tablesToCopyData = ['table1','table2'];

const dbSetup = () => {
    return databaseSetup.dropAllTables()
            .then(() => {
                return Promise.all([databaseSetup.replicateTables(tablesToReplicate)]);
            })
            .then(() => {
                return Promise.all([databaseSetup.copyDataForTables(tablesToCopyData)])
            });
};

const dbTeardown = () => {
    return databaseSetup.dropAllTables();
};
`,
            describeBlocks: [{
                functionName: 'describe',
                description: `${this._allFileInfo.service.className}`,
                passDoneToCallback: false,
                callbackBody: [{
                    functionName: 'describe',
                    description: 'create',
                    passDoneToCallback: false,
                    callbackBody: [{
                        functionName: 'before',
                        passDoneToCallback: false,
                        callbackBody: 'return dbSetup();'
                    },{
                        functionName: 'after',
                        passDoneToCallback: false,
                        callbackBody: 'return dbTeardown();'
                    },{
                        functionName: 'it',
                        description: `Should create a ${this._allFileInfo.serviceCoreVo.className} entry in the database`,
                        passDoneToCallback: false,
                        callbackBody: createCallbackBody
                    }]
                },{
                    functionName: 'describe',
                    description: 'getById',
                    passDoneToCallback: false,
                    callbackBody: [{
                        functionName: 'before',
                        passDoneToCallback: false,
                        callbackBody: 'return dbSetup();'
                    },{
                        functionName: 'after',
                        passDoneToCallback: false,
                        callbackBody: 'return dbTeardown();'
                    },{
                        functionName: 'it',
                        description: `Should return a ${this._allFileInfo.serviceCoreVo.className} by ID from the database`,
                        passDoneToCallback: false,
                        callbackBody: createCallbackBody
                    }]
                },{
                    functionName: 'describe',
                    description: 'updateById',
                    passDoneToCallback: false,
                    callbackBody: [{
                        functionName: 'before',
                        passDoneToCallback: false,
                        callbackBody: 'return dbSetup();'
                    },{
                        functionName: 'after',
                        passDoneToCallback: false,
                        callbackBody: 'return dbTeardown();'
                    },{
                        functionName: 'it',
                        description: `Should update the ${this._allFileInfo.serviceCoreVo.className} entry in the database`,
                        passDoneToCallback: false,
                        callbackBody:
`let newId = null;
const createArgs = ${this._allFileInfo.serviceCreateArgsVoFactory.className}.createFromJsObj(${createArgJsObj});
return service.create(createArgs)
    .then(id => {
        newId = id;
        const updateArgs = ${this._allFileInfo.serviceCreateArgsVoFactory.className}.createFromJsObj(${updateArgJsObj});
        const updatePromise = service.updateById(id, updateArgs);
        return Promise.all([updatePromise]).then(results => results[0]);
    })
    .then(numRowsModified => {
        Should.exist(numRowsModified);
        numRowsModified.should.eql(1);
    })
    .then(() => {
        const getPromise = service.getById(newId);
        return Promise.all([getPromise]).then(results => results[0]);
    })
    .then(${voVariable} => {
        ${shouldUpdateVoCheck}
    });`
                    }]
                },{
                    functionName: 'describe',
                    description: 'deleteById',
                    passDoneToCallback: false,
                    callbackBody: [{
                        functionName: 'before',
                        passDoneToCallback: false,
                        callbackBody: 'return dbSetup();'
                    },{
                        functionName: 'after',
                        passDoneToCallback: false,
                        callbackBody: 'return dbTeardown();'
                    },{
                        functionName: 'it',
                        description: `Should delete the ${this._allFileInfo.serviceCoreVo.className} entry in the database`,
                        passDoneToCallback: false,
                        callbackBody:
`let newId = null;
const createArgs = ${this._allFileInfo.serviceCreateArgsVoFactory.className}.createFromJsObj(${createArgJsObj});
return service.create(createArgs)
    .then(id => {
        newId = id;
        const deletePromise = service.deleteById(id);
        return Promise.all([deletePromise]).then(results => results[0]);
    })
    .then(numRowsDelete => {
        Should.exist(numRowsDelete);
        numRowsDelete.should.eql(1);
    })
    .then(() => {
        const getPromise = service.getById(newId);
        return Promise.all([getPromise]).then(results => results[0]);
    })
    .then(${voVariable} => {
        Should.not.exist(${voVariable});
    });`
                    }]
                }]
            }]
        });

        const createArgs = MochaTestServiceCreateArgsFactory.createFromJsObj({
            test: test,
            generatorContext: this._createArgs.generatorContext,
            destinationDirectory: this._allFileInfo.serviceTest.destinationDirectory,
            associatedFilePath: this._allFileInfo.service.destinationDirectory + '/' + this._allFileInfo.service.fileName
        });

        MochaTestService.createFile(createArgs);
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