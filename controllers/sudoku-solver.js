class SudokuSolver {
  /**********************************************************
  constructor function creates array named chars.
  chars contains
  >> first element: rank of sudoku input by user
  >> second element:
      it is an array of arrays.
      each nested array contains indices that are related to each other due to being in same row.
      for example:
        first element of rowIndices(3) would be [0,1,2,3,4,5,6,7,8].
        last element of rowIndices(3) would be [72,73,74,75,76,77,78,79,80].
  >> third element:
      it is an array of arrays.
      each nested array contains indices that are related to each other due to being in same column.
      for example:
        first element of colIndices(3) would be [0,9,18,27,36,45,54,63,72].
  >> fourth element:
      it is an array of arrays.
      each nested array contains indices that are related to each other due to being in same sector or square.
      for example:
        first element of sectorIndices(3) would be [0,1,2,9,10,11,18,19,20].
        
  >> Given below are puzzlestring indices that correspond to soduko of rank 3.
  >> Example: if puzzlestring starts with ...5 that would mean number 5 sits at index position 3 in the soduko grid below.
  
         0, 1, 2,   3, 4, 5,    6, 7, 8,
         9,10,11,  12,13,14,   15,16,17,
        18,19,20,  21,22,23,   24,25,26,
        
        27,28,29,  30,31,32    33,34,35,
        36,37,38,  39,40,41    42,43,44,
        45,46,47,  48,49,50    51,52,53,
        
        54,55,56,  57,58,59,   60,61,62,
        63,64,65,  66,67,68,   69,70,71,
        72,73,74,  75,76,77,   78,79,80
  **********************************************************/
  constructor(n) {
    // chars = [rank, rows, cols, sectors]
    this.chars = [n, rowIndices(n), colIndices(n), sectorIndices(n)]
  }

  // validates if puzzleString is of the correct length corresponding to rank of sudoku game
  validate(puzzleString) {
    if (puzzleString.length !== (this.rank**4)) {
      return false;
    } else {
      return true
    }
  }

  // pending (not in use)
  checkRowPlacement(puzzleString, row, column, value) {
  }
  // pending (not in use)
  checkColPlacement(puzzleString, row, column, value) {
  }
  // pending (not in use)
  checkRegionPlacement(puzzleString, row, column, value) {
  }


// solves sudoku puzzleString
  solve(puzzleString) {
    let impliedString  = fillImplications(puzzleString, this.chars);
    if (impliedString.includes(".")) {
      if (failCheck(impliedString, this.chars)) {
        return "Invalid sudoku puzzle string."
      } else {
        return fillGuess(impliedString, this.chars, []);
      }
    } else {
      return impliedString;
    }
  }
}

// this function take a guess for empty cell and then calculated implied position before taking another guess or backtacking or finding a solution
function fillGuess(string, chars, outcomes) {
  let strArr = [...string];
  let [index, options] = takeGuess(string, chars);
  for (let each of options) {
    strArr[index] = each;
    let returnString = fillImplications(strArr.join(""), chars);
    if (returnString.includes(".")) {
      if (failCheck(returnString, chars)) {
      } else {
        fillGuess(returnString, chars, outcomes);
      }
    } else {
      if (checkSolutionValidity(returnString, chars)) {
        outcomes.push(returnString);
      }
    }
  }
  return outcomes;
}

// validates if given string follows sudoku RULE that numbers can't repeat in same row, column or sector/square
function checkSolutionValidity(puzzleString, chars) {
  if (
    isUnique(puzzleString, chars[1]) &&
    isUnique(puzzleString, chars[2]) &&
    isUnique(puzzleString, chars[3])
  ) {
    return true;
  } else {
    return false;
  }
}

// this function selects the input string index that would require minimum number of guesses to get it right
// it returns the index and numbers/options that can be filled at returned index
function takeGuess(string, chars) {
  let obj = genObjects(string, chars);
  let len = (chars[0]**2);
  let guessIndex;
  for (let each in obj) {
    if (obj[each].length < len) {
      guessIndex = each;
      len = obj[each].length;
    }
  }
  return [guessIndex, obj[guessIndex]]
}

// this function checks if empty cells still have numbers/options left that can be filled in without causing repetition
// if a cell has no options/numbers left that could be filled in then that means guess was wrong and backtracking is required.
function failCheck(string, chars) {
  let obj = genObjects(string, chars);
  for (let each in obj) {
    if (obj[each].length === 0) {
      return true;
    }
  }
  return false;
}

// this function generates that possible option/numbers that can be used to fill in a cell
// it looks at all the numbers that have been used in the corresponding row, column or sector and then removes those from available numbers to fill.
// it returns object with keys representing empty cell indices and values representing array of available numbers that could be used to fill that empty cell
function genObjects(string, chars) {
  let blanks = blankIndices(string);
  let checkIndiceObj = checkIndices(blanks, chars[1], chars[2], chars[3]);
  let answersObj = probeAnswers(checkIndiceObj, string, chars[0]);
  return answersObj;
}

// recursively fills empty cells where there is only one possible number due to row, column or sector constaints
// does NOT take a guess instead leaves those cells empty
function fillImplications(string, chars) {
  let obj = genObjects(string, chars);
  let strArr = [...string];
  for (let each in obj) {
    if (obj[each].length === 1) {
      strArr[each] = `${obj[each][0]}`;
    }
  }
  let newString = strArr.join("");
  if (newString === string) {
    return newString;
  } else {
    return fillImplications(newString, chars);
  }
}

function probeAnswers(obj, string, rank) {
  let arr = [];
  for (let each in obj) {
    for (let i = 0; i < obj[each].length; i++) {
      arr.push(string[obj[each][i]])
    }
    obj[each] = [...new Set(arr.filter((e) => e != "."))];
    arr = [];
    for (let j = 1; j <= (rank**2); j++) {
      if (!obj[each].includes(`${j}`)) {
        arr.push(j);
      }
    }
    obj[each] = arr;
    arr = [];  
  }
  return obj;
}

function checkIndices(blanks, rows, cols, sectors) {
  let obj = {};
  let arr = [];
  for (let i = 0; i < blanks.length; i++) {
    for(let j = 0; j < rows.length; j++) {
      if (rows[j].includes(blanks[i])) {
        rows[j].forEach((e) => arr.push(e));
      }
    }
    for(let j = 0; j < cols.length; j++) {
      if (cols[j].includes(blanks[i])) {
        cols[j].forEach((e) => arr.push(e));
      }
    }
    for(let j = 0; j < sectors.length; j++) {
      if (sectors[j].includes(blanks[i])) {
        sectors[j].forEach((e) => arr.push(e));
      }
    }
    obj[`${blanks[i]}`] = [...new Set(arr)].filter( e => e != blanks[i]);
    arr = [];
  }
  return obj;
}

function blankIndices(string) {
  let blankIndices = [];
  for (let i = 0; i < string.length; i++) {
    if (string[i] === ".") {
      blankIndices.push(i)
    }
  }
  return blankIndices;
}

function isUnique(string, indices) {
  let arr = [...string];
  let compArr = [];
  for (let i = 0; i < indices.length; i++) {
    for (let val of indices[i]) {
      compArr.push(arr[val]);
    }
    let filterComp = compArr.filter((e) => e !== ".");
    if (filterComp.length !== new Set(filterComp).size) {
      return false;
    }
    compArr = [];
  }
  return true;
}

function rowIndices(n) {
  let rows = [];
  let insert = [0]
  for (let i=1; i < (n**4); i++) {
    if (i % (n**2) === 0) {
      rows.push(insert);
      insert = [];
    }
    insert.push(i);
  }
  rows.push(insert);
  return rows;
}

function colIndices(n) {
  let cols = [];
  let insert = [];
  for (let i=0; i < ((n**4) + (n**2)); i+=(n**2)) {
    if (insert.length === (n**2)) {
      cols.push(insert);
      i = cols.length;
      insert = [];
    }
    insert.push(i);
  }
  return cols;
}

function sectorIndices(n) {
  let sectors = [];
  let insert = [0];
  for (let i = 1; i < (n**4); i++) {
    if (insert.length === (n**2)) {
      sectors.push(insert);
      insert = [];
      if (sectors.length % n !== 0) {
        i = i - (n**2 * (n-1));
      }
    } else if (insert.length % n === 0) {
      i = i + (n**2 - n);
    }
    insert.push(i);
  }
  sectors.push(insert);
  return sectors;
}

module.exports = SudokuSolver;

