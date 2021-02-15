const { rando } = require('@nastyox/rando.js');

const shuffleArr = (arr) => {
  // Fisher Yates algo
  for (let i = arr.length - 1; i > 0; i--) {
    let j = rando(i);
    j = Math.floor(j + i * j) % arr.length;
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
};

module.exports = shuffleArr;
