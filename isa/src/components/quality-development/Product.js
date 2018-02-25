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
//import {Card} from 'primereact/components/card/Card';

//Data Test
import { CarService } from '../../service/CarService';
/* ======  DATA CATALOGOS ======== */
import { tipoProducto } from '../../global/catalogs';

/* ======  COMPONENTS ======== */
import { Caracteristicas } from './especificaciones';
/* ======  TRANSACTIONS ======== */
import { productSave } from '../../utils/TransactionsCalidad';



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
            cars: [],
        };
        this.carservice = new CarService();
        this.onDropdownChangeTipoProducto = this.onDropdownChangeTipoProducto.bind(this);
        this.closeDialogProductoNuevo = this.closeDialogProductoNuevo.bind(this);
        this.saveProducto = this.saveProducto.bind(this);
    }

    componentDidMount() {
        this.carservice.getCarsSmall().then(data => this.setState({ cars: data }));
    }

    /* ======== FUNCIONES ========== */
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
        var Producto={typeProduct: this.state.tipo, nameProduct:this.state.nombre, sapCode: this.state.codigo, descProduct:this.state.descripcion};
        productSave(Producto, function(itemData){
            debugger;
            console.log(itemData);
        });
        this.closeDialogProductoNuevo();
    }

    /* ====== FIN FUNCIONES */

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
                <Dialog header="Caraterísticas" visible={this.state.showModalCaraterísticas} width="600px" modal={true} onHide={() => this.setState({ showModalCaraterísticas: false })} style={{ background: '' }}>
                    <div className="ui-g form-group ui-fluid" >
                        <div className="ui-g-12" style={{textAlign:'center', fontWeight: '15'}} >
                            Deseas añadir características al Nuevo Producto?
                        </div>

                        <div className="ui-g-6" style={{alignItems:'center'}}>
                            <span >
                                <label htmlFor="float-input">Tipo</label>
                                <Button label="Si" icon="fa-close" className="danger-btn" onClick={this.closeDialogProductoNuevo} />
                                <Button label="No" icon="fa-close" className="danger-btn" onClick={this.closeDialogProductoNuevo} />
                            </span>
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}