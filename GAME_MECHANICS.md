# 🎮 Game Mechanisms & Features: Truth or Trap

Truth or Trap is a high-tactile, "Vibrant" minimalist party game designed for mobile devices. It combines the classic Truth or Dare format with strategic card-based gameplay and chance events.

---

## 🚀 1. Setup Phase
Before the party begins, the host configures the game environment:
*   **Player Entry**: Add at least 2 players to the lobby. The interface shows the newest player at the top for quick verification.
*   **Difficulty Selection**: A vertical list allows players to choose the intensity of the challenges:
    *   **Simple**: Light, fun, and perfect for warming up.
    *   **Normal**: The classic experience with a balanced mix of secrets and silly tasks.
    *   **Extreme**: Pushes limits for the truly brave.
*   **Language Port**: Quick switching between **English (🇺🇸)**, **Chinese (🇨🇳)**, and **Malay (🇲🇾)** via a dedicated header bar.
*   **Tutorial Port**: A multi-step interactive wizard accessible from the top-left to explain rules and card designs.

---

## 🌀 2. Core Gameplay Loop

### The Roulette
Every round starts with the Roulette. The system randomly selects one player to be the "Active Player."

### The 2x Streak (Forced Dare)
If the Roulette picks the **same player twice in a row**, that player is locked into a **Forced Dare**. They lose the ability to choose "Truth" and must perform a challenge to continue.

### Decision Phase
The active player is spotlighted and must choose between:
*   **Truth**: Answer a personal question honestly.
*   **Dare**: Perform a physical or social challenge.
*   *Note: Accessibility patterns (Dots for Truth / Stripes for Dare) help distinguish the choices visually.*

### Challenge Phase (Middle Stage)
The selected challenge "flies" into the center of the screen.
*   **No Retreat**: The "Skip Challenge" button has been removed to increase stakes. All challenges are mandatory.
*   **DONE Action**: Once completed, the player taps the prominent **DONE** button to pass the turn.

---

## 🃏 3. The Trap Card System
Cards are special items that can be used to manipulate the game or target other players. They are revealed during "Chance Events" or earned through streaks.

### 🎒 Item Inventory
Players can access their cards via the **ITEMS (X)** handle at the bottom of the screen. This inventory is only available during the Decision Phase.

### Detailed Card Actions:
| Card Type | Icon | Mechanism |
| :--- | :--- | :--- |
| **Immunity** | 🛡️ | **Skip Turn**: Allows a player to skip a scary Truth or Dare entirely without penalty. |
| **Battle** | ⚔️ | **RPS Duel**: Challenge any other player to Rock-Paper-Scissors. The loser is immediately forced into a high-stakes Dare. |
| **Steal** | 🕵️ | **Theft (75%)**: Attempt to steal an Immunity Card from another player. If you fail, YOU are forced into a hard challenge as punishment. |
| **King** | 👑 | **Decree**: Allows the user to write their own custom challenge (Truth or Dare) and force it upon any target player. |

---

## 🎁 4. Rewards & Chance Events

### Dare Streak Reward
Players who are brave enough to complete **3 Dares in a row** are automatically awarded an **Immunity Card** as a "Brave Bonus."

### Lucky Chance Events
After a turn ends, there is a probability of a **Chance Event** occurring. The system will interrupt the flow to award a random Trap Card to any player, keeping the balance of power shifting constantly.

---

## 🎨 5. Design Philosophy: VIBRANT
The game follows the **VIBRANT Design System**:
*   **Minimalist Emojis**: Emojis are stripped from key interaction points (Difficulty, Selection, Headers) to maintain a premium, stable aesthetic.
*   **Tactile Feedback**: Buttons use physical "lips" and 3D shadows to simulate real-world presses.
*   **Vertical Focus**: All core game elements are centered vertically for better ergonomics on mobile devices.
*   **Contextual UI**: Screens transition smoothly, hiding unnecessary elements (like the card inventory) during high-focus challenge moments.
