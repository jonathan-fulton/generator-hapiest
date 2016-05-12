'use strict';

const MyObj = require('./myObj');

class MyObjFactory {

    /**
     * @returns {MyObj}
     */
    static createFromNodeConfig() {
        return new MyObj({});
    }

    /**
     * @returns {MyObj}
     */
    static createFromJsObj() {
        return new MyObj({});
    }

}

module.exports = MyObjFactory;