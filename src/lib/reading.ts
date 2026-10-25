import {
  ADVENTURES,
  ARCHETYPE_ORDER,
  ARCHETYPES,
  PALM_LINE_ORDER,
  PALM_LINES_CONTENT,
  type Adventure,
  type Archetype,
  type ArchetypeId,
  type Interest,
  type LineId,
  type ReflectionOption,
} from "./palm-data";

export type Answers = Partial<Record<LineId, string>>;

export interface LineResult {
  lineId: LineId;
  name: string;
  keywords: string;
  answer?: ReflectionOption;
  reading: string;
}

export interface Contribution {
  lineId: LineId;
  answerLabel: string;
  points: number;
}

export interface ReadingResult {
  archetype: Archetype;
  /** Points per archetype, so the UI can explain exactly how the title was chosen. */
  scores: Record<ArchetypeId, number>;
  /** Which answers contributed points to the winning archetype. */
  contributions: Contribution[];
  lines: LineResult[];
  adventures: Adventure[];
  discovery: DiscoveryLevel;
  answeredCount: number;
}

export interface DiscoveryLevel {
  score: number;
  explored: number;
  answered: number;
}

export const POINTS_PER_EXPLORED_LINE = 10;
export const POINTS_PER_REFLECTION = 15;

export function findOption(lineId: LineId, optionId?: string) {
  if (!optionId) return undefined;
  return PALM_LINES_CONTENT[lineId].options.find((o) => o.id === optionId);
}

/**
 * Exploration progress only: 10 points for each line opened and
 * 15 for each reflection answered (4 × 10 + 4 × 15 = 100).
 */
export function computeDiscovery(explored: Iterable<LineId>, answers: Answers): DiscoveryLevel {
  const exploredCount = new Set(explored).size;
  const answered = PALM_LINE_ORDER.filter((id) => findOption(id, answers[id])).length;
  return {
    score: exploredCount * POINTS_PER_EXPLORED_LINE + answered * POINTS_PER_REFLECTION,
    explored: exploredCount,
    answered,
  };
}

/**
 * Deterministic reading composer. Each answer adds the archetype points
 * listed on its option; the highest total wins, ties resolved by
 * ARCHETYPE_ORDER with the heart-line answer given precedence.
 */
export function composeReading(answers: Answers, explored: Iterable<LineId>): ReadingResult {
  const scores = Object.fromEntries(ARCHETYPE_ORDER.map((id) => [id, 0])) as Record<ArchetypeId, number>;
  const interests: Interest[] = [];

  const lines: LineResult[] = PALM_LINE_ORDER.map((lineId) => {
    const line = PALM_LINES_CONTENT[lineId];
    const answer = findOption(lineId, answers[lineId]);
    if (answer) {
      for (const [archetype, points] of Object.entries(answer.weights) as [ArchetypeId, number][]) {
        scores[archetype] += points;
      }
      interests.push(answer.interest);
    }
    return {
      lineId,
      name: line.name,
      keywords: line.keywords,
      answer,
      reading: answer?.reading ?? line.neutralReading,
    };
  });

  const top = Math.max(...Object.values(scores));
  const contenders = ARCHETYPE_ORDER.filter((id) => scores[id] === top);
  let winner: ArchetypeId = contenders[0];
  if (contenders.length > 1) {
    // Prefer the archetype the earliest-answered line leaned toward most.
    for (const lineId of PALM_LINE_ORDER) {
      const option = findOption(lineId, answers[lineId]);
      if (!option) continue;
      const pick = contenders
        .filter((id) => option.weights[id])
        .sort((a, b) => (option.weights[b] ?? 0) - (option.weights[a] ?? 0))[0];
      if (pick) {
        winner = pick;
        break;
      }
    }
  }

  const contributions: Contribution[] = PALM_LINE_ORDER.flatMap((lineId) => {
    const option = findOption(lineId, answers[lineId]);
    const points = option?.weights[winner];
    return option && points ? [{ lineId, answerLabel: option.label, points }] : [];
  });

  return {
    archetype: ARCHETYPES[winner],
    scores,
    contributions,
    lines,
    adventures: pickAdventures(interests, winner),
    discovery: computeDiscovery(explored, answers),
    answeredCount: lines.filter((l) => l.answer).length,
  };
}

const ARCHETYPE_DEFAULT_INTEREST: Record<ArchetypeId, Interest> = {
  explorer: "novelty",
  dreamer: "making",
  strategist: "ideas",
  adventurer: "movement",
  builder: "making",
  observer: "stillness",
};

/** Two suggestions: one from the most frequent interest, one from the runner-up (or the archetype's default). */
function pickAdventures(interests: Interest[], archetype: ArchetypeId): Adventure[] {
  const counts = new Map<Interest, number>();
  interests.forEach((i) => counts.set(i, (counts.get(i) ?? 0) + 1));
  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || interests.indexOf(a[0]) - interests.indexOf(b[0]))
    .map(([i]) => i);

  const first = ranked[0] ?? ARCHETYPE_DEFAULT_INTEREST[archetype];
  const second = ranked[1];
  if (second) return [ADVENTURES[first][0], ADVENTURES[second][0]];
  return [ADVENTURES[first][0], ADVENTURES[first][1]];
}
