'use strict';

const Should = require('should');
const Path = require('path');
const Fs = require('fs');
const removeDirectory = require('rimraf');

const Vo = require('../../../generators/factory/index');
const YeomanEnvironment = require('yeoman-environment');
const FactoryService = require('../../../lib/factory/factoryService');
const FactoryCreateFileArgsFactory = require('../../../lib/factory/factoryCreateFileArgsFactory');

const tmpDirectory = Path.resolve(__dirname, '../../unit-helper/factory/tmp');

describe('FactoryService', function() {
    describe('createFile', function() {

        before(function(done) {
            removeDirectory(tmpDirectory, done);
        });

        it('1) Should generate a Factory file with all properties', function(done) {

            const generatorContext = new Vo({
                env: YeomanEnvironment.createEnv(),
                resolved: Path.resolve(__dirname, 'tmp')
            });

            const createArgs = FactoryCreateFileArgsFactory.createFromJsObj({
                generatorContext: generatorContext,
                destinationDirectory: tmpDirectory,
                factoryClassName: 'MyObjFactory',
                factoryFunctions: ['createFromNodeConfig', 'createFromJsObj'],
                associatedVoClassName: 'MyObj',
                associatedVoFilePath: './myObj.js',
                associatedVoProperties: [{name: 'id', type: 'int'}, {name: 'name', type: 'string'}]
            });

            FactoryService.createFile(createArgs);

            generatorContext.fs.commit((err) => {
                try {
                    Should.not.exist(err);

                    const expectedFilePath = Path.join(tmpDirectory, 'myObjFactory.js');
                    const fileExists = Fs.existsSync(expectedFilePath);
                    fileExists.should.be.true;

                    const expectedFileContents = Fs.readFileSync(Path.join(__dirname, '../../unit-helper/factory/expected/1-factoryOutput.js'), 'utf8');
                    const fileContents = Fs.readFileSync(expectedFilePath, 'utf8');
                    fileContents.should.eql(expectedFileContents);
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

        afterEach(function(done) {
            removeDirectory(tmpDirectory, done);
            //done();
        });
    });

});
