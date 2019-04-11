import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { Dialog } from 'primereact/components/dialog/Dialog';


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
        }
        that = this;
        this.readTests = this.readTests.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.registerMoreTest = this.registerMoreTest.bind(this);
        this.cancelMoreTest = this.cancelMoreTest.bind(this);
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
        var test = { batchTest: null, idProduct: null, owner: null, comment: null }
        test.batchTest = this.state.batch;
        test.idProduct = this.state.dataProduct.idProduct;
        test.owner = this.state.userLogin.idUser;
        test.comment = this.state.comment;

        if ((this.state.batch !== null) && (this.state.dataProduct.idProduct !== null)) {
            ReadTestPlaneFile(test, function (data, status, msg) {
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

            </div>
        )
    }

}