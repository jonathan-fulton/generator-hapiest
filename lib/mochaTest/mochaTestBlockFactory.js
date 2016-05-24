'use strict';

const _ = require('lodash');

const MochaTestBlock = require('./mochaTestBlock');

class MochaTestBlockFactory {

   /**
    * @param {object} obj
    * @param {string} obj.functionName
    * @param {string} obj.description
    * @param {Array.<MochaTestBlock|object>|string} obj.callbackBody
    * @param {boolean} obj.passDoneToCallback
    *
    * @returns {MochaTestBlock}
    */
    static createFromJsObj(obj) {

        const callbackBody = Internal.convertToArrayOfMochaTestBlock(obj.callbackBody);

        const newArgs = {
            functionName: obj.functionName,
            description: obj.description,
            callbackBody: callbackBody,
            passDoneToCallback: obj.passDoneToCallback
        };

       return new MochaTestBlock(newArgs);
    }

    /**
     * @param {Array.<object>|string} objArr
     * @returns {Array.<MochaTestBlock>|string}
     */
    static createFromJsObjArrOrString(objArr) {
        if (typeof(objArr) === 'string') {
            return objArr;
        } else {
            const results = [];
            objArr.forEach(obj => results.push(MochaTestBlockFactory.createFromJsObj(obj)));
            return results;
        }
    }

    /**
     * @param {object} obj
     * @param {description} obj.description
     * @param {Array.<MochaTestBlock|object>|string} obj.callbackBody
     *
     * @returns {MochaTestBlock}
     */
    static describe(obj) {
        const callbackBody = Internal.convertToArrayOfMochaTestBlock(obj.callbackBody);
        const newArgs = {
            functionName: 'describe',
            description: obj.description,
            callbackBody: callbackBody,
            passDoneToCallback: false
        };

        return MochaTestBlockFactory.createFromJsObj(newArgs);
    }

    /**
     * @param {object} obj
     * @param {description} obj.description
     * @param {string} obj.callbackBody
     * @param {boolean} obj.passDoneToCallback
     *
     * @returns {MochaTestBlock}
     */
    static it(obj) {
        const newArgs = {
            functionName: 'it',
            description: obj.description,
            callbackBody: obj.callbackBody,
            passDoneToCallback: obj.passDoneToCallback
        };

        return MochaTestBlockFactory.createFromJsObj(newArgs);
    }

}

module.exports = MochaTestBlockFactory;

class Internal {

    /**
     * @param {Array.<MochaTestBlock|object>|string} callbackBody
     * @returns {MochaTestBlock[]|string}
     */
    static convertToArrayOfMochaTestBlock(callbackBody) {
        if (typeof(callbackBody) === 'string') {
            return callbackBody
        } else {
            let cbBody = [];
            callbackBody.forEach(block => {
                if (block instanceof MochaTestBlock) {
                    cbBody.push(block);
                } else {
                    cbBody.push(MochaTestBlockFactory.createFromJsObj(block));
                }
            });
            return cbBody;
        }
    }

}