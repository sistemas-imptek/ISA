import React, { Component } from 'react';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { SplitButton } from 'primereact/components/splitbutton/SplitButton';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { TabView, TabPanel } from 'primereact/components/tabview/TabView';
import { Card } from 'primereact/components/card/Card';
import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';
import { DataList } from 'primereact/components/datalist/DataList';
import { InputSwitch } from 'primereact/components/inputswitch/InputSwitch';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Growl } from 'primereact/components/growl/Growl';
import { RadioButton } from 'primereact/components/radiobutton/RadioButton';
import { Chips } from 'primereact/components/chips/Chips';
import { ProgressSpinner } from 'primereact/components/progressspinner/ProgressSpinner';
import { ColumnGroup } from 'primereact/components/columngroup/ColumnGroup';
import { Row } from 'primereact/components/row/Row';

/* ============  D A T A    C A T A L O G O  S =============== */
import { periocidad, tipoProducto, abbreviation } from '../../global/catalogs';

/* ====================  T R A N S A C T I O N S ======== */
import { GetAllProducts, GetProductById, GenerateHCC, HCCSave, GetAllHCCs, GenerateCertificate, GetAllClients, SendEmail } from '../../utils/TransactionsCalidad';

/* ====================  U T I L S  ======== */
import { formattedDate, formattedStringtoDate } from '../../utils/FormatDate';


var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var that;
var DataResult = {};
var DataResultCumple = {};
var proveedoresMP = [];
var clientNames = []; // Variable para formar el Array de nombres de los clientes.

export class HCC extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            lote: '',
            pnlCabeceraMP: 'none',
            pnlCabeceraPT: 'none',
            specificationPanel: 'none',
            specificationList: 'none',
            resultsPanel: 'none',
            btnGuardarHCC: 'none',
            hCC: {},
            frecuencia: '',
            tipo: '',
            hccPT: '',
            hccOF: '',
            hccMP: '',
            orderNumber: '',
            checked1: false,
            enabledFrecuencia: true,
            receptDate: undefined,
            proveedor: '',
            analysis: '',
            observation: '',
            hccFilesFilter: [],
            hccFilesAll: [],
            selectedHCC: undefined,
            dialogCertificate: false,
            cliente: undefined,
            email: 'svillacis@imptek.com',
            order: undefined,
            hccType: undefined,
            clientList: [],
            referralGuide: undefined,
            fieldReferralGuide: 'none',
            reloadTextInput: false,
            propertyDetail: [],
            productionDate: undefined,
            visibleModalEmail: false,
            visibleModalEmail2: false,
            pathFile: null,
            sendTo: ['anunez@imptek.com'],
            sendSubject: 'HCC MP ',
            sendMessage: 'Estimados. \nAdjunto el documento ',
            waitModalView: false,
            abbreValue: undefined,
            otroAbrebbation: undefined,
            fieldAbbrebation: true,
            msgError: '',
            shMsgError: 'none',

        };
        that = this;
        this.generateHCC = this.generateHCC.bind(this);
        this.onDropdownChangeFrecuencia = this.onDropdownChangeFrecuencia.bind(this);
        this.onDropdownChangeTipo = this.onDropdownChangeTipo.bind(this);
        this.onDropdownChangeProveedor = this.onDropdownChangeProveedor.bind(this);
        this.onChangeBasic = this.onChangeBasic.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.saveHCC = this.saveHCC.bind(this);
        this.setData = this.setData.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.showDialogCertifiacte = this.showDialogCertifiacte.bind(this);
        this.generateCertificate = this.generateCertificate.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.findObjCliente = this.findObjCliente.bind(this);
        this.propertyDelete = this.propertyDelete.bind(this);
        this.closeModalEmail = this.closeModalEmail.bind(this);
        this.sendEmailHCCMP = this.sendEmailHCCMP.bind(this);
        this.changeChipsAdd = this.changeChipsAdd.bind(this);
        this.changeChipsRemove = this.changeChipsRemove.bind(this);
        this.onAbbrevationChange = this.onAbbrevationChange.bind(this);
        this.closeModalCertificate = this.closeModalCertificate.bind(this);

    }

    /* =============== I N I C I O   F U N C I O N E S ======================= */

    /* Métodos  Auto Completado Buscar Producto */
    handleDropdownClick() {
        this.setState({ filteredBrands: [] });
        //mimic remote call
        setTimeout(() => {
            this.setState({ filteredBrands: this.brands });
        }, 100)
    }
    filterProducts(event) {
        let results = nameProducts.filter((brand) => {
            return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredProducts: results });
    }
    onProductValueChange(e) {
        debugger;
        if (e.value.length != 1) {
            this.state.products.map(function (obj, index) {
                if (obj.nameProduct == e.value) {
                    if (obj.typeProduct == 'PT') {
                        that.setState({ enabledFrecuencia: false });
                    }
                    if (obj.typeProduct == 'MP') {
                        that.setState({ enabledFrecuencia: true });
                    }
                }
            })
        }
        this.setState({ productName: e.value, filteredProducts: null });
    }
    /* FIn Métodos  Auto Completado */

    /* Métodos  Auto Completado Buscar Clinte */
    handleDropdownClickClientFind() {
        this.setState({ filteredClients: [] });
        //mimic remote call
        setTimeout(() => {
            this.setState({ filteredClients: this.clients });
        }, 100)
    }
    filterClients(event) {
        debugger
        let results = clientNames.filter((brand) => {
            return brand.toLowerCase().startsWith(event.query.toLowerCase());
        });
        this.setState({ filteredClients: results });
    }
    onClientValueChange(e) {
        debugger;
        this.setState({ clientName: e.value, filteredClients: null });
    }

    /* FIn Métodos  Auto Completado *


    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'Mensaje Exitoso', detail: message };
        this.growl.show(msg);
    }

    /* Métodos ListasDesplegables */
    onDropdownChangeFrecuencia(event) {
        this.setState({ frecuencia: event.value });
    }
    onDropdownChangeTipo(event) {
        this.setState({ tipo: event.value });
    }
    onDropdownChangeProveedor(event) {
        this.setState({ proveedor: event.value });
    }
    onChangeBasic(e, id) {
        debugger;
        DataResultCumple[id] = e.value;
        this.setState({ reloadTextInput: true });
    }

    onAbbrevationChange(event) {
        if (event.value == 'Otro')
            this.setState({ abbreValue: event.value, fieldAbbrebation: false });
        else
            this.setState({ abbreValue: event.value, fieldAbbrebation: true });
    }
    /* Metodo para onRadioButton hccTYpe */
    onRadioChange(event) {
        debugger
        console.log(this.state.hccFilesAll);
        var newData = [];
        this.state.hccFilesAll.map(function (obj, index) {
            switch (event.value) {
                case 'PT':
                    if (obj.product.typeProduct == 'PT')
                        newData.push(obj);
                    break;
                case 'MP':
                    if (obj.product.typeProduct == 'MP')
                        newData.push(obj);
                    break;
            }
        })
        this.setState({ hccType: event.value, hccFilesFilter: newData })
    }

    /* Método para generar HCC */
    generateHCC() {
        var result = {};
        DataResult = {},
            DataResultCumple = {};
        if (this.state.specificationList == '') {
            this.setState({ specificationList: 'none', hCC: {} })
        }
        debugger;
        if (this.state.productName != '' && this.state.lote != '') {
            this.state.products.map(function (value, index) {
                if (that.state.productName == value.nameProduct) {
                    result = value;
                }
            });
            GenerateHCC(result.idProduct, this.state.lote, this.state.frecuencia, function (item) {
                console.log(item);
                that.setData(item.detail);
                console.log(DataResult);
                if (item.product.typeProduct == 'PT') {
                    if (item.product.typeProductTxt === 'Emulsiones Asfálticas') {
                        that.setState({ hCC: item, pnlCabeceraPT: '', pnlCabeceraMP: 'none', specificationPanel: '', specificationList: '', btnGuardarHCC: '', resultsPanel: '', fieldReferralGuide: '' })
                    } else
                        that.setState({ hCC: item, pnlCabeceraPT: '', pnlCabeceraMP: 'none', specificationPanel: '', specificationList: '', btnGuardarHCC: '', resultsPanel: '', fieldReferralGuide: 'none' })
                } else {
                    item.product.providers.map(function (obj, index) {
                        var objAux = { label: '', value: '' };
                        objAux.label = obj.nameProvider;
                        objAux.value = obj.idProvider;
                        proveedoresMP.push(objAux);
                    })
                    var hccHeadIdProvider = item.idProviderMP;
                    var hccHeadDateTests = null
                    if (item.dateOrder != null)
                        hccHeadDateTests = formattedStringtoDate(item.dateOrder);
                    that.setState({ hCC: item, pnlCabeceraMP: '', pnlCabeceraPT: 'none', specificationPanel: '', specificationList: '', btnGuardarHCC: '', resultsPanel: '', proveedor: hccHeadIdProvider, receptDate: hccHeadDateTests })

                }
            })
        } else {

            this.showError('Datos Incompletos');
        }
    }
    setData(data) {
        DataResult = {};
        DataResultCumple = {};
        data.map(function (item, index) {
            switch (item.typeProperty) {
                case 'V':
                    DataResult[item.idProperty] = item.resultText;
                    DataResultCumple[item.idProperty] = item.passTest;
                    break;
                case 'T':
                    DataResult[item.idProperty] = item.result;
                    DataResultCumple[item.idProperty] = item.passTest;
                    break;
            }
        })
    }

    /* Método que captura el valor de InputText */
    onWriting(e, id) {
        debugger;
        DataResult[id] = e.target.value;
        this.setState({ reloadTextInput: true });
    }

    /* Template para accion en Tabla HCC */
    actionTemplate(rowData, column) {
        switch (rowData.product.typeProduct) {
            case 'PT':
                return <div>
                    <Button type="button" icon='fa-print' style={{ width: '20%' }} className="ui-button-success" onClick={() => this.showDialogCertifiacte(rowData)}></Button>
                </div>;
                break;

            case 'MP':
                return <div>
                    <Button type="button" icon='fa-print' style={{ width: '20%' }} className="ui-button-success" onClick={() => this.showDialogCertifiacte(rowData)}></Button>
                </div>;
                break;
        }
    }
    showDialogCertifiacte(data) {
        this.setState({
            dialogCertificate: true, selectedHCC: data
        })
    }

    closeModalCertificate() {
        this.setState({
            dialogCertificate: false, clientName: undefined, abbreValue: undefined, otroAbrebbation: undefined, shMsgError: 'none', msgError: ''
        })
    }


    /* Function for property delete of specifications test hcc */
    propertyDelete(codeProperty) {
        debugger;
        console.log(codeProperty);
        var detailTMP = [];
        this.state.hCC.detail.map(function (i) {
            if (i.idProperty != codeProperty)
                detailTMP.push(i);
        })

        this.state.hCC.detail = detailTMP;
        this.setData(detailTMP);
        this.setState({})
    }


    /* Template itemList */
    propertyTemplate(prop) {
        if (this.state.reloadTextInput == false) {
            console.log(prop)
            DataResult[prop.idProperty] = prop.result;
            DataResultCumple[prop.idProperty] = prop.passTest;
        }
        if (!prop) {
            return;
        }
        return (
            <div className="ui-g ui-fluid car-item" style={{ justifyContent: 'center' }}>
                <div className="ui-g-12 ui-md-3">
                    {prop.nameProperty}
                </div>
                <div className="ui-g-12 ui-md-2" style={{ textAlign: 'center' }}>
                    {prop.specifications}
                </div>
                <div className="ui-g-12 ui-md-1">
                    {prop.unit}
                </div>
                <div className="ui-g-12 ui-md-2 ui-fluid">
                    <InputText placeholder='Resultado' value={DataResult[prop.idProperty] ? DataResult[prop.idProperty] : ''} onChange={(e) => this.onWriting(e, prop.idProperty)} />
                </div>
                <div className="ui-g-12 ui-md-1">
                    <InputSwitch onLabel="Si" offLabel="No" checked={DataResultCumple[prop.idProperty]} onChange={(e) => this.onChangeBasic(e, prop.idProperty)} style={{ marginLeft: '30px' }} />
                </div>
                <div className="ui-g-12 ui-md-1" style={{ justifyContent: 'center', textAlign: 'center' }}>
                    <Button icon="fa fa-times" className="danger-btn" onClick={() => this.propertyDelete(prop.idProperty)} />
                </div>
            </div>
        );
    }
    /* Método para guardar HCC Final y Genera archivo */
    saveHCC() {
        debugger;
        var detailAUX = [];
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        if (this.state.hccPT !== '' && this.state.analysis !== '' && this.state.observation !== '') {
            if (this.state.hCC.detail.length == Object.keys(DataResult).length) {
                this.state.hCC.detail.map(function (item, index) {
                    switch (item.typeProperty) {
                        case 'T':
                            item.result = DataResult[item.idProperty];
                            item.passTest = DataResultCumple[item.idProperty];
                            break;
                        case 'V':
                            item.resultText = DataResult[item.idProperty];
                            item.passTest = DataResultCumple[item.idProperty];
                            break;
                    }
                    detailAUX.push(item);
                })
                if (this.state.hCC.product.typeProduct == 'PT') {
                    this.state.hCC.sapCode = this.state.hccPT;
                    this.state.hCC.of = this.state.hccOF;
                    this.state.hCC.dateOrder = formattedDate(this.state.productionDate);
                    if (this.state.hCC.product.typeProductTxt == 'Emulsiones Asfálticas') {
                        this.state.hCC.referralGuide = this.state.referralGuide;
                    }
                } else {
                    this.state.hCC.sapCode = this.state.hccPT;
                    this.state.hCC.of = this.state.proveedor;
                    var nameProviderTMP = undefined;
                    this.state.hCC.product.providers.map(function (obj) {
                        if (that.state.proveedor == obj.idProvider) {
                            nameProviderTMP = obj.nameProvider;
                        }
                    });
                    this.state.hCC.hccNorm = nameProviderTMP;
                    this.state.hCC.orderNumber = this.state.orderNumber;
                    this.state.hCC.dateOrder = formattedDate(this.state.receptDate);
                }
                this.state.hCC.detail = detailAUX;
                this.state.hCC.comment = this.state.observation;
                this.state.hCC.analysis = this.state.analysis;
                this.state.hCC.asUser = sesion.nickName;
                console.log(this.state.hCC);
                this.setState({ waitModalView: true })
                HCCSave(this.state.hCC, function (data, status, msg) {
                    that.setState({ waitModalView: false })
                    switch (status) {
                        case 'OK':
                            that.showSuccess(msg);
                            if (that.state.hCC.product.typeProduct == 'MP') {
                                var se = that.state.sendSubject + ' ' + that.state.productName;
                                var ms = that.state.sendMessage + ' ' + that.state.productName;
                                that.setState({ visibleModalEmail: true, pathFile: data.filePath, sendSubject: se, sendMessage: ms })
                            } else {
                                DataResult = {};
                                DataResultCumple = {};
                                that.setState({
                                    pnlCabeceraMP: 'none', pnlCabeceraPT: 'none', specificationPanel: 'none', specificationList: 'none', fieldReferralGuide: 'none',
                                    resultsPanel: 'none',
                                    btnGuardarHCC: 'none',
                                    productName: '',
                                    lote: '', observation: '', analysis: '', hccPT: '', hccOF: '', referralGuide: '', reloadTextInput: false, hCC: {}, productionDate: undefined, dateOrder: undefined,
                                });
                            }

                            GetAllHCCs(function (items) {
                                console.log(items)
                                var hccsFiles = items;
                                that.setState({ hccFiles: items })
                            })

                            break;
                        case 'ERROR':
                            that.showError(msg);
                            break;
                    }
                })

            } else {
                this.showError('Contacte al administrador');
            }
        } else {
            this.showError('Datos Icompletos');
        }
    }

    changeChipsAdd(e) {
        debugger
        var aux = this.state.sendTo;
        aux.push(e);
        this.setState({ sendTo: aux });
    }

    changeChipsRemove(e) {
        debugger
        var array = this.state.sendTo
        var filtered = array.filter(function (value, index, arr) {

            return value != e;

        });
        this.setState({ sendTo: filtered });
    }

    /* Metodo para enviar correo a destinatarios. */
    sendEmailHCCMP() {
        debugger
        if (this.state.pathFile !== null) {
            this.setState({ waitModalView: true })
            var obj = { contacts: this.state.sendTo.toString(), subject: this.state.sendSubject, filePath: this.state.pathFile, message: this.state.sendMessage }
            SendEmail(obj, function (data, status, msg) {
                that.setState({ waitModalView: false })
                switch (status) {
                    case 'OK':
                        that.showSuccess(msg);
                        DataResult = {};
                        DataResultCumple = {};
                        that.setState({
                            pnlCabeceraMP: 'none', pnlCabeceraPT: 'none', specificationPanel: 'none', specificationList: 'none', fieldReferralGuide: 'none',
                            resultsPanel: 'none',
                            btnGuardarHCC: 'none',
                            productName: '',
                            lote: '', observation: '', analysis: '', hccPT: '', hccOF: '', referralGuide: '', reloadTextInput: false, hCC: {}, productionDate: undefined, dateOrder: undefined,
                            visibleModalEmail: false, sendTo: ['anunez@imptek.com'], sendMessage: 'Estimados. \nAdjunto el documento', sendSubject: 'HCC MP'
                        });
                        break;
                    case 'ERROR':
                        that.showSuccess(msg);
                        break;
                }
            })
        }

    }

    closeModalEmail() {
        DataResult = {};
        DataResultCumple = {};
        that.setState({
            pnlCabeceraMP: 'none', pnlCabeceraPT: 'none', specificationPanel: 'none', specificationList: 'none', fieldReferralGuide: 'none',
            resultsPanel: 'none',
            btnGuardarHCC: 'none',
            productName: '',
            lote: '', observation: '', analysis: '', hccPT: '', hccOF: '', referralGuide: '', reloadTextInput: false, hCC: {}, productionDate: undefined, dateOrder: undefined,
            visibleModalEmail: false,
            clientName: undefined, abbreValue: undefined
        });
    }

    /* Metodo para generar Certificado */
    generateCertificate() {
        var objAux = { hccHead: { sapCode: '' }, clientImptek: { idClient: undefined, nameClient: undefined }, email: '', clientPrint: '' };
        objAux.clientImptek.idClient = this.findObjCliente(this.state.clientName);
        objAux.clientImptek.nameClient = this.state.clientName
        objAux.hccHead.sapCode = this.state.selectedHCC.sapCode;
        objAux.email = this.state.email;
        if (this.state.abbreValue == 'Otro')
            objAux.clientPrint = this.state.otroAbrebbation + '.' + ' ' + this.state.clientName;
        else
            objAux.clientPrint = this.state.abbreValue + '.' + ' ' + this.state.clientName;
        if ((this.state.abbreValue !== undefined) & (this.state.clientName !== undefined)) {
            this.setState({ waitModalView: true })
            GenerateCertificate(objAux, function (data, status, msg) {
                that.setState({ waitModalView: false })
                switch (status) {
                    case 'OK':
                        that.showSuccess(msg);
                        var temp = '';
                        if (that.state.abbreValue == 'Otro')
                            temp = 'Estimado\n' + that.state.otroAbrebbation + '. ' + that.state.clientName;
                        else
                            temp = 'Estimado\n' + that.state.abbreValue + '. ' + that.state.clientName;
                        that.setState({
                            dialogCertificate: false, cliente: '', order: '', visibleModalEmail: true, sendTo: [], sendMessage: temp, sendSubject: 'Certificado de Calidad',
                            pathFile: data.filePath
                        });
                        break;
                    case 'ERROR':
                        that.showError(msg);
                        break;
                }
            })
        } else {
            this.setState({ msgError: 'Error debe ingresar todos los campos', shMsgError: '' })
        }
    }
    findObjCliente(name) {
        var idclienteTMP = undefined;
        this.state.clientList.map(function (obj) {
            if (obj.nameClient === name)
                idclienteTMP = obj.idClient;
        })

        return idclienteTMP;
    }



    /* ================= F I N   F U N C I O N E S ======================= */

    componentWillMount() {
        nameProducts = [];
        var hccsFiles = [];
        clientNames = [];
        GetAllProducts(function (items) {
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ products: items })
        });
        GetAllHCCs(function (items) {
            hccsFiles = items;
            that.setState({ hccFilesAll: items, hccFilesFilter: items })
        });
        GetAllClients(function (items) {
            items.map(function (value, index) {
                clientNames.push(value.nameClient);
            })
            that.setState({ clientList: items })
        });
    }
    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="fa-check" className="ui-button-primary" onClick={() => this.sendEmailHCCMP()} />
                <Button label="Cancelar" icon="fa-close" onClick={() => this.closeModalEmail()} className="ui-button-danger" />
            </div>
        );
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        var header = <div style={{ 'textAlign': 'right' }}>
            <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
        </div>
        let dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button className='ui-button-danger' icon="fa fa-close" label="Cancelar" onClick={this.closeModalCertificate} />
            <Button className='ui-button-success' label="Aceptar" icon="fa-check" onClick={this.generateCertificate} />
        </div>;
        let headerGroupTableHCC = <ColumnGroup>
            <Row>
                <Column header="HCC" style={{ width: '10%', textAlign: 'center', backgroundColor: '#4DA6DE', color: '#ffffff' }} />
                <Column header="Lote" style={{ width: '10%', backgroundColor: '#337ab7', color: '#ffffff' }} />
                <Column header="Producto" style={{ width: '25%', backgroundColor: '#4DA6DE', color: '#ffffff' }} />
                <Column header="Fecha" style={{ width: '10%', backgroundColor: '#337ab7', color: '#ffffff' }} />
                <Column header="Análisis" style={{ width: '35%', backgroundColor: '#4DA6DE', color: '#ffffff' }} />
                <Column header="Certificado" style={{ width: '10%', backgroundColor: '#337ab7', color: '#ffffff', justifyContent: 'center', textAlign: 'center' }} />
            </Row>
        </ColumnGroup>

        return (
            <div>
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
                <Dialog header="Envío Correo Electrónico" visible={this.state.visibleModalEmail} style={{ width: '40vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalEmail: false })}>
                    <div className="ui-grid ui-grid-responsive ui-fluid">
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Para</label></div>
                            <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                <Chips value={this.state.sendTo} onAdd={(e) => this.changeChipsAdd(e.value)} onRemove={(e) => this.changeChipsRemove(e.value)}></Chips>
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Asunto</label></div>
                            <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                <InputText onChange={(e) => this.setState({ sendSubject: e.target.value })} value={this.state.sendSubject} />
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Mensaje</label></div>
                            <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                <InputTextarea rows={5} value={this.state.sendMessage} onChange={(e) => this.setState({ sendMessage: e.target.value })} />
                            </div>
                        </div>
                        <div className="ui-grid-row">
                            <div>{this.state.messageEmail}</div>
                        </div>
                    </div>
                </Dialog>
                <Growl ref={(el) => this.growl = el} />
                <Button label='Guardar' icon='fa fa-save' onClick={this.saveHCC} style={{
                    display: this.state.btnGuardarHCC,
                    position: 'fixed',
                    float: 'right',
                    width: 80,
                    height: 80,
                    bottom: 30,
                    right: 30,
                    borderRadius: 50,
                    shadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
                    zIndex: 100,
                }} />

                <TabView style={{ marginBottom: '10px' }}>

                    <TabPanel header="Consultar HCC" leftIcon="fa fa-product-hunt">
                        {/* <div className="card " style={{ padding: '0px', background: '#4DA6DE' }}>
                            <div className="ui-g">
                                <div className="ui-g-12 ui-md-1">
                                    <strong>Filtros</strong>
                                </div>
                                <div className="ui-g-12 ui-md-2">
                                    <RadioButton value="MP" inputId="rb1" onChange={this.onRadioChange} checked={this.state.hccType === "MP"} />
                                    <label htmlFor="rb1" style={{ marginLeft: '5px' }}>Materia Prima</label>
                                </div>
                                <div className="ui-g-12 ui-md-2">
                                    <RadioButton value="PT" inputId="rb2" onChange={this.onRadioChange} checked={this.state.hccType === "PT"} />
                                    <label htmlFor="rb2" style={{ marginLeft: '5px' }}>Producto Terminado</label>
                                </div>
                            </div>
                        </div> */}
                        <Toolbar style={{backgroundColor:'#337ab7'}}>
                            <div className="ui-toolbar-group-right">
                                <i className="fa fa-search" style={{ margin: '4px 4px 0 0', color:'#ffffff' }}></i>
                                <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                            </div>
                            <div className="ui-toolbar-group-left">
                                <RadioButton value="MP" inputId="rb1" onChange={this.onRadioChange} checked={this.state.hccType === "MP"} />
                                <label htmlFor="rb1" style={{ marginLeft: '5px', marginRight:'10px', color:'#ffffff' }}>MP</label>
                                <RadioButton value="PT" inputId="rb2" onChange={this.onRadioChange} checked={this.state.hccType === "PT"} />
                                <label htmlFor="rb2" style={{ marginLeft: '5px', color:'#ffffff' }}>PT</label>
                            </div>
                        </Toolbar>
                        <DataTable value={this.state.hccFilesFilter} paginator={true} rows={15}  headerColumnGroup={headerGroupTableHCC} globalFilter={this.state.globalFilter} scrollable scrollHeight="600px">
                            <Column field="sapCode" header="HCC" style={{ width: '10%' }} />
                            <Column field="hcchBatch" header="Lote" style={{ width: '10%' }} />
                            <Column field="product.nameProduct" header="Producto" style={{ width: '25%' }} />
                            <Column field="dateCreate" header="Fecha" style={{ width: '10%' }} />
                            <Column field="analysis" header="Análisis" style={{ width: '35%' }} />
                            <Column header="Certificado" body={this.actionTemplate} style={{ justifyContent: 'center', textAlign: 'center' }} />
                        </DataTable>
                        <Dialog visible={this.state.dialogCertificate} header="Generar Certificado" modal={true} style={{ width: '35%' }} footer={dialogFooter} onHide={this.closeModalCertificate}>
                            <div className="ui-grid ui-grid-responsive ui-fluid">
                                <div className="ui-grid-row" style={{ marginBottom: '18px' }}>
                                    <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Profesión</label></div>
                                    <div className="ui-grid-col-3" style={{ padding: '0px 10px' }}>
                                        <Dropdown value={this.state.abbreValue} options={abbreviation} onChange={this.onAbbrevationChange} placeholder="Seleccione" />
                                    </div>
                                    <div className="ui-grid-col-6" style={{ padding: '0px 10px' }}>
                                        <InputText onChange={(e) => this.setState({ otroAbrebbation: e.target.value })} value={this.state.otroAbrebbation} disabled={this.state.fieldAbbrebation} />
                                    </div>
                                </div>
                                <div className="ui-grid-row" style={{ marginBottom: '18px' }}>
                                    <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Cliente</label></div>
                                    <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                        <AutoComplete minLength={1} placeholder="Nombre" id="acAdvanced"
                                            suggestions={this.state.filteredClients} completeMethod={this.filterClients.bind(this)} value={this.state.clientName}
                                            onChange={this.onClientValueChange.bind(this)} onDropdownClick={this.handleDropdownClickClientFind.bind(this)}
                                        />
                                    </div>
                                </div>
                                <div className="ui-grid-row" style={{ marginBottom: '25px' }}>
                                    <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Correo</label></div>
                                    <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                        <InputText onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} />
                                    </div>
                                </div>
                            </div>
                            <div className="ui-grid-row" style={{ display: this.state.shMsgError }}>
                                <div style={{ color: '#e53935', textAlign: 'center' }}>{this.state.msgError}</div>
                            </div>
                        </Dialog>

                    </TabPanel>
                    <TabPanel header="HCC" leftIcon="fa fa-product-hunt">
                        <Card style={{ backgroundColor: '#d4e157' }}>
                            <div className='ui-g form-group ui-fluid'>
                                <div className='ui-g-4'>
                                    <label htmlFor="float-input">Buscar Producto</label>
                                    <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                        suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                        onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                    />
                                </div>
                                <div className='ui-g-2'>
                                    <label htmlFor="float-input">Frecuencia</label>
                                    <Dropdown disabled={this.state.enabledFrecuencia} options={periocidad} value={this.state.frecuencia} onChange={this.onDropdownChangeFrecuencia} autoWidth={false} placeholder="Selecione" />
                                </div>
                                <div className='ui-g-2'>
                                    <label htmlFor="float-input">Lote</label>
                                    <InputText placeholder='Lote' keyfilter="int" onChange={(e) => this.setState({ lote: e.target.value })} value={this.state.lote} />
                                </div>
                                <div className='ui-g-2' style={{ marginTop: '23px' }}>
                                    <Button label='Generar HCC' onClick={this.generateHCC} />
                                </div>
                            </div>
                        </Card>
                        <Card style={{ display: this.state.pnlCabeceraPT, borderColor: '#d4e157', borderBottomWidth: 5 }}>
                            <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                <div className='ui-g-12' style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '0px', backgroundColor: '#457fca', borderRadius: 5 }}>
                                    <h3 style={{ color: '#ffff' }}>LABORATORIO DE INSPECCIÓN Y ENSAYO PRODUCTO TERMINADO</h3>
                                </div>
                                <div className='ui-g-3'>
                                    <strong style={{ marginRight: '10px' }}>PRODUCTO:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.product.nameProduct}
                                </div>
                                <div className='ui-g-3'>
                                    <strong style={{ marginRight: '10px' }}>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.product.typeProductTxt}</strong>
                                </div>
                                <div className='ui-g-3'>
                                    <strong style={{ marginRight: '10px' }}>REVISIÓN:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.review}
                                </div>
                            </div>
                            <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                <div className='ui-g-3'>
                                    <label htmlFor="float-input">HCC</label>
                                    <InputText placeholder='Codigo' onChange={(e) => this.setState({ hccPT: e.target.value })} value={this.state.hccPT} />
                                </div>
                                <div className='ui-g-3'>
                                    <label htmlFor="float-input">Orden Fabricación</label>
                                    <InputText placeholder='Número' onChange={(e) => this.setState({ hccOF: e.target.value })} value={this.state.hccOF} />
                                </div>
                                <div className='ui-g-3' style={{ display: this.state.fieldReferralGuide }}>
                                    <label htmlFor="float-input">Guía Remisión</label>
                                    <InputText placeholder='Número' onChange={(e) => this.setState({ referralGuide: e.target.value })} value={this.state.referralGuide} />
                                </div>
                                <div className='ui-g-3' style={{}}>
                                    <label htmlFor="float-input">Fecha Producción</label>
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.productionDate} locale={es} showIcon="true" onChange={(e) => this.setState({ productionDate: e.value })}></Calendar>
                                </div>
                            </div>
                        </Card>
                        <Card style={{ display: this.state.pnlCabeceraMP, borderColor: '#d4e157', borderBottomWidth: 5 }}>
                            <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                <div className='ui-g-12' style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '0px', backgroundColor: '#457fca', borderRadius: 5 }}>
                                    <h3 style={{ color: '#ffff' }}>LABORATORIO DE INSPECCIÓN Y ENSAYO MATERIAS PRIMAS</h3>
                                </div>
                                <div className='ui-g-3'>
                                    <strong style={{ marginRight: '10px' }}>PRODUCTO:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.product.nameProduct}
                                </div>
                                <div className='ui-g-3'>
                                    <strong style={{ marginRight: '10px' }}>CODIGO MATERIAL:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.product.idProduct}
                                </div>
                            </div>
                            <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                <div className='ui-g-3'>
                                    <label htmlFor="float-input">Proveedor</label>
                                    <Dropdown options={proveedoresMP} value={this.state.proveedor} onChange={this.onDropdownChangeProveedor} autoWidth={false} placeholder="Selecione" />
                                </div>
                                <div className='ui-g-3'>
                                    <label htmlFor="float-input">Fecha Recepción</label>
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.receptDate} locale={es} showIcon="true" onChange={(e) => this.setState({ receptDate: e.value })}></Calendar>
                                </div>
                                <div className='ui-g-3'>
                                    <label htmlFor="float-input">Pedido</label>
                                    <InputText placeholder='Número' onChange={(e) => this.setState({ orderNumber: e.target.value })} value={this.state.orderNumber} />
                                </div>
                                <div className='ui-g-3'>
                                    <label htmlFor="float-input">Hcc</label>
                                    <InputText placeholder='Codigo' onChange={(e) => this.setState({ hccPT: e.target.value })} value={this.state.hccPT} />
                                </div>
                            </div>
                        </Card>
                        <Card style={{ display: this.state.specificationPanel, marginTop: 5 }}>
                            <div className="ui-g ui-fluid car-item" style={{ justifyContent: 'center', backgroundColor: '#457fca', borderRadius: 5 }}>
                                <div className="ui-g-12 ui-md-3">
                                    <strong style={{ color: '#ffff' }}>Propiedad</strong>
                                </div>
                                <div className="ui-g-12 ui-md-2">
                                    <strong style={{ color: '#ffff' }}>Especificaciones</strong>
                                </div>
                                <div className="ui-g-12 ui-md-1">
                                    <strong style={{ color: '#ffff' }}>Unidad</strong>
                                </div>
                                <div className="ui-g-12 ui-md-2 ui-fluid" style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#ffff' }}>Resultado</strong>
                                </div>
                                <div className="ui-g-12 ui-md-1" style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#ffff' }}>Cumple</strong>
                                </div>
                                <div className="ui-g-12 ui-md-1" style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#ffff' }}>Opción</strong>
                                </div>
                            </div>
                        </Card>
                        <DataList style={{ display: this.state.specificationList }} value={this.state.hCC.detail} itemTemplate={this.propertyTemplate.bind(this)} paginator={true} rows={70}></DataList>
                        <Card style={{ display: this.state.resultsPanel }}>
                            <div className="ui-g ui-fluid car-item" style={{ justifyContent: 'center', backgroundColor: '', borderRadius: 5 }}>
                                <div className='ui-g-6'>
                                    <label htmlFor="float-input">Observaciones</label>
                                    <InputTextarea rows={5} value={this.state.observation} onChange={(e) => this.setState({ observation: e.target.value })} />
                                </div>
                                <div className='ui-g-6'>
                                    <label htmlFor="float-input">Análisis</label>
                                    <InputTextarea rows={5} value={this.state.analysis} onChange={(e) => this.setState({ analysis: e.target.value })} />
                                </div>
                            </div>
                        </Card>
                        {/* <Dialog header="Envío Correo Electrónico" visible={this.state.visibleModalEmail} style={{ width: '40vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalEmail: false })}>
                            <div className="ui-grid ui-grid-responsive ui-fluid">
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Para</label></div>
                                    <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                        <Chips value={this.state.sendTo} onAdd={(e) => this.changeChipsAdd(e.value)} onRemove={(e) => this.changeChipsRemove(e.value)}></Chips>
                                    </div>
                                </div>
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Asunto</label></div>
                                    <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                        <InputText onChange={(e) => this.setState({ sendSubject: e.target.value })} value={this.state.sendSubject} />
                                    </div>
                                </div>
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Mensaje</label></div>
                                    <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                        <InputTextarea rows={5} value={this.state.sendMessage} onChange={(e) => this.setState({ sendMessage: e.target.value })} />
                                    </div>
                                </div>
                                <div className="ui-grid-row">
                                    <div>{this.state.messageEmail}</div>
                                </div>
                            </div>
                        </Dialog> */}
                    </TabPanel>

                </TabView>

            </div>


        )
    }
}
