import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {logout} from './components/autentication/login'
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

    Logout(){
        debugger
        console.log('Cierre de sesion')
        logout();
    }

    render() {
        let topbarItemsClassName = classNames('topbar-items fadeInDown', {'topbar-items-visible': this.props.topbarMenuActive});
        var sesion= JSON.parse(localStorage.getItem('dataSession'));
        return <div className="topbar clearfix">
                    <div className="topbar-left">
                        <img alt="Logo" src="assets/layout/images/logo-letter-white.png" className="topbar-logo" />
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
                                            <i className="fa fa-lock"></i>
                                            <span>Cambiar Contraseña</span>
                                        </a>
                                    </li>
                                    <li role="menuitem">
                                        <a onClick={(e) => this.Logout()}>
                                            <i className="fa fa-sign-out"></i>
                                            <span>Cerrar Sesión</span>
                                        </a>
                                    </li>
                                   
                                </ul>
                            </li>
                            <li className="topbar-item-name" style={{color:'#fff'}}>
                                <strong>Usuario: </strong><span>{sesion.employee.lastName+' '+sesion.employee.name}</span>
                            </li>
                           
                           
                        </ul>
                    </div>
                </div>;
    }
}