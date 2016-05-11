'use strict';

const VO = require('hapiest-vo');

class VoCreateFileArgs extends VO {

    /**
     * @param {object} obj
     * @param {Base} obj.generatorContext
     * @param {string} obj.className
     * @param {VoClassProperty[]} obj.classProperties
     * @param {string} obj.destinationPath
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
    get className() {return this.get('className');}

    /**
     * @returns {VoClassProperty[]}
     */
    get classProperties() {return this.get('classProperties');}

    /**
     * @returns {string}
     */
    get destinationDirectory() {return this.get('destinationDirectory');}
}

module.exports = VoCreateFileArgs;