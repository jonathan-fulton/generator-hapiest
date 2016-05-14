'use strict';

const VO = require('hapiest-vo');

class Class extends VO {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {ClassDependency[]} obj.dependencies
     * @param {ClassMethod[]} obj.methods
     */
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    
    /**
     * @returns {string}
     */
    get name() {return this.get('name');}
    
    /**
     * @returns {ClassDependency[]}
     */
    get dependencies() {return this.get('dependencies');}
    
    /**
     * @returns {ClassMethod[]}
     */
    get methods() {return this.get('methods');}
    
}

module.exports = Class;