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
import { Checkbox } from 'primereact/components/checkbox/Checkbox';
import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';


//Data Test
import { CarService } from '../../service/CarService';
import { data } from './data';

/* ===========  DATA CATALOGOS =========== */
import { tipoProducto, familiaProducto, unidadesMedida } from '../../global/catalogs';
import { technicalProperty, viewProperty } from '../../global/properties';

/* ======  T R A N S A C T I O N S ======== */
import { GetAllProducts, GetProductById, productSave, PropertyProductSave } from '../../utils/TransactionsCalidad';

var DataCheck;
var DataCheck2 = [];
var that;
var componetesCheck = [];
var DataInput = []; //Variable para almacenar los datos modificados.
var widgetProperty = [];// variable para guardar los componentes creados.
var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var productoEncontrado = undefined;

export class Product extends Component {

    constructor() {
        super();
        this.state = {
            tipo: '',
            nombre: '',
            codigo: '',
            familia: '',
            descripcion: '',
            filters: {},
            showModalProduct: false,
            showModalCaraterísticas: false,
            cars: [],
            checkboxValue: [],
            checkboxValueVC: [],
            statePanelInfProduc: 'none',
            unidad: '',
            productFinded: {},
            reloadTextInput: false,
        };
        that = this;
        this.carservice = new CarService();
        this.onDropdownChangeTipoProducto = this.onDropdownChangeTipoProducto.bind(this);
        this.onDropdownChangeFamiliaProducto = this.onDropdownChangeFamiliaProducto.bind(this);
        this.onDropdownChangeUnidad = this.onDropdownChangeUnidad.bind(this);
        this.closeDialogProductoNuevo = this.closeDialogProductoNuevo.bind(this);
        this.saveProducto = this.saveProducto.bind(this);
        this.renderCheckBox = this.renderCheckBox.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
        this.onCheckboxChangeVC = this.onCheckboxChangeVC.bind(this);
        this.buildForm = this.buildForm.bind(this);
        this.showPropertiesBBDD = this.showPropertiesBBDD.bind(this);
        this.searchProduct = this.searchProduct.bind(this);
        this.updatePropertyProduct = this.updatePropertyProduct.bind(this);
    }

    componentDidMount() {
        //this.carservice.getCarsSmall().then(data => this.setState({ cars: data }));
    }
    componentWillMount() {
        nameProducts=[];
        GetAllProducts(function (items) {
            debugger;
            items.map(function (value, index) {
                nameProducts.push(value.nameProduct);
            })
            that.setState({ cars: items })
            console.log(that.state.cars);
        });
    }

    /* =============== F U N C I O N E S ============== */
    onDropdownChangeTipoProducto(event) {
        this.setState({ tipo: event.value });
    }
    onDropdownChangeFamiliaProducto(event) {
        this.setState({ familia: event.value });
    }
    onDropdownChangeUnidad(e, id) {
        DataInput[id] = e.value;
        this.setState({ reloadTextInput: true })
    }

    closeDialogProductoNuevo() {
        this.setState({ showModalProduct: false, tipo: '', nombre: '', codigo: '', descripcion: '', familia: '' });
    }

    onCheckboxChange(event) {
        debugger;
        var selected = [...this.state.checkboxValue];
        if (event.checked)
            selected.push(event.value);
        else
            selected.splice(selected.indexOf(event.value), 1);

        this.setState({ checkboxValue: selected });
    }
    onCheckboxChangeVC(event) {
        debugger;
        var selected = [...this.state.checkboxValueVC];
        if (event.checked)
            selected.push(event.value);
        else
            selected.splice(selected.indexOf(event.value), 1);

        this.setState({ checkboxValueVC: selected });
    }
    /* Método que captura el valor de InputText */
    onWriting(e, id) {
        debugger;
        DataInput[id] = e.target.value;
        this.setState({ reloadTextInput: true });
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
        this.setState({ product: e.value, filteredProducts: null });
    }
    /* FIn Métodos  Auto Completado */

    /* Método para guardar un producto */
    saveProducto() {
        var newIten = { codigo: "", tipo: "", nombre: "", codigoSAP: "" };
        newIten.codigo = 5;
        newIten.tipo = this.state.tipo;
        newIten.nombre = this.state.nombre;
        newIten.codigoSAP = this.state.codigo;
        this.state.cars.push(newIten);
        this.setState({ showModalCaraterísticas: true })
        //this.showListProperties('LAMINAS');
        var Producto = { typeProduct: this.state.tipo, nameProduct: this.state.nombre, sapCode: this.state.codigo, descProduct: this.state.descripcion };
        productSave(Producto, function (itemData) {
            console.log(itemData);
        });
        this.closeDialogProductoNuevo();
    }
    /* Método para consultar Producto por ID */
    searchProduct() {
        var result = {};
        this.state.cars.map(function (value, index) {
            if (that.state.product == value.nameProduct) {
                result = value;
            }
        })
        GetProductById(result.idProduct, function (product) {
            console.log(product);
            that.buildForm(product);
            productoEncontrado = product;
            that.setState({ productFinded: product, statePanelInfProduc: '' });
        });
    }
    /* Método para modificar propiedades de un Producto  */
    updatePropertyProduct() {
        var productTMP = this.state.productFinded;
        Object.keys(DataInput).map(function (key1) {
            var res = key1.split('.');
            productTMP.propertyList.map(function (value, index) {
                if (value.idProperty === res[0]) {
                    switch (res[1]) {
                        case 'valueMin':
                            value.minProperty = DataInput[key1];
                            break;
                        case 'valueMax':
                            value.maxProperty = DataInput[key1];
                            break;
                        case 'unit':
                            value.unitProperty = DataInput[key1];
                            break;
                        default:
                            value.viewProperty=DataInput[key1];
                            break;
                    }
                }
            })
        })
        debugger;
        PropertyProductSave(productTMP, function(respuesta){
            debugger;
            
        });

    }

    /* Método para crear componentes  dinamicamente */
    showListProperties(familyType) {
        switch (familyType) {
            case 'LAMINAS':
                technicalProperty.map(function (value, index) {
                    debugger;
                    DataCheck2[value.name];
                    componetesCheck.push(that.renderCheckBox(value.name, value.name, value.name));
                })
                break;
        }
    }

    renderCheckBox(id, value, text) {
        DataCheck2[text] = false;
        return (
            <div id={id}>
                <Checkbox id={id} value={value} style={{ padding: '10px' }} ckecked={DataCheck2} />
                <label htmlFor="id">{text}</label>
            </div>
        )
    }

    renderProperty(id, namePorperty, valueMin, valueMax, unit, valueView, type) {
        switch (type) {
            case 'T':
                if (this.state.reloadTextInput != true) {
                    DataInput[id + ".valueMin"] = valueMin;
                    DataInput[id + ".valueMax"] = valueMax;
                    DataInput[id + ".unit"] = unit;
                }
                return (
                    <div className='ui-g-6'>
                        <Card>
                            <div className='ui-g ui-fluid'>
                                <div className='ui-g-12'>
                                    <strong>{namePorperty}</strong>
                                </div>
                                <div className='ui-g-4'>
                                    <label htmlFor="float-input">Valor Mínimo</label>
                                    <InputText id={'vmin' + id} type="text" onChange={(e) => this.onWriting(e, id + ".valueMin")} value={DataInput[id + ".valueMin"]} />
                                </div>
                                <div className='ui-g-4'>
                                    <label htmlFor="float-input">Valor Máximo</label>
                                    <InputText id={'vmax' + id} type="text" onChange={(e) => this.onWriting(e, id + ".valueMax")} value={DataInput[id + ".valueMax"]} />
                                </div>
                                <div className='ui-g-4'>
                                    <label htmlFor="float-input">Unidad</label>
                                    <Dropdown id={'u' + id} options={unidadesMedida} value={DataInput[id + '.unit']} onChange={(e) => this.onDropdownChangeUnidad(e, id + ".unit")} autoWidth={false} placeholder="Selecione" />
                                </div>
                            </div>
                        </Card>
                    </div>
                )
                break;
            case 'V':
                if (this.state.reloadTextInput != true) {
                    DataInput[id] = valueView;
                }
                return (
                    <div className='ui-g-6'>
                        <Card>
                            <div className='ui-g ui-fluid'>
                                <div className='ui-g-12'>
                                    <strong>{namePorperty}</strong>
                                </div>
                                <div className='ui-g-12'>
                                    <InputText id={id} type="text" onChange={(e) => this.onWriting(e, id)} value={DataInput[id]} />
                                </div>
                            </div>
                        </Card>
                    </div>
                )
                break;
        }


    }
    /* FUNCIÓN QUE PERMITE CREAR EL FORMULARIO EN BASE A CARACTERITICAS */
    buildForm(product) {
        debugger;
        console.log('ingreso')
        product.propertyList.map(function (value, index) {
            widgetProperty.push(that.renderProperty(value.idProperty, value.nameProperty, value.minProperty, value.maxProperty, value.unitProperty, value.viewProperty, value.typeProperty));
        })
    }
    /* FUNCIÓN QUE MUESTRA LAS PROPIEDADES INGRESADAS DE LA BBDD */
    showPropertiesBBDD() {
        debugger;
        var dataRecibe = data;
        dataRecibe.map(function (value, index) {
            widgetProperty.push(that.renderProperty(value.idProperty, value.nameProperty, value.minProperty, value.maxProperty, value.unitProperty));
        })
    }

    verData() {
        debugger
        GetAllProducts(function (items) {
            debugger;
        });
    }
    /* ============= FIN FUNCIONES ============ */

    render() {
        //this.showPropertiesBBDD();
        if (productoEncontrado !== undefined) {
            widgetProperty = [];
            this.buildForm(this.state.productFinded);
        }
        var header = <div style={{ 'textAlign': 'left' }}>
            <Toolbar>
                <div className="ui-toolbar-group-left">
                    {/* <Button label="Nuevo" icon="fa-plus" onClick={() => this.setState({ showModalProduct: true })} />
                    <Button label="Editar" icon="fa-edit" onClick={() => this.setState({ showModalProduct: true })} /> */}
                </div>
                <div className="ui-toolbar-group-right">
                    <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
                    <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="25" />
                </div>
            </Toolbar>
        </div>
        return (
            <div className="ui-g">
                <div className="ui-g-12">

                    <div className="card card-w-title">
                        <TabView>
                            <TabPanel header="Productos" leftIcon="fa fa-product-hunt">
                                <div className="">
                                    <DataTable value={this.state.cars} paginator={true} rows={15} header={header} globalFilter={this.state.globalFilter}>
                                        <Column field="idProduct" header="Codigo" style={{ width: '10%' }} />
                                        <Column field="nameProduct" header="Nombre" style={{ width: '40%' }} />
                                        <Column field="typeProduct" header="Tipo" style={{ width: '15%' }} />
                                        <Column field="itcdq" header="ITCDQ" style={{ width: '15%' }} />
                                        <Column field="sapCode" header="Codigo SAP" style={{ width: '15%' }} />
                                    </DataTable>
                                </div>
                            </TabPanel>
                            {/* <TabPanel header="Especificaciones" leftIcon="fa fa-book">
                                <div className='ui-g form-group ui-fluid' style={{ alignItems: 'center' }}>
                                    <div className='ui-g-8'>
                                        <div className="ui-inputgroup">
                                            <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                                suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.product}
                                                onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                            />
                                            <Button icon="fa-search" onClick={this.searchProduct} />
                                        </div>
                                    </div>
                                </div>
                                <Card style={{ display: this.state.statePanelInfProduc }}>
                                    <div className="ui-g">
                                        <div className='ui-g-9'>
                                            <div className="ui-g-12" style={{ color: '#1565c0' }}>INFORMACIÓN DEL PRODUCTO</div>
                                            <div className="ui-g-1" style={{ color: '#1565c0' }}>Código</div>
                                            <div className="ui-g-3" >{this.state.productFinded.idProduct}</div>
                                            <div className="ui-g-1" style={{ color: '#1565c0' }}>Familia</div>
                                            <div className="ui-g-3">{this.state.productFinded.familyProduct}</div>
                                            <div className="ui-g-1" style={{ color: '#1565c0' }}>Tipo</div>
                                            <div className="ui-g-3">{this.state.productFinded.typeProduct}</div>
                                            <div className="ui-g-4" style={{ color: '#1565c0' }}>Nombre</div>
                                            <div className="ui-g-8">{this.state.productFinded.nameProduct}</div>
                                        </div>
                                        <div className='ui-g-3' style={{ alignSelf: 'center', justifyContent: 'center' }}>
                                            <Button label='Propiedades' icon="fa fa-thermometer-three-quarters" onClick={() => this.setState({ showModalCaraterísticas: true })} />
                                        </div>
                                    </div>
                                </Card>
                                <Card style={{ display: this.state.statePanelInfProduc }}>
                                    <div className='ui-g'>
                                        {widgetProperty}
                                    </div>
                                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                        <div className='ui-g-4'>
                                            <Button label='Aceptar' icon="fa fa-check" onClick={this.updatePropertyProduct} />
                                        </div>
                                        <div className='ui-g-4'>
                                            <Button className="ui-button-danger" label='Cancelar' icon="fa fa-close" />
                                        </div>

                                    </div>

                                </Card>

                            </TabPanel> */}
                        </TabView>
                    </div>


                </div>
                <Dialog header="Producto Nuevo" visible={this.state.showModalProduct} width="600px" modal={true} onHide={() => this.setState({ showModalProduct: false })} style={{ background: '' }}>
                    <div className="ui-g form-group ui-fluid">
                        <div className="ui-g-6">
                            <span >
                                <label htmlFor="float-input">Tipo</label>
                                <Dropdown options={tipoProducto} value={this.state.tipo} onChange={this.onDropdownChangeTipoProducto} autoWidth={false} placeholder="Selecione" />
                            </span>
                        </div>
                        <div className="ui-g-6">
                            <span>
                                <label htmlFor="float-input">Familia</label>
                                <Dropdown options={familiaProducto} value={this.state.familia} onChange={this.onDropdownChangeFamiliaProducto} autoWidth={false} placeholder="Selecione" />
                            </span>
                        </div>
                        <div className="ui-g-6">
                            <span>
                                <label htmlFor="float-input">Nombre</label>
                                <InputText type="text" onChange={(e) => this.setState({ nombre: e.target.value })} value={this.state.nombre} />
                            </span>
                        </div>
                        <div className="ui-g-6">
                            <span>
                                <label htmlFor="float-input">Codigo SAP</label>
                                <InputText type="text" onChange={(e) => this.setState({ codigo: e.target.value })} value={this.state.codigo} />
                            </span>
                        </div>

                        <div className="ui-g-12">
                            <span >
                                <label htmlFor="float-input">Descripción</label>
                                <InputTextarea rows={3} cols={30} autoResize={true} onChange={(e) => this.setState({ descripcion: e.target.value })} value={this.state.descripcion} />
                            </span>
                        </div>
                        <div className="ui-g-12">
                            <div className="ui-g-3" />
                            <div className="ui-g-3" />
                            <div className="ui-g-3">
                                <Button label="Aceptar" icon="fa-check" onClick={this.saveProducto} />
                            </div>
                            <div className="ui-g-3">
                                <Button label="Cancelar" icon="fa-close" className="danger-btn" onClick={this.closeDialogProductoNuevo} />
                            </div>
                        </div>
                    </div>

                </Dialog >
                <Dialog header="Caraterísticas" visible={this.state.showModalCaraterísticas} width="85%" modal={true} onHide={() => this.setState({ showModalCaraterísticas: false })} style={{ background: '' }}>
                    <div className="ui-g form-group ui-fluid" >
                        <div className="ui-g-12" >
                            <TabView>
                                <TabPanel header="Técnicas" leftIcon="fa fa-thermometer-full">
                                    <Card >
                                        <div className="ui-g">
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Punto de Reblandecimiento" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Punto de Reblandecimiento') > -1 ? true : false} />
                                                <label htmlFor="sf">Punto de Reblandecimiento</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Penetración" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Penetración') > -1 ? true : false} />
                                                <label htmlFor="sf">Penetración</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Perdida por Calentamiento" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Perdida por Calentamiento') > -1 ? true : false} />
                                                <label htmlFor="sf">Perdida por Calentamiento</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Contenido de Cenizas" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Contenido de Cenizas') > -1 ? true : false} />
                                                <label htmlFor="sf">Contenido de Cenizas</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Densidad" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Densidad') > -1 ? true : false} />
                                                <label htmlFor="sf">Densidad</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Deformación Remante por Tracción" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Deformación Remante por Tracción') > -1 ? true : false} />
                                                <label htmlFor="sf">Deformación Remante por Tracción</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Rectitud" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Rectitud') > -1 ? true : false} />
                                                <label htmlFor="sf">Rectitud</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Ancho" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Ancho') > -1 ? true : false} />
                                                <label htmlFor="sf">Ancho</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Longitud" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Longitud') > -1 ? true : false} />
                                                <label htmlFor="sf">Longitud</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Espesor" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Espesor') > -1 ? true : false} />
                                                <label htmlFor="sf">Espesor</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Peso Rollo" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Peso Rollo') > -1 ? true : false} />
                                                <label htmlFor="sf">Peso Rollo</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Peso por Área" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Peso por Área') > -1 ? true : false} />
                                                <label htmlFor="sf">Peso por Área</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Perdida por calentamiento" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Perdida por calentamiento') > -1 ? true : false} />
                                                <label htmlFor="sf">Perdida por calentamiento</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia a la Fluencia a Elevadas Temperaturas" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia a la Fluencia a Elevadas Temperaturas') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia a la Fluencia a Elevadas Temperaturas</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Estabilidad Dimensional" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Estabilidad Dimensional') > -1 ? true : false} />
                                                <label htmlFor="sf">Estabilidad Dimensional</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia a Tracción Transversal" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia a Tracción Transversal') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia a Tracción Transversal</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia a Tracción Longitudinal" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia a Tracción Longitudinal') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia a Tracción Longitudinal</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Adhesividad" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Adhesividad') > -1 ? true : false} />
                                                <label htmlFor="sf">Adhesividad</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia Cizalla Longitudinal" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia Cizalla Longitudinal') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia Cizalla Longitudinal</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia Cizalla Transversal" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia Cizalla Transversal') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia Cizalla Transversal</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Sujeción de Gránulos" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Sujeción de Gránulos') > -1 ? true : false} />
                                                <label htmlFor="sf">Sujeción de Gránulos</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Alargamiento a la Rotura Longitudinal" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Alargamiento a la Rotura Longitudinal') > -1 ? true : false} />
                                                <label htmlFor="sf">Alargamiento a la Rotura Longitudinal</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Alargamiento a la Rotura Tranversal" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Alargamiento a la Rotura Tranversal') > -1 ? true : false} />
                                                <label htmlFor="sf">Adhesividad</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia al Pelado del Solape" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia al Pelado del Solape') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia al Pelado del Solape</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia al Impacto" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia al Impacto') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia al Impacto</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia al Desgarro(Clavo)" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia al Desgarro(Clavo)') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia al Desgarro(Clavo)</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Duplicidad" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Duplicidad') > -1 ? true : false} />
                                                <label htmlFor="sf">Duplicidad</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Punto de Inflamación" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Punto de Inflamación') > -1 ? true : false} />
                                                <label htmlFor="sf">Punto de Inflamación</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Viscocidad Dinámica 180°C" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Viscocidad Dinámica 180°C') > -1 ? true : false} />
                                                <label htmlFor="sf">Viscocidad Dinámica 180°C</label>
                                            </div>
                                        </div>
                                    </Card>
                                </TabPanel>
                                <TabPanel header="Visuales" leftIcon="fa fa-eye-slash">
                                    <Card>

                                        <div className="ui-g">
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Defectos Visibles" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Defectos Visibles') > -1 ? true : false} />
                                                <label htmlFor="sf">Defectos Visibles</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Plegabilidad a Bajas Temperaturas" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Plegabilidad a Bajas Temperaturas') > -1 ? true : false} />
                                                <label htmlFor="sf">Plegabilidad a Bajas Temperaturas</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Flexibiidad" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Flexibiidad') > -1 ? true : false} />
                                                <label htmlFor="sf">Flexibiidad</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Estanquidad al Agua" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Estanquidad al Agua') > -1 ? true : false} />
                                                <label htmlFor="sf">Estanquidad al Agua</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Comportaminento Frente al Fuego" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Comportaminento Frente al Fuego') > -1 ? true : false} />
                                                <label htmlFor="sf">Comportaminento Frente al Fuego</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Reacción al Fuego" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Reacción al Fuego') > -1 ? true : false} />
                                                <label htmlFor="sf">Reacción al Fuego</label>
                                            </div><div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Propiedades Frente al Vapor del Agua" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Propiedades Frente al Vapor del Agua') > -1 ? true : false} />
                                                <label htmlFor="sf">Propiedades Frente al Vapor del Agua</label>
                                            </div><div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia a la Penetración Raices" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Resistencia a la Penetración Raices') > -1 ? true : false} />
                                                <label htmlFor="sf">Resistencia a la Penetración Raices</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Flexibilidad a Baja Temperaturas °C" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Flexibilidad a Baja Temperaturas °C') > -1 ? true : false} />
                                                <label htmlFor="sf">Flexibilidad a Baja Temperaturas °C</label>
                                            </div>
                                            <div className="ui-g-3">
                                                <Checkbox style={{ padding: '5px' }} id='sf' value="Comportamiento al Envejecimiento" onChange={this.onCheckboxChangeVC} checked={this.state.checkboxValueVC.indexOf('Comportamiento al Envejecimiento') > -1 ? true : false} />
                                                <label htmlFor="sf">Comportamiento al Envejecimiento</label>
                                            </div>
                                        </div>
                                    </Card>
                                </TabPanel>

                            </TabView>



                        </div>

                        <div className="ui-g-12" style={{ textAlign: 'center' }} >
                            <div className="ui-g-3" style={{ alignItems: 'center' }}>
                                <Button label="Aceptar" icon="fa-close" className="success-btn" onClick={this.buildForm} />
                            </div>
                            <div className="ui-g-3" style={{ alignItems: 'center' }}>
                                <Button label="No" icon="fa-close" className="danger-btn" onClick={() => this.setState({ showModalCaraterísticas: false })} />
                            </div>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}