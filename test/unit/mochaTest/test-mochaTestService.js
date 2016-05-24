'use strict';

'use strict';

const Should = require('should');
const Path = require('path');
const Fs = require('fs');
const removeDirectory = require('rimraf');
const YeomanEnvironment = require('yeoman-environment');

const MochaTestGenerator = require('../../../generators/mochaTest/index');
const MochaTestService = require('../../../lib/mochaTest/mochaTestService');
const MochaTestCreateFilesArgsFactory = require('../../../lib/mochaTest/mochaTestCreateFileArgsFactory');
const MochaTestFactory = require('../../../lib/mochaTest/mochaTestFactory');

const tmpDirectory = Path.resolve(__dirname, '../../unit-helper/mochaTest/tmp');

describe('MochaTestService', function() {
    describe('createFiles', function() {

        before(function(done) {
            removeDirectory(tmpDirectory, done);
        });

        afterEach(function(done) {
            removeDirectory(tmpDirectory, done);
            //done();
        });

        it('should work', function(done) {
            const generatorContext = new MochaTestGenerator({
                env: YeomanEnvironment.createEnv(),
                resolved: tmpDirectory
            });
            generatorContext.destinationRoot(tmpDirectory);
            
            const test = MochaTestFactory.createFromJsObj({
                dependencies: [
                    {variableName: 'Should', requireString: 'should'},
                    {variableName: 'UserService', requireString: '../../../lib/app/services/user/userService'}
                ],
                describeBlocks: [{
                    functionName: 'describe',
                    description: 'UserService',
                    passDoneToCallback: false,
                    callbackBody: [{
                        functionName: 'describe',
                        description: 'create',
                        passDoneToCallback: false,
                        callbackBody: [{
                            functionName: 'it',
                            description: 'Should create a user in the database',
                            passDoneToCallback: true,
                            callbackBody: `done(new Error('Not implemented'));`
                        }, {
                            functionName: 'it',
                            description: 'Should create another user in the database',
                            passDoneToCallback: true,
                            callbackBody: `done(new Error('Not implemented'));`
                        }]
                    }, {
                        functionName: 'describe',
                        description: 'getById',
                        passDoneToCallback: false,
                        callbackBody: [{
                            functionName: 'it',
                            description: 'Should fetch a user by id',
                            passDoneToCallback: false,
                            callbackBody:
`const id = 1;
throw new Error('Not implemented');`
                        }]
                    }]
                }]
            });

            const createArgs = MochaTestCreateFilesArgsFactory.createFromJsObj({
                test: test,
                generatorContext: generatorContext,
                destinationDirectory: generatorContext.destinationRoot(),
                associatedFilePath: 'app/services/user/userService.js'
            });

            const generatedFilePath = MochaTestService.createFile(createArgs);

            generatorContext.fs.commit((err) => {
                try {
                    const expectedFilePath = Path.join(__dirname, '../../unit-helper/mochaTest/test-1/1-mochaTestOutput.js');

                    const expectedFileContents = Fs.readFileSync(expectedFilePath, 'utf8');
                    const generatedFileContents = Fs.readFileSync(generatedFilePath, 'utf8');

                    generatedFileContents.should.eql(expectedFileContents);

                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

    });
});