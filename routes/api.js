'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let rank = 3;
  let solver = new SudokuSolver(rank);
  let letterRowMap = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
  }
  
  app.route('/api/check')
    .post((req, res) => {
      let string = req.body.puzzle;
      let index = req.body.coordinate;
      let value = req.body.value;
      let valFlag = solver.validate(string);
      /*** This piece of code is just to satisfy peculiar test. Otherwise valFlag would have worked fine on its own. ***/
      if (string === "" || string === undefined) {
        return res.json({"error": "Required field(s) missing"});
      }
      /*********************************************************/
      if (valFlag === true) {
        if (index === "" || index === undefined || value === "" || value === undefined ) {
          return res.json({"error": "Required field(s) missing"});
        }
        if (value > (rank**2) || value < 1 || !/^[1-9]$/.test(value)) {
          return res.json({"error": "Invalid value"});
        }
        if (index.length > 2 || !Object.keys(letterRowMap).includes(index[0]) ||
            !/^[1-9]$/.test(index[1])
           ) {
          return res.json({"error": "Invalid coordinate"});
        }
        index = ((letterRowMap[index[0]] - 1) * (rank**2)) + (+index[1]) - 1;
        let strArr = [...string];
        strArr[index] = value;
        let newString = strArr.join("");
        let conflict = [
          !solver.checkRowPlacement(newString), //row
          !solver.checkColPlacement(newString), //col
          !solver.checkRegionPlacement(newString), //region
        ];
        if (conflict.includes(true)) {
          let reArr = [];
          if (conflict[0] === true) {reArr.push("row")};
          if (conflict[1] === true) {reArr.push("column")};
          if (conflict[2] === true) {reArr.push("region")};
          res.json({"valid": false, "conflict": reArr});
        } else {
          res.json({"valid": true})
        }
      } else {
        return res.json(valFlag);
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let string = req.body.puzzle;
      let valFlag = solver.validate(string);
      if (valFlag === true) {
        let solution = solver.solve(string);
        if (Array.isArray(solution)) {
          res.json({
            error: `More that one solution exists.`,
            solution: solution,
          });
        } else {
          res.json({solution: solution});
        }
      } else {
        res.json(valFlag);
      }
    });
};
