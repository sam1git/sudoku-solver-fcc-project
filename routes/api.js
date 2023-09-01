'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver(3);
  let string = '......................2.31...7318.6.24.....73...........279.1..5...8..36..3......';
  let answers = [
      "124536789385179624796824315957318462241965873638247591462793158579481236813652947"
    ];
  let solutions = solver.solve(string);
  if (Array.isArray(solutions)) {
    for (let each of answers) {
      if (solutions.includes(each)) {
        console.log("Yes")
      } else {
        console.log("no")
      }
    }
  } else {
    if (answers.includes(solutions)) {
      console.log("Yes")
    } else {
      console.log("no")
    }
  }
  
  app.route('/api/check')
    .post((req, res) => {

    });
    
  app.route('/api/solve')
    .post((req, res) => {

    });
};
