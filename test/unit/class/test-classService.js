'use strict';

const Should = require('should');
const Path = require('path');
const Fs = require('fs');
const removeDirectory = require('rimraf');
const YeomanEnvironment = require('yeoman-environment');

const ClassGenerator = require('../../../generators/class/index');
const ClassService = require('../../../lib/class/classService');
const ClassFactory = require('../../../lib/class/classFactory');
const ClassCreateFileArgsFactory = require('../../../lib/class/classCreateFileArgsFactory');


const tmpDirectory = Path.resolve(__dirname, '../../unit-helper/class/tmp');

describe('ClassService', function() {
    describe('createFile', function() {

        before(function(done) {
            removeDirectory(tmpDirectory, done);
        });

        afterEach(function(done) {
            removeDirectory(tmpDirectory, done);
            //done();
        });

        it('1) Should generate a file matching 1-classOutput', function(done) {
            const classObj = ClassFactory.createFromJsObj({
                name: 'MyAwesomeClass',
                extends: 'BlahParentClass',
                dependencies: [
                    {variableName: 'foo', requireString: './someFile'},
                    {variableName: 'bar', requireString: './anotherFile'}
                ],
                methods: [{
                    name: 'doThis',
                    type: 'instance',
                    args: [{name: 'arg1', type: 'string'}, {name: 'arg2', type: 'int'}],
                    body: '',
                    returnType: 'string'
                }, {
                    name: 'anotherFunction',
                    type: 'static',
                    args: [{name: 'first', type: 'object'}],
                    body:
`        const foo = blah(first);
        const bar = blahAgain(foo);
        return bar;`,
                    returnType: 'string'
                }, {
                    name: 'noArgs',
                    type: 'get',
                    args: [{name: 'obj', type: 'object', jsDocTypes: [{name: 'obj.prop1', type: 'string'},{name: 'obj.prop2', type: 'int'}]}],
                    body: '',
                    returnType: 'int'
                }]
            });

            const generatorContext = new ClassGenerator({
                env: YeomanEnvironment.createEnv(),
                resolved: tmpDirectory
            });

            const createArgs = ClassCreateFileArgsFactory.create({
                class: classObj,
                generatorContext: generatorContext,
                destinationDirectory: tmpDirectory
            });

            ClassService.createFile(createArgs);

            generatorContext.fs.commit((err) => {
                try {
                    Should.not.exist(err);

                    const expectedFilePath = Path.join(tmpDirectory, 'myAwesomeClass.js');
                    const fileExists = Fs.existsSync(expectedFilePath);
                    fileExists.should.be.true;

                    const expectedFileContents = Fs.readFileSync(Path.join(__dirname, '../../unit-helper/class/expected/1-classOutput.js'), 'utf8');
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