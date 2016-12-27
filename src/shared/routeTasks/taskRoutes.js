import * as PostActions from '../actions/posts';

function taskRoutes({ dispatch }) {
  return [
    {
      pattern: '/posts/:id',
      prefetchData: ({ id } : { id: number }) => dispatch(PostActions.fetch(id)),
      // deferredData: ({ id } : { id: number }) => dispatch(PostActions.fetch(id)),
    },
  ];
}

export default taskRoutes;
