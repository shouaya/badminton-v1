const Badminton = require('./Badminton');

const players = [
    { id: 1, name: 'p1', rate: 1 },
    { id: 2, name: 'p2', rate: 2 },
    { id: 3, name: 'p3', rate: 3 },
    { id: 4, name: 'p4', rate: 1 },
    { id: 5, name: 'p5', rate: 2 },
    { id: 6, name: 'p6', rate: 3 },
    { id: 7, name: 'p7', rate: 2 },
    { id: 8, name: 'p8', rate: 1 },
    { id: 9, name: 'p9', rate: 2 },
    { id: 10, name: 'p10', rate: 2 },
    { id: 11, name: 'p11', rate: 2 },
    { id: 12, name: 'p12', rate: 3 },
    { id: 13, name: 'p13', rate: 2 },
    { id: 14, name: 'p14', rate: 1 },
]
const rounds = players.length - 1;
const courts = 2;
const badminton = new Badminton(players, rounds, courts);
const game = badminton.generateGame();

for (let round = 1; round <= rounds; round++) {
    const { idlePlayers, matches } = game[round - 1];
    console.log(`round: ${round} rest: ${idlePlayers.map(({ id }) => id).join(', ')}`);
    for (let court = 1; court <= courts; court++) {
      const match = matches[court - 1];
      console.log(`round: ${round} court: ${court} batter: ${match[0].id}(${match[0].rate}), ${match[1].id}(${match[1].rate}) VS ${match[2].id}(${match[2].rate}), ${match[3].id}(${match[3].rate})`);
    }
}

console.log(badminton.getStats(game));