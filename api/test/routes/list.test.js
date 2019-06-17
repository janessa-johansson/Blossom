// Mongoose and mocking requests
const sinon = require('sinon');

const mongoose = require('mongoose')
mongoose.set('debug', true)
require('sinon-mongoose')

// initialize the app and models
const app = require('../../index.js')

// sending requests
const agent = require('supertest').agent(app);
// validating results
const expect = require('chai').expect;

// get the model
const List = mongoose.model('List')

var Mock = sinon.mock(List)

beforeEach(() => {
    Mock.restore(); // Unwraps the spy
    Mock = sinon.mock(List)
});

afterEach(() => {
    Mock.verify();
});


describe('List Integration tests', () => {

    // Our test data
    const request = {
        "list": {
            "item": [
                "hello5",
                "hello26",
                "hello37"
            ],
            "title": "list title"
        },
        "_id": "5d0739ae5c7605196c91e438",
        "username": "sable10",
        "__v": 0
    }


    const expected = {
        "list": {
            "item": [
                "hello5",
                "hello26",
                "hello37"
            ],
            "title": "list title"
        },
        "_id": "5d0739ae5c7605196c91e438",
        "username": "sable10",
        "__v": 0
    }

    describe('list.get', () => {

        it('Should return an array of all lists', (done) => {

            // Given (preconditions)
            Mock
                .expects('find')
                .chain('exec')
                .resolves([expected]);

            // When (someting happens)
            agent
                .get('/lists')
                .end((err, res) => {
                    // Then (something should happen)
                    expect(res.status).to.equal(200);
                    expect(res.body).to.eql([expected]);
                    done();
                });
        });

        it('Should get a list by username', (done) => {

            // Given (preconditions)
            Mock
                .expects('find')
                .withArgs({ username: "sable10" })
                .chain('exec')
                .resolves(expected);

            // When (someting happens)
            agent
                .get('/lists?username=sable10')
                .end((err, res) => {
                    // Then (something should happen)
                    expect(res.status).to.equal(200);
                    expect(res.body).to.eql(expected);
                    done();
                });
        });
    });

    // describe('list.post', () => {
    // 	it('Should be able to create a list', (done) => {
    // 		// Given (preconditions)
    // 		Mock
    // 			.expects('create')
    // 			.withArgs(request)
    // 			.chain('exec')
    // 			.resolves(expected);

    // 		// When (someting happens)
    // 		agent
    // 			.post('/lists/')
    // 			.send(request)
    // 			.end((err, res) => {
    // 				// Then (something should happen)
    // 				expect(res.status).to.equal(201);
    // 				expect(res.body).to.eql(expected);
    // 				done();
    // 			});
    // 	});
    // })

    // describe('list.put', () => {
    // 	it('Should be able to create a list', (done) => {
    // 		// Given (preconditions)
    // 		Mock
    // 			.expects('updateOne')
    // 			.withArgs({ _id: "5d0739ae5c7605196c91e438" }, request)
    // 			.chain('exec')
    // 			.resolves({
    // 				n: 1,
    // 				nModified: 0,
    // 				upserted: [{ index: 0, _id: "5d0739ae5c7605196c91e438" }],
    // 				ok: 1
    // 			});

    // 		// When (someting happens)
    // 		agent
    // 			.put('/lists/5d0739ae5c7605196c91e438')
    // 			.send(request)
    // 			.end((err, res) => {
    // 				// Then (something should happen)
    // 				expect(res.status).to.equal(201);
    // 				done();
    // 			});
    // 	});

    // 	it('Should be able to update a list', (done) => {
    // 		// Given (preconditions)
    // 		Mock
    // 			.expects('updateOne')
    // 			.withArgs({ _id: "5d0739ae5c7605196c91e438" }, request)
    // 			.chain('exec')
    // 			.resolves({
    // 				n: 1,
    // 				nModified: 1,
    // 				ok: 1
    // 			});

    // 		// When (someting happens)
    // 		agent
    // 			.put('/lists/5d0739ae5c7605196c91e438')
    // 			.send(request)
    // 			.end((err, res) => {
    // 				// Then (something should happen)
    // 				expect(res.status).to.equal(200);
    // 				done();
    // 			});
    // 	});


    // 	it('Should return 204 when not updating a list', (done) => {
    // 		// Given (preconditions)
    // 		Mock
    // 			.expects('updateOne')
    // 			.withArgs({ _id: "5d0739ae5c7605196c91e438" }, request)
    // 			.chain('exec')
    // 			.resolves({
    // 				n: 1,
    // 				nModified: 0,
    // 				ok: 1
    // 			});

    // 		// When (someting happens)
    // 		agent
    // 			.put('/lists/5d0739ae5c7605196c91e438')
    // 			.send(request)
    // 			.end((err, res) => {
    // 				// Then (something should happen)
    // 				expect(res.status).to.equal(204);
    // 				done();
    // 			});
    // 	});

    // });

    describe('list.deleteById', () => {
        it('Should be able to delete a list', (done) => {
            // Given (preconditions)
            Mock
                .expects('findByIdAndDelete')
                .withArgs({ _id: "5d0739ae5c7605196c91e438" })
                .chain('exec')
                .resolves(expected);

            // When (someting happens)
            agent
                .delete('/lists/5d0739ae5c7605196c91e438')
                .send(request)
                .end((err, res) => {
                    // Then (something should happen)
                    expect(res.status).to.equal(200);
                    expect(res.body).to.eql(expected);
                    done();
                });
        });
    });
});