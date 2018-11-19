// Copyright (c) Microsoft. All rights reserved.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Breadcrumbs } from './breadcrumbs';
import { Svg } from 'components/shared';
import { isFunc, svgs } from 'utilities';
import ProfileImagePath from 'assets/images/profile.png';

import './header.css';

const docsDropdown = 'docsDropdown';

const parentHasClass = (element, ...searchClasses) => {
  if (
    typeof element.className === 'string' &&
    element.className
      .split(' ')
      .some(classname =>
        searchClasses.some(searchClass => searchClass === classname)
      )
  ) return true;
  return element.parentNode && parentHasClass(element.parentNode, ...searchClasses);
};

const docLinks = [
  {
    translationId: 'header.getStarted',
    url: 'https://docs.microsoft.com/en-us/azure/iot-suite/iot-suite-remote-monitoring-monitor'
  },
  {
    translationId: 'header.documentation',
    url: 'https://docs.microsoft.com/en-us/azure/iot-suite'
  },
  {
    translationId: 'header.sendSuggestion',
    url: 'https://feedback.azure.com/forums/916438-azure-iot-solution-accelerators'
  }
];

/** The header component for the top of the page */
class Header extends Component {

  constructor(props) {
    super(props);

    this.state = { openDropdown: '' };
  }

  componentDidMount() {
    window.addEventListener('mousedown', this.handleWindowMousedown);
  }

  componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleWindowMousedown);
  }

  handleWindowMousedown = ({ target }) => {
    const isMenuTrigger = parentHasClass(target, 'menu-item', 'menu-trigger');
    if (!isMenuTrigger && this.state.openDropdown) {
      this.setState({ openDropdown: '' });
    }
  }

  toggleDropdown = (openDropdown) => () => this.setState({ openDropdown });

  render() {
    return (
      <header className="app-header" role="banner">
        <div className="breadcrumbs">
          <Breadcrumbs t={this.props.t} crumbsConfig={this.props.crumbsConfig} />
        </div>
        <div className="label">{ this.props.t('header.appName') }</div>
        <div className="items-container">
          <div className="menu-container">
            <button className="menu-trigger" onClick={this.toggleDropdown(docsDropdown)}>
              <Svg path={svgs.questionMark} className="item-icon" />
            </button>
            {
              this.state.openDropdown === docsDropdown &&
              <div className="menu">
                {
                  docLinks.map(({ url, translationId }) =>
                    <Link key={translationId}
                      className="menu-item"
                      target="_blank"
                      to={url}>
                      { this.props.t(translationId) }
                    </Link>
                  )
                }
              </div>
            }
          </div>
          {
            isFunc(this.props.openSystemSettings) &&
            <button onClick={this.props.openSystemSettings}>
              <Svg path={svgs.settings} className="item-icon" />
            </button>
          }
          {
            isFunc(this.props.openUserProfile) &&
            <button className="item-icon profile" onClick={this.props.openUserProfile}>
              <img src={ProfileImagePath} alt={ this.props.t('header.profile') } />
            </button>
          }
        </div>
      </header>
    );
  }
};

export default Header;
