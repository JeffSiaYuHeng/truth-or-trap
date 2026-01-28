🛠️ Implementation Instruction.md: Mirror & Partner Mechanics
Version: 1.0
Status: Draft
Context: Integration of "Mirror" (Target Redirect) and "Partner" (Shared Execution) cards into the core game loop.
1. Data Model Updates
Before writing logic, the system state must be updated to handle "Target Switching" and "Multi-player Execution."
1.1 Card Definitions
Add the new card types to your Card Enum/Registry.
code
TypeScript
enum CardType {
  // ... existing cards
  MIRROR = "MIRROR",
  PARTNER = "PARTNER"
}
1.2 Challenge State Object
Modify the active challenge state to support multiple executors and execution modes.
code
TypeScript
interface ChallengeState {
  // Existing fields...
  id: string;
  type: 'TRUTH' | 'DARE';
  
  // NEW FIELDS
  originalExecutorId: string; // To track who pulled it (for logging)
  currentExecutorId: string;  // The actual person responsible (Modified by Mirror)
  partnerId: string | null;   // The linked partner (Modified by Partner)
  executionMode: 'SOLO' | 'SHARED';
  
  // Resolution Flags
  executorCompleted: boolean;
  partnerCompleted: boolean; // Only relevant if executionMode === SHARED
}
2. Core Logic Implementation
2.1 🪞 Mirror Card (Redirect Logic)
Trigger: Player activates card during PHASE_CHALLENGE_ASSIGNED.
Function: applyMirrorEffect(initiatorId, targetId)
Validation:
Check if initiatorId has a MIRROR card.
Check if targetId is valid (Alive, Not Self).
Critical Check: Verify activePlayers.count > 1. If only 1 opponent remains, throw error: "Cannot use Mirror in 1v1."
Check Global State: Must be in CHALLENGE_ASSIGNED phase.
Execution:
Consume 1 MIRROR card from initiatorId.
Update State: ChallengeState.currentExecutorId = targetId.
Notification: Emit event MirrorActivated(from: initiatorId, to: targetId).
Flow Control:
Crucial: Reset the "Reaction Timer" for the new target. The new target must now have an opportunity to play their own cards (e.g., Immunity).
2.2 🔗 Partner Card (Link Logic)
Trigger: Player activates card during PHASE_CHALLENGE_REVEALED.
Function: applyPartnerEffect(initiatorId, targetId)
Validation:
Check if initiatorId has a PARTNER card.
Check if initiatorId == ChallengeState.currentExecutorId (Can only use on self's turn).
Check if targetId is valid (Alive, Not Self).
Execution:
Consume 1 PARTNER card.
Update State:
ChallengeState.partnerId = targetId
ChallengeState.executionMode = 'SHARED'
Notification: Emit event PartnerLinked(initiator: initiatorId, partner: targetId).
UI Update: Update the prompt screen to show both avatars facing the challenge.
3. Game Loop Integration
You need to inject these checks into your standard Turn Lifecycle.
Phase A: Challenge Assigned (The Mirror Window)
Current Flow: Player Selected -> Challenge Assigned -> [Wait for Input] -> Reveal.
New Flow:
code
Pseudo
Event: Challenge_Assigned_To_Player(A)
Start Timer: Pre-Reveal Reaction Window
Loop:
  If Player A uses MIRROR on Player B:
    Change Executor to Player B
    Notify All: "Mirror Used! New Victim: Player B"
    Reset Timer (Give Player B a chance to react or use Immunity)
    Continue Loop
  
  If Player uses IMMUNITY:
    Cancel Challenge
    End Loop
  
  If Timer Ends or Player confirms "Ready":
    Proceed to Phase B
Phase B: Challenge Revealed (The Partner Window)
Current Flow: Text Revealed -> Execution -> Result.
New Flow:
code
Pseudo
Event: Challenge_Revealed (Text shown)
Start Timer: Pre-Execution Window
Loop:
  If Executor uses PARTNER on Player B:
    Set Mode = SHARED
    Set Partner = Player B
    Notify All: "Partner Card! Player A dragged Player B into the abyss."
    Update UI: Show instructions for BOTH players
    Break Loop (Usually Partner card is instant, no counter-play required standardly, unless Immunity allows blocking invites)

  If Executor confirms "Start":
    Proceed to Execution Phase
Phase C: Resolution (Winning/Losing)
You must update the logic that determines if a turn was "Passed" or "Failed".
code
TypeScript
function resolveChallenge(state: ChallengeState) {
  if (state.executionMode === 'SOLO') {
    // Standard logic
    if (state.executorCompleted) return RESULT_SUCCESS;
    return RESULT_FAILURE;
  } 
  
  else if (state.executionMode === 'SHARED') {
    // 🔗 Partner Logic: BOTH must succeed
    if (state.executorCompleted && state.partnerCompleted) {
      return RESULT_SHARED_SUCCESS; // Both get points/safe
    } else {
      return RESULT_SHARED_FAILURE; // Both take penalty
    }
  }
}
4. UI/UX Implementation Plan
4.1 Card Interaction
Inventory Screen:
Mirror Card: Active only when you are the designated target, but before you click "Reveal".
Partner Card: Active only after you see the Truth/Dare text.
Targeting Modal:
When either card is clicked, open a "Select Target" modal listing all living players excluding self.
4.2 HUD / Feedback
Mirror Effect:
Animation: An arrow curving from Player A to Player B.
Text: "↩️ REDIRECTED! [Player B] is now the target."
Partner Effect:
Animation: Chain link icon connecting Player A and Player B avatars.
Text: "🔗 LINKED! [Player B] must join the challenge."
5. Edge Cases & Conflict Rules
Handle these specific scenarios in your code:
Mirror Chains:
Scenario: A Mirrors to B. B has a Mirror card. Can B Mirror to C?
Rule: Yes. The currentExecutorId updates. Ensure the loop doesn't infinite cycle (game theory handles this naturally as cards are consumed).
Constraint: Can B Mirror back to A? Yes (Standard "No U" mechanic).
Partner + Immunity:
Scenario: A uses Partner on B. B has Immunity.
Rule: If B plays Immunity immediately, they break the link. A must do it alone (or select another partner if cards allow). Implementation: Allow Immunity to clear partnerId.
Forced Dares (Streaks):
Scenario: Player A is on a "Forced Dare" streak. Uses Mirror on B.
Rule: The "Forced" status travels with the challenge. B must do a Dare.
Implementation: Ensure the isForcedDare flag remains true during the transfer in Phase 2.1.
Disconnects:
If a Linked Partner disconnects during a SHARED challenge, default to "Success" for the remaining player to prevent unfair punishment, or auto-fail the disconnected player.
6. Implementation Checklist

Update CardType enum.

Update ChallengeState interface (add partnerId, executionMode).

Create applyMirrorEffect backend function.

Create applyPartnerEffect backend function.

Modify resolveChallenge to handle SHARED logic (AND gate).

UI: Add "Select Target" modal.

UI: Add visual indicators for "Linked" state.

Test: Mirroring back and forth (Ping Pong).

Test: Partner logic with 1 Success / 1 Fail (Should result in Total Fail).