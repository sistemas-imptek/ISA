import React, { Component } from 'react';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { SplitButton } from 'primereact/components/splitbutton/SplitButton';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import {InputTextarea} from 'primereact/components/inputtextarea/InputTextarea';
import {TabView, TabPanel} from 'primereact/components/tabview/TabView';
//import {Card} from 'primereact/components/card/Card';

//Data Test
import { CarService } from '../../service/CarService';
/* ======  DATA CATALOGOS ======== */
import {tipoProducto} from '../../global/catalogs';

export class Product extends Component {

    constructor() {
        super();
        this.state = {
            tipo:'',
            nombre:'',
            codigo:'',
            descripcion:'',
            filters: {},
            showModalProduct: false,
        };
        this.carservice = new CarService();
        this.onDropdownChangeTipoProducto= this.onDropdownChangeTipoProducto.bind(this);
        this.closeDialogProductoNuevo= this.closeDialogProductoNuevo.bind(this);
        this.saveProducto= this.saveProducto.bind(this);
    }

    componentDidMount() {
        this.carservice.getCarsSmall().then(data => this.setState({ cars: data }));
    }

    /* ======== FUNCIONES ========== */
    onDropdownChangeTipoProducto(event){
        this.setState({tipo:event.value});
    }

    closeDialogProductoNuevo(){
        this.setState({showModalProduct:false, tipo:'', nombre:'', codigo:'', descripcion:''});
    }

    saveProducto(){
        console.log(this.state.tipo +" "+ this.state.nombre+" "+ this.state.descripcion+ " "+this.state.codigo);
        this.closeDialogProductoNuevo();
    }

    /* ====== FIN FUNCIONES */

    render() {
        var header = <div style={{ 'textAlign': 'left' }}>
            <Toolbar>
                <div className="ui-toolbar-group-left">
                    <Button label="Nuevo" icon="fa-plus" onClick={() => this.setState({ showModalProduct: true })} />
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
                                        <Column field="vin" header="Vin" />
                                        <Column field="year" header="Year" />
                                        <Column field="brand" header="Brand" />
                                        <Column field="color" header="Color" />
                                    </DataTable>
                                </div>
                            </TabPanel>
                            <TabPanel header="Especificaciones" leftIcon="fa fa-book">
                            
                            </TabPanel>
                            <TabPanel header="Consultar" leftIcon="fa-eye">
                                After a break of more than  15 years, director Francis Ford Coppola and writer Mario Puzo returned to the well for this third and final story of the fictional Corleone crime family. Two decades have passed, and crime kingpin Michael Corleone, now divorced from his wife Kay has nearly succeeded in keeping his promise that his family would one day be completely legitimate.
                            </TabPanel>
                        </TabView>
                    </div>
                
                    
                </div>
                <Dialog header="Producto Nuevo" visible={this.state.showModalProduct} width="600px" modal={true} onHide={() => this.setState({ showModalProduct: false })} style={{background:''}}>
                    <div className="ui-g form-group ui-fluid">
                        <div className="ui-g-6">
                            <span className="ui-float-label">
                                <label htmlFor="float-input">Tipo</label>
                                <Dropdown options={tipoProducto} value={this.state.tipo} onChange={this.onDropdownChangeTipoProducto} autoWidth={false} placeholder="Selecione" />                               
                            </span>
                        </div>
                        <div className="ui-g-6">
                            <span className="ui-float-label">
                                <label htmlFor="float-input">Codigo SAP</label>
                                <InputText type="text" onChange={(e) => this.setState({ codigo: e.target.value })} value={this.state.codigo}/>                               
                            </span>
                        </div>
                        <div className="ui-g-12">
                            <span className="ui-float-label">
                                <label htmlFor="float-input">Nombre</label>
                                <InputText type="text" onChange={(e) => this.setState({ nombre: e.target.value })} value={this.state.nombre}/>                                
                            </span>
                        </div>
                        <div className="ui-g-12">
                            <span className="ui-float-label">
                                <label htmlFor="float-input">Descripción</label>
                                <InputTextarea rows={3} cols={30} autoResize={true} onChange={(e) => this.setState({ descripcion: e.target.value })} value={this.state.descripcion} />                        
                            </span>
                        </div>
                        <div className="ui-g-12">
                            <div className="ui-g-3"/>
                            <div className="ui-g-3"/>
                            <div className="ui-g-3">
                                <Button label="Aceptar" icon="fa-check" onClick={this.saveProducto}/>
                            </div>
                            <div className="ui-g-3">
                                <Button label="Cancelar" icon="fa-close" className="danger-btn" onClick={this.closeDialogProductoNuevo} />
                            </div>                            
                        </div>
                    </div>
                    
                </Dialog>
            </div>
        )
    }
}