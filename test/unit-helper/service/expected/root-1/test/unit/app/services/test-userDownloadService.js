'use strict';

const Should = require('should');
const Promise = require('bluebird');
const NodeConfig = require('config');
const databaseSetup = require('../../../helpers/databaseSetupFactory').createFromNodeConfig(NodeConfig);
const ServiceLocatorFactory = require('../../../../app/services/serviceLocatorFactory');
const UserDownload = require('../../../../app/services/userDownload/get/userDownload');
const UserDownloadServiceCreateArgsFactory = require('../../../../app/services/userDownload/create/userDownloadServiceCreateArgsFactory');

const serviceLocator = ServiceLocatorFactory.getServiceLocatorSingleton();
const service = serviceLocator.getUserDownloadService();

const tablesToReplicate = ['table1','table2','table3'];
const tablesToCopyData = ['table1','table2'];

const dbSetup = () => {
    return databaseSetup.replicateTables(tablesToReplicate)
            .then(() => {
                return Promise.all([databaseSetup.copyDataForTables(tablesToCopyData)])
            });
};

const dbTeardown = () => {
    return databaseSetup.replicateTables(tablesToReplicate);
};

describe('UserDownloadService', function() {

    describe('create', function() {

        before(function() {
            return dbSetup();
        });

        after(function() {
            return dbTeardown();
        });

        it('Should create a UserDownload entry in the database', function() {
            const createArgs = UserDownloadServiceCreateArgsFactory.createFromJsObj({
                firstName: 'wbKUG39KRqbo04tmt',
                lastName: 'L$8oTc1#v1',
                email: 'eS47aMT^yxPgywE',
                numSignupAttempts: 1220
            });
            return service.create(createArgs)
                .then(id => {
                    const getPromise = service.getById(id);
                    return Promise.all([getPromise]).then(results => results[0]);
                })
                .then(userDownload => {
                    Should.exist(userDownload);
                    userDownload.id.should.be.a.Number();
                    userDownload.firstName.should.eql('wbKUG39KRqbo04tmt');
                    userDownload.lastName.should.eql('L$8oTc1#v1');
                    userDownload.email.should.eql('eS47aMT^yxPgywE');
                    userDownload.numSignupAttempts.should.eql(1220);
                    userDownload.dateCreated.should.be.a.Date();
                });
        });

    });

    describe('getById', function() {

        before(function() {
            return dbSetup();
        });

        after(function() {
            return dbTeardown();
        });

        it('Should return a UserDownload by ID from the database', function() {
            const createArgs = UserDownloadServiceCreateArgsFactory.createFromJsObj({
                firstName: 'wbKUG39KRqbo04tmt',
                lastName: 'L$8oTc1#v1',
                email: 'eS47aMT^yxPgywE',
                numSignupAttempts: 1220
            });
            return service.create(createArgs)
                .then(id => {
                    const getPromise = service.getById(id);
                    return Promise.all([getPromise]).then(results => results[0]);
                })
                .then(userDownload => {
                    Should.exist(userDownload);
                    userDownload.id.should.be.a.Number();
                    userDownload.firstName.should.eql('wbKUG39KRqbo04tmt');
                    userDownload.lastName.should.eql('L$8oTc1#v1');
                    userDownload.email.should.eql('eS47aMT^yxPgywE');
                    userDownload.numSignupAttempts.should.eql(1220);
                    userDownload.dateCreated.should.be.a.Date();
                });
        });

    });

    describe('updateById', function() {

        before(function() {
            return dbSetup();
        });

        after(function() {
            return dbTeardown();
        });

        it('Should update the UserDownload entry in the database', function() {
            let newId = null;
            const createArgs = UserDownloadServiceCreateArgsFactory.createFromJsObj({
                firstName: 'wbKUG39KRqbo04tmt',
                lastName: 'L$8oTc1#v1',
                email: 'eS47aMT^yxPgywE',
                numSignupAttempts: 1220
            });
            return service.create(createArgs)
                .then(id => {
                    newId = id;
                    const updateArgs = UserDownloadServiceCreateArgsFactory.createFromJsObj({
                       firstName: 'lYY(8a',
                       lastName: 'O0jOEk5BRXnG9GhTuLe',
                       email: 'f9@dGU',
                       numSignupAttempts: 5476
                    });
                    const updatePromise = service.updateById(id, updateArgs);
                    return Promise.all([updatePromise]).then(results => results[0]);
                })
                .then(numRowsModified => {
                    Should.exist(numRowsModified);
                    numRowsModified.should.eql(1);
                })
                .then(() => {
                    const getPromise = service.getById(newId);
                    return Promise.all([getPromise]).then(results => results[0]);
                })
                .then(userDownload => {
                    Should.exist(userDownload);
                    userDownload.id.should.be.a.Number();
                    userDownload.firstName.should.eql('lYY(8a');
                    userDownload.lastName.should.eql('O0jOEk5BRXnG9GhTuLe');
                    userDownload.email.should.eql('f9@dGU');
                    userDownload.numSignupAttempts.should.eql(5476);
                    userDownload.dateCreated.should.be.a.Date();
                });
        });

    });

    describe('deleteById', function() {

        before(function() {
            return dbSetup();
        });

        after(function() {
            return dbTeardown();
        });

        it('Should delete the UserDownload entry in the database', function() {
            let newId = null;
            const createArgs = UserDownloadServiceCreateArgsFactory.createFromJsObj({
                firstName: 'wbKUG39KRqbo04tmt',
                lastName: 'L$8oTc1#v1',
                email: 'eS47aMT^yxPgywE',
                numSignupAttempts: 1220
            });
            return service.create(createArgs)
                .then(id => {
                    newId = id;
                    const deletePromise = service.deleteById(id);
                    return Promise.all([deletePromise]).then(results => results[0]);
                })
                .then(numRowsDelete => {
                    Should.exist(numRowsDelete);
                    numRowsDelete.should.eql(1);
                })
                .then(() => {
                    const getPromise = service.getById(newId);
                    return Promise.all([getPromise]).then(results => results[0]);
                })
                .then(userDownload => {
                    Should.not.exist(userDownload);
                });
        });

    });

});
