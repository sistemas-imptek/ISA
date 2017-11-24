import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class AppTopbar extends Component {

    static defaultProps = {
        onMenuButtonClick: null,
        onTopbarMenuButtonClick: null,
        onTopbarItemClick: null,
        profileMode: null,
        horizontal: false,
        topbarMenuActive: false,
        activeTopbarItem: null
    }

    static propTypes = {
        onMenuButtonClick: PropTypes.func.isRequired,
        onTopbarMenuButtonClick: PropTypes.func.isRequired,
        onTopbarItemClick: PropTypes.func.isRequired,
        profileMode: PropTypes.string.isRequired,
        horizontal: PropTypes.bool.isRequired,
        topbarMenuActive: PropTypes.bool.isRequired,
        activeTopbarItem: PropTypes.string
    }

    constructor() {
        super();
        this.state = {};
    }

    onTopbarItemClick(event, item) {
        if(this.props.onTopbarItemClick) {
            this.props.onTopbarItemClick({
                originalEvent: event,
                item: item
            });
        }
    }

    render() {
        let topbarItemsClassName = classNames('topbar-items fadeInDown', {'topbar-items-visible': this.props.topbarMenuActive});

        return <div className="topbar clearfix">
                    <div className="topbar-left">
                        <img alt="Logo" src="assets/layout/images/logo.png" className="topbar-logo" />
                    </div>

                    <div className="topbar-right">
                        <a id="menu-button" onClick={this.props.onMenuButtonClick}>
                            <i className="fa fa-angle-left"></i>
                        </a>
                                            
                        <a id="topbar-menu-button" onClick={this.props.onTopbarMenuButtonClick}>
                            <i className="fa fa-bars"></i>
                        </a>
                        <ul className={topbarItemsClassName}>
                            {(this.props.profileMode === 'top' || this.props.horizontal) && 
                                <li className={classNames('profile-item', {'active-top-menu': this.props.activeTopbarItem === 'profile'})}>

                                    <a onClick={(e) => this.onTopbarItemClick(e, 'profile')}>
                                        <img alt="User" className="profile-image" src="assets/layout/images/avatar.png" />
                                        <span className="topbar-item-name">Isabel Lopez</span>
                                        <span className="topbar-item-role">Marketing</span>
                                    </a>
                                
                                    <ul className="layout-menu fadeInDown">
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-user"></i>
                                            <span>Profile</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-user-secret"></i>
                                            <span>Privacy</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-cog"></i>
                                            <span>Settings</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-sign-out"></i>
                                            <span>Logout</span>
                                        </a>
                                    </li>
                                    </ul>
                            </li>}

                            <li className={classNames({'active-top-menu': this.props.activeTopbarItem === 'settings'})}>
                                <a onClick={(e) => this.onTopbarItemClick(e, 'settings')}>
                                    <i className="topbar-icon fa fa-fw fa-cog"></i>
                                    <span className="topbar-item-name">Settings</span>
                                </a>
                                <ul className="layout-menu fadeInDown">
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-paint-brush"></i>
                                            <span>Change Theme</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-star-o"></i>
                                            <span>Favorites</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-lock"></i>
                                            <span>Lock Screen</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-picture-o"></i>
                                            <span>Wallpaper</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className={classNames({'active-top-menu': this.props.activeTopbarItem === 'messages'})}>
                                <a onClick={(e) => this.onTopbarItemClick(e, 'messages')}>
                                    <i className="topbar-icon fa fa-fw fa-envelope-o"></i>
                                    <span className="topbar-badge">5</span>
                                    <span className="topbar-item-name">Messages</span>
                                </a>
                                <ul className="layout-menu fadeInDown">
                                    <li role="menuitem">
                                        <a className="topbar-message">
                                            <img alt="Avatar 1" src="assets/layout/images/avatar1.png" width="35"/>
                                            <span>Give me a call</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a className="topbar-message">
                                            <img alt="Avatar 2" src="assets/layout/images/avatar2.png" width="35"/>
                                            <span>Sales reports attached</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a className="topbar-message">
                                            <img alt="Avatar 3" src="assets/layout/images/avatar3.png" width="35"/>
                                            <span>About your invoice</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a className="topbar-message">
                                            <img alt="Avatar 4" src="assets/layout/images/avatar2.png" width="35"/>
                                            <span>Meeting today at 10pm</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a className="topbar-message">
                                            <img alt="Avatar 5" src="assets/layout/images/avatar4.png" width="35"/>
                                            <span>Out of office</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className={classNames({'active-top-menu': this.props.activeTopbarItem === 'notifications'})}>
                                <a onClick={(e) => this.onTopbarItemClick(e, 'notifications')}>
                                    <i className="topbar-icon fa fa-fw fa-bell-o"></i>
                                    <span className="topbar-badge animated rubberBand">4</span>
                                    <span className="topbar-item-name">Notifications</span>
                                </a>
                                <ul className="layout-menu fadeInDown">
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-tasks"></i>
                                            <span>Pending tasks</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-calendar-check-o"></i>
                                            <span>Meeting today at 3pm</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-download"></i>
                                            <span>Download documents</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a>
                                            <i className="fa fa-fw fa-plane"></i>
                                            <span>Book flight</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <li className={classNames('search-item', {'active-top-menu': this.props.activeTopbarItem === 'search'})}
                                    onClick={(e) => this.onTopbarItemClick(e, 'search')}>
                                    <div className="topbar-search">
                                        <input type="text" placeholder="Search" />
                                        <i className="fa fa-search"></i>
                                    </div>
                            </li>
                        </ul>
                    </div>
                </div>;
    }
}