export default function mergeReducers(reducers) {
  return function (state, action) {
    if (!state) {
      return reducers.reduce(
        (acc, reducer) => ({ ...acc, ...reducer(state, action) }),
        {}
      );
    } else {
      let nextState = state;
      for (const reducer of reducers) {
        nextState = reducer(nextState, action);
      }
      return nextState;
    }
  };
}
