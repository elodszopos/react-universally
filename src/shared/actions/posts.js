function fetching(id) {
  return { type: 'FETCHING_POST', payload: id };
}

function fetched(post) {
  return { type: 'FETCHED_POST', payload: post };
}

export function fetch(id) { // eslint-disable-line
  return (dispatch, getState, { axios }) => {
    dispatch(fetching(id));

    return axios
      .get(`https://jsonplaceholder.typicode.com/posts/${id}`)
      .then(({ data }) => dispatch(fetched(data))).then(() => true);
  };
}
