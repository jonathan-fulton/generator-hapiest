'use strict';

const _ = require('lodash');
const Path = require('path');

const ClassFactory = require('../class/classFactory');
const ClassCreateFileArgsFactory = require('../class/classCreateFileArgsFactory');
const ClassService = require('../class/classService');

class VoService {

    /**
     * @param {VoCreateFileArgs} createArgs
     * @returns {string} path to file created
     */
    static createFile(createArgs) {
        const className = _.upperFirst(_.camelCase(createArgs.className));
        const classObj = ClassFactory.createVoClass({className: className, voProperties: createArgs.classProperties});

        const createClassFileArgs = ClassCreateFileArgsFactory.create({
            class: classObj,
            generatorContext: createArgs.generatorContext,
            destinationDirectory: createArgs.destinationDirectory
        });

        return ClassService.createFile(createClassFileArgs);
    }
    
}

module.exports = VoService;
