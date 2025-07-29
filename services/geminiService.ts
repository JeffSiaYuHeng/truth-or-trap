import { GoogleGenAI, Type } from "@google/genai";
import { GameMode, ChallengeType, Language, Difficulty } from '../types';

// The API key is read from process.env.API_KEY, which is assumed to be set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const languageMap: Record<Language, string> = {
    [Language.EN]: 'English',
    [Language.CN]: 'Simplified Chinese',
    [Language.MY]: 'Malay'
};

const challengePrompts = {
    [Language.EN]: {
        [GameMode.PRIVATE]: {
            [ChallengeType.TRUTH]: "Generate a personal or funny 'Truth' question for close friends playing indoors. Be creative!",
            [ChallengeType.DARE]: "Generate a fun, slightly embarrassing 'Dare' for someone in a private home setting. Keep it safe."
        },
        [GameMode.PUBLIC]: {
            [ChallengeType.TRUTH]: "Generate a 'Truth' question suitable for a public setting, perhaps about public observations or general opinions.",
            [ChallengeType.DARE]: "Generate a 'Dare' that is performative but safe to do in a public space like a park or cafe in Malaysia. Involve mild, funny public interaction."
        }
    },
    [Language.CN]: {
        [GameMode.PRIVATE]: {
            [ChallengeType.TRUTH]: "为在室内玩耍的亲密朋友生成一个个人或有趣‘真心话’问题。要有创意！",
            [ChallengeType.DARE]: "在私人家庭环境中，为某人生成一个有趣、略带尴尬的‘大冒险’。注意安全。"
        },
        [GameMode.PUBLIC]: {
            [ChallengeType.TRUTH]: "生成一个适合公共场合的‘真心话’问题，可以关于公共观察或普遍看法。",
            [ChallengeType.DARE]: "生成一个在马来西亚公园或咖啡馆等公共场所既有表演性又安全的‘大冒险’。包含温和、有趣的公众互动。"
        }
    },
    [Language.MY]: {
        [GameMode.PRIVATE]: {
            [ChallengeType.TRUTH]: "Jana soalan 'Jujur' yang peribadi atau lucu untuk kawan rapat yang bermain di dalam rumah. Jadilah kreatif!",
            [ChallengeType.DARE]: "Jana 'Cabaran' yang seronok dan sedikit memalukan untuk seseorang dalam suasana rumah persendirian. Pastikan ia selamat."
        },
        [GameMode.PUBLIC]: {
            [ChallengeType.TRUTH]: "Jana soalan 'Jujur' yang sesuai untuk suasana awam, mungkin mengenai pemerhatian awam atau pendapat umum.",
            [ChallengeType.DARE]: "Jana 'Cabaran' yang performatif tetapi selamat untuk dilakukan di tempat awam seperti taman atau kafe di Malaysia. Libatkan interaksi awam yang ringan dan lucu."
        }
    }
};

const difficultyPrompts = {
    [Language.EN]: {
        [Difficulty.SIMPLE]: " The challenge should be lighthearted, easy, and quick to perform. Avoid anything too personal or embarrassing.",
        [Difficulty.NORMAL]: " The challenge should be a standard, fun party game task. A good balance of fun and challenge.",
        [Difficulty.EXTREME]: " The challenge should be very difficult, revealing, or daring. Push the player's limits. Be extreme but still safe."
    },
    [Language.CN]: {
        [Difficulty.SIMPLE]: " 挑战应该是轻松、简单、快速的。避免过于私人或令人尴尬的内容。",
        [Difficulty.NORMAL]: " 挑战应该是标准的、有趣的派对游戏任务。在乐趣和挑战之间取得良好平衡。",
        [Difficulty.EXTREME]: " 挑战应该非常困难、具有揭示性或大胆。挑战玩家的极限。要极端但仍需注意安全。"
    },
    [Language.MY]: {
        [Difficulty.SIMPLE]: " Cabaran hendaklah ringan, mudah, dan cepat untuk dilakukan. Elakkan apa-apa yang terlalu peribadi atau memalukan.",
        [Difficulty.NORMAL]: " Cabaran hendaklah menjadi tugas permainan parti yang standard dan menyeronokkan. Keseimbangan yang baik antara keseronokan dan cabaran.",
        [Difficulty.EXTREME]: " Cabaran hendaklah sangat sukar, mendedahkan, atau berani. Tolak had pemain. Jadilah ekstrem tetapi masih selamat."
    }
};

export const generateChallenge = async (
  gameMode: GameMode,
  challengeType: ChallengeType,
  language: Language,
  difficulty: Difficulty,
  options: { isIntensified?: boolean; isStealFailure?: boolean } = {}
): Promise<string> => {
  try {
    let promptText = challengePrompts[language][gameMode][challengeType];
    promptText += difficultyPrompts[language][difficulty];

    if (options.isIntensified) {
        promptText += " Make the challenge significantly harder and more personal. This could be because they lost a duel or used a special card."
    }
    if (options.isStealFailure) {
        promptText += " This player just failed an attempt to steal a card from someone else. Generate a punishing but funny 'Dare' as a consequence for their failure."
    }


    const systemInstruction = `You are 'Truth or Trap', a party game AI. Your response must be in ${languageMap[language]}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            challenge: {
              type: Type.STRING,
              description: `The ${challengeType} text in ${languageMap[language]}.`
            }
          }
        },
        temperature: 1,
        topP: 0.95,
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && result.challenge) {
      return result.challenge;
    } else {
      console.error("Generated JSON is missing 'challenge' field:", result);
      throw new Error("Invalid response format from AI.");
    }
  } catch (error) {
    console.error("Error generating challenge with Gemini:", error);
    throw error;
  }
};