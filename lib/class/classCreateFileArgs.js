'use strict';

const VO = require('hapiest-vo');

class ClassCreateFileArgs extends VO {

    /**
     * @param {object} obj
     * @param {Class} obj.class
     * @param {Base} obj.generatorContext
     * @param {string} obj.destinationDirectory
     */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    
    /**
     * @returns {Class}
     */
    get class() {return this.get('class');}
    
    /**
     * @returns {Base}
     */
    get generatorContext() {return this.get('generatorContext');}
    
    /**
     * @returns {string}
     */
    get destinationDirectory() {return this.get('destinationDirectory');}
    
}

module.exports = ClassCreateFileArgs;