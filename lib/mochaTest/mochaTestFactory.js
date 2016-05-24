'use strict';

const MochaTest = require('./mochaTest');
const MochaTestDependencyFactory = require('./mochaTestDependencyFactory');
const MochaTestBlockFactory = require('./mochaTestBlockFactory');

class MochaTestFactory {

   /**
    * @param {object} obj
    * @param {{variableName: string, requireString: string}[]} obj.dependencies
    * @param {{functionName: string, description: string, callbackBody: Array.<MochaTestBlock>|string, passDoneToCallback: boolean}[]} obj.describeBlocks
    *
    * @returns {MochaTest}
    */
    static createFromJsObj(obj) {
        const newArgs = {
            dependencies: MochaTestDependencyFactory.createFromJsObjArr(obj.dependencies),
            describeBlocks: MochaTestBlockFactory.createFromJsObjArrOrString(obj.describeBlocks)
        };

       return new MochaTest(newArgs);
    }

}

module.exports = MochaTestFactory;