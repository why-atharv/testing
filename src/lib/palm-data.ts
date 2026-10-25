/**
 * Editorial content for the four major palm lines and their reflection
 * questions. Interpretations follow traditional palmistry as a cultural
 * practice — they are written as invitations to reflect, never predictions.
 */

export type LineId = "heart" | "head" | "life" | "fate";

export type ArchetypeId =
  | "explorer"
  | "dreamer"
  | "strategist"
  | "adventurer"
  | "builder"
  | "observer";

export interface ReflectionOption {
  id: string;
  label: string;
  /** Archetype points awarded for choosing this option. Shown to the user in the results. */
  weights: Partial<Record<ArchetypeId, number>>;
  /** Line reading shown in the results when this option was chosen. */
  reading: string;
  /** Interest tag used to pick next-adventure suggestions. */
  interest: Interest;
}

export type Interest = "people" | "ideas" | "making" | "movement" | "stillness" | "novelty";

export interface PalmLine {
  id: LineId;
  name: string;
  subtitle: string;
  /** Where to look for it on a real palm. */
  location: string;
  tradition: string;
  question: string;
  options: ReflectionOption[];
  /** Reading used in the results when the question was skipped. */
  neutralReading: string;
  /** Short keywords shown in lists. */
  keywords: string;
}

export const PALM_LINE_ORDER: LineId[] = ["heart", "head", "life", "fate"];

export const PALM_LINES_CONTENT: Record<LineId, PalmLine> = {
  heart: {
    id: "heart",
    name: "Heart Line",
    subtitle: "The language of emotion.",
    location: "The uppermost line, running across the palm beneath the fingers — from the little-finger edge toward the index finger.",
    tradition:
      "Traditional palmistry associates the heart line with emotions, affection, and the way we connect with the people around us.",
    question: "What matters most to you when building a meaningful friendship?",
    keywords: "Emotion · Connection",
    neutralReading:
      "Your heart line is a reminder that connection takes many shapes. Notice which friendships leave you feeling more like yourself.",
    options: [
      {
        id: "deep-talks",
        label: "Deep conversations",
        weights: { observer: 2, dreamer: 1 },
        interest: "ideas",
        reading:
          "You value depth over noise. In palmistry's language, a heart line read this way speaks of someone who listens closely and remembers what others say.",
      },
      {
        id: "shared-adventures",
        label: "Shared adventures",
        weights: { adventurer: 2, explorer: 1 },
        interest: "movement",
        reading:
          "For you, friendship grows in motion — road trips, late-night plans, the story you'll both tell later. Your heart line is read as open and outward-facing.",
      },
      {
        id: "trust-loyalty",
        label: "Trust and loyalty",
        weights: { builder: 2, strategist: 1 },
        interest: "people",
        reading:
          "You build friendships the way good things are built: slowly and to last. Tradition would call this a steady heart line — consistent and dependable.",
      },
      {
        id: "making-laugh",
        label: "Making each other laugh",
        weights: { explorer: 2, dreamer: 1 },
        interest: "novelty",
        reading:
          "Lightness is your love language. A heart line read through laughter belongs to someone who makes rooms feel warmer simply by being in them.",
      },
    ],
  },
  head: {
    id: "head",
    name: "Head Line",
    subtitle: "The shape of thought.",
    location: "Begins between the thumb and index finger and travels across the middle of the palm.",
    tradition:
      "In traditional palmistry, the head line is linked with curiosity, learning style, and the way a person approaches problems.",
    question: "When you face a tricky problem, what do you reach for first?",
    keywords: "Thought · Perspective",
    neutralReading:
      "Your head line invites a simple question: when do your best ideas arrive? Pay attention this week — the answer may surprise you.",
    options: [
      {
        id: "plan",
        label: "A plan, step by step",
        weights: { strategist: 2, builder: 1 },
        interest: "ideas",
        reading:
          "You like to see the whole board before you move. Palmists would read a clear, even head line here — patient thinking that turns chaos into order.",
      },
      {
        id: "sketch",
        label: "A sketch or a wild idea",
        weights: { dreamer: 2, explorer: 1 },
        interest: "making",
        reading:
          "Your mind takes the scenic route. A head line that curves toward imagination belongs to someone who finds answers others walk past.",
      },
      {
        id: "try-it",
        label: "Just try something",
        weights: { adventurer: 2, builder: 1 },
        interest: "making",
        reading:
          "You think with your hands. Traditional readings would call this a decisive head line — learning by doing, adjusting as you go.",
      },
      {
        id: "ask-around",
        label: "Ask around, gather views",
        weights: { observer: 2, strategist: 1 },
        interest: "people",
        reading:
          "You know no single mind has every answer. Read this way, your head line is wide and collaborative — you collect perspectives before choosing.",
      },
    ],
  },
  life: {
    id: "life",
    name: "Life Line",
    subtitle: "The rhythm of energy.",
    location: "Curves around the base of the thumb, arcing from the edge of the palm toward the wrist.",
    tradition:
      "Despite its name, palmistry traditions read the life line as a picture of vitality and how we spend our energy — not how long we live.",
    question: "Where do you feel most energised?",
    keywords: "Energy · Growth",
    neutralReading:
      "Your life line is about rhythm, not length. Notice which moments in your week give you energy, and which ones quietly take it.",
    options: [
      {
        id: "outdoors",
        label: "Outdoors, moving",
        weights: { adventurer: 2, explorer: 1 },
        interest: "movement",
        reading:
          "Fresh air resets you. In palmistry's vocabulary, a strong sweep around the thumb is read as energy that loves open space and motion.",
      },
      {
        id: "creating",
        label: "Lost in a creative project",
        weights: { dreamer: 2, builder: 1 },
        interest: "making",
        reading:
          "Time disappears when you're making something. Your life line, read this way, glows brightest in flow — hands busy, mind quiet.",
      },
      {
        id: "crowd",
        label: "Surrounded by people",
        weights: { explorer: 2, adventurer: 1 },
        interest: "people",
        reading:
          "You recharge in good company. Tradition would describe a life line that draws warmth from others and gives it back twice over.",
      },
      {
        id: "quiet",
        label: "In a quiet corner",
        weights: { observer: 2, strategist: 1 },
        interest: "stillness",
        reading:
          "Stillness is your power source. A calm, deep life line in traditional readings belongs to someone whose energy runs steady and long.",
      },
    ],
  },
  fate: {
    id: "fate",
    name: "Fate Line",
    subtitle: "The pull of direction.",
    location: "Runs vertically up the centre of the palm toward the middle finger. Not everyone has one — that's normal.",
    tradition:
      "Palmistry links the fate line with direction and purpose. Many palms show a faint or absent fate line, which traditions read as a path still being written.",
    question: "If you could spend a year on anything, what would it be?",
    keywords: "Direction · Purpose",
    neutralReading:
      "A fate line is read as a path still being written. You don't need a single direction yet — curiosity is a direction too.",
    options: [
      {
        id: "build-thing",
        label: "Building something real",
        weights: { builder: 2, strategist: 1 },
        interest: "making",
        reading:
          "You want to leave something behind that works. Read this way, your fate line points toward craft — ideas made solid, one version at a time.",
      },
      {
        id: "travel",
        label: "Travelling somewhere new",
        weights: { adventurer: 2, explorer: 1 },
        interest: "novelty",
        reading:
          "Your compass points outward. A fate line read through travel belongs to someone whose path is shaped by places and the people met along the way.",
      },
      {
        id: "learn",
        label: "Mastering a new subject",
        weights: { strategist: 2, observer: 1 },
        interest: "ideas",
        reading:
          "Depth calls you. Traditional readings would see a focused fate line here — the patience to go further into one thing than most people go.",
      },
      {
        id: "create-art",
        label: "Making art or stories",
        weights: { dreamer: 2, observer: 1 },
        interest: "making",
        reading:
          "You'd spend the year imagining out loud. Your fate line, read this way, bends toward expression — making the invisible visible.",
      },
    ],
  },
};

export interface Archetype {
  id: ArchetypeId;
  title: string;
  tagline: string;
  intro: string;
}

/** Order also acts as the tie-breaker when two archetypes share the top score. */
export const ARCHETYPE_ORDER: ArchetypeId[] = [
  "explorer",
  "dreamer",
  "strategist",
  "adventurer",
  "builder",
  "observer",
];

export const ARCHETYPES: Record<ArchetypeId, Archetype> = {
  explorer: {
    id: "explorer",
    title: "The Curious Explorer",
    tagline: "New perspectives. Bigger questions.",
    intro:
      "You're drawn to new ideas, fresh perspectives, and experiences that make a good story. Your curiosity helps you see the world in unexpected ways.",
  },
  dreamer: {
    id: "dreamer",
    title: "The Creative Dreamer",
    tagline: "Imagination first. Everything else follows.",
    intro:
      "You notice possibilities before anyone else does. Where others see a blank page, you see a world waiting to be drawn.",
  },
  strategist: {
    id: "strategist",
    title: "The Thoughtful Strategist",
    tagline: "Calm mind. Clear moves.",
    intro:
      "You think before you leap — and when you do leap, you land well. You turn messy questions into clear next steps.",
  },
  adventurer: {
    id: "adventurer",
    title: "The Bold Adventurer",
    tagline: "Say yes. Figure it out on the way.",
    intro:
      "You'd rather try than wonder. Energy, momentum, and the occasional detour are all part of how you discover what you love.",
  },
  builder: {
    id: "builder",
    title: "The Curious Builder",
    tagline: "Ideas, made real.",
    intro:
      "You like your ideas best when they work. Patient and practical, you turn sparks of inspiration into things people can actually use.",
  },
  observer: {
    id: "observer",
    title: "The Quiet Observer",
    tagline: "Notice everything. Say what matters.",
    intro:
      "You see details others miss and listen more than you speak. That quiet attention is a rare kind of strength.",
  },
};

export interface Adventure {
  title: string;
  body: string;
}

export const ADVENTURES: Record<Interest, Adventure[]> = {
  people: [
    { title: "Ask a better question", body: "This week, ask someone you know “What's something you've changed your mind about?” and really listen." },
    { title: "Reconnect", body: "Send a message to a friend you haven't spoken to in a while. Keep it simple — a memory, a song, a hello." },
  ],
  ideas: [
    { title: "Follow a rabbit hole", body: "Pick one question you've always wondered about and spend 30 minutes finding the best answer you can." },
    { title: "Explain it simply", body: "Teach something you understand well to someone younger, in under two minutes. Notice what gets clearer." },
  ],
  making: [
    { title: "Make a tiny thing", body: "Build, draw, cook, or code something small in a single evening. Finished beats perfect." },
    { title: "Remix an idea", body: "Take an object you use every day and sketch three ways it could work differently." },
  ],
  movement: [
    { title: "Take the long way", body: "Walk a route you've never taken in your own neighbourhood. Look up at least once." },
    { title: "Plan a micro-adventure", body: "Pick a place within an hour of home you've never visited and go this month." },
  ],
  stillness: [
    { title: "Ten quiet minutes", body: "Sit somewhere without your phone for ten minutes and write down three things you noticed." },
    { title: "Keep a margin journal", body: "End each day this week with one sentence: what surprised you today?" },
  ],
  novelty: [
    { title: "Try a first", body: "Do one thing this week you've never done before — a food, a skill, a style of music." },
    { title: "Meet someone new", body: "Start a conversation at an event like Ideas 4.0 with someone whose project you don't understand yet." },
  ],
};
