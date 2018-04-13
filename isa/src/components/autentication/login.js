
import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';
import {loginValidate} from '../../utils/Transactions';
  import App from '../../App';
  import {Home} from '../Home';
  import {Acta} from '../sgc/Acta';
  import {ActaQuickResponse} from '../quick-response/Acta';
  import {Product} from '../quality-development/Product';
  import {HCC} from '../quality-development/Hcc';
  import {ProductoNoConforme} from '../quality-development/Pnc'
  import {Documentation} from '../Documentation';
  import {Router,Route,hashHistory} from 'react-router';


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
            stateLogin:false,
        };
        this.validateUser = this.validateUser.bind(this);
    }


    validateUser(){
        if(this.state.user!=='' && this.state.password!==''){
            if(this.state.password==='123456'){
                console.log("usuario validado")
                loginValidate(this.state.user, this.state.password)
                this.setState({stateLogin:false})
            }
        }
    }


    render() {
        var imgstyle = {
            height: '80%',
            width: '100%',
            position: 'absolute',
            background: 'url("./images/login/bg-login.jpg") no-repeat',
            backgroundsize: 'cover',
            backgroundposition: 'center',
        }

        var formContent = {
            width: '400px',
            position: ' absolute',
            marginleft: '-200px',
            top: '30px',
            left: '40%',
            color: '#fff'
        }
        var container = {
            width: '100%',
            height: '380px',
            borderradius: '0',
            marginBottom: '0',
            bottom: '0',
            position: 'absolute',
            textalign: 'center',
            backgroundColor: '#292b2c'
        }

        if (this.state.stateLogin) {
            return (
                <div style={{ overflow: 'hidden', margin: '0 auto' }}>
                    <img style={imgstyle} src="assets/layout/images/login/bg-login.jpg" />
                    <div className="card ui-fluid" style={container}>
                        <div style={formContent}>
                            <div className="ui-g">
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
                                    <Button label="Aceptar"  onClick={this.validateUser} className="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            )
        }else{
            return (<div>
                <Router history={hashHistory}>
                    <Route path="/" component={App}>
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
