# Truth or Trap

This is a web-based "Truth or Dare" party game with a twist. Players take turns choosing between a "truth" or a "dare", but they also have special cards that can be used to turn the tables on their opponents.

## Features

*   **Multiplayer:** Play with 2 or more players.
*   **Localization:** Supports English, Chinese, and Malay.
*   **Difficulty Levels:** Choose between Simple, Normal, and Extreme difficulty levels for the challenges.
*   **Special Cards:** Use cards to gain advantages, such as immunity from a challenge, battling another player, stealing their cards, or even creating your own custom truth or dare.
*   **Persistent State:** The game state is saved to local storage, so you can pick up where you left off.

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/truth-or-trap.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd truth-or-trap
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server, run the following command:

```bash
npm run dev
```

This will start the application on `http://localhost:5173`.

## Game Rules

1.  **Setup:**
    *   Add at least two players.
    *   Choose a difficulty level for the challenges.
    *   Select a language for the game.
2.  **Gameplay:**
    *   A player is randomly selected to start the game.
    *   The current player chooses between a "truth" or a "dare".
    *   A random challenge is presented to the player.
    *   After completing the challenge, there is a chance to receive a special card.
3.  **Cards:**
    *   Players can use their special cards at any time during their turn.
    *   See the "Card Types" section for more details on each card.
4.  **Winning:**
    *   There is no winning condition in this game. The goal is to have fun and complete the challenges.

## Card Types

*   **Immunity Card:** Skip your turn once.
*   **Battle Card:** Challenge another player to a game of rock-paper-scissors. The loser has to complete the dare.
*   **Steal Card:** Attempt to steal a card from another player (75% chance of success).
*   **King Card:** Create your own custom truth or dare for any player.

## Project Structure

```
.
├── src
│   ├── components
│   │   ├── BattleModal.tsx
│   │   ├── BattleSetupModal.tsx
│   │   ├── CardAwardPopup.tsx
│   │   ├── CardModal.tsx
│   │   ├── GameScreen.tsx
│   │   ├── KingCardModal.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── StealSetupModal.tsx
│   │   └── tutorial.tsx
│   ├── context
│   │   └── LocalizationContext.tsx
│   ├── hooks
│   │   └── gameReducer.ts
│   ├── services
│   │   ├── challenges.json
│   │   └── challengeService.ts
│   ├── App.tsx
│   ├── constants.ts
│   ├── index.tsx
│   └── types.ts
├── public
│   └── images
├── QuestionFile
│   ├── new.py
│   └── run.py
├── package.json
└── README.md
```

## Scripts

*   `npm run dev`: Starts the development server.
*   `npm run build`: Builds the application for production.
*   `npm run preview`: Previews the production build locally.

## Contributing

The `QuestionFile` directory contains Python scripts for adding new truth or dare questions to the `challenges.json` file.

*   `new.py`: A helper script to create a JSON file with a new question.
*   `run.py`: A script to format and add a list of questions to the `challenges.json` file.

To add new questions, modify the `truths` and `dares` lists in `run.py` and then run the script. This will generate a new JSON file with the questions, which can then be merged with the main `challenges.json` file.