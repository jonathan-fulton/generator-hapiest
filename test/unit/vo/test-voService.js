'use strict';

const Should = require('should');
const Path = require('path');
const Fs = require('fs');
const removeDirectory = require('rimraf');

const Vo = require('../../../generators/vo/index');
const YeomanEnvironment = require('yeoman-environment');
const VoService = require('../../../lib/vo/voService');
const VoCreateFileArgsFactory = require('../../../lib/vo/voCreateFileArgsFactory');

const tmpDirectory = Path.resolve(__dirname, '../../unit-helper/vo/tmp');

describe('VoService', function() {
    describe('createFile', function() {

        before(function(done) {
            removeDirectory(tmpDirectory, done);
        });

        afterEach(function(done) {
            removeDirectory(tmpDirectory, done);
            //done();
        });

        it('1) Should generate a VO file with all properties', function(done) {

            const generatorContext = new Vo({
                env: YeomanEnvironment.createEnv(),
                resolved: Path.resolve(__dirname, 'tmp')
            });

            const createArgs = VoCreateFileArgsFactory.createFromJsObj({
                generatorContext: generatorContext,
                className: 'MyObj',
                classProperties: [
                    {name: 'id', type: 'int'},
                    {name: 'name', type: 'string'}
                ],
                destinationDirectory: tmpDirectory
            });

            VoService.createFile(createArgs);

            generatorContext.fs.commit((err) => {
                try {
                    Should.not.exist(err);

                    const expectedFilePath = Path.join(tmpDirectory, 'myObj.js');
                    const fileExists = Fs.existsSync(expectedFilePath);
                    fileExists.should.be.true;

                    const expectedFileContents = Fs.readFileSync(Path.join(__dirname, '../../unit-helper/vo/expected/1-voOutput.js'), 'utf8');
                    const fileContents = Fs.readFileSync(expectedFilePath, 'utf8');
                    fileContents.should.eql(expectedFileContents);
                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

    });

});
