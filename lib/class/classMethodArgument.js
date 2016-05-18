'use strict';

const VO = require('hapiest-vo');

class ClassMethodArgument extends VO {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {string} obj.type
     * @param {ClassMethodArgument[]|null} obj.jsDocTypes
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
     * @returns {string}
     */
    get type() {return this.get('type');}

    /**
     * @returns {ClassMethodArgument[]|null}
     */
    get jsDocTypes() {return this.get('jsDocTypes');}
    
}

module.exports = ClassMethodArgument;