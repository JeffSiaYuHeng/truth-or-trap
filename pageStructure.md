# Page Structure & Layout 🏗️

This document outlines the visual hierarchy and component layout of the **Truth or Trap** application.

---

## 1. Global App Wrapper (`App.tsx`)
The root container that manages screen transitions and global state.
- **Background**: `#FFFFFF` (Solid white for a clean, canvas-like feel).
- **Font**: `'Varela Round', sans-serif`.
- **State Management**: Controls the transition between `SetupScreen` and `GameScreen`.

---

## 2. Setup Screen (`SetupScreen.tsx`)
The initial configuration page for players and difficulty.

### **Layout Hierarchy**
1.  **Main Container (`card-vibrant`)**: A centered, rounded white card with a subtle gray border.
2.  **Header**:
    - **Logo**: Centered brand image.
    - **Language Selector**: Row of `btn-vibrant` buttons (EN, 中文, MY) for instant localization.
3.  **Player Management Section**:
    - **Player List**: Scrollable area showing added players with their **AI Avatars** and names.
    - **Add Input**: Text input for names + `btn-vibrant` "plus" action.
4.  **Difficulty Grid**:
    - A 1x3 (mobile) or 3x1 (desktop) grid of selection cards.
    - Selected item uses a Blue border (`#1CB0F6`) and light blue highlight.
5.  **Action Footer**:
    - **Start/Continue Button**: Large `btn-success` (`#58CC02`) that sticks to the bottom.
    - **Tutorial Toggle**: Blue button to open instructions.

---

## 3. Game Screen (`GameScreen.tsx`)
The core gameplay interface where actions happen.

### **Layout Hierarchy**
1.  **Top Navigation**:
    - **Progress Bar**: A full-width chunky bar at the top reflecting the current turn in the player rotation.
    - **Reset Button**: A small exit/back link on the top-left.
2.  **Active Player Stage**:
    - **Avatar**: Large AI-generated portrait in a thick-bordered circle.
    - **Turn Text**: Bold name display using large typography.
3.  **Action Stage (The "Arena")**:
    - **Decision State**: Two large physical buttons: **Truth (Blue)** and **Dare (Red)**.
    - **Challenge State**: Displays the challenge text in high-contrast bold font.
    - **Next Player Button**: A large green "Continue" action.
4.  **Interaction Menu**:
    - **Card Button**: A teal button at the bottom showing the current player's card count.

---

## 4. Interaction Overlays

### **A. Card Sheet (`CardModal.tsx`)**
- **Type**: Bottom Sheet.
- **Layout**: Slides up from the bottom, covering ~60% of the screen.
- **Content**: A vertical list of cards owned by the player. Each card item shows the card image, name, and a "Use" button.

### **B. Battle Arena (`BattleModal.tsx`)**
- **Type**: Fullscreen Overlay.
- **Layout**: Centered battle title ("BATTLE!") with two opposing player avatars.
- **Action**: A primary selection area for Rock-Paper-Scissors choices using large emoji icons.

### **C. Reward Popup (`CardAwardPopup.tsx`)**
- **Type**: Centered Modal.
- **Layout**: Exploding confetti emoji + image of the new card found.
- **Animation**: `drop-and-bounce` entrance to emphasize the reward.

---

## 📐 Design Tokens used in Layouts
| Element | Border Radius | Stroke Weight | Shadow Style |
| :--- | :--- | :--- | :--- |
| **Buttons** | 16px | N/A | 4px Lower Lip |
| **Cards** | 20px | 2px | Subtle Outer Glow |
| **Modals** | 32px (Top) | 2px | Deep Soft Shadow |
| **Avatars** | 50% (Circle) | 4px | High Contrast Border |
