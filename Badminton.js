const RandomPicker = require('./RandomPicker');

class Badminton {
  constructor(players, rounds, courts) {
    this.players = players;
    this.rounds = rounds;
    this.courts = courts;
    this.picker = new RandomPicker(this.players.length, this.players.length - this.courts * 4);
    this.usedTeams = new Set();
    this.usedPlayers = new Set();
    this.usedGroups = new Set();
    this.regenerateTimes = 0;
  }

  // create team key
  #createTeamKey(player1, player2) {
    return `${String(player1.id).padStart(3, '0')}${String(player2.id).padStart(3, '0')}`;
  }

  #createGroupKey(players) {
    // create a key for a group of 4 players
    return [...players]
      .map(p => p.id)
      .sort((a, b) => a - b)
      .join(',');
  }

  #highAndLow(teams, high, low) {
    let success = false;
    const team = this.#pickTeams(high, low);
    if (team != null) {
      teams.push(team);
      this.#afterTeamCreate(team);
      success = true;
    }
    return success;
  }

  #highAndHigh(teams, high) {
    let success = false;
    const high_team = this.#pickHighOrLowTeams(high);
    if (high_team != null) {
      teams.push(high_team);
      this.#afterTeamCreate(high_team);
      success = true;
    }
    return success;
  }

  #lowAndLow(teams, low) {
    let success = false;
    const low_team = this.#pickHighOrLowTeams(low);
    if (low_team != null) {
      teams.push(low_team);
      this.#afterTeamCreate(low_team);
      success = true;
    }
    return success;
  }

  #pickHighOrLowTeams(players) {
    const high = players.slice(0, players.length / 2);
    const low = players.slice(players.length / 2, players.length);
    return this.#pickTeams(high, low);
  }

  #pickTeams(high, low) {
    // Create a map of available players for faster lookup
    const availableHigh = high.filter(p => !this.usedPlayers.has(p.id));
    const availableLow = low.filter(p => !this.usedPlayers.has(p.id));

    for (const h1 of availableHigh) {
      for (const h2 of availableHigh) {
        if (h1.id === h2.id) continue;

        for (const l1 of availableLow) {
          for (const l2 of availableLow) {
            if (l1.id === l2.id) continue;

            const team1 = [h1, l1];
            const team2 = [h2, l2];

            const key1 = this.#createTeamKey(h1, l1);
            const key2 = this.#createTeamKey(h2, l2);
            const groupKey = this.#createGroupKey([h1, h2, l1, l2]);

            if (this.usedTeams.has(key1) ||
              this.usedTeams.has(key2) ||
              this.usedGroups.has(groupKey)
              ) {
              continue;
            }
            return [...team1, ...team2];
          }
        }
      }
    }
    return null;
  }

  #afterTeamCreate(team) {
    const key1 = this.#createTeamKey(team[0], team[1]);
    const key2 = this.#createTeamKey(team[2], team[3]);
    this.usedPlayers.add(team[0].id);
    this.usedPlayers.add(team[1].id);
    this.usedPlayers.add(team[2].id);
    this.usedPlayers.add(team[3].id);
    this.usedTeams.add(key1);
    this.usedTeams.add(key2);

    // add key for 4 players group
    this.usedGroups.add(this.#createGroupKey(team));
  }

  #randomGroup(players) {
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    const groups = [];
    for (let i = 0; i < players.length; i += 4) {
      const group = players.slice(i, i + 4);
      group.sort((a, b) => b.rate - a.rate);
      const team = [group[0], group[3], group[2], group[1]];
      this.#afterTeamCreate(team);
      groups.push(team);
    }
    return groups;
  }

  #generateMatchTeamsByRound(players, round) {
    const sortedPlayers = [...players].sort((a, b) => b.rate - a.rate);
    const psize = sortedPlayers.length / 4;
    const teams = [];

    // Split players into high and low rated groups
    const high = sortedPlayers.slice(0, sortedPlayers.length / 2);
    const low = sortedPlayers.slice(sortedPlayers.length / 2);

    for (let j = 1; j <= psize; j++) {
      let success = false;

      if (round % 2) {
        // Try high-high and low-low combinations first
        success = this.#highAndHigh(teams, high) ||
          this.#lowAndLow(teams, low)
      }

      if (!success) {
        // Try high-low combination
        success = this.#highAndLow(teams, high, low)
      }
    }

    // Handle remaining players
    const leftPlayers = players.filter(player => !this.usedPlayers.has(player.id));
    if (leftPlayers.length > 0) {
      teams.push(...this.#randomGroup(leftPlayers));
    }

    return teams;
  }

  #checkDuplicate(games) {
    const stats = this.getStats(games);
    const restCounts = Object.values(stats.playerRestCounts);
    const playCounts = Object.values(stats.playerMatchCounts);
    const maxRest = Math.max(...restCounts);
    const minRest = Math.min(...restCounts);
    const maxPlay = Math.max(...playCounts);
    const minPlay = Math.min(...playCounts);
    const maxDuplicateTeamsPerCount = Math.ceil(this.regenerateTimes / 500);
    const maxDuplicateTeamsLength = Math.ceil(this.regenerateTimes / 500);
    return Object.keys(stats.duplicateTeams).length > maxDuplicateTeamsLength ||
      Object.keys(stats.duplicateGroups).length > 0 ||
      Object.values(stats.duplicateTeams).some(count => count > maxDuplicateTeamsPerCount) ||
      maxRest - minRest > 1 ||
      maxPlay - minPlay > 1;
  }

  generateGame() {
    let games;
    let needRegenerate;
    do {
      games = [];
      needRegenerate = false;

      // clear used sets
      this.usedTeams.clear();
      this.usedGroups.clear();

      for (let round = 1; round <= this.rounds; round++) {
        const idlePlayers = this.picker.pickRandomGroup().map(index => this.players[index]);
        const activePlayers = this.players.filter(player => !idlePlayers.includes(player));
        const activeTeams = this.#generateMatchTeamsByRound(activePlayers, round);
        const matches = activeTeams.splice(0, this.courts);
        games.push({ matches, idlePlayers, activePlayers });
        this.usedPlayers.clear();
      }

      // Check if the generated games are valid
      if (this.#checkDuplicate(games)) {
        this.regenerateTimes++;
        needRegenerate = true;
      }

    } while (needRegenerate);

    return games;
  }

  getStats(games) {
    const playerMatchCounts = {};
    const teamMatchCounts = {};
    const playerRestCounts = {};
    const duplicateTeams = {};
    const duplicateGroups = {};

    for (const round of games) {
      const { idlePlayers, matches } = round;
      // Count rest times for idle players
      idlePlayers.forEach(player => {
        playerRestCounts[player.id] = (playerRestCounts[player.id] || 0) + 1;
      });

      // Count match times for players and teams
      matches.forEach(match => {
        // Count player matches
        match.forEach(player => {
          playerMatchCounts[player.id] = (playerMatchCounts[player.id] || 0) + 1;
        });

        // Count team matches
        const team1Name = `${match[0].id},${match[1].id}`;
        const team2Name = `${match[2].id},${match[3].id}`;

        // Create all possible combinations of 4 players from the match
        const allPlayers = [...match];
        allPlayers.sort((a, b) => a.id - b.id);
        const groupKey = allPlayers.map(p => p.id).join(',');
        duplicateGroups[groupKey] = (duplicateGroups[groupKey] || 0) + 1;

        teamMatchCounts[team1Name] = (teamMatchCounts[team1Name] || 0) + 1;
        teamMatchCounts[team2Name] = (teamMatchCounts[team2Name] || 0) + 1;

        // Record teams that appear more than once
        if (teamMatchCounts[team1Name] > 1) {
          duplicateTeams[team1Name] = teamMatchCounts[team1Name];
        }
        if (teamMatchCounts[team2Name] > 1) {
          duplicateTeams[team2Name] = teamMatchCounts[team2Name];
        }
      });
    }

    // Filter out groups that only appeared once
    const filteredDuplicateGroups = Object.fromEntries(
      Object.entries(duplicateGroups).filter(([_, count]) => count > 1)
    );

    return {
      playerMatchCounts,
      teamMatchCounts,
      playerRestCounts,
      duplicateTeams,
      duplicateGroups: filteredDuplicateGroups,
      regenerateTimes: this.regenerateTimes
    };
  }
}

module.exports = Badminton;