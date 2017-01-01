import React, { PureComponent } from 'react';
import WidthProvider from 'react-grid-layout/build/components/WidthProvider';
import GridLayout from 'react-grid-layout';
import gridConfig from './gridConfig';

let ResponsiveReactGridLayout = GridLayout.Responsive;

ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

function getRowHeight(screenHeight) {
  let factor = 32;

  if (screenHeight > 1000) {
    factor = 32;
  } else if (screenHeight > 900) {
    factor = 34;
  } else if (screenHeight > 800) {
    factor = 36;
  } else if (screenHeight > 700) {
    factor = 38;
  } else if (screenHeight > 600) {
    factor = 40;
  } else if (screenHeight > 500) {
    factor = 42;
  } else if (screenHeight && parseInt(screenHeight, 10) <= 500) {
    factor = 44;
  }

  return screenHeight / factor;
}

export default class Grid extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      screenHeight: 1037,
    };
  }

  componentDidMount() {
    this.resizeListener = function resizer() {
      const height = window.innerHeight
        || document.documentElement.clientHeight
        || document.body.clientHeight;

      this.setState({ screenHeight: height });
    };

    this.resizeListener = this.resizeListener.bind(this);

    window.addEventListener('resize', this.resizeListener, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener, false);
  }

  render() {
    const { screenHeight } = this.state;

    return (
      <div>
        <ResponsiveReactGridLayout
          {...gridConfig}
          rowHeight={getRowHeight(screenHeight)}
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
        >
          <div key="1"><span className="text">Contact me</span></div>
          <div key="2"><span className="text">Skill set</span></div>
          <div key="3"><span className="text">About me</span></div>
          <div key="4"><span className="text">Playground</span></div>
          <div key="5"><span className="text">Projects</span></div>
          <div key="6"><span className="text">Articles</span></div>
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
