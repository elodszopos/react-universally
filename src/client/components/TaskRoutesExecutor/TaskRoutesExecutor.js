import { Children, PropTypes, Component } from 'react';
import executeTasks from './executeTasks';

const { object, func, node } = PropTypes;

export default class TaskRoutesExecutor extends Component {
  static get propTypes() {
    return {
      location: object,
      dispatch: func,
      children: node,
    };
  }

  static get contextTypes() {
    return {
      store: object,
    };
  }

  componentWillMount() {
    const { location, dispatch } = this.props;
    const { store } = this.context;

    if (location) {
      executeTasks(location, dispatch, store.getState());
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, dispatch } = nextProps;
    const { store } = this.context;

    if (location && location !== this.props.location) {
      executeTasks(location, dispatch, store.getState());
    }
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}
