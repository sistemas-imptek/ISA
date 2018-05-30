
import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { App } from '../../App';
import { Home } from '../Home';
import { Acta } from '../sgc/Acta';
import { ActaQuickResponse } from '../quick-response/Acta';
import { Product } from '../quality-development/Product';
import { HCC } from '../quality-development/Hcc';
import { ProductoNoConforme } from '../quality-development/Pnc'
import { Documentation } from '../Documentation';
import { Router, Route, hashHistory } from 'react-router';
import AddPropsToRoute from './test';
/* ====================  T R A N S A C T I O N S ======== */
import { loginValidate } from '../../utils/Transactions';

var that;
var obj = {};
export class Login extends Component {

    constructor() {
        super();
        this.state = {
            user: '',
            password: '',
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
            stateLogin: true,
            dataMenu: undefined,
        };
        that = this;
        this.validateUser = this.validateUser.bind(this);
    }


    validateUser() {
        if (this.state.user !== '' && this.state.password !== '') {
            loginValidate(this.state.user, this.state.password, function (data) {
                switch (data.status) {
                    case 'OK':
                        that.setState({ stateLogin: false })
                        break;

                    case 'ERROR':
                        that.showError(data.message);
                        break;
                    default:
                        localStorage.setItem('dataSession', JSON.stringify(data));
                        that.setState({ stateLogin: false, dataMenu: data });
                        break;
                }
            })

        } else {
            this.showError('Usuario o Contraseña incorrecta');
        }
    }

    /* Metodos Mensajes Mostrar */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'Exito', detail: message };
        this.growl.show(msg);
    }


    render() {
        var imgstyle = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            justifyContent: 'center', textAlign: 'center',
            //background: 'url("./images/logo-imptek.svg") no-repeat',
            //backgroundColor: '#4DA6DE',
            //backgroundColor: '#292b2c',
            backgroundColor: '#b0bec5',
            backgroundsize: 'cover',
            backgroundposition: 'center',
            paddingTop: '10%'
        }

        var formContent = {
            width: '400px',
            position: ' absolute',
            //marginleft: '-200px',
            justifyContent: 'center', textAlign: 'center',
            top: '30px',
            left: '20%',
            color: '#fff'
        }
        var container = {
            width: '40%',
            height: '100%',
            borderradius: '0',
            marginBottom: '0',
            bottom: '0',
            left: '30%',
            position: 'absolute',
            textalign: 'center',
            backgroundColor: '#4DA6DE'
            //backgroundColor: '#292b2c'
            //backgroundColor: '#D1DA28'
        }

        if (this.state.stateLogin) {
            return (
                <div style={{ overflow: 'hidden', margin: '0 auto', justifyContent: 'center', textAlign:'center' }}>
                    <Growl ref={(el) => this.growl = el} />
                    <div style={imgstyle}>

                    </div>
                    <div className="card ui-fluid" style={container}>

                        <div style={formContent}>
                            <div className="ui-g" style={{marginTop:'20%'}}>
                                <div className="ui-g-12">
                                    <img style={{ justifyContent: 'center', textAlign: 'center', marginBottom:'50px' }} src="assets/layout/images/logo-letter-white.png" />
                                </div>
                                <div className="ui-g-3" style={{ textAlign: 'center' }}>
                                    <img src="assets/layout/images/login/icon-login.svg" />
                                </div>
                                <div className="ui-g-9" style={{ textAlign: 'right' }}>
                                    <h2 className="welcome-text">Bienvenido</h2>
                                    <span className="guest-sign-in">Inicia Sesión Isa-Imptek</span>
                                </div>
                                <div className="ui-g-12" style={{ textAlign: 'left' }}>
                                    <label className="login-label">Usuario</label>
                                    <div className="login-input">
                                        <InputText type="text" className="ui-inputtext ui-widget ui-state-default ui-corner-all" onChange={(e) => this.setState({ user: e.target.value })} />
                                    </div>
                                </div>
                                <div className="ui-g-12" style={{ textAlign: 'left' }}>
                                    <label className="login-label">Contraseña</label>
                                    <div className="login-input">
                                        <InputText type="password" className="ui-inputtext ui-widget ui-state-default ui-corner-all" onChange={(e) => this.setState({ password: e.target.value })} />
                                    </div>
                                </div>
                                <div className="ui-g-12 ui-md-6 button-pane">
                                    <Button label="Aceptar" onClick={this.validateUser} className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )
        } else {
            return (<div>
                <Router history={hashHistory}>
                    <Route path="/" component={AddPropsToRoute(App, this.state.dataMenu)} >
                        <Route path="/home" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/documentation" component={Documentation} />
                        <Route path="/acta" component={Acta} />
                        <Route path="/quick-response/acta" component={ActaQuickResponse} />
                        <Route path="/quality-development/product" component={Product} />
                        <Route path="/quality-development/hcc" component={HCC} />
                        <Route path="/quality-development/pnc" component={ProductoNoConforme} />
                    </Route>
                </Router>,

            </div>)
        }


    }


}
