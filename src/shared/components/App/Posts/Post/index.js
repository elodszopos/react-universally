import React, { PureComponent, PropTypes } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withJob } from 'react-jobs/ssr';
import * as postActions from 'shared/actions/posts';
import Helmet from 'react-helmet';
import * as FromState from 'shared/redux';

const { object } = PropTypes;

export class Post extends PureComponent {
  static get propTypes() {
    return {
      post: object,
    };
  }

  render() {
    const { post } = this.props;

    if (!post || Object.keys(post).length === 0) {
      // Post hasn't been fetched yet. It would be better if we had a "status"
      // reducer attached to our posts which gave us a bit more insight, such
      // as whether the post is currently being fetched, or if the fetch failed.
      return null;
    }

    const { title, body } = post;

    return (
      <div>
        <Helmet title={`Posts - ${title}`} />

        <h1>{title}</h1>
        <div>
          {body}
        </div>
        <div>
          Foo
        </div>
      </div>
    );
  }
}

const mapActionsToProps = {
  fetchPost: postActions.fetch,
};

function mapStateToProps(state, { params: { id } }) {
  return {
    post: FromState.getPostById(state, id),
  };
}

export default compose(
  connect(mapStateToProps, mapActionsToProps),
  withJob(({ params: { id }, post, fetchPost }) => {
    if (post) {
      return true;
    }

    return fetchPost(id);
  }),
)(Post);
