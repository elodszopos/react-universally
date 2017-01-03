function getConfig() {
  const layout = { xl: [], lg: [], md: [], sm: [], xs: [], xxs: [] };

  for (let i = 1; i < 10; i++) {
    layout.xl.push({
      i: `${i}`,
      x: (i % 3) * 5,
      y: (i % 3) * 10,
      w: 5,
      h: 10,
    });

    layout.lg.push({
      i: `${i}`,
      x: (i % 3) * 4,
      y: (i % 3) * 8,
      w: 4,
      h: 8,
    });

    layout.md.push({
      i: `${i}`,
      x: (i % 2) * 5,
      y: (i % 2) * 10,
      w: 5,
      h: 10,
    });

    layout.sm.push({
      i: `${i}`,
      x: (i % 2) * 4,
      y: (i % 2) * 8,
      w: 4,
      h: 8,
    });

    layout.xs.push({
      i: `${i}`,
      x: (i % 2) * 3,
      y: (i % 2) * 6,
      w: 3,
      h: 6,
    });

    layout.xxs.push({
      i: `${i}`,
      x: 0,
      y: i * 6,
      w: 4,
      h: 7,
    });
  }

  return layout;
}

const layoutConfig = {
  layouts: getConfig(),
  // layouts: {
    // lg: [
    //   { i: '1', x: 8, y: 15, w: 4, h: 7 },
    //   { i: '2', x: 0, y: 0, w: 3, h: 15 },
    //   { i: '3', x: 3, y: 6, w: 9, h: 9 },
    //   { i: '4', x: 9, y: 0, w: 3, h: 6 },
    //   { i: '5', x: 3, y: 0, w: 6, h: 6 },
    //   { i: '6', x: 0, y: 15, w: 8, h: 7 },
    //   { i: '7', x: 0, y: 15, w: 8, h: 7 },
    //   { i: '8', x: 0, y: 15, w: 8, h: 7 },
    //   { i: '9', x: 0, y: 15, w: 8, h: 7 },
    // ],
    // md: [
    //   { i: '1', x: 6, y: 15, w: 4, h: 7 },
    //   { i: '2', x: 0, y: 0, w: 3, h: 15 },
    //   { i: '3', x: 3, y: 6, w: 7, h: 9 },
    //   { i: '4', x: 7, y: 0, w: 3, h: 6 },
    //   { i: '5', x: 3, y: 0, w: 4, h: 6 },
    //   { i: '6', x: 0, y: 15, w: 6, h: 7 },
    // ],
    // sm: [
    //   { i: '1', x: 3, y: 17, w: 3, h: 7 },
    //   { i: '2', x: 0, y: 0, w: 4, h: 8 },
    //   { i: '3', x: 0, y: 8, w: 3, h: 9 },
    //   { i: '4', x: 0, y: 17, w: 3, h: 7 },
    //   { i: '5', x: 4, y: 0, w: 2, h: 8 },
    //   { i: '6', x: 3, y: 8, w: 3, h: 5 },
    // ],
    // xs: [
    //   { i: '1', x: 2, y: 14, w: 2, h: 7 },
    //   { i: '2', x: 2, y: 0, w: 2, h: 7 },
    //   { i: '3', x: 0, y: 0, w: 2, h: 7 },
    //   { i: '4', x: 0, y: 14, w: 2, h: 7 },
    //   { i: '5', x: 0, y: 7, w: 2, h: 7 },
    //   { i: '6', x: 2, y: 7, w: 2, h: 7 },
    // ],
    // xxs: [
    //   { i: '1', x: 0, y: 35, w: 2, h: 7 },
    //   { i: '2', x: 0, y: 7, w: 2, h: 7 },
    //   { i: '3', x: 0, y: 0, w: 2, h: 7 },
    //   { i: '4', x: 0, y: 28, w: 2, h: 7 },
    //   { i: '5', x: 0, y: 14, w: 2, h: 7 },
    //   { i: '6', x: 0, y: 21, w: 2, h: 7 },
    // ],
  // },
  className: 'layout',
  breakpoints: { xl: 1600, lg: 1300, md: 1090, sm: 768, xs: 550, xxs: 0 },
  cols: { xl: 15, lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 },
  useCSSTransforms: true,
  margin: [10, 10],
  isResizable: false,
};

export default layoutConfig;
