import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import * as sidenotes from "sidenotes";

const reducer = combineReducers({
  sidenotes: sidenotes.reducer,
});

const store = createStore(reducer, applyMiddleware(thunkMiddleware));
sidenotes.setup(store, { padding: 10 });

export default store;
