/* eslint global-require: 0 */
import React from 'react';
import Match from 'react-router/Match';
import Miss from 'react-router/Miss';
import Helmet from 'react-helmet';
import { CodeSplit } from 'code-split-component';
import { safeConfigGet } from 'shared/utils/config';

import 'normalize.css/normalize.css';
import './globals.scss';

import Error404 from './Error404';
import Header from './Header';

function App() {
  return (
    <div style={{ padding: '10px' }}>
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
          <CodeSplit chunkName="home" modules={{ Home: require('./Home') }}>
            { ({ Home }) => Home && <Home {...routerProps} /> }
          </CodeSplit>
        }
      />

      <Match
        pattern="/posts"
        render={routerProps =>
          <CodeSplit chunkName="posts" modules={{ Posts: require('./Posts') }}>
            { ({ Posts }) => Posts && <Posts {...routerProps} /> }
          </CodeSplit>
        }
      />

      <Match
        pattern="/about"
        render={routerProps =>
          <CodeSplit chunkName="about" modules={{ About: require('./About') }}>
            { ({ About }) => About && <About {...routerProps} /> }
          </CodeSplit>
        }
      />

      <Miss component={Error404} />
    </div>
  );
}

export default App;
