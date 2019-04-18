import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { ProgressSpinner } from 'primereact/components/progressspinner/ProgressSpinner';
import { RadioButton } from 'primereact/components/radiobutton/RadioButton';


/* ====================  T R A N S A C T I O N S ======== */
import { ReadTestPlaneFile } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getProductFound, setnewTest } from '../TestResuts';

var that;
export class ReadTestPFForm extends Component {
    constructor() {
        super();
        this.state = {
            dataProduct: undefined,
            userLogin: undefined,
            visibleModalP: false,
            batch: null,
            comment: null,
            confirmationModalView: false,
            waitModalView: false,
            testDevice: null,
            waitModalView: false,
        }
        that = this;
        this.readTests = this.readTests.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.registerMoreTest = this.registerMoreTest.bind(this);
        this.cancelMoreTest = this.cancelMoreTest.bind(this);
        this.getCodePropertyRadioButton = this.getCodePropertyRadioButton.bind(this);
    }

    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'Mensaje Exitoso', detail: message };
        this.growl.show(msg);
    }
    showInfo(message) {
        let msg = { severity: 'info', summary: 'INFO', detail: message };
        this.growl.show(msg);
    }

    /* Método para leer los resultados de los test (Equipo Universal) de archivos planos generados   */
    readTests() {
        debugger;
        var test = { batchTest: null, idProduct: null, owner: null, comment: null, idProperty: null }
        test.batchTest = this.state.batch;
        test.idProduct = this.state.dataProduct.idProduct;
        test.owner = this.state.userLogin.idUser;
        test.comment = this.state.comment;
        test.idProperty = this.getCodePropertyRadioButton();

        if ((this.state.testDevice !== null) && (this.state.dataProduct.idProduct !== null)) {
            if (this.state.dataProduct.typeProduct == 'MP') {
                this.setState({ waitModalView: true });
                test.batchTest='';
                ReadTestPlaneFile(test, function (data, status, msg) {
                    that.setState({ waitModalView: false });
                    switch (status) {
                        case 'OK':
                            that.showSuccess(msg);
                            that.setState({ confirmationModalView: true });
                            break;
                        case 'ERROR':
                            that.showError(msg);
                            break;
                        case 'INFO':
                            that.showInfo(msg);
                        default:
                            break;
                    }
                })
            } else {
                if (this.state.batch !== null) {
                    this.setState({ waitModalView: true });
                    ReadTestPlaneFile(test, function (data, status, msg) {
                        that.setState({ waitModalView: false });
                        switch (status) {
                            case 'OK':
                                that.showSuccess(msg);
                                that.setState({ confirmationModalView: true });
                                break;
                            case 'ERROR':
                                that.showError(msg);
                                break;
                            case 'INFO':
                                that.showInfo(msg);
                            default:
                                break;
                        }
                    })
                } else {
                    this.showError('Ingrese todos los campos necesarios');
                }
            }

        } else {
            this.showError('Seleccione el dispositivo para el ensayo');
        }
    }

    /* Metodo para castear el tipo de propiedad escogido */
    getCodePropertyRadioButton() {
        switch (this.state.testDevice) {
            case 'EquipoUniversal':
                return 'EquipoUniversal';
            case 'EquipoReblandecimiento':
                return 'PROP_1'
            default:
                return null;
        }
    }

    /* Método para cancelar la lectura de mas ensayos */
    cancelMoreTest() {
        this.setState({ batch: null, comment: null, confirmationModalView: false })
        setnewTest();
    }

    registerMoreTest() {
        this.setState({ confirmationModalView: false })
    }

    componentWillMount() {
        var pp = getProductFound();
        this.setState({ dataProduct: pp })
    }
    componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    }

    render() {
        const footer = (
            <div>
                <Button label="Si" icon="fa-check" className="ui-button-primary" onClick={() => this.registerMoreTest()} />
                <Button label="No" icon="fa-close" onClick={() => this.cancelMoreTest()} className="ui-button-danger" />
            </div>
        );
        return (
            <div className="ui-g" style={{ justifyContent: 'center' }}>
                <Growl ref={(el) => this.growl = el} />
                <div className="ui-g-12" style={{ width: '50%', }}>
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginTop: '2%', marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold' }}>LECTURA DE ENSAYOS </h3>
                    </div>
                    <div className='ui-g form-group ui-fluid'>
                        <div className='ui-g-12'>
                            <label htmlFor="float-input">ELIJE EL EQUIPO DE ENSAYO</label>
                        </div>
                        <div className='ui-g-12 ui-md-4'>
                            <RadioButton inputId="rb1" name="city" value="EquipoUniversal" onChange={(e) => this.setState({ testDevice: e.value })} checked={this.state.testDevice === 'EquipoUniversal'} />
                            <label htmlFor="rb1" className="p-radiobutton-label" style={{ marginLeft: '5px' }}>Equipo Universal</label>
                        </div>
                        <div className='ui-g-12 ui-md-4'>
                            <RadioButton inputId="rb1" name="city" value="EquipoReblandecimiento" onChange={(e) => this.setState({ testDevice: e.value })} checked={this.state.testDevice === 'EquipoReblandecimiento'} />
                            <label htmlFor="rb1" className="p-radiobutton-label" style={{ marginLeft: '5px' }}>Equipo Reblandecimiento</label>
                        </div>
                        <div className='ui-g-12'>
                            <label htmlFor="float-input">LOTE</label>
                            <InputText placeholder='Ingrese el número de lote ' onChange={(e) => this.setState({ batch: e.target.value })} value={this.state.batch} />
                        </div>
                        <div className='ui-g-12'>
                            <label htmlFor="float-input">OBSERVACIÓN</label>
                            <InputTextarea value={this.state.comment} onChange={(e) => this.setState({ comment: e.target.value })} rows={5}></InputTextarea>
                        </div>
                    </div>
                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                        <div className='ui-g-3'>
                            <Button label='Aceptar' className='ui-button-success' icon="fa-check" onClick={this.readTests} />
                        </div>
                        <div className='ui-g-3'>
                            <Button label='Cancelar' className='ui-button-danger' icon="fa fa-close" onClick={() => setnewTest()} />
                        </div>
                    </div>
                </div>
                <Dialog visible={this.state.confirmationModalView} style={{ width: '20vw' }} footer={footer} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ confirmationModalView: false })}>
                    <div className="ui-grid ui-grid-responsive ui-fluid">
                        <div className="ui-grid-row" style={{ marginRight: '10px', marginTop: '10px', marginBottom: '10px' }}>
                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Desea leer otro ensayo..?</span>
                        </div>
                    </div>
                </Dialog>
                <Dialog visible={this.state.waitModalView} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ waitModalView: false })}>
                    <div className="ui-grid ui-grid-responsive ui-fluid">
                        <div className="ui-grid-row" style={{ marginRight: '10px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration="4s" />
                        </div>
                        <div className="ui-grid-row" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '10px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Espere por favor... !</span>
                        </div>
                    </div>
                </Dialog>

            </div>
        )
    }

}