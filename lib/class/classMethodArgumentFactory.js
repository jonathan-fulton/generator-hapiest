'use strict';

const ClassMethodArgument = require('./classMethodArgument');

class ClassMethodArgumentFactory {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {string} obj.type
     *
     * @returns {ClassMethodArgument}
     */
    static createFromJsObj(obj) {
        const newArgs = {
          name: obj.name,
          type: obj.type
        };
            
        return new ClassMethodArgument(newArgs);
    }

    /**
     * @param {{name: string, type: string}[]} jsObjArr
     * 
     * @returns {ClassMethodArgument[]}
     */
    static createFromJsObjArr(jsObjArr) {
        const args = [];
        jsObjArr.forEach(obj => {
            args.push(ClassMethodArgumentFactory.createFromJsObj(obj));
        });
        return args;
    }

}

module.exports = ClassMethodArgumentFactory;