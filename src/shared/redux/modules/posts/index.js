import { combineReducers } from 'redux';
import all, * as FromAll from './all';
import byId, * as FromById from './byId';

const posts = combineReducers({
  all,
  byId,
});

export function getById(state, id) {
  return FromById.getById(state.byId, id);
}

export function getAll(state) {
  return FromAll
    .getAll(state.all)
    .map(id => getById(state, id));
}

export default posts;
