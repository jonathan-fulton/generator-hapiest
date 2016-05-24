'use strict';

const Should = require('should');
const Path = require('path');
const Fs = require('fs');
const removeDirectory = require('rimraf');
const YeomanEnvironment = require('yeoman-environment');

const ServiceGenerator = require('../../../generators/service/index');
const ServiceService = require('../../../lib/service/serviceService');
const ServiceCreateFilesArgsFactory = require('../../../lib/service/serviceCreateFilesArgsFactory');

const tmpDirectory = Path.resolve(__dirname, '../../unit-helper/service/tmp');

describe('ServiceService', function() {
    describe('createFiles', function() {

        before(function(done) {
            removeDirectory(tmpDirectory, done);
        });

        afterEach(function(done) {
            removeDirectory(tmpDirectory, done);
            //done();
        });

        it('should work', function(done) {
            const generatorContext = new ServiceGenerator({
                env: YeomanEnvironment.createEnv(),
                resolved: tmpDirectory
            });
            generatorContext.destinationRoot(tmpDirectory);

            const createArgs = ServiceCreateFilesArgsFactory.createFromJsObj({
                generatorContext: generatorContext,
                serviceName: 'UserDownload',
                includeCreateOperation: true,
                includeReadOperation: true,
                includeUpdateOperation: true,
                includeDeleteOperation: true,
                includeCreateArgsVO: true,
                includeCoreVo: true,
                createArgsVoProperties: [
                    {name: 'firstName', type: 'string'},
                    {name: 'lastName', type: 'string'},
                    {name: 'email', type: 'string'},
                    {name: 'numSignupAttempts', type: 'int'}
                ],
                coreVoProperties: [
                    {name: 'id', type: 'int'},
                    {name: 'firstName', type: 'string'},
                    {name: 'lastName', type: 'string'},
                    {name: 'email', type: 'string'},
                    {name: 'numSignupAttempts', type: 'int'},
                    {name: 'dateCreated', type: 'Date'}
                ],
                chanceSeed: 10
            });

            ServiceService.createFiles(createArgs);

            generatorContext.fs.commit((err) => {
                try {

                    const coreFilesToTest = [
                        'userDownloadService.js',
                        'userDownloadServiceFactory.js',
                        'create/userDownloadServiceCreateArgs.js',
                        'create/userDownloadServiceCreateArgsFactory.js',
                        'get/userDownload.js',
                        'get/userDownloadFactory.js',
                        'dao/userDownloadDao.js',
                        'dao/userDownloadDaoFactory.js'
                    ];

                    testCoreFiles(coreFilesToTest, 'root-1');

                    const testFilesToTest = [
                        'test-userDownloadService.js'
                    ];

                    testTestFiles(testFilesToTest, 'root-1');

                    done();
                } catch(e) {
                    done(e);
                }
            });
        });

    });
});

function testCoreFiles(filesToTest, expectedRootFolderName) {
    filesToTest.forEach(file => {

        const expectedFilePath = Path.join(__dirname, '../../unit-helper/service/expected/', expectedRootFolderName, 'app/services/userDownload/', file);
        const generatedFilePath = Path.join(tmpDirectory, 'app/services/userDownload/', file);

        const expectedFileContents = Fs.readFileSync(expectedFilePath, 'utf8');
        const generatedFileContents = Fs.readFileSync(generatedFilePath, 'utf8');

        Should.exist(generatedFileContents);
        generatedFileContents.should.eql(expectedFileContents);
    });
}

function testTestFiles(filesToTest, expectedRootFolderName) {
    filesToTest.forEach(file => {

        const expectedFilePath = Path.join(__dirname, '../../unit-helper/service/expected/', expectedRootFolderName, 'test/unit/app/services/', file);
        const generatedFilePath = Path.join(tmpDirectory, 'test/unit/app/services/', file);

        const expectedFileContents = Fs.readFileSync(expectedFilePath, 'utf8');
        const generatedFileContents = Fs.readFileSync(generatedFilePath, 'utf8');

        Should.exist(generatedFileContents);
        generatedFileContents.should.eql(expectedFileContents);
    });
}