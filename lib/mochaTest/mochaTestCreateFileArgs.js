'use strict';

const VO = require('hapiest-vo');

class MochaTestCreateFileArgs extends VO {

   /**
    * @param {object} obj
    * @param {MochaTest} obj.test
    * @param {Base} obj.generatorContext
    * @param {string} obj.destinationDirectory
    * @param {string} obj.associatedFilePath
    */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

   /**
    * @returns {MochaTest}
    */
    get test() {
        return this.get('test');
    }

   /**
    * @returns {Base}
    */
    get generatorContext() {
        return this.get('generatorContext');
    }

   /**
    * @returns {string}
    */
    get destinationDirectory() {
        return this.get('destinationDirectory');
    }

    /**
     * @returns {string}
     */
    get associatedFilePath() {
        return this.get('associatedFilePath');
    }

}

module.exports = MochaTestCreateFileArgs;