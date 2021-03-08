import { UI_DESELECT_SIDENOTE } from "./types";

export function deselectSidenote(docId) {
  return {
    type: UI_DESELECT_SIDENOTE,
    payload: { docId },
  };
}
