import React, { Component } from 'react';
import classNames from 'classnames';
import 'nanoscroller';
import {AppTopbar} from './AppTopbar';
import {AppFooter} from './AppFooter';
import {AppMenu} from './AppMenu';
import {Home} from './components/Home';
import 'primereact/resources/primereact.min.css';
import 'nanoscroller/bin/css/nanoscroller.css';
import 'fullcalendar/dist/fullcalendar.css';
import 'font-awesome/css/font-awesome.css';
import './App.css';
import jQuery from 'jquery';

var menu=[];
export class App extends Component {

    constructor(props) {
        super(props);
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
            menuActive: false,
            stateLogin:false,
            menuObj: props,
        };
        
        this.onDocumentClick = this.onDocumentClick.bind(this);
        this.onMenuClick = this.onMenuClick.bind(this);
        this.onMenuButtonClick = this.onMenuButtonClick.bind(this);
        this.onTopbarMenuButtonClick = this.onTopbarMenuButtonClick.bind(this);
        this.onTopbarItemClick = this.onTopbarItemClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.onRootMenuItemClick = this.onRootMenuItemClick.bind(this);
        //this.createMenu();
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

    createMenu(props) {
        var menuPrincipal=[];
        props.role.menus.map(function(obj,index){
            var menuItem={label:'', icon:'', command:()=>{window.location.hash=''}};
            menuItem.label=obj.itemDescription;
            menuItem.icon= obj.iconMenu;
            
            if(obj.subMenus.length !=0 ||obj.subMenus.length != undefined ){
                menuItem.items=[];
                obj.subMenus.map(function(obj2,i){
                    var itemsAux={label:'', icon:'', command:undefined};
                    itemsAux.label=obj2.desc;
                    itemsAux.icon=obj2.icon;
                    itemsAux.command=()=>{window.location.hash=obj2.ref};
                    menuItem.items.push(itemsAux);
                })

            }else {
                menuItem.command=()=> {window.location.hash=obj.ref};
            }
            menuPrincipal.push(menuItem);
            menu= menuPrincipal;
        })
        this.menu2 = [
            {label: 'Inicio', icon: 'fa fa-fw fa-home', command: () => { window.location.hash="/"}},
            {
                label: 'S.G.C', icon: 'fa fa-files-o',
                items:[
                    {label:'Crear Acta', icon:'fa fa-plus-circle', command: () => { window.location.hash="/acta"}},
                    {label:'Pendientes', icon:'fa fa-list-ol'},
                ]
            
            },
            {
                label: 'Respuesta Rápida', icon: 'fa fa-bolt',
                items:[
                    {label:'Crear Acta', icon:'fa fa-plus-circle', command: () => { window.location.hash="/quick-response/acta"}},
                    {label:'Pendientes', icon:'fa fa-list-ol'},
                ]
            
            },
            {
                label: 'RR - HH', icon: 'fa fa-users', command: () => { window.location.hash="/"},
                items:[
                    {label:'Rol', icon:'fa fa-usd'},
                    {label:'Vacaciones', icon:'fa fa-star'},
                ]
            
            },
            {
                label: 'I + D', icon: 'fa fa-fw fa-magic',
                items:[
                    {label: 'Producto', icon:'fa fa-product-hunt', command: () => { window.location.hash="/quality-development/product"}},
                    /* {label:'Ensayos', icon:'fa fa-flask'}, */
                    {label: 'HCC', icon:'fa fa-copy', command: () => { window.location.hash="/quality-development/hcc"}},
                    {label: 'PNC', icon:'fa fa-edit', command: () => { window.location.hash="/quality-development/pnc"}},
                ]
            
            },
            
        ];
    }

    render() {
        var sesion= localStorage.getItem('dataSession');
        this.createMenu(this.props);
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
                                    
                                    <AppMenu model={menu} onMenuItemClick={this.onMenuItemClick} onRootMenuItemClick={this.onRootMenuItemClick} 
                                            layoutMode={this.state.layoutMode} active={this.state.menuActive} /> 
                                </div>
                            </div>
                        </div>
                        
                        <div className="layout-main">
                            {this.props.children || <Home />}
                        </div>
                        
                        <div className="layout-mask"></div>
                        
                        <AppFooter />
                    </div>
                </div>;
  }
}


