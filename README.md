# 🎮 Truth or Trap

> **Core Philosophy**: A high-tactile, "Vibrant" minimalist party game designed for mobile devices. It combines the classic *Truth or Dare* format with strategic card-based gameplay and chance events.

## 🎨 Design Philosophy: VIBRANT

The application follows the **VIBRANT 1.0** UI/UX Design System, prioritizing high engagement, tactile feedback, and a premium "coloring-book" aesthetic.

### Core Principles
- **Minimalist Emojis**: Emojis are purposefully stripped from key interaction points to maintain a premium, stable aesthetic.
- **The "Juice" Principle**: Every interaction is tactile. Buttons have physical "lips" (3D shadows) that depress when clicked to simulate real-world presses.
- **Vertical Focus**: All core game elements are centered vertically for better ergonomics on mobile devices.
- **Contextual UI**: Screens transition smoothly, hiding unnecessary elements (like the card inventory) during high-focus challenge moments.

### Visual Foundations
- **Typography**: Geometric rounded sans-serif (**Varela Round**) for a friendly tone.
- **AI Avatars**: Dynamic player avatars powered by the **DiceBear Open Peeps API**.
- **Bottom Sheets**: Modern interaction patterns using sliding sheets instead of standard modals.

## 🚀 Features & Mechanics

### 1. Setup Phase
- **Player Entry**: Dynamic lobby supporting 2+ players with automated avatar generation.
- **Difficulty Selection**:
    - **Simple**: Light, fun, and perfect for warming up.
    - **Normal**: The classic experience with a balanced mix of secrets and silly tasks.
    - **Extreme**: Pushes limits for the truly brave.
- **Language Port**: Instant switching between **English (🇺🇸)**, **Chinese (🇨🇳)**, and **Malay (🇲🇾)**.
- **Tutorial Port**: Interactive wizard to explain rules and card designs.

### 2. Core Gameplay Loop
- **The Roulette**: Randomly selects the "Active Player" each round.
- **The 2x Streak (Forced Dare)**: If the same player is picked **twice in a row**, they are locked into a **Forced Dare** (cannot choose Truth).
- **Decision Phase**: Active player chooses **Truth** (Terms apply) or **Dare**.
    - *Accessibility*: Uses distinctive patterns (Dots vs. Stripes) for visual clarity.
- **Challenge Phase**:
    - **No Retreat**: "Skip Challenge" is disabled. All challenges are mandatory.
    - **DONE Action**: Prominent completion verification.

### 3. The Trap Card System
Players can access their inventory during the Decision Phase. Cards are earned via streaks or random events.

| Card Type | Icon | Mechanism |
| :--- | :--- | :--- |
| **Immunity** | 🛡️ | **Skip Turn**: Skip a Truth or Dare entirely without penalty. |
| **Battle** | ⚔️ | **RPS Duel**: Challenge a player to Rock-Paper-Scissors. The loser takes a high-stakes Dare. |
| **Steal** | 🕵️ | **Theft (75%)**: Attempt to steal an Immunity Card. Failure results in a punishment Challenge. |
| **King** | 👑 | **Decree**: Write a custom challenge and force it upon any target player. |

### 4. Rewards & Chance Events
- **Dare Streak Reward**: Completing **3 Dares in a row** awards an automatic **Immunity Card**.
- **Lucky Chance Events**: Random system interruptions after turns that gift a Trap Card to a player, keeping the game dynamic.

## 📁 Project Structure

```text
truth-or-trap/
├── components/        # UI components (Screens, Modals, Popups)
├── context/           # React context for Localization (EN/CN/MY)
├── hooks/             # Custom hooks (gameReducer.ts for core game logic)
├── services/          # Data services and challenge database (JSON)
├── QuestionFile/      # Python utility scripts for content management
├── public/            # Static assets and game illustrations
├── App.tsx             # Main application logic and navigation
├── constants.ts       # Shared constants and game configurations
├── types.ts           # TypeScript definitions for game state
├── index.css          # VIBRANT design system and global styles
├── GAME_MECHANICS.md  # Detailed rules and mechanics (English)
└── 游戏.md             # Detailed rules and mechanics (Chinese)
```

## Contributing

The `QuestionFile` directory contains Python scripts for expanding the `challenges.json` database.
- `new.py`: Template generator for new questions.
- `run.py`: Bulk formatting and processing script.