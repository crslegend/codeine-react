import {
  UI_CONNECT_SIDENOTE,
  UI_DISCONNECT_SIDENOTE,
  UI_DESELECT_SIDENOTE,
  UI_REPOSITION_SIDENOTES,
  UI_SELECT_SIDENOTE,
  UI_SELECT_ANCHOR,
} from "./types";

export function deselectSidenote(docId) {
  console.log(docId);
  return {
    type: UI_DESELECT_SIDENOTE,
    payload: { docId },
  };
}

export function repositionSidenotes(docId) {
  console.log("reposition", docId);
  return {
    type: UI_REPOSITION_SIDENOTES,
    payload: { docId },
  };
}

export function connectSidenote(docId, sidenoteId) {
  console.log("connect", docId);
  const baseId = "anchor";
  return {
    type: UI_CONNECT_SIDENOTE,
    payload: { baseId, docId, sidenoteId },
  };
}

export function disconnectSidenote(docId, sidenoteId) {
  console.log("disconnect", docId);
  return {
    type: UI_DISCONNECT_SIDENOTE,
    payload: { docId, sidenoteId },
  };
}

export function selectSidenote(docId, sidenoteId) {
  console.log(docId);
  return {
    type: UI_SELECT_SIDENOTE,
    payload: { docId, sidenoteId },
  };
}

export function selectAnchor(docId, anchorId) {
  console.log(docId);
  return {
    type: UI_SELECT_ANCHOR,
    payload: { docId, anchorId },
  };
}
