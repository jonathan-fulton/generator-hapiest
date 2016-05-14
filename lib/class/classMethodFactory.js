'use strict';

const ClassMethod = require('./classMethod');
const ClassMethodArgumentFactory = require('./classMethodArgumentFactory');

class ClassMethodFactory {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {'instance'|'static'|'get'|'set'} obj.type
     * @param {{name: string, type: string}[]} obj.args
     * @param {string} obj.body
     * @param {string} obj.returnType
     *
     * @returns {ClassMethod}
     */
    static createFromJsObj(obj) {
        const newArgs = {
            name: obj.name,
            type: obj.type,
            args: obj.args,
            body: obj.body,
            returnType: obj.returnType
        };
            
        return new ClassMethod(newArgs);
    }

    /**
     * @param {{name: string, type: string, args:{name: string, type: string}[], body: string, returnType: string}[]} jsObjArr
     */
    static createFromJsObjArr(jsObjArr) {
        const methods = [];
        jsObjArr.forEach(obj => {
            methods.push(ClassMethodFactory.createFromJsObj(obj));
        });
        return methods;
    }

}

module.exports = ClassMethodFactory;