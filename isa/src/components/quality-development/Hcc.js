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

/* ============  D A T A    C A T A L O G O  S =============== */
import { periocidad } from '../../global/catalogs';

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
            pnlCabecera: '',
            hCC: {},
            frecuencia: '',
            codeHCC: '',
            checked1: false,

        };
        that = this;

        this.generateHCC = this.generateHCC.bind(this);
        this.onDropdownChangeFrecuencia = this.onDropdownChangeFrecuencia.bind(this);
        this.onChangeBasic = this.onChangeBasic.bind(this);
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
        this.setState({ productName: e.value, filteredProducts: null });
    }
    /* FIn Métodos  Auto Completado */

    /* Métodos ListasDesplegables */
    onDropdownChangeFrecuencia(event) {
        this.setState({ frecuencia: event.value });
    }
    onChangeBasic(e, id) {
        debugger;
        DataResultCumple[id] = e.value;
        this.setState({ reloadTextInput: true });
    }

    /* Método para generar HCC */
    generateHCC() {
        var result = {};
        this.state.products.map(function (value, index) {
            if (that.state.productName == value.nameProduct) {
                result = value;
            }
        });
        GenerateHCC(result.idProduct, this.state.lote, function (item) {
            console.log(item);
            that.setState({ hCC: item, pnlCabecera: '' })
        })
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
        GetAllProducts(function (items) {
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ products: items })
        });
    }
    render() {
        debugger;
        return (
            <div>
                <Button label='Guardar HCC' style={{
                    position: 'fixed',
                    width: 80,
                    height: 50,
                    bottom: 10,
                    backgroundColor: 'blue',
                    zIndex: 100,
                }} />
                <Card>
                    <div className='ui-g form-group ui-fluid'>
                        <div className='ui-g-6'>
                            <label htmlFor="float-input">Buscar Producto</label>
                            <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                            />
                        </div>
                        <div className='ui-g-3'>
                            <label htmlFor="float-input">Lote</label>
                            <InputText placeholder='Lote' keyfilter="int" onChange={(e) => this.setState({ lote: e.target.value })} value={this.state.lote} />
                        </div>
                        <div className='ui-g-3' style={{ marginTop: '23px' }}>
                            <Button label='Generar HCC' onClick={this.generateHCC} />
                        </div>

                    </div>
                </Card>
                <Card style={{ display: this.state.pnlCabecera }}>
                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                        <div className='ui-g-12' style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '0px' }}>
                            <h3>LABORATORIO DE INSPECCIÓN Y ENSAYO</h3>
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
                            <label htmlFor="float-input">FRECUENCIA</label>
                            <Dropdown options={periocidad} value={this.state.frecuencia} onChange={this.onDropdownChangeFrecuencia} autoWidth={false} placeholder="Selecione" />
                        </div>
                        <div className='ui-g-4'>
                            <label htmlFor="float-input">HCC</label>
                            <InputText placeholder='Codigo' />
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="ui-g ui-fluid car-item" style={{ justifyContent: 'center' }}>
                        <div className="ui-g-12 ui-md-3">
                            <strong>Propiedad</strong>
                        </div>
                        <div className="ui-g-12 ui-md-2">
                            <strong>Especificaciones</strong>
                        </div>
                        <div className="ui-g-12 ui-md-1">
                            <strong>Unidad</strong>
                        </div>
                        <div className="ui-g-12 ui-md-2 ui-fluid" style={{ textAlign: 'center' }}>
                            <strong>Resultado</strong>
                        </div>
                        <div className="ui-g-12 ui-md-3" style={{ textAlign: 'center' }}>
                            <strong>Cumple</strong>
                        </div>
                    </div>

                </Card>

                <DataList value={this.state.hCC.detail} itemTemplate={this.propertyTemplate.bind(this)} paginator={true} rows={70}></DataList>



            </div>


        )
    }
}
