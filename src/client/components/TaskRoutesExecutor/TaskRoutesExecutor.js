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

  componentWillMount() {
    const { location, dispatch } = this.props;

    if (location) {
      executeTasks(location, dispatch);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, dispatch } = nextProps;

    if (location && location !== this.props.location) {
      executeTasks(location, dispatch);
    }
  }

  render() {
    const { children } = this.props;

    return Children.only(children);
  }
}
