/* eslint global-require: 0 */
import React, { Component } from 'react';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';
import Helmet from 'react-helmet';
import { CodeSplit } from 'code-split-component';
import { safeConfigGet } from 'shared/utils/config';
import Error404 from 'shared/components/Error404';
import Header from 'shared/components/Header';

import 'normalize.css/normalize.css';
import 'shared/styles/globals.scss';
import 'shared/styles/font-awesome.min.css';
import '../Grid/grid.scss';

export default class App extends Component {
  render() {
    return (
      <div>
        <Helmet
          htmlAttributes={safeConfigGet(['htmlPage', 'htmlAttributes'])}
          titleTemplate={safeConfigGet(['htmlPage', 'titleTemplate'])}
          defaultTitle={safeConfigGet(['htmlPage', 'defaultTitle'])}
          meta={safeConfigGet(['htmlPage', 'meta'])}
          link={safeConfigGet(['htmlPage', 'links'])}
          script={safeConfigGet(['htmlPage', 'scripts'])}
        />
        <Header />
        <Match
          exactly
          pattern="/"
          render={routerProps =>
        <CodeSplit chunkName="home" modules={{ Home: require('../Home') }}>
          { ({ Home }) => Home && <Home {...routerProps} /> }
        </CodeSplit>
      }
        />

        <Match
          pattern="/posts"
          render={routerProps =>
        <CodeSplit chunkName="posts" modules={{ Posts: require('../Posts') }}>
          { ({ Posts }) => Posts && <Posts {...routerProps} /> }
        </CodeSplit>
      }
        />

        <Match
          pattern="/about"
          render={routerProps =>
        <CodeSplit chunkName="about" modules={{ About: require('../About') }}>
          { ({ About }) => About && <About {...routerProps} /> }
        </CodeSplit>
      }
        />

        <Miss component={Error404} />
      </div>
    );
  }
}
