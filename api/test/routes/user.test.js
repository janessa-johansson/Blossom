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
const User = mongoose.model('User')

var Mock = sinon.mock(User)

beforeEach(() => {
	Mock.restore(); // Unwraps the spy
	Mock = sinon.mock(User)
});

afterEach(() => {
	Mock.verify();
});


describe('User Integration tests', () => {

	// Our test data
	const request = {
		"_id": "5cfe5befe5d04f26389dec49",
		"name": "sable17",
		"username": "sable17",
		"password": "sable17",
		"__v": 0
	}

	const expected = {
		"_id": "5cfe5befe5d04f26389dec49",
		"name": "sable17",
		"username": "sable17",
		"password": "sable17",
		"__v": 0
	}

	describe('user.get', () => {

		it('Should return an array of all users', (done) => {

			// Given (preconditions)
			Mock
				.expects('find')
				.chain('exec')
				.resolves([expected]);

			// When (someting happens)
			agent
				.get('/users')
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(200);
					expect(res.body).to.eql([expected]);
					done();
				});
		});

		it('Should get a user by username', (done) => {

			// Given (preconditions)
			Mock
				.expects('findOne')
				.withArgs({ username: "sable17" })
				.chain('exec')
				.resolves(expected);

			// When (someting happens)
			agent
				.get('/users?username=sable17')
				.end((err, res) => {
					// Then (something should happen)
					expect(res.status).to.equal(200);
					expect(res.body).to.eql(expected);
					done();
				});
		});
	});

	// describe('user.post', () => {
	// 	it('Should be able to create a user', (done) => {
	// 		// Given (preconditions)
	// 		Mock
	// 			.expects('create')
	// 			.withArgs(request)
	// 			.chain('exec')
	// 			.resolves(expected);

	// 		// When (someting happens)
	// 		agent
	// 			.post('/users/')
	// 			.send(request)
	// 			.end((err, res) => {
	// 				// Then (something should happen)
	// 				expect(res.status).to.equal(201);
	// 				expect(res.body).to.eql(expected);
	// 				done();
	// 			});
	// 	});
	// })

	// describe('user.put', () => {
	// 	it('Should be able to create a user', (done) => {
	// 		// Given (preconditions)
	// 		Mock
	// 			.expects('findOneAndUpdate')
	// 			.withArgs({ _id: "5cfe5befe5d04f26389dec49" }, request)
	// 			.chain('exec')
	// 			.resolves(expected);

	// 		// When (someting happens)
	// 		agent
	// 			.put('/users/5cfe5befe5d04f26389dec49')
	// 			.send(request)
	// 			.end((err, res) => {
	// 				// Then (something should happen)
	// 				expect(res.status).to.equal(200);
	// 				done();
	// 			});
	// 	});

	// 	it('Should be able to update a user', (done) => {
	// 		// Given (preconditions)
	// 		Mock
	// 			.expects('findOneAndUpdate')
	// 			.withArgs({ _id: "5cfe5befe5d04f26389dec49" }, request)
	// 			.chain('exec')
	// 			.resolves(expected);

	// 		// When (someting happens)
	// 		agent
	// 			.put('/users/5cfe5befe5d04f26389dec49')
	// 			.send(request)
	// 			.end((err, res) => {
	// 				// Then (something should happen)
	// 				expect(res.status).to.equal(200);
	// 				done();
	// 			});
	// 	});


	// 	it('Should return 204 when not updating a user', (done) => {
	// 		// Given (preconditions)
	// 		Mock
	// 			.expects('findOneAndUpdate')
	// 			.withArgs({ _id: "5cfe5befe5d04f26389dec49" }, request)
	// 			.chain('exec')
	// 			.resolves({
	// 				n: 1,
	// 				nModified: 0,
	// 				ok: 1
	// 			});

	// 		// When (someting happens)
	// 		agent
	// 			.put('/users/5cfe5befe5d04f26389dec49')
	// 			.send(request)
	// 			.end((err, res) => {
	// 				// Then (something should happen)
	// 				expect(res.status).to.equal(204);
	// 				done();
	// 			});
	// 	});

	// });

	describe('user.deleteById', () => {
		it('Should be able to delete a user', (done) => {
			// Given (preconditions)
			Mock
				.expects('findByIdAndDelete')
				.withArgs({ _id: "5cfe5befe5d04f26389dec49" })
				.chain('exec')
				.resolves(expected);

			// When (someting happens)
			agent
				.delete('/users/5cfe5befe5d04f26389dec49')
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