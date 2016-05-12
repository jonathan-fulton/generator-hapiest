'use strict';

const MyObj = require('./myObj');

class MyObjFactory {

    /**
     * @param {object} obj
     * @param {int} obj.id
     * @param {string} obj.name
     *
     * @returns {MyObj}
     */
    static createFromNodeConfig(obj) {
        const newArgs = {
          id: obj.id,
          name: obj.name
        };
            
        return new MyObj(newArgs);
    }

    /**
     * @param {object} obj
     * @param {int} obj.id
     * @param {string} obj.name
     *
     * @returns {MyObj}
     */
    static createFromJsObj(obj) {
        const newArgs = {
          id: obj.id,
          name: obj.name
        };
            
        return new MyObj(newArgs);
    }

}

module.exports = MyObjFactory;