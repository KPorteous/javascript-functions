const { prototype } = require("mocha");

function seed() {
  return Array.prototype.slice.call(arguments);
};

function same([x, y], [j, k]) {
  if (x === j && y === k) {
    return true;
  } else {
    return false;
  }
};

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(c => same(c, cell));
};

const printCell = (cell, state) => {
  if (contains.call(state, cell)) {
    return '\u25A3';
  } else {
    return '\u25A2'
  };
};

const corners = (state = []) => {
  if (state.length === 0) {
    return {topRight: [0, 0], bottomLeft: [0, 0]};
  };
  let x = [];
  let y = [];
  state.forEach(value => {
    x.push(value[0]);
    y.push(value[1]);
  });
  return {topRight: [Math.max(...x), Math.max(...y)], bottomLeft: [Math.min(...x), Math.min(...y)]};
};

const printCells = (state) => {
  const { bottomLeft, topRight } = corners(state);
  let accumulator = "";
  for (let y = topRight[1]; y >= bottomLeft[1]; y--) {
    let row = [];
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
    accumulator += row.join(" ") + "\n";
  }
  return accumulator;
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x-1, y+1], [x, y+1], [x+1, y+1], [x-1, y], [x+1, y], [x-1, y-1], [x, y-1], [x+1, y-1]
  ]
};

const getLivingNeighbors = (cell, state) => {
  return getNeighborsOf(cell).filter(n => contains.bind(state)(n));
};

const willBeAlive = (cell, state) => {
  const livingNeighbors = getLivingNeighbors(cell, state);

  return (
    livingNeighbors.length === 3 ||
    (contains.call(state, cell) && livingNeighbors.length === 2)
  );
};

const calculateNext = (state) => {
  let nextState = []
  const bottomLeft = corners(state)['bottomLeft'];
  const topRight = corners(state)['topRight'];
  for (let y = topRight[1] + 1; y >= bottomLeft[1] -1; y--) {
    for (let x = bottomLeft[0] - 1; x <= topRight[0] + 1; x++) {
      if (willBeAlive([x, y], state)) {
        nextState.push([x, y]);
      };
    };
  };
  return nextState;
};

const iterate = (state, iterations) => {
  let gameStates = [state];
  let nextState = state;
  do {
    nextState = calculateNext(nextState);
    gameStates.push(nextState);
    iterations--;
  } while (iterations > 0);
  return gameStates;
};

const main = (pattern, iterations) => {};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;