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
                firstName: 'YQbiyc8Fy@t]#3X[!NX',
                lastName: 'mDp3ScsAH',
                email: '1bJYevMGX*cSJ9*g0)',
                numSignupAttempts: 376
            });
            return service.create(createArgs)
                .then(id => {
                    const getPromise = service.getById(id);
                    return Promise.all([getPromise]).then(results => results[0]);
                })
                .then(userDownload => {
                    Should.exist(userDownload);
                    userDownload.id.should.be.a.Number();
                    userDownload.firstName.should.eql('YQbiyc8Fy@t]#3X[!NX');
                    userDownload.lastName.should.eql('mDp3ScsAH');
                    userDownload.email.should.eql('1bJYevMGX*cSJ9*g0)');
                    userDownload.numSignupAttempts.should.eql(376);
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
                firstName: 'YQbiyc8Fy@t]#3X[!NX',
                lastName: 'mDp3ScsAH',
                email: '1bJYevMGX*cSJ9*g0)',
                numSignupAttempts: 376
            });
            return service.create(createArgs)
                .then(id => {
                    const getPromise = service.getById(id);
                    return Promise.all([getPromise]).then(results => results[0]);
                })
                .then(userDownload => {
                    Should.exist(userDownload);
                    userDownload.id.should.be.a.Number();
                    userDownload.firstName.should.eql('YQbiyc8Fy@t]#3X[!NX');
                    userDownload.lastName.should.eql('mDp3ScsAH');
                    userDownload.email.should.eql('1bJYevMGX*cSJ9*g0)');
                    userDownload.numSignupAttempts.should.eql(376);
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
                firstName: 'YQbiyc8Fy@t]#3X[!NX',
                lastName: 'mDp3ScsAH',
                email: '1bJYevMGX*cSJ9*g0)',
                numSignupAttempts: 376
            });
            return service.create(createArgs)
                .then(id => {
                    newId = id;
                    const updateArgs = UserDownloadServiceCreateArgsFactory.createFromJsObj({
                       firstName: '9u4LxGxX3)]I',
                       lastName: 'mB])YFT#9#i1',
                       email: '2t45Gdt(FFFn)GtPq',
                       numSignupAttempts: 6347
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
                    userDownload.firstName.should.eql('9u4LxGxX3)]I');
                    userDownload.lastName.should.eql('mB])YFT#9#i1');
                    userDownload.email.should.eql('2t45Gdt(FFFn)GtPq');
                    userDownload.numSignupAttempts.should.eql(6347);
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
                firstName: 'YQbiyc8Fy@t]#3X[!NX',
                lastName: 'mDp3ScsAH',
                email: '1bJYevMGX*cSJ9*g0)',
                numSignupAttempts: 376
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
