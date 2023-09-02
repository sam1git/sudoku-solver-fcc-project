const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  this.timeout(5000);

  test('Valid puzzle string POST request to /api/solve', function(done) {
    let stringInput = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    let solution = "568913724342687519197254386685479231219538467734162895926345178473891652851726943";
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: stringInput,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "solution", 'Output expected to be an object with solution property');
        assert.deepEqual(res.body,{solution: solution}, 'Output expected to be an object with valid solution');
        done();
      });
  });

  test('Missing puzzle string POST request to /api/solve', function(done) {
    let stringInput = undefined;
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: stringInput,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Required field missing"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test('Puzzle string with invalid chars POST request to /api/solve', function(done) {
    let stringInput = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...*";
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: stringInput,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Invalid characters in puzzle"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test('Invalid length puzzle string POST request to /api/solve', function(done) {
    let stringInput = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...";
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: stringInput,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Expected puzzle to be 81 characters long"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test("Unsolvable puzzle string POST request to /api/solve", function(done) {
    let stringInput = "9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({
        puzzle: stringInput,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Puzzle cannot be solved"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test("Puzzle placement with all fields to POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "I9";
    let value = 5;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.deepEqual(res.body,{"valid": true}, 'Output expected to be an object with valid property set to boolean true');
        done();
      });
  });

  test("Single placement conflict POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "I9";
    let value = 1;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "valid", 'Output expected to be an object with valid property');
        assert.property(res.body, "conflict", 'Output expected to be an object with conflict property');
        assert.deepEqual(res.body,{"valid": false, "conflict": ["region"]}, 'Output expected to be an object with indicating conflicts');
        done();
      });
  });

  test("Multiple placement conflicts POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "A1";
    let value = 4;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "valid", 'Output expected to be an object with valid property');
        assert.property(res.body, "conflict", 'Output expected to be an object with conflict property');
        assert.deepEqual(res.body,{"valid": false, "conflict": ["column","region"]}, 'Output expected to be an object with indicating conflicts');
        done();
      });
  });
  
  test("All placement conflicts POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "I9";
    let value = 4;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "valid", 'Output expected to be an object with valid property');
        assert.property(res.body, "conflict", 'Output expected to be an object with conflict property');
        assert.deepEqual(res.body,{"valid": false, "conflict": ["row","column","region"]}, 'Output expected to be an object with indicating conflicts');
        done();
      });
  });

  test("Required fields missing POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "I9";
    let value = undefined;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Required field(s) missing"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test("Puzzle placement with invalid chars POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.*";
    let coordinate = "I9";
    let value = 4;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Invalid characters in puzzle"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test("Puzzle placement with invalid length POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.";
    let coordinate = "I9";
    let value = 4;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Expected puzzle to be 81 characters long"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test("Puzzle placement with invalid coordinate POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "Z9";
    let value = 4;
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Invalid coordinate"}, 'Output expected to be an object with error message');
        done();
      });
  });

  test("Puzzle placement with invalid value POST request to /api/check", function(done) {
    let stringInput = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    let coordinate = "Z9";
    let value = "M";
    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: stringInput,
        coordinate: coordinate,
        value: value,
      })
      .end((err, res) => {
        assert.isObject(res.body, 'Output expected to be an object');
        assert.property(res.body, "error", 'Output expected to be an object with error property');
        assert.deepEqual(res.body,{"error": "Invalid value"}, 'Output expected to be an object with error message');
        done();
      });
  });
  
});

