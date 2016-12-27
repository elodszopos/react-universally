const defaultState = [];

export default function allPostsReducer(state = defaultState, action) {
  if (action.type === 'FETCHED_POST') {
    const post = action.payload;

    return state.find(x => post.id === x) ? state : [...state, action.payload.id];
  }

  return state;
}

export function getAll(state) {
  return state;
}
