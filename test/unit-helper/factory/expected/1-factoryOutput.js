'use strict';

const _ = require('lodash');
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
       const newArgs = _.cloneDeep(obj);
       return MyObjFactory.createFromJsObj(newArgs);
    }

   /**
    * @param {object} obj
    * @param {int} obj.id
    * @param {string} obj.name
    *
    * @returns {MyObj}
    */
    static createFromJsObj(obj) {
       const newArgs = _.cloneDeep(obj);
       return new MyObj(newArgs);
    }

}

module.exports = MyObjFactory;