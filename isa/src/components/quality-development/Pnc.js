import React, { Component } from 'react';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { Card } from 'primereact/components/card/Card';
import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Growl } from 'primereact/components/growl/Growl';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Toolbar } from 'primereact/components/toolbar/Toolbar'
import { TabView, TabPanel } from 'primereact/components/tabview/TabView';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';
import { Checkbox } from 'primereact/components/checkbox/Checkbox';


/* ====================  T R A N S A C T I O N S ======================== */
import { GetAllProducts, GetCatalogsPNC, GetAllPncs, ClosedPNC, PNCSave } from '../../utils/TransactionsCalidad';

/* =====================  D A T A    C A T A L O G O  S ======================= */
import { procedencia, unidadesMedida, cincoMs } from '../../global/catalogs';

/* ====================  U T I L S  ======== */
import { formattedDate } from '../../utils/FormatDate';

/* ====================  C O M P O N E N T S ======================== */
import { ExitMaterial, setDataOutputMaterial } from './ExitMaterialPNC/OutputMaterial';


var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var that;
var defects = [];
var areas = [];
var outMethods = [];

export class ProductoNoConforme extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
            productName: undefined,
            source: undefined,
            productionDate: undefined,
            detectionnDate: undefined,
            batch: undefined,
            daysAntiquities: undefined,
            orderProduction: undefined,
            hccFreeUse: undefined,
            amountProduced: undefined,
            amountNonConforming: undefined,
            unitNCP: undefined,
            hccFreeUse: undefined,
            exitMaterial: 0,
            validityAverage: null,
            balanceMaterial: undefined,
            defect: undefined,
            defectDescription: undefined,
            fivems: [],
            fiveMDescription: undefined,
            viewForm: 'none',
            viewOtherDefect: 'none',
            viewOtherOutMethod: 'none',
            viewOtherFiveM: 'none',
            area: undefined,
            outMethod: undefined,
            otherOutMethod: undefined,
            finalDestination: undefined,
            aditionalRemarks: undefined,
            validationTextBalancedMaterial: '',
            vaidationFontTextBalanceMaerial: '',
            visibleFormPNC: false,
            idPNC: undefined,
            foundProduct: undefined,
            listPnc: [],
            userLogin: null,
            displayOutputMaterial: 'none',
            displayTablePNC: '',
            selectedPNC: null,
            itemPNC: null,

        };
        that = this;
        this.onDropdownChangeOrigin = this.onDropdownChangeOrigin.bind(this);
        this.onDropdownChangeUnitNCP = this.onDropdownChangeUnitNCP.bind(this);
        this.onDropdownChangeArea = this.onDropdownChangeArea.bind(this);
        this.productFind = this.productFind.bind(this);
        this.convertDataToCatalogAreas = this.convertDataToCatalogAreas.bind(this);
        this.savePNC = this.savePNC.bind(this);
        this.setCNC = this.setCNC.bind(this);
        this.setExitMaterial = this.setExitMaterial.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);
        this.editPNCFile = this.editPNCFile.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.onHideFormPNC = this.onHideFormPNC.bind(this);
        this.closePNC = this.closePNC.bind(this);
        this.onFivemsChange = this.onFivemsChange.bind(this);
        this.onPNCSelect = this.onPNCSelect.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.addNewOutputMaterial = this.addNewOutputMaterial.bind(this);
    }

    /* =============== I N I C I O   F U N C I O N E S ======================= */
    /* Métodos ListasDesplegables */
    onDropdownChangeOrigin(event) {
        if (event.value == 'Otro') {
            this.setState({ source: event.value, viewOtherFiveM: '' });
        } else {
            this.setState({ source: event.value, viewOtherFiveM: 'none' });
        }
    }
    onDropdownChangeUnitNCP(event) {
        this.setState({ unitNCP: event.value });
    }
    onDropdownChangeArea(event) {
        this.setState({ area: event.value });
    }

    /* Metodo inputCheck */
    onFivemsChange(e) {
        let selectedFivems = [...this.state.fivems];
        if (e.checked)
            selectedFivems.push(e.value);
        else
            selectedFivems.splice(selectedFivems.indexOf(e.value), 1);
        this.setState({ fivems: selectedFivems });
    }

    /* Métodos  Auto Completado */
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

    /*  Metodo Obtener/Buscar Producto*/
    productFind() {
        debugger;
        let finedProduc = undefined;
        if (this.state.productName != undefined) {
            this.state.products.map(function (value, index) {
                if (value.nameProduct == that.state.productName) {
                    finedProduc = value;
                }
            })
        }
        if (finedProduc != undefined) {
            this.setState({ viewForm: '', foundProduct: finedProduc })
            this.showSuccess('Producto Encontrado');
        } else {
            this.showError('Producto no Encontrado');
        }
    }
    /* Metodo para hacer la data de combos */
    convertDataToCatalogAreas(data) {
        debugger
        areas = [];
        data.map(function (value) {
            let newData = { label: '', value: '' }
            newData.label = value.nameArea;
            newData.value = value.idArea;
            areas.push(newData);
        })
    }


    /*======== Metodos para calculos ======== */
    setCNC(e) {
        debugger;
        let quantityProd = 0;
        let calc = null;
        if (this.state.amountProduced !== null) {
            quantityProd = parseFloat(this.state.amountProduced);
        }

        if (quantityProd !== 0) {
            calc = (100 - (e.target.value / quantityProd) * 100).toFixed(2);
        }

        this.setState({ amountNonConforming: e.target.value, validityAverage: calc })
    }
    setExitMaterial(e) {
        debugger
        let a = parseFloat(e.target.value);
        let b = parseFloat(this.state.amountNonConforming);
        let calc = this.state.amountNonConforming - e.target.value;
        if (a > b) {
            this.setState({ exitMaterial: e.target.value, validationTextBalancedMaterial: 'ui-state-error', vaidationFontTextBalanceMaerial: '#ef9a9a', balanceMaterial: calc })
        } else {

            if (calc < 0) {
                this.setState({ validationTextBalancedMaterial: 'ui-state-error', vaidationFontTextBalanceMaerial: '#ef9a9a', balanceMaterial: calc })
            } else
                this.setState({ exitMaterial: e.target.value, balanceMaterial: calc, validationTextBalancedMaterial: '', vaidationFontTextBalanceMaerial: '', })
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
    /* Metodo para lanzar mensajes */
    showMessage(message, type) {
        switch (type) {
            case 'error':
                this.growl.show({ severity: 'error', summary: 'Error', detail: message });
                break;
            case 'success':
                this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
                break;
            case 'info':
                this.growl.show({ severity: 'info', summary: 'Información', detail: message });
                break;
        }
    }
    /* FIN Metodos Mensajes Mostrar */

    /* Metodo para guardar el PNC */
    savePNC() {
        debugger;
        var pncNew = {};
        pncNew.amountNonConforming = this.state.amountNonConforming;
        pncNew.amountProduced = this.state.amountProduced;
        pncNew.validityPercent = this.state.validityAverage;
        pncNew.batch = this.state.batch;
        pncNew.dateDetection = formattedDate(this.state.detectionnDate);
        pncNew.dateProduction = formattedDate(this.state.productionDate);
        pncNew.defect = this.state.defect;

        pncNew.hccFreeUse = this.state.hccFreeUse;
        pncNew.orderProduction = this.state.orderProduction;
        pncNew.product = { idProduct: this.state.foundProduct.idProduct };
        pncNew.area = { idArea: this.state.area };
        pncNew.source = this.state.source;
        pncNew.unitNCP = this.state.unitNCP;
        pncNew.asUser = this.state.userLogin.nickName;
        let stringFiveMs = '';
        this.state.fivems.map(function (o) {
            stringFiveMs = stringFiveMs + o + ',';
        })
        pncNew.fiveM = stringFiveMs;
        PNCSave(pncNew, function (data, status, msg) {
            console.log(data);
            switch (status) {
                case 'OK':
                    that.showSuccess(msg);
                    data.product.nameProduct = that.state.productName;
                    var pncs = that.state.listPnc;
                    pncs.push(data);
                    that.setState({
                        visibleFormPNC: false, viewForm: 'none', listPnc: pncs, productName: null
                    });

                    break;
                case 'ERROR':
                    that.showError(msg);
                    break;
            }
        })

    }
    /* Método Template DataTable PNC's */
    actionTemplate(rowData, column) {
        if (!rowData.close)
            return <div>
                <Button type="button" icon="fa-edit" className="ui-button-warning" onClick={() => this.editPNCFile(rowData)}></Button>
            </div>;
        else
            return <div>
                <Button type="button" icon="fa-edit" disabled className="ui-button-warning" onClick={() => this.editPNCFile(rowData)}></Button>
            </div>
    }
    statusTemplate(rowData, column) {
        return <div>
            {rowData.state == 'Cerrado' ? <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{rowData.state}</span> : <span style={{ color: '#388e3c', fontWeight: 'bold' }}>{rowData.state}</span>}
        </div>;
    }
    /* Metodo para editar PNC's */
    editPNCFile(rowData) {
        var dDetection = new Date(rowData.dateDetection);
        var dProduction2 = new Date(rowData.dateProduction);
        var taskReformat = rowData.tasks.map(function (item, index) {
            var tasknew = { descriptionTask: '', idTask: '', percentTask: '' }
            tasknew.descriptionTask = item.descriptionTask;
            tasknew.idTask = item.idTask;
            tasknew.percentTask = item.percentTask * 100;
            return tasknew;

        })
        this.setState({
            visibleFormPNC: true, viewForm: true,
            batch: rowData.batch,
            productionDate: dDetection,
            detectionnDate: dProduction2,
            orderProduction: rowData.orderProduction,
            hccFreeUse: rowData.hccFreeUse,
            source: rowData.source,
            amountProduced: rowData.amountProduced,
            amountNonConforming: rowData.amountNonConforming,
            unitNCP: rowData.unitNCP,
            area: rowData.area.idArea,
            exitMaterial: rowData.exitMaterial,
            balanceMaterial: rowData.balanceMaterial,
            defect: rowData.defect.idDefect,
            fiveM: rowData.fiveM,
            outMethod: rowData.outputMethod.idOM,
            finalDestination: rowData.finalDestination,
            tasks: taskReformat,
            aditionalRemarks: rowData.aditionalRemarks,
            productName: rowData.product.nameProduct,
            idPNC: rowData.idNCP
        })
        console.log(rowData);
    }
    /* Ocultar Dialog FormPNC */
    onHideFormPNC(event) {
        this.setState({
            visibleFormPNC: false, viewForm: 'none',
            batch: '',
            productionDate: '',
            detectionnDate: undefined,
            orderProduction: undefined,
            hccFreeUse: '',
            source: '',
            amountProduced: '',
            amountNonConforming: '',
            unitNCP: '',
            area: undefined,
            exitMaterial: '',
            balanceMaterial: 0,
            defect: undefined,
            fiveM: undefined,
            outMethod: undefined,
            finalDestination: '',
            aditionalRemarks: '',
            validityAverage: null,
        });
    }
    /* Selecciona un item de la lista de PNCS */
    onPNCSelect(e) {
        this.setState({
            displayOutputMaterial: '',
            itemPNC: Object.assign({}, e.data)
        });
    }

    /* Metodo para Cerrar PNC */
    closePNC() {
        ClosedPNC(this.state.idPNC, function (data) {
            switch (data.status) {
                case 'OK':
                    that.showSuccess(data.message);
                    that.setState({
                        visibleFormPNC: false, viewForm: 'none',
                    });
                    GetAllPncs(function (items) {
                        that.setState({ listPnc: items })
                    })
                    break;
                case 'ERROR':
                    that.showError(data.message);
                    break;
            }
        })
    }
    changeTab(e) {
        debugger;
        console.log('Cambio')
    }

    /* Metodo para registrar la salida de material */
    addNewOutputMaterial() {
        debugger
        if (this.state.selectedPNC !== null) {
            setDataOutputMaterial(this.state.selectedPNC);
            this.setState({ displayOutputMaterial: '', displayTablePNC: 'none' });
        } else {
            this.showMessage('Seleccione un item', 'error');
        }
    }

    /* ================= F I N   F U N C I O N E S ======================= */

    componentWillMount() {
        nameProducts = [];
        GetAllProducts(function (items) {
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ products: items })
        });

        GetAllPncs(function (items) {
            console.log(items);
            that.setState({ listPnc: items })
        })
        GetCatalogsPNC(function (catalogo) {
            console.log(catalogo);
            that.convertDataToCatalogAreas(catalogo.areas);
        })
    }

    componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    }

    render() {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        let footer = <div className="ui-helper-clearfix" style={{ width: '30%' }} >
            <Button style={{ float: 'left' }} icon="fa-plus" label="Añadir" onClick={this.addNew} />
        </div>;
        var header = <div >
            <Toolbar style={{ border: 'none', padding: '0px' }}>
                <div className="ui-toolbar-group-right">
                    <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
                </div>
                <div className="ui-toolbar-group-left">
                    <Button label='Salida Material' icon='fa fa-plus-circle' onClick={() => this.addNewOutputMaterial()} />
                </div>
            </Toolbar>
        </div>
        let footerDialog = <div>
            <Button className='ui-button-success' label="Aceptar" icon="fa-check" onclick={() => this.PNCSave} />
            <Button className='ui-button-danger' label="Cancelar" icon="fa-close" onClick={this.onHideFormPNC} />
            <Button label="Cerrar PNC" icon="fa-times-circle" onClick={this.closePNC} />
        </div>;

        var formPNC = <div>
            <Card style={{ display: this.state.viewForm }}>
                <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                    <div className='ui-g-12 ui-lg-12' style={{
                        justifyContent: 'center', textAlign: 'center', paddingTop: '0px', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)',
                        borderTopColor: '#337ab7', borderLeftColor: '#337ab7', borderRightColor: '#337ab7', borderRadius: 5, borderStyle: 'solid', borderBottomColor: '#d4e157'
                    }}>
                        <br /><span style={{ fontSize: '18px', fontWeight: 'bold' }}>FORMATO DEL REGISTRO</span><br />
                        <span style={{ fontWeight: 'inherit' }}>Referencia: MP-PNC.01</span><br />
                        <span style={{ fontWeight: 'lighter' }}>Tratamiento Del Producto No Conforme</span><br />
                        <span style={{ color: '#457fca', fontSize: '18px', marginBottom: '0px' }}>{this.state.productName}</span>

                    </div>
                    <div className='ui-g-12 ui-lg-12' style={{ borderColor: '#337ab7', borderRadius: '8px', borderStyle: 'solid', background: '#f5f5f5' }}>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">Fecha De Producción</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.productionDate} locale={es} showIcon="true" onChange={(e) => this.setState({ productionDate: e.value })}></Calendar>
                        </div>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">Fecha De Detección</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.detectionnDate} locale={es} showIcon="true" onChange={(e) => this.setState({ detectionnDate: e.value })}></Calendar>
                        </div>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">Área</label>
                            <Dropdown options={areas} value={this.state.area} onChange={this.onDropdownChangeArea} autoWidth={false} placeholder="Selecione" />
                        </div>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">Cantidad Producida</label>
                            <div className="ui-inputgroup">
                                <InputText placeholder='cantidad' keyfilter="num" onChange={(e) => this.setState({ amountProduced: e.target.value })} value={this.state.amountProduced} />
                                <Dropdown options={unidadesMedida} value={this.state.unitNCP} onChange={this.onDropdownChangeUnitNCP} autoWidth={false} placeholder="Seleccione UM" />
                            </div>
                        </div>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">Cantidad No Conforme</label>
                            <div className="ui-inputgroup">
                                <InputText placeholder='cantidad' keyfilter="num" onChange={(e) => this.setCNC(e)} value={this.state.amountNonConforming} />
                                <Dropdown options={unidadesMedida} value={this.state.unitNCP} onChange={this.onDropdownChangeUnitNCP} autoWidth={false} placeholder="Selecione UM" />
                            </div>
                        </div>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">% Validez P</label>
                            <InputText value={this.state.validityAverage} disabled />
                        </div>
                        <div className='ui-g-12 ui-lg-12' style={{ padding: '0px' }}>
                            <div className='ui-g-12 ui-lg-4'>
                                <label htmlFor="float-input">Orden de Producción</label>
                                <InputText placeholder='orden' onChange={(e) => this.setState({ orderProduction: e.target.value })} value={this.state.orderProduction} />
                            </div>
                            <div className='ui-g-12 ui-lg-4'>
                                <label htmlFor="float-input">Lote</label>
                                <InputText placeholder='lote' onChange={(e) => this.setState({ batch: e.target.value })} value={this.state.batch} />
                            </div>
                            <div className='ui-g-12 ui-lg-4'>
                                <label htmlFor="float-input">Procedencia</label>
                                <Dropdown options={procedencia} value={this.state.source} onChange={this.onDropdownChangeOrigin} autoWidth={false} placeholder="Selecione" />
                            </div>
                        </div>

                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">HCC Traspaso Libre Utilización</label>
                            <InputText placeholder='codigo' onChange={(e) => this.setState({ hccFreeUse: e.target.value })} value={this.state.hccFreeUse} />
                        </div>
                        <div className='ui-g-12 ui-lg-8'>
                            <label className="ui-g-12 ui-lg-12" htmlFor="float-input"><span style={{ color: '#CB3234' }}>*</span>Observaciones 5 M's</label>
                            <div className="ui-g-12 ui-lg-4">
                                <Checkbox inputId="cb1" value="Mano de Obra" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Mano de Obra') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="ui-checkbox-label">Mano de Obra</label>
                            </div>
                            <div className="ui-g-12 ui-lg-4">
                                <Checkbox inputId="cb1" value="Materia Prima" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Materia Prima') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="ui-checkbox-label">Materia Prima</label>
                            </div>
                            <div className="ui-g-12 ui-lg-4">
                                <Checkbox inputId="cb1" value="Método" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Método') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="ui-checkbox-label">Método</label>
                            </div>
                            <div className="ui-g-12 ui-lg-4">
                                <Checkbox inputId="cb1" value="Medio Ambiente" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Medio Ambiente') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="ui-checkbox-label">Medio Ambiente</label>
                            </div>
                            <div className="ui-g-12 ui-lg-4">
                                <Checkbox inputId="cb1" value="Maquinaria" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Maquinaria') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="ui-checkbox-label">Maquinaria</label>
                            </div>
                            <div className="ui-g-12 ui-lg-4">
                                <Checkbox inputId="cb1" value="Otro" onChange={this.onFivemsChange} checked={this.state.fivems.indexOf('Otro') !== -1}></Checkbox>
                                <label htmlFor="cb1" style={{ paddingLeft: '8px' }} className="ui-checkbox-label">Otro</label>
                            </div>
                        </div>

                        <div className='ui-g-12 ui-lg-12'>
                            <label htmlFor="float-input">Defectos</label>
                            <InputTextarea rows={3} value={this.state.defect} onChange={(e) => this.setState({ defect: e.target.value })} />
                        </div>
                        <div className='ui-g-12 ui-lg-12' style={{ justifyContent: 'left', textAlign: 'right' }}>
                            <Button label='Guardar' icon='fa fa-save' style={{ width: '10%' }} onClick={() => this.savePNC()} />
                        </div>
                    </div>

                </div>
            </Card>
        </div>

        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                {/* <Button label='Guardar' icon='fa fa-save' onClick={this.savePNC} style={{
                    display: this.state.viewForm,
                    position: 'fixed',
                    float: 'right',
                    width: 80,
                    height: 80,
                    bottom: 50,
                    right: 30,
                    borderRadius: 50,
                    shadow: '0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)',
                    zIndex: 100,
                }} /> */}
                <div className="card card-w-title">
                    <TabView style={{ marginBottom: '10px' }} selected={1}>
                        <TabPanel header="Consultar PNC" leftIcon="fas fa-search" onTabChange={this.changeTab} activeIndex={0} >
                            <DataTable style={{ display: this.state.displayTablePNC }} value={this.state.listPnc} paginator={true} rows={15} header={header} globalFilter={this.state.globalFilter}
                                selectionMode="single" selection={this.state.selectedPNC} onSelectionChange={(e) => { this.setState({ selectedPNC: e.data }); }}
                                onRowSelect={this.onTaskSelect}
                            >
                                <Column field="idNCP" header="PNC" style={{ width: '5%', textAlign: 'center' }} />
                                <Column field="batch" header="Lote" style={{ width: '10%', textAlign: 'center' }} />
                                <Column field="product.nameProduct" header="Producto" style={{ width: '30%', textAlign: 'center' }} />
                                <Column field="existingMaterial" header="Cantidad" style={{ width: '7%', textAlign: 'center' }} />
                                <Column field="unitNCP" header="Unidad" style={{ width: '4%' }} />
                                <Column field="dateProduction" header="Fecha Producción" style={{ width: '10%', textAlign: 'center' }} />
                                <Column field="dateDetection" header="Fecha Detección" style={{ width: '10%', textAlign: 'center' }} />
                                <Column body={this.statusTemplate} header="Estado" style={{ width: '10%', textAlign: 'center' }} />
                                {/* <Column body={this.actionTemplate} style={{ width: '10%', textAlign: 'center' }} /> */}
                            </DataTable>
                            <div style={{ display: this.state.displayOutputMaterial }}>
                                <ExitMaterial />
                            </div>

                        </TabPanel>

                        <TabPanel header="PNC" leftIcon="fas fa-file" onTabChange={this.changeTab} activeIndex={1}  >
                            <Card style={{ backgroundColor: '#d4e157' }}>
                                <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                    <div className='ui-g-4'>
                                        <label htmlFor="float-input">Nombre Producto</label>
                                        <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                            suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                            onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                        />
                                    </div>
                                    <div className='ui-g-2' style={{ marginTop: '23px' }}>
                                        <Button label='Buscar' icon='fa fa-search' onClick={this.productFind} />
                                    </div>
                                </div>
                            </Card>
                            {formPNC}
                        </TabPanel>
                    </TabView>
                    <Dialog header="Editar PNC" visible={this.state.visibleFormPNC} width="80% " modal={true} footer={footerDialog} onHide={() => this.onHideFormPNC()}>
                        <ScrollPanel style={{ width: '100%', height: '700px' }}>
                            {formPNC}
                        </ScrollPanel>
                    </Dialog>
                </div>
            </div>
        )
    }
}

export function setDataCancelOutputMaterial() {
    that.setState({ displayOutputMaterial: 'none', displayTablePNC: '' });
}

export function setDataAfterSaveExitMaterial(itemPnc, status, msg) {
    that.state.listPnc.map(function (p) {
        if (itemPnc.idPNC == p.idPNC)
            p = itemPnc;
    })
    that.showMessage(msg, 'success');
    that.setState({ displayOutputMaterial: 'none', displayTablePNC: '' });
}