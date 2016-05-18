'use strict';

const VoClassProperty = require('./voClassProperty');

class VoClassPropertyFactory {

    /**
     * @param {{name: string, type: string}} obj
     * @param {string} obj.name
     * @param {string} obj.type
     */
    static createFromJsObj(obj) {
        const newArgs = {
            name: obj.name,
            type: obj.type
        };
        return new VoClassProperty(newArgs);
    }

    /**
     * @param {{name: string, type: string}[]} objArr
     */
    static createFromArrOfJsObj(objArr) {
        const results = [];
        objArr.forEach(obj => results.push(VoClassPropertyFactory.createFromJsObj(obj)));
        return results;
    }

}

module.exports = VoClassPropertyFactory;
