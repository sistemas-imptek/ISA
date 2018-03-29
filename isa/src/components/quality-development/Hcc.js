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


/* ============  D A T A    C A T A L O G O  S =============== */
import { periocidad, tipoProducto, proveedoresMP } from '../../global/catalogs';

/* ====================  T R A N S A C T I O N S ======== */
import { GetAllProducts, GetProductById, GenerateHCC } from '../../utils/TransactionsCalidad';


var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var that;
var DataResult = [];
var DataResultCumple = [];
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
            resultsPanel:'none',
            btnGuardarHCC:'none',
            hCC: {},
            frecuencia: '',
            tipo: '',
            hccPT: '',
            hccMP: '',
            orderNumber: '',
            checked1: false,
            enabledFrecuencia: true,
            receptDate: '',
            proveedor: '',
            analysis: '',
            observation: '',

        };
        that = this;
        this.generateHCC = this.generateHCC.bind(this);
        this.onDropdownChangeFrecuencia = this.onDropdownChangeFrecuencia.bind(this);
        this.onDropdownChangeTipo = this.onDropdownChangeTipo.bind(this);
        this.onDropdownChangeProveedor = this.onDropdownChangeProveedor.bind(this);
        this.onChangeBasic = this.onChangeBasic.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
    }

    /* =============== I N I C I O   F U N C I O N E S ======================= */

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
                    if(obj.typeProduct == 'MP'){
                        that.setState({ enabledFrecuencia: true });
                    }
                }
            })
        }
        this.setState({ productName: e.value, filteredProducts: null });
    }
    /* FIn Métodos  Auto Completado */

    /* Mostrar Mensajes */
    showError() {
        this.growl.show({ severity: 'error', summary: 'Error', detail: 'Ingrese el nombre del producto' });
    }
    showSuccess() {
        let msg = { severity: 'success', summary: 'Success Message', detail: 'Order submitted' };
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

    /* Método para generar HCC */
    generateHCC() {
        var result = {};
        debugger;
        if (this.state.productName != '' && this.state.lote != '') {
            this.state.products.map(function (value, index) {
                if (that.state.productName == value.nameProduct) {
                    result = value;
                }
            });
            GenerateHCC(result.idProduct, this.state.lote, this.state.frecuencia, function (item) {
                console.log(item);
                if (item.product.typeProduct == 'PT') {
                    that.setState({ hCC: item, pnlCabeceraPT: '', pnlCabeceraMP:'none', specificationPanel:'',specificationList:'',btnGuardarHCC:'', resultsPanel:'' })
                } else {
                    that.setState({ hCC: item, pnlCabeceraMP: '', pnlCabeceraPT:'none', specificationList:'',specificationList:'',btnGuardarHCC:'', resultsPanel:'' })
                }

            })
        } else {

            this.showError();
        }


    }

    /* Método que captura el valor de InputText */
    onWriting(e, id) {
        debugger;
        DataResult[id] = e.target.value;
        this.setState({ reloadTextInput: true });
    }


    /* Template itemList */
    propertyTemplate(prop) {
        if (this.state.reloadTextInput == false) {
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
                    <InputText placeholder='Resultado' value={DataResult[prop.idProperty]} onChange={(e) => this.onWriting(e, prop.idProperty)} />
                </div>
                <div className="ui-g-12 ui-md-3">
                    <InputSwitch onLabel="Si" offLabel="No" checked={DataResultCumple[prop.idProperty]} onChange={(e) => this.onChangeBasic(e, prop.idProperty)} style={{ marginLeft: '30px' }} />
                </div>
            </div>
        );
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
        return (
            <div>

                <Growl ref={(el) => this.growl = el} />
                <Button label='Guardar' icon='fa fa-save' style={{
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
                            <strong style={{ marginRight: '10px' }}>NORMA:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.hccNorm}
                        </div>
                        <div className='ui-g-3'>
                            <strong style={{ marginRight: '10px' }}>REVISIÓN:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.review}
                        </div>
                        <div className='ui-g-3'>
                            <strong style={{ marginRight: '10px' }}>O/F:</strong>{Object.keys(this.state.hCC).length === 0 ? '' : this.state.hCC.of}
                        </div>

                    </div>
                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>

                        <div className='ui-g-4'>
                            <label htmlFor="float-input">HCC</label>
                            <InputText placeholder='Codigo' onChange={(e) => this.setState({ hccPT: e.target.value })} value={this.state.hccPT} />
                        </div>
                    </div>
                </Card>
                <Card style={{ display: this.state.pnlCabeceraMP }}>
                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                        <div className='ui-g-12' style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '0px' }}>
                            <h3>LABORATORIO DE INSPECCIÓN Y ENSAYO MATERIAS PRIMAS</h3>
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
                            <Calendar value={this.state.receptDate} locale={es} showIcon="true" onChange={(e) => this.setState({ receptDate: e.value })}></Calendar>
                        </div>
                        <div className='ui-g-3'>
                            <label htmlFor="float-input">Pedido</label>
                            <InputText placeholder='Número' onChange={(e) => this.setState({ orderNumber: e.target.value })} value={this.state.orderNumber} />
                        </div>
                        <div className='ui-g-3'>
                            <label htmlFor="float-input">Hcc</label>
                            <InputText placeholder='Codigo' onChange={(e) => this.setState({ hccMP: e.target.value })} value={this.state.hccMP} />
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
                        <div className="ui-g-12 ui-md-3" style={{ textAlign: 'center' }}>
                            <strong style={{ color: '#ffff' }}>Cumple</strong>
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
            </div>


        )
    }
}
