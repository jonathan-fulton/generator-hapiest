'use strict';

const VO = require('hapiest-vo');

class FactoryCreateFileArgs extends VO {

    /**
     * @param {object} obj
     * @param {Base} obj.generatorContext
     * @param {string} obj.destinationDirectory
     * @param {string} obj.factoryClassName
     * @param {string[]} obj.factoryFunctions
     * @param {string} obj.associatedVoClassName
     * @param {string} obj.associatedVoFileName
     * @param {VoClassProperty[]} obj.associatedVoProperties
     */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    
    /**
     * @return {Base}
     */
    get generatorContext() {return this.get('generatorContext');}

    /**
     * @return {string}
     */
    get destinationDirectory() {return this.get('destinationDirectory');}

    /**
     * @return {string}
     */
    get factoryClassName() {return this.get('factoryClassName');}

    /**
     * @return {string[]}
     */
    get factoryFunctions() {return this.get('factoryFunctions');}

    /**
     * @return {string}
     */
    get associatedVoClassName() {return this.get('associatedVoClassName');}

    /**
     * @return {string}
     */
    get associatedVoFileName() {return this.get('associatedVoFileName');}

    /**
     * @return {VoClassProperty[]}
     */
    get associatedVoProperties() {return this.get('associatedVoProperties');}
    
}

module.exports = FactoryCreateFileArgs;