'use strict';

const VO = require('hapiest-vo');

class ClassMethod extends VO {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {'instance'|'static'|'get'|'set'} obj.type
     * @param {ClassMethodArgument} obj.args
     * @param {string} obj.returnType
     * @param {string} obj.body
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
     * @returns {'instance'|'static'|'get'|'set'}
     */
    get type() {return this.get('type');}
    
    /**
     * @returns {ClassMethodArgument[]}
     */
    get args() {return this.get('args');}

    /**
     * @returns {string}
     */
    get returnType() {return this.get('returnType')}

    /**
     * @returns {string}
     */
    get body() {return this.get('body');}
}

module.exports = ClassMethod;