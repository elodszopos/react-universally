import React, { Component } from 'react';
import WidthProvider from 'react-grid-layout/build/components/WidthProvider';
import GridLayout from 'react-grid-layout';
import gridConfig from './gridConfig';

import ContactCard from './ContactCard';
import SkillsCard from './SkillsCard';
import LearningCard from './LearningCard';
import ConsultingCard from './ConsultingCard';
import PlaygroundCard from './PlaygroundCard';

let ResponsiveReactGridLayout = GridLayout.Responsive;

ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

function getRowHeight(screenHeight) {
  let factor = 36;

  if (screenHeight > 1000) {
    factor = 36;
  } else if (screenHeight > 900) {
    factor = 38;
  } else if (screenHeight > 800) {
    factor = 40;
  } else if (screenHeight && parseInt(screenHeight, 10) > 0) {
    return 1037 / 38;
  }

  return screenHeight / factor;
}

export default class Grid extends Component {
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
      const width = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;

      this.setState({ screenHeight: height, screenWidth: width });
    };

    this.resizeListener = this.resizeListener.bind(this);
    this.resizeListener();

    window.addEventListener('resize', this.resizeListener, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener, false);
  }

  render() {
    const { screenHeight, screenWidth } = this.state;

    return (
      <div>
        <ResponsiveReactGridLayout
          {...gridConfig}
          isDraggable={screenWidth > 480}
          rowHeight={getRowHeight(screenHeight)}
        >
          <div key="1">
            <ContactCard />
          </div>
          <div key="2">
            <SkillsCard />
          </div>
          <div key="3">
            <LearningCard />
          </div>
          <div key="4">
            <PlaygroundCard />
          </div>
          <div key="5">
            <ConsultingCard />
          </div>
          {/*<div key="6">*/}
            {/*<SkillsCard />*/}
          {/*</div> */}
          {/*<div key="7"><span className="text">Projects</span></div>*/}
          {/*<div key="8"><span className="text">Projects</span></div>*/}
          {/*<div key="9"><span className="text">Projects</span></div>*/}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
