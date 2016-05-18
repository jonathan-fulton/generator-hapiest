'use strict';

const ClassMethodArgument = require('./classMethodArgument');

class ClassMethodArgumentFactory {

    /**
     * @param {object} obj
     * @param {string} obj.name
     * @param {string} obj.type
     * @param {{name: string, type: string}[]|null} obj.jsDocTypes
     *
     * @returns {ClassMethodArgument}
     */
    static createFromJsObj(obj) {

        let jsDocTypes = null;
        if (obj.jsDocTypes) {
            jsDocTypes = ClassMethodArgumentFactory.createFromJsObjArr(obj.jsDocTypes);
        }

        const newArgs = {
            name: obj.name,
            type: obj.type,
            jsDocTypes: jsDocTypes
        };
            
        return new ClassMethodArgument(newArgs);
    }

    /**
     * @param {{name: string, type: string, jsDocTypes:{name: string, type: string}[]|null}[]} jsObjArr
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