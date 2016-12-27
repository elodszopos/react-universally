const defaultState = {};

export default function postsByIdReducer(state = defaultState, action) {
  if (action.type === 'FETCHED_POST') {
    return Object.assign({}, state,
      { [action.payload.id]: action.payload },
    );
  }

  return state;
}

export function getById(state, id) {
  return state[id];
}
