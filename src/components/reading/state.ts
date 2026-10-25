import { PALM_LINE_ORDER, type LineId } from "@/lib/palm-data";
import type { Answers } from "@/lib/reading";

export type Stage = "intro" | "camera" | "upload" | "explore" | "results";
export type PhotoSource = "camera" | "upload";

export interface ReadingState {
  stage: Stage;
  /** Palm photo held only in memory — never persisted or uploaded. */
  photo: Blob | null;
  photoSource: PhotoSource | null;
  answers: Answers;
  explored: LineId[];
  current: LineId;
}

export type ReadingAction =
  | { type: "go"; stage: Stage }
  | { type: "setPhoto"; photo: Blob; source: PhotoSource }
  | { type: "removePhoto" }
  | { type: "select"; line: LineId }
  | { type: "answer"; line: LineId; optionId: string | undefined }
  | { type: "reset" };

export const initialReadingState: ReadingState = {
  stage: "intro",
  photo: null,
  photoSource: null,
  answers: {},
  explored: [],
  current: "heart",
};

export function readingReducer(state: ReadingState, action: ReadingAction): ReadingState {
  switch (action.type) {
    case "go": {
      if (action.stage === "explore") {
        const explored = state.explored.includes(state.current) ? state.explored : [...state.explored, state.current];
        return { ...state, stage: "explore", explored };
      }
      return { ...state, stage: action.stage };
    }
    case "setPhoto":
      return { ...state, photo: action.photo, photoSource: action.source };
    case "removePhoto":
      return { ...state, photo: null, photoSource: null };
    case "select":
      return {
        ...state,
        current: action.line,
        explored: state.explored.includes(action.line) ? state.explored : [...state.explored, action.line],
      };
    case "answer":
      return { ...state, answers: { ...state.answers, [action.line]: action.optionId } };
    case "reset":
      return initialReadingState;
  }
}

/** The next line to visit after `from`: first unexplored, then first unanswered, else null (ready for results). */
export function nextLine(state: ReadingState, from: LineId): LineId | null {
  const start = PALM_LINE_ORDER.indexOf(from);
  const rotated = [...PALM_LINE_ORDER.slice(start + 1), ...PALM_LINE_ORDER.slice(0, start)];
  return rotated.find((id) => !state.explored.includes(id)) ?? null;
}
