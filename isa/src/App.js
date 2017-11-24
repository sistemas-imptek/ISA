import React, { Component } from 'react';
import classNames from 'classnames';
import 'nanoscroller';
import {AppTopbar} from './AppTopbar';
import {AppInlineProfile} from './AppInlineProfile';
import {AppFooter} from './AppFooter';
import {AppMenu} from './AppMenu';
import {Dashboard} from './components/Dashboard';
import 'primereact/resources/primereact.min.css';
import 'nanoscroller/bin/css/nanoscroller.css';
import 'fullcalendar/dist/fullcalendar.css';
import 'font-awesome/css/font-awesome.css';
import './App.css';
import jQuery from 'jquery';

class App extends Component {

    constructor() {
        super();
        this.state = {
            layoutMode: 'static',
            profileMode: 'inline',
            layoutCompact: true,
            overlayMenuActive: false,
            staticMenuDesktopInactive: false,
            staticMenuMobileActive: false,
            rotateMenuButton: false,
            topbarMenuActive: false,
            activeTopbarItem: null,
            darkMenu: false,
            menuActive: false
        };
        
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onTopbarMenuButtonClick = this.onTopbarMenuButtonClick.bind(this);
        this.onTopbarItemClick = this.onTopbarItemClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onRootMenuItemClick = this.onRootMenuItemClick.bind(this);
        this.createMenu();
    }

    onMenuClick(event) {
        this.menuClick = true;

        if(!this.isHorizontal()) {
            setTimeout(() => {
                jQuery(this.layoutMenuScroller).nanoScroller();
            }, 500);
        }
    }

    onMenuButtonClick(event) {
        this.menuClick = true;
        this.setState(({
            rotateMenuButton: !this.state.rotateMenuButton,
            topbarMenuActive: false
        }));

        if(this.state.layoutMode === 'overlay') {
            this.setState({
                overlayMenuActive: !this.state.overlayMenuActive
            });
        }
        else {
            if(this.isDesktop())
                this.setState({staticMenuDesktopInactive: !this.state.staticMenuDesktopInactive});
            else
                this.setState({staticMenuMobileActive: !this.state.staticMenuMobileActive});
        }

        event.preventDefault();
    }

    onTopbarMenuButtonClick(event) {
        this.topbarItemClick = true;
        this.setState({topbarMenuActive: !this.state.topbarMenuActive});
        this.hideOverlayMenu();
        event.preventDefault();
    }

    onTopbarItemClick(event) {
        this.topbarItemClick = true;

        if(this.state.activeTopbarItem === event.item)
            this.setState({activeTopbarItem: null});
        else
            this.setState({activeTopbarItem: event.item});

        event.originalEvent.preventDefault();
    }

    onMenuItemClick(event) {
        if(!event.item.items) {
            this.hideOverlayMenu();
        }
    }
    
    onRootMenuItemClick(event) {
        this.setState({
            menuActive: !this.state.menuActive
        });
        
        event.originalEvent.preventDefault();
    }
    
    onDocumentClick(event) {
        if(!this.topbarItemClick) {
            this.setState({
                activeTopbarItem: null,
                topbarMenuActive: false
            });
        }

        if(!this.menuClick) {
            if(this.isHorizontal() || this.isSlim()) {
                this.setState({
                    menuActive: false
                })
            }
            
            this.hideOverlayMenu();
        }
        
        if(!this.rightPanelClick) {
            this.setState({
                rightPanelActive: false
            })
        }

        this.topbarItemClick = false;
        this.menuClick = false;
        this.rightPanelClick = false;
    }
    
    hideOverlayMenu() {
        this.setState({
            rotateMenuButton: false,
            overlayMenuActive: false,
            staticMenuMobileActive: false
        })
    }
    
    componentDidMount() {
        jQuery(this.layoutMenuScroller).nanoScroller({flash:true});
    }

    isTablet() {
        let width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.state.layoutMode === 'overlay';
    }

    isHorizontal() {
        return this.state.layoutMode === 'horizontal';
    }
    
    isSlim() {
        return this.state.layoutMode === 'slim';
    }

    changeTheme(theme) {
        this.changeStyleSheetUrl('theme-css', theme, 'theme');
    }
    
    changeLayout(layout, special) {
        this.changeStyleSheetUrl('layout-css', layout, 'layout');
        
        if(special) {
            this.setState({
                darkMenu: true
            })
        }
    }
    
    changeStyleSheetUrl(id, value, prefix) {
        let element = document.getElementById(id);
        let urlTokens = element.getAttribute('href').split('/');
        urlTokens[urlTokens.length - 1] = prefix + '-' + value + '.css';
        let newURL = urlTokens.join('/');
        element.setAttribute('href', newURL);
    }

    createMenu() {
        this.menu = [
            {label: 'Dashboard', icon: 'fa fa-fw fa-home', command: () => { window.location.hash="/"}},
            {
                label: 'Customization', icon: 'fa fa-fw fa-bars' ,badge: '8',
                items: [
                    {label: 'Static Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'static'}) },
                    {label: 'Overlay Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'overlay'}) },
                    {label: 'Slim Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'slim'}) },
                    {label: 'Horizontal Menu', icon: 'fa fa-fw fa-bars',  command: () => this.setState({layoutMode: 'horizontal'}) },
                    {label: 'Inline Profile', icon: 'fa fa-sun-o fa-fw',  command: () => this.setState({profileMode: 'inline'}) },
                    {label: 'Top Profile', icon: 'fa fa-moon-o fa-fw',  command: () => this.setState({profileMode: 'top'}) },
                    {label: 'Light Menu', icon: 'fa fa-sun-o fa-fw',  command: () => this.setState({darkMenu: false}) },
                    {label: 'Dark Menu', icon: 'fa fa-moon-o fa-fw',  command: () => this.setState({darkMenu: true}) }
                ]
            },
            {
                label: 'Layout Colors', icon: 'fa fa-fw fa-magic',
                items: [
                    {
                        label: 'Flat', 
                        icon: 'fa fa-fw fa-circle',
                        items: [
                            {label: 'Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('blue')}},
                            {label: 'Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('purple')}},
                            {label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('cyan')}},
                            {label: 'Indigo', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('indigo')}},
                            {label: 'Teal', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('teal')}},
                            {label: 'Pink', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('pink')}},
                            {label: 'Lime', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('lime')}},
                            {label: 'Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('green')}},
                            {label: 'Amber', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('amber')}},
                            {label: 'Dark Grey', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('darkgrey')}},
                        ]
                    },
                    {
                        label: 'Special', 
                        icon: 'fa fa-fw fa-fire',
                        items: [
                            {label: 'Influenza', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('influenza', true)}},
                            {label: 'Suzy', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('suzy', true)}},
                            {label: 'Calm', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('calm', true)}},
                            {label: 'Crimson', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('crimson', true)}},
                            {label: 'Night', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('night', true)}},
                            {label: 'Skyling', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('skyline', true)}},
                            {label: 'Sunkist', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('sunkist', true)}},
                            {label: 'Little Leaf', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('littleleaf', true)}},
                            {label: 'Joomla', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('joomla', true)}},
                            {label: 'Firewatch', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeLayout('firewatch', true)}}
                        ]
                    }
                ]
            },
            {
                label: 'Themes', icon: 'fa fa-fw fa-paint-brush', badge: '5',
                items: [
                    {label: 'Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('blue')}},
                    {label: 'Cyan', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('cyan')}},
                    {label: 'Indigo', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('indigo')}},
                    {label: 'Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('purple')}},
                    {label: 'Teal', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('teal')}},
                    {label: 'Orange', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('orange')}},
                    {label: 'Deep Purple', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('deeppurple')}},
                    {label: 'Light Blue', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('lightblue')}},
                    {label: 'Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('green')}},
                    {label: 'Light Green', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('lightgreen')}},
                    {label: 'Lime', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('lime')}},
                    {label: 'Amber', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('amber')}},
                    {label: 'Brown', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('brown')}},
                    {label: 'Dark Grey', icon: 'fa fa-fw fa-paint-brush', command: (event) => {this.changeTheme('darkgrey')}},
                ]
            },
            {
                label: 'Components', icon: 'fa fa-fw fa-sitemap',
                items: [
                    {label: 'Sample Page', icon: 'fa fa-fw fa-columns', command: () => { window.location.hash="/sample"; }},
                    {label: 'Forms', icon: 'fa fa-fw fa-code', command: () => { window.location.hash="/forms"; }},
                    {label: 'Data', icon: 'fa fa-fw fa-table', command: () => { window.location.hash="/data"; }},
                    {label: 'Panels', icon: 'fa fa-fw fa-list-alt', command: () => { window.location.hash="/panels"; }},
                    {label: 'Overlays', icon: 'fa fa-fw fa-square', command: () => { window.location.hash="/overlays"; }},
                    {label: 'Menus', icon: 'fa fa-fw fa-minus-square-o', command: () => { window.location.hash="/menus"; }},
                    {label: 'Messages', icon: 'fa fa-fw fa-circle-o-notch', command: () => { window.location.hash="/messages"; }},
                    {label: 'Charts', icon: 'fa fa-fw fa-area-chart', command: () => { window.location.hash="/charts"; }},
                    {label: 'Misc', icon: 'fa fa-fw fa-user-secret', command: () => { window.location.hash="/misc"; }}
                ]
            },
            {
                label: 'Template Pages', icon: 'fa fa-fw fa-life-saver',
                items: [
                    {label: 'Empty Page', icon: 'fa fa-fw fa-square-o', command: () => { window.location.hash="/empty"; }},
                    {label: 'Landing', icon: 'fa fa-fw fa-certificate', url: 'assets/pages/landing.html', target: '_blank'},
                    {label: 'Login', icon: 'fa fa-fw fa-sign-in', url: 'assets/pages/login.html', target: '_blank'},
                    {label: 'Error', icon: 'fa fa-fw fa-exclamation-circle', url: 'assets/pages/error.html', target: '_blank'},
                    {label: 'Not Found', icon: 'fa fa-fw fa-times', url: 'assets/pages/notfound.html', target: '_blank'},
                    {label: 'Access Denied', icon: 'fa fa-fw fa-exclamation-triangle', url: 'assets/pages/access.html', target: '_blank'}
                ]
            },
            {
                label: 'Menu Hierarchy', icon: 'fa fa-fw fa-gg',
                items: [
                    {
                        label: 'Submenu 1', icon: 'fa fa-fw fa-sign-in',
                        items: [
                            {
                                label: 'Submenu 1.1', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    {label: 'Submenu 1.1.1', icon: 'fa fa-fw fa-sign-in'},
                                    {label: 'Submenu 1.1.2', icon: 'fa fa-fw fa-sign-in'},
                                    {label: 'Submenu 1.1.3', icon: 'fa fa-fw fa-sign-in'},
                                ]
                            },
                            {
                                label: 'Submenu 1.2', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    {label: 'Submenu 1.2.1', icon: 'fa fa-fw fa-sign-in'},
                                    {label: 'Submenu 1.2.2', icon: 'fa fa-fw fa-sign-in'}
                                ]
                            },
                        ]
                    },
                    {
                        label: 'Submenu 2', icon: 'fa fa-fw fa-sign-in',
                        items: [
                            {
                                label: 'Submenu 2.1', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    {label: 'Submenu 2.1.1', icon: 'fa fa-fw fa-sign-in'},
                                    {label: 'Submenu 2.1.2', icon: 'fa fa-fw fa-sign-in'},
                                    {label: 'Submenu 2.1.3', icon: 'fa fa-fw fa-sign-in'},
                                ]
                            },
                            {
                                label: 'Submenu 2.2', icon: 'fa fa-fw fa-sign-in',
                                items: [
                                    {label: 'Submenu 2.2.1', icon: 'fa fa-fw fa-sign-in'},
                                    {label: 'Submenu 2.2.2', icon: 'fa fa-fw fa-sign-in'}
                                ]
                            },
                        ]
                    }
                ]
            },
            {label: 'Utils', icon: 'fa fa-fw fa-wrench', command: () => { window.location.hash="/utils"; }},
            {label: 'Documentation', icon: 'fa fa-fw fa-book', command: () => { window.location.hash="/documentation"; }}
        ];
    }

    render() {
        let layoutClassName = classNames('layout-wrapper', {
            'menu-layout-static': this.state.layoutMode !== 'overlay',
            'menu-layout-overlay': this.state.layoutMode === 'overlay',
            'layout-menu-overlay-active': this.state.overlayMenuActive,
            'menu-layout-slim': this.state.layoutMode === 'slim',
            'menu-layout-horizontal': this.state.layoutMode === 'horizontal',
            'layout-menu-static-inactive': this.state.staticMenuDesktopInactive,
            'layout-menu-static-active': this.state.staticMenuMobileActive
        });
        let menuClassName = classNames('layout-menu-container', {'layout-menu-dark': this.state.darkMenu});
        
        return <div className={layoutClassName} onClick={this.onDocumentClick}>
                    <div>
                        <AppTopbar profileMode={this.state.profileMode} horizontal={this.props.horizontal} 
                                topbarMenuActive={this.state.topbarMenuActive} activeTopbarItem={this.state.activeTopbarItem}
                                onMenuButtonClick={this.onMenuButtonClick} onTopbarMenuButtonClick={this.onTopbarMenuButtonClick} 
                                onTopbarItemClick={this.onTopbarItemClick} />

                        <div className={menuClassName} onClick={this.onMenuClick}>
                            <div ref={(el) => this.layoutMenuScroller = el} className="nano">
                                <div className="nano-content menu-scroll-content">
                                    {(this.state.profileMode === 'inline' && this.state.layoutMode !== 'horizontal') && <AppInlineProfile />}
                                    <AppMenu model={this.menu} onMenuItemClick={this.onMenuItemClick} onRootMenuItemClick={this.onRootMenuItemClick} 
                                            layoutMode={this.state.layoutMode} active={this.state.menuActive} /> 
                                </div>
                            </div>
                        </div>
                        
                        <div className="layout-main">
                            {this.props.children || <Dashboard />}
                        </div>
                        
                        <div className="layout-mask"></div>
                        
                        <AppFooter />
                    </div>
                </div>;
  }
}

export default App;
