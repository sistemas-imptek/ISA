
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
import { ResultTest } from '../quality-development/TestResuts';
import { Complaint } from '../quality-development/ReclamosMP';
import { WFlow } from '../quality-development/WorkFlow';
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
        const styles = {
            login_block: {
                //background: 'linear-gradient(to bottom, #FFB88C, #DE6262)',
                background: '#DE6262',
                float: 'left',
                width: '100%',
                padding: '50px',
            },
            banner_sec: {
                background: "url(https://static.pexels.com/photos/33972/pexels-photo.jpg)  no-repeat left bottom",
                backgroundSize: "cover",
                minHeight: "500px",
                borderRadius: "0 10px 10px 0",
                padding: "0"
            },
            container: {
                background: '#fff',
                borderRadius: "10px",
                boxShadow: "15px 20px 0px rgba(0,0,0,0.1)"
            },
            carousel_inner: {
                borderRadius: "0 10px 10px 0"
            },
            carousel_caption: {
                "textAlign": "left",
                "left": "5%"
            },
            login_sec: {
                padding: "50px 30px",
                position: "relative"
            },
            login_sec__copy_text: {
                position: "absolute",
                width: "80%",
                bottom: "20px",
                fontSize: "13px",
                textAlign: "center"
            },
            login_sec__copy_text_i: {
                "color": "#FEB58A"
            },
            login_sec__copy_text_a: {
                "color": "#E36262"
            },
            login_sec_h2: {
                marginBottom: "30px",
                fontWeight: "800",
                fontSize: "30px",
            color: "#DE6262"
            },
            login_sec_h2_after: {
                "content": "\" \"",
                "width": "100px",
                "height": "5px",
                "background": "#FEB58A",
                "display": "block",
                "marginTop": "20px",
                "borderRadius": "3px",
                "marginLeft": "auto",
                "marginRight": "auto"
            },
            btn_login: {
                background: "#DE6262",
                color: "#fff",
                fontWeight: "600"
            },
            banner_text: {
                "width": "70%",
                "position": "absolute",
                "bottom": "40px",
                "paddingLeft": "20px"
            },
            "banner_text_h2": {
                "color": "#fff",
                "fontWeight": "600"
            },
            banner_text_h2_after: {
                "content": "\" \"",
                "width": "100px",
                "height": "5px",
                "background": "#FFF",
                "display": "block",
                "marginTop": "20px",
                "borderRadius": "3px"
            },
            banner_text_p: {
                "color": "#fff"
            }
        }

        if (this.state.stateLogin) {
            return (
                <div style={{
                    background: 'linear-gradient(to bottom, #4DA6DE, #D1DA28)', width: '100%', height: '100%', padding: '180px' }}>
                    <Growl ref={(el) => this.growl = el} />
                    <link href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css" rel="stylesheet" id="bootstrap-css" />
                    {/*---- Include the above in your HEAD tag --------*/}
                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                        <div className='ui-g-6' style={{ background: '#fff', borderRadius: "10px", boxShadow: "15px 20px 0px rgba(0,0,0,0.1)" }}>
                            <div className="ui-g-6" style={{ padding: "50px 30px", position: "relative" }} >
                                <h2 className="text-center" style={{marginBottom: "30px",fontWeight: "800",fontSize: "30px",color: "#4DA6DE"}}>Iniciar Sesión</h2>
                                <div className="login-form">
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1" className="text-uppercase">Usuario</label>
                                        <input type="text" className="form-control" placeholder onChange={(e) => this.setState({ user: e.target.value })}/>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1" className="text-uppercase">Contraseña</label>
                                        <input type="password" className="form-control" placeholder onChange={(e) => this.setState({ password: e.target.value })} />
                                    </div>
                                    <div className="form-check">
                                        
                                        <button className="btn float-right" style={{ background: "#4DA6DE",color: "#fff",fontWeight: "600"}} onClick={this.validateUser} >Aceptar</button>
                                    </div>
                                </div>
                                {/* <div className="copy-text">Elaborado por T.I ASTS <i className="fa fa-heart" /> by <a href="http://grafreez.com">Grafreez.com</a></div> */}
                                <div className="copy-text" style={{position: "absolute",width: "80%", bottom: "20px",fontSize: "13px", textAlign: "center"}} >Elaborado por el área T.I </div>
                            </div>
                            <div className="ui-g-6 banner-sec" style={{background:'#4DA6DE', borderRadius: "0 10px 10px 0",height:'100%', padding: "0",alignSelf:'center' }}>
                                <img style={{ justifyContent: 'center', textAlign: 'center', marginTop: '60px', width:'100%', height:'60%', paddingLeft:'15px', paddingRight:'15px' }} src="assets/layout/images/logo-imptek-white.svg" />
                            </div>
                        </div>
                    </div>

                </div>
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
                        <Route path="/quality-development/resulttest" component={ResultTest} />
                        <Route path="/quality-development/complaint" component={Complaint} />
                        <Route path="/quality-development/wflow" component={WFlow} />
                    </Route>
                </Router>,

            </div>)
        }


    }


}

export function logout(){
    that.setState({stateLogin: true})
}