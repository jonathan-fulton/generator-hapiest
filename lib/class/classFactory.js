'use strict';

const _ = require('lodash');
const Path = require('path');

const Class = require('./class');
const ClassDependencyFactory = require('./classDependencyFactory');
const ClassMethodFactory = require('./classMethodFactory');

class ClassFactory {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {{variableName: string, requireString: string}[]} obj.dependencies
     * @param {{name: string, type: string, args:{name: string, type: string}[], body: string, returnType: string}[]} obj.methods
     * @param {string|null} obj.extends
     *
     * @returns {Class}
     */
    static createFromJsObj(obj) {
        const newArgs = {
            name: obj.name,
            dependencies: ClassDependencyFactory.createFromJsObjArr(obj.dependencies),
            methods: ClassMethodFactory.createFromJsObjArr(obj.methods),
            extends: obj.extends || null
        };
            
        return new Class(newArgs);
    }

    /**
     * @param {{className: string, voProperties: VoClassProperty[]}} args
     *
     * @returns {Class}
     */
    static createVoClass(args) {
        const dependencies = [{variableName: 'VO', requireString: 'hapiest-vo'}];

        const jsDocTypesForConstructor = [];
        const methods = [];
        args.voProperties.forEach(property => {
            jsDocTypesForConstructor.push({name: 'obj.'+property.name, type: property.type});
            methods.push({
                name: property.name,
                args: [],
                type: 'get',
                body:
`        return this.get('${property.name}');`,
                returnType: property.type
            })
        });

        methods.unshift({
            name: 'constructor',
            args: [{
                name: 'obj',
                type: 'object',
                jsDocTypes: jsDocTypesForConstructor
            }],
            type: 'instance',
            body:
`        super();
        this._addProperties(obj);`
        });

        return ClassFactory.createFromJsObj({
            name: args.className,
            dependencies: dependencies,
            methods: methods,
            extends: 'VO'
        });
    }

    /**
     * @param args
     * @param {string} args.factoryClassName
     * @param {string[]} args.factoryFunctions
     * @param {string} args.associatedVoClassName
     * @param {string} args.associatedVoFileName
     * @param {VoClassProperty[]} args.associatedVoProperties
     * @param {boolean} args.addCreateFromDbFunctions
     *
     * @returns {Class}
     */
    static createFactoryClass(args) {
        const voFileLocationForRequire = './' + args.associatedVoFileName;
        const dependencies = [
            {variableName: '_', requireString: 'lodash'},
            {variableName: args.associatedVoClassName, requireString: voFileLocationForRequire}
        ];
        const methods = [];

        // Add the request methods from args.factoryFunctions

        const methodArgJsDocTypes = [];
        args.associatedVoProperties.forEach((property,index) => {
            methodArgJsDocTypes.push({name: 'obj.'+property.name, type: property.type});
            const assignmentValue = `obj.${property.name}`;
        });
        const factoryFunctionBodyWithoutReturn =
`       const newArgs = _.cloneDeep(obj);`;


        args.factoryFunctions.forEach(func => {
            const returnStatement = (func === 'createFromJsObj') ?
`       return new ${args.associatedVoClassName}(newArgs);` :
`       return ${args.factoryClassName}.createFromJsObj(newArgs);`;

            const factoryFunctionBody = factoryFunctionBodyWithoutReturn + "\n" + returnStatement;

            methods.push({
                name: func,
                args: [{name: 'obj', type: 'object', jsDocTypes: methodArgJsDocTypes}],
                type: 'static',
                returnType: args.associatedVoClassName,
                body: factoryFunctionBody
            });
        });

        /////////////////////////////////////////////
        // Add the database access methods if requested
        /////////////////////////////////////////////

        if (args.addCreateFromDbFunctions) {

            /////////////////////////////////////////////
            // Single row
            /////////////////////////////////////////////

            const dbRowJsDocTypes = [];
            args.associatedVoProperties.forEach((property, index) => {
                const dbRowPropName = _.snakeCase(property.name);
                dbRowJsDocTypes.push({name: 'dbRow.' + dbRowPropName, type: property.type});
            });
            const dbRowFunctionBody =
`        const newArgs = {};
        Object.keys(dbRow).forEach(column => {
            newArgs[_.camelCase(column)] = dbRow[column];
        });
        return ${args.factoryClassName}.createFromJsObj(newArgs);`;

            methods.push({
                name: 'createFromDbRow',
                args: [{name: 'dbRow', type: 'object', jsDocTypes: dbRowJsDocTypes}],
                type: 'static',
                returnType: args.associatedVoClassName,
                body: dbRowFunctionBody
            });

            /////////////////////////////////////////////
            // Array of rows
            /////////////////////////////////////////////

            methods.push({
                name: 'createFromDbRows',
                args: [{name: 'dbRows', type: 'Object[]'}],
                type: 'static',
                returnType: args.associatedVoClassName + '[]',
                body:
`        const results = [];
        dbRows.forEach(dbRow => results.push(${args.factoryClassName}.createFromDbRow(dbRow)));
        return results;`
            });

        }


        return ClassFactory.createFromJsObj({
            name: args.factoryClassName,
            dependencies: dependencies,
            methods: methods
        })
    }

}

module.exports = ClassFactory;