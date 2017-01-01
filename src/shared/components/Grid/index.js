import React, { PureComponent } from 'react';
import WidthProvider from 'react-grid-layout/build/components/WidthProvider';
import GridLayout from 'react-grid-layout';
import gridConfig from './gridConfig';

let ResponsiveReactGridLayout = GridLayout.Responsive;

ResponsiveReactGridLayout = WidthProvider(ResponsiveReactGridLayout);

export default class Grid extends PureComponent {
  render() {
    return (
      <div>
        <ResponsiveReactGridLayout
          {...gridConfig}
          onLayoutChange={this.onLayoutChange}
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
