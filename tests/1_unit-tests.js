const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver(3);

suite('Unit Tests', () => {

  test('Valid puzzle string of 81 chars', function() {
    let stringInput = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.validate(stringInput),true, 'Output expected to be a boolean - true');
  });

  test('Invalid puzzle string of 81 chars with chars other than . or 1-9', function() {
    let stringInput = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.7*...3";
    assert.isObject(solver.validate(stringInput), 'Output expected to be an error object');
    assert.deepEqual(solver.validate(stringInput),{"error": "Invalid characters in puzzle"}, 'Output expected to be an error object indicating invalid characters in input string');
  });

  test('Invalid puzzle string not 81 chars long', function() {
    let stringInput1 = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.7...3";
    let stringInput2 = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.7...322";
    assert.isObject(solver.validate(stringInput1), 'Output expected to be an error object');
    assert.deepEqual(solver.validate(stringInput1),{"error": "Expected puzzle to be 81 characters long"}, 'Output expected to be an error object indicating invalid puzzle string length');
    assert.isObject(solver.validate(stringInput2), 'Output expected to be an error object');
    assert.deepEqual(solver.validate(stringInput2),{"error": "Expected puzzle to be 81 characters long"}, 'Output expected to be an error object indicating invalid puzzle string length');
  });

  test('Valid row placement', function() {
    let placementString = "54.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.checkRowPlacement(placementString), true, 'Output expected to be a boolean - true');
  });

  test('Invalid row placement', function() {
    let placementString = "51.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.checkRowPlacement(placementString), false, 'Output expected to be a boolean - false');
  });

  test('Valid col placement', function() {
    let placementString = "54.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.checkColPlacement(placementString), true, 'Output expected to be a boolean - true');
  });
  
  test('Invalid col placement', function() {
    let placementString = "58.91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.checkColPlacement(placementString), false, 'Output expected to be a boolean - false');
  });

  test('Valid region placement', function() {
    let placementString = "54.91372.3.7.8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.checkRegionPlacement(placementString), true, 'Output expected to be a boolean - true');
  });
  
  test('Invalid region placement', function() {
    let placementString = "5..91372.3.3.8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    assert.strictEqual(solver.checkRegionPlacement(placementString), false, 'Output expected to be a boolean - false');
  });

  test('Invalid puzzle string fail solver', function() {
    let invalidString = "2.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isString(solver.solve(invalidString), 'Output expected to be a string.')
    assert.strictEqual(solver.solve(invalidString), "Invalid sudoku puzzle string.", 'Output expected to be a string indicating input is invalid puzzle string.')
  });

  test('Valid puzzle string pass solver', function() {
    let stringInput = "5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3";
    let stringOutput = "568913724342687519197254386685479231219538467734162895926345178473891652851726943";
    assert.strictEqual(solver.solve(stringInput),stringOutput, 'Output expected to be solved sudoku string');
  });

  test('Solver returns all solutions for incomplete puzzle', function() {
    let stringInput = "8..6..9.5.............2.31...7318.6.24.....73...........279.1..5...8..36..3......";
    let arrayOutput = [
      "814637925325149687796825314957318462241956873638274591462793158579481236183562749",
      "814637925325941687796825314957318462241569873638472591462793158579184236183256749",
      "834671925125839647796425318957318462241956873368247591682793154579184236413562789",
      "834671925125839647796524318957318462241956873368247591682793154519482736473165289",
      "834671925125839647796524318957318462241965873368247591682793154519482736473156289"
    ];
    assert.isArray(solver.solve(stringInput), 'Output expected to be an array');
    assert.deepEqual(solver.solve(stringInput),arrayOutput, 'Output expected to be solved sudoku array');
  });

});
