import * as PostActions from '../actions/posts';

function taskRoutes({ dispatch, state }) {
  return [
    {
      pattern: '/posts/:id',
      prefetchData: ({ id } : { id: number }) => (state.posts.byId[id] ? Promise.resolve() : dispatch(PostActions.fetch(id))),
      // deferredData: ({ id } : { id: number }) => dispatch(PostActions.fetch(id)),
    },
  ];
}

export default taskRoutes;
