'use strict';

const VO = require('hapiest-vo');

class MochaTest extends VO {

   /**
    * @param {object} obj
    * @param {MochaTestDependency[]} obj.dependencies
    * @param {MochaTestBlock[]} obj.describeBlocks
    */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

   /**
    * @returns {MochaTestDependency[]}
    */
    get dependencies() {
        return this.get('dependencies');
    }

   /**
    * @returns {MochaTestBlock[]}
    */
    get describeBlocks() {
        return this.get('describeBlocks');
    }

}

module.exports = MochaTest;