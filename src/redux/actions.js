import { UI_DESELECT_SIDENOTE, UI_REPOSITION_SIDENOTES } from "./types";

export function deselectSidenote(docId) {
  return {
    type: UI_DESELECT_SIDENOTE,
    payload: { docId },
  };
}

export function repositionSidenotes(docId) {
  return {
    type: UI_REPOSITION_SIDENOTES,
    payload: { docId },
  };
}
