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


//Data Test
import { CarService } from '../../service/CarService';

/* ===========  DATA CATALOGOS =========== */
import { tipoProducto } from '../../global/catalogs';
import { technicalProperty, viewProperty } from '../../global/properties';

/* ======  COMPONENTS ======== */
import { Caracteristicas } from './especificaciones';
/* ======  TRANSACTIONS ======== */
import { productSave } from '../../utils/TransactionsCalidad';

var DataCheck;
var DataCheck2 = [];
var that;
var componetesCheck = [];

export class Product extends Component {

    constructor() {
        super();
        this.state = {
            tipo: '',
            nombre: '',
            codigo: '',
            descripcion: '',
            filters: {},
            showModalProduct: false,
            showModalCaraterísticas: false,
            cars: [],
            checkboxValue: []
        };
        that = this;
        this.carservice = new CarService();
        this.onDropdownChangeTipoProducto = this.onDropdownChangeTipoProducto.bind(this);
        this.closeDialogProductoNuevo = this.closeDialogProductoNuevo.bind(this);
        this.saveProducto = this.saveProducto.bind(this);
        this.renderCheckBox = this.renderCheckBox.bind(this);
        this.onCheckboxChange = this.onCheckboxChange.bind(this);
    }

    componentDidMount() {
        this.carservice.getCarsSmall().then(data => this.setState({ cars: data }));
    }

    /* =============== FUNCIONES ============== */
    onDropdownChangeTipoProducto(event) {
        this.setState({ tipo: event.value });
    }

    closeDialogProductoNuevo() {
        this.setState({ showModalProduct: false, tipo: '', nombre: '', codigo: '', descripcion: '' });
    }




    saveProducto() {
        console.log(this.state.tipo + " " + this.state.nombre + " " + this.state.descripcion + " " + this.state.codigo);
        var newIten = { codigo: "", tipo: "", nombre: "", codigoSAP: "" };
        newIten.codigo = 5;
        newIten.tipo = this.state.tipo;
        newIten.nombre = this.state.nombre;
        newIten.codigoSAP = this.state.codigo;
        this.state.cars.push(newIten);
        this.setState({ showModalCaraterísticas: true })
        this.showListProperties('LAMINAS');
        var Producto = { typeProduct: this.state.tipo, nameProduct: this.state.nombre, sapCode: this.state.codigo, descProduct: this.state.descripcion };
        /*productSave(Producto, function(itemData){
            debugger;
            console.log(itemData);
        });*/
        this.closeDialogProductoNuevo();
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

    onCheckboxChange(event) {
        debugger;
        var selected = [...this.state.checkboxValue];
        if (event.checked)
            selected.push(event.value);
        else
            selected.splice(selected.indexOf(event.value), 1);

        this.setState({ checkboxValue: selected });

    }

    /* ============= FIN FUNCIONES ============ */

    render() {
        var header = <div style={{ 'textAlign': 'left' }}>
            <Toolbar>
                <div className="ui-toolbar-group-left">
                    <Button label="Nuevo" icon="fa-plus" onClick={() => this.setState({ showModalProduct: true })} />
                    <Button label="Editar" icon="fa-edit" onClick={() => this.setState({ showModalProduct: true })} />
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
                                    <DataTable value={this.state.cars} paginator={true} rows={5} header={header} globalFilter={this.state.globalFilter}>
                                        <Column field="codigo" header="Codigo" />
                                        <Column field="nombre" header="Nombre" />
                                        <Column field="tipo" header="Tipo" />
                                        <Column field="codigoSAP" header="Codigo SAP" />
                                    </DataTable>
                                </div>
                            </TabPanel>
                            <TabPanel header="Especificaciones" leftIcon="fa fa-book">
                                <div className='ui-g'>
                                <Card>
                                    <div className="ui-g">
                                        <div className="ui-g-12">Informción del producto</div>
                                        <div className="ui-g-4">Código</div>
                                        <div className="ui-g-8">{this.state.codigo}</div>
                                        <div className="ui-g-4">Nombre</div>
                                        <div className="ui-g-8">{this.state.nombre}</div>
                                        <div className="ui-g-12 ui-lg-4">ui-g-12 ui-lg-4</div>
                                    </div>
                                </Card>
                                <Caracteristicas/>
                                </div>
                            </TabPanel>
                            <TabPanel header="Consultar" leftIcon="fa-eye">
                                After a break of more than  15 years, director Francis Ford Coppola and writer Mario Puzo returned to the well for this third and final story of the fictional Corleone crime family. Two decades have passed, and crime kingpin Michael Corleone, now divorced from his wife Kay has nearly succeeded in keeping his promise that his family would one day be completely legitimate.
                            </TabPanel>
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
                                <label htmlFor="float-input">Codigo SAP</label>
                                <InputText type="text" onChange={(e) => this.setState({ codigo: e.target.value })} value={this.state.codigo} />
                            </span>
                        </div>
                        <div>
                            <span>
                                <label htmlFor="float-input">Nombre</label>
                                <InputText type="text" onChange={(e) => this.setState({ nombre: e.target.value })} value={this.state.nombre} />
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
                        <div className="ui-g-12" style={{ textAlign: 'center' }} >
                            <h3>Deseas añadir características al Nuevo Producto?</h3>
                        </div>
                        <div className="ui-g-12" >
                            <Card >
                                <div>Caracteríticas Técnicas</div>
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
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Ancho" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Deformación Remante por Tracción') > -1 ? true : false} />
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

                            <Card>
                                Características Visibles
                                <div className="ui-g">
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Defectos Visibles" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Defectos Visibles') > -1 ? true : false} />
                                        <label htmlFor="sf">Defectos Visibles</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Plegabilidad a Bajas Temperaturas" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Plegabilidad a Bajas Temperaturas') > -1 ? true : false} />
                                        <label htmlFor="sf">Plegabilidad a Bajas Temperaturas</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Flexibiidad" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Flexibiidad') > -1 ? true : false} />
                                        <label htmlFor="sf">Flexibiidad</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Estanquidad al Agua" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Estanquidad al Agua') > -1 ? true : false} />
                                        <label htmlFor="sf">Estanquidad al Agua</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Comportaminento Frente al Fuego" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Comportaminento Frente al Fuego') > -1 ? true : false} />
                                        <label htmlFor="sf">Comportaminento Frente al Fuego</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Reacción al Fuego" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Reacción al Fuego') > -1 ? true : false} />
                                        <label htmlFor="sf">Reacción al Fuego</label>
                                    </div><div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Propiedades Frente al Vapor del Agua" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Propiedades Frente al Vapor del Agua') > -1 ? true : false} />
                                        <label htmlFor="sf">Propiedades Frente al Vapor del Agua</label>
                                    </div><div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Resistencia a la Penetración Raices" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Resistencia a la Penetración Raices') > -1 ? true : false} />
                                        <label htmlFor="sf">Resistencia a la Penetración Raices</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Flexibilidad a Baja Temperaturas °C" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Flexibilidad a Baja Temperaturas °C') > -1 ? true : false} />
                                        <label htmlFor="sf">Flexibilidad a Baja Temperaturas °C</label>
                                    </div>
                                    <div className="ui-g-3">
                                        <Checkbox style={{ padding: '5px' }} id='sf' value="Comportamiento al Envejecimiento" onChange={this.onCheckboxChange} checked={this.state.checkboxValue.indexOf('Comportamiento al Envejecimiento') > -1 ? true : false} />
                                        <label htmlFor="sf">Comportamiento al Envejecimiento</label>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <div className="ui-g-12" style={{ textAlign: 'center' }} >
                            <div className="ui-g-3" style={{ alignItems: 'center' }}>
                                <Button label="Aceptar" icon="fa-close" className="success-btn" onClick={this.closeDialogProductoNuevo} />
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