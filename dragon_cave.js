const readline = require('readline');

// Function to generate a random number between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to display the cave (4x4 grid)
function displayCave(playerPosition, dragonPosition) {
  let cave = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (i === playerPosition[0] && j === playerPosition[1]) {
        cave += 'P ';
      } else if (i === dragonPosition[0] && j === dragonPosition[1]) {
        cave += 'D ';
      } else {
        cave += '_ ';
      }
    }
    cave += '\n';
  }
  console.log(cave);
}

// Function to move the dragon
function moveDragon(playerPosition, dragonPosition) {
  const dx = playerPosition[0] - dragonPosition[0];
  const dy = playerPosition[1] - dragonPosition[1];
  if (dx === 0 && dy === 0) return dragonPosition; // Dragon caught the player
  if (dx === 0) {
    // Same row
    dragonPosition[1] += dy > 0 ? 1 : -1;
  } else if (dy === 0) {
    // Same column
    dragonPosition[0] += dx > 0 ? 1 : -1;
  } else {
    // Randomly choose row or column
    if (Math.random() < 0.5) {
      dragonPosition[0] += dx > 0 ? 1 : -1;
    } else {
      dragonPosition[1] += dy > 0 ? 1 : -1;
    }
  }
  return dragonPosition;
}

// Function to check if the player survived
function checkSurvival(playerPosition, dragonPosition) {
  return (playerPosition[0] === dragonPosition[0] && playerPosition[1] === dragonPosition[1]);
}

// Function to start the game
function startGame() {
  let playerPosition = [getRandomInt(0, 3), 0]; // Randomly choose player position (1 of the 4 rooms on the far left)
  let dragonPosition = [getRandomInt(0, 3), 3]; // Randomly choose dragon position (1 of the 4 rooms on the far right)
  let turnsSurvived = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Main game loop
  function gameLoop() {
    displayCave(playerPosition, dragonPosition);
    rl.question('Enter your move (W/A/S/D): ', (move) => {
      switch (move.toUpperCase()) {
        case 'W':
          playerPosition[0] = Math.max(0, playerPosition[0] - 1); // Move north
          break;
        case 'A':
          playerPosition[1] = Math.max(0, playerPosition[1] - 1); // Move west
          break;
        case 'S':
          playerPosition[0] = Math.min(3, playerPosition[0] + 1); // Move south
          break;
        case 'D':
          playerPosition[1] = Math.min(3, playerPosition[1] + 1); // Move east
          break;
        default:
          break; // Stay put
      }

      dragonPosition = moveDragon(playerPosition, dragonPosition);
      turnsSurvived++;

      if (checkSurvival(playerPosition, dragonPosition)) {
        console.log('You were caught by the dragon! Game over.');
        console.log(`You survived ${turnsSurvived} turns.`);
        rl.close();
      } else if (playerPosition[1] === 3) {
        console.log('You reached the end of the cave and survived! You win!');
        console.log(`You survived ${turnsSurvived} turns.`);
        rl.close();
      } else if (turnsSurvived >= 10) {
        console.log('Congratulations! You survived 10 turns and won the game!');
        console.log(`You survived ${turnsSurvived} turns.`);
        rl.close();
      } else {
        gameLoop();
      }
    });
  }

  gameLoop();
}

// Start the game
startGame();
