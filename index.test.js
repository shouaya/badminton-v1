const Badminton = require('./Badminton');

function checkGameStructure(games, rounds, expectedIdlePlayers, expectedActivePlayers, expectedMatches) {
    expect(games.length).toBe(rounds);

    for (let round = 1; round <= rounds; round++) {
        const { idlePlayers, activePlayers, matches } = games[round - 1];
        expect(idlePlayers.length).toBe(expectedIdlePlayers);
        expect(activePlayers.length).toBe(expectedActivePlayers);
        expect(matches.length).toBe(expectedMatches);
    }
}

function checkStats(stats) {
    const restCounts = Object.values(stats.playerRestCounts);
    const playCounts = Object.values(stats.playerMatchCounts);
    const teamCounts = Object.values(stats.teamMatchCounts);

    // Check rest counts
    const maxRest = Math.max(...restCounts);
    const minRest = Math.min(...restCounts);
    expect(maxRest - minRest).toBeLessThanOrEqual(1);

    // Check play counts
    const maxPlay = Math.max(...playCounts);
    const minPlay = Math.min(...playCounts);
    expect(maxPlay - minPlay).toBeLessThanOrEqual(1);

    // Check team counts
    for (const count of Object.values(teamCounts)) {
        expect(count).toBeLessThanOrEqual(2);
    }
}

test('game rounds p length 11', () => {
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
        { id: 11, name: 'p11', rate: 2 }
    ];
    const rounds = players.length - 1;
    const courts = 2;

    const badminton = new Badminton(players, rounds, courts);
    const games = badminton.generateGame();

    checkGameStructure(games, rounds, players.length - courts*4 , courts*4, courts);

    const stats = badminton.getStats(games);
    checkStats(stats);
});

test('game rounds p length 12', () => {
    const players = [
        { id: 1, name: 'p1', rate: 1 },
        { id: 2, name: 'p2', rate: 2 },
        { id: 3, name: 'p3', rate: 3 },
        { id: 4, name: 'p4', rate: 3 },
        { id: 5, name: 'p5', rate: 2 },
        { id: 6, name: 'p6', rate: 3 },
        { id: 7, name: 'p7', rate: 3 },
        { id: 8, name: 'p8', rate: 3 },
        { id: 9, name: 'p9', rate: 1 },
        { id: 10, name: 'p10', rate: 2 },
        { id: 11, name: 'p11', rate: 2 },
        { id: 12, name: 'p12', rate: 3 },
    ];
    const rounds = players.length - 1;
    const courts = 2;

    const badminton = new Badminton(players, rounds, courts);
    const games = badminton.generateGame();

    checkGameStructure(games, rounds, players.length - courts*4 , courts*4, courts);

    const stats = badminton.getStats(games);
    checkStats(stats);
});

test('game rounds p length 14', () => {
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
        { id: 12, name: 'p12', rate: 1 },
        { id: 13, name: 'p13', rate: 2 },
        { id: 14, name: 'p14', rate: 2 },
    ];
    const rounds = players.length - 1;
    const courts = 2;

    const badminton = new Badminton(players, rounds, courts);
    const games = badminton.generateGame();

    checkGameStructure(games, rounds, players.length - courts*4 , courts*4, courts);

    const stats = badminton.getStats(games);
    checkStats(stats);
});

test('game rounds p length 18', () => {
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
        { id: 12, name: 'p12', rate: 1 },
        { id: 13, name: 'p13', rate: 2 },
        { id: 14, name: 'p14', rate: 2 },
        { id: 15, name: 'p15', rate: 3 },
        { id: 16, name: 'p16', rate: 3 },
        { id: 17, name: 'p17', rate: 3 },
        { id: 18, name: 'p18', rate: 3 },
    ];
    const rounds = players.length - 1;
    const courts = 3;

    const badminton = new Badminton(players, rounds, courts);
    const games = badminton.generateGame();

    checkGameStructure(games, rounds, players.length - courts*4 , courts*4, courts);

    const stats = badminton.getStats(games);
    checkStats(stats);
});

test('game rounds p length 20', () => {
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
        { id: 12, name: 'p12', rate: 1 },
        { id: 13, name: 'p13', rate: 2 },
        { id: 14, name: 'p14', rate: 2 },
        { id: 15, name: 'p15', rate: 3 },
        { id: 16, name: 'p16', rate: 3 },
        { id: 17, name: 'p17', rate: 3 },
        { id: 18, name: 'p18', rate: 3 },
        { id: 19, name: 'p19', rate: 1 },
        { id: 20, name: 'p20', rate: 2 },
    ];
    const rounds = players.length - 1;
    const courts = 3;

    const badminton = new Badminton(players, rounds, courts);
    const games = badminton.generateGame();

    checkGameStructure(games, rounds, players.length - courts*4 , courts*4, courts);

    const stats = badminton.getStats(games);
    checkStats(stats);
});