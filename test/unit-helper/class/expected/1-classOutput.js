'use strict';

const foo = require('./someFile');
const bar = require('./anotherFile');

class MyAwesomeClass extends BlahParentClass {

   /**
    * @param {string} arg1
    * @param {int} arg2
    *
    * @returns {string}
    */
    doThis(arg1, arg2) {

    }

   /**
    * @param {object} first
    *
    * @returns {string}
    */
    static anotherFunction(first) {
        const foo = blah(first);
        const bar = blahAgain(foo);
        return bar;
    }

   /**
    * @param {object} obj
    * @param {string} obj.prop1
    * @param {int} obj.prop2
    *
    * @returns {int}
    */
    get noArgs(obj) {

    }

}

module.exports = MyAwesomeClass;