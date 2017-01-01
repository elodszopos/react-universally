import React from 'react';
import { Link } from 'react-router';
import Headroom from 'react-headroom';
import Classnames from 'classnames';

export default class Header extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      mobileActive: null,
    };

    this._toggleMobileMenu = this._toggleMobileMenu.bind(this);
  }

  render () {
    const activeNav = this.props.activeNav;

    let header = !this.props.show ? null : (
        <header className={Classnames({'mobile-active': !!this.state.mobileActive})}>
          <section className="brand">
            <Link to={'/'}>
              <div className="small-logo" />
            </Link>
            <span className="tagline">
            TAGLINE MAZAFAKA
          </span>
          </section>
          <button
            className="mobile-toggle"
            onClick={this._toggleMobileMenu}>
            <i className={Classnames("menu", { open: !!this.state.mobileActive})} />
          </button>
          <ul className="nav">
            <li>
              <Link
                title="Articles"
                to={'/articles/'}
                className={activeNav === 'articles' ? 'active' : null}>
                Articles
              </Link>
            </li>
            <li>
              <Link
                title="My videos"
                to={'/videos/'}
                className={activeNav === 'videos' ? 'active' : null}>
                Videos
              </Link>
            </li>
            <li>
              <Link
                title="About me"
                to={'/about/'}
                className={activeNav === 'about' ? 'active' : null}>
                About
              </Link>
            </li>
            <li className="social">
              <a title="Twitter" href='https://www.twitter.com/halfatheist'>
                <i className="twitter" />
              </a>
            </li>
            <li  className="social">
              <a title="Facebook" href='https://www.facebook.com/HalfAtheist-310361469308402/'>
                <i className="facebook" />
              </a>
            </li>
            <li  className="social">
              <a title="Youtube" href='https://www.youtube.com/channel/UC-aWYYvF8DM6yI52UaMLhLg'>
                <i className="youtube" />
              </a>
            </li>
          </ul>
        </header>
      );

    return (
      <Headroom wrapperStyle={{ height: '80px' }}>
        {header}
      </Headroom>
    );
  }


  _toggleMobileMenu (e) {
    e.preventDefault();

    this.setState({
      mobileActive: !this.state.mobileActive,
    });
  }
}


Header.propTypes = {
  activeNav: React.PropTypes.string,
  show: React.PropTypes.bool,
};

Header.defaultProps = {
  activeNav: null,
  show: true,
};
