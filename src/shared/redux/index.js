import { combineReducers } from 'redux';
import posts, * as FromPosts from './modules/posts';

const rootReducer = combineReducers({
  posts,
});

export function getPostById(state, id) {
  return FromPosts.getById(state.posts, id);
}

export default rootReducer;
