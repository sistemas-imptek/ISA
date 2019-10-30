import React, { Component } from 'react';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Growl } from 'primereact/components/growl/Growl';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { InputTextarea } from 'primereact/components/inputtextarea/InputTextarea';
import { ColumnGroup } from 'primereact/components/columngroup/ColumnGroup';
import { Row } from 'primereact/components/row/Row';
import { Card } from 'primereact/components/card/Card';

/* =============  DATA CATALOGOS ================ */
import { SaveExitMaterialHistory } from '../../../utils/TransactionsCalidad';

/* =============  DATA CATALOGOS ================ */
import { finaltSource, unidadesMedida } from '../../../global/catalogs';

/* ============= C O M P O N E N T S ============= */
import { ConcessionR, getDataConcessionRequest, setDataDefaultConcessionRequest } from './ConcessionRequest';
import { setDataCancelOutputMaterial, setDataAfterSaveExitMaterial } from '../Pnc';


var that;
export class ExitMaterial extends Component {
    constructor() {
        super();
        this.state = {
            finalSouce: null,
            descriptionfinalSource: null,
            comments: null,
            quantity: null,
            unit: null,
            listTask: [],
            displayDialog: false,
            task: null,
            selectedTask: null,
            selectedPnc: null,
            itemPNC: null,
            userLogin: null,

        };
        that = this;
        this.onDropdownChangeUnit = this.onDropdownChangeUnit.bind(this);
        this.onDropdownChangeFinaltSource = this.onDropdownChangeFinaltSource.bind(this);
        this.addNewTask = this.addNewTask.bind(this);
        this.updatePropertyTask = this.updatePropertyTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.onTaskSelect = this.onTaskSelect.bind(this);
        this.cancelOutputMaterial = this.cancelOutputMaterial.bind(this);
        this.saveExitMaterial = this.saveExitMaterial.bind(this);
        this.showMessage = this.showMessage.bind(this);
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

    /* Método para seleccionar la unidad Dropdown */
    onDropdownChangeUnit(event) {
        this.setState({ unit: event.value })
    }
    /* Método para seleccionar el destino del material Dropdown */
    onDropdownChangeFinaltSource(event) {
        this.setState({ finalSouce: event.value })
    }

    /*
    *  ============== INICIO FUNCION TABLE CRUD TAREAS Y CUMPLIMIENTO ==================  
    */
    saveTask() {
        let tasks = [...this.state.listTask];
        if (this.newTask)
            tasks.push(this.state.task);
        else
            tasks[this.findSelectedTaskIndex()] = this.state.task;

        this.setState({ listTask: tasks, selectedTask: null, task: null, displayDialog: false });
    }

    deleteTask() {
        let index = this.findSelectedTaskIndex();
        this.setState({
            listTask: this.state.listTask.filter((val, i) => i !== index),
            selectedTask: null,
            task: null,
            displayDialog: false
        });
    }

    findSelectedTaskIndex() {
        return this.state.listTask.indexOf(this.state.selectedTask);
    }

    updatePropertyTask(property, value) {
        let task = this.state.task;
        task[property] = value;
        this.setState({ task: task });
    }

    onTaskSelect(e) {
        this.newTask = false;
        this.setState({
            displayDialog: true,
            task: Object.assign({}, e.data)
        });
    }

    addNewTask() {
        this.newTask = true;
        this.setState({
            task: { descriptionTask: null, percentTask: null },
            displayDialog: true
        });
    }
    /* =============================== F I N ====================== */
    /* Cancela el registro de la salida del material */
    cancelOutputMaterial() {
        this.setState({ listTask: [] });
        setDataCancelOutputMaterial();
    }

    /* Metodo que Guarda el registro de la salida de material */
    saveExitMaterial() {
        try {
            debugger
            var emh = { quantity: null, description: null, ncpID: null, type: null, listTasks: [], concessionRequest: null, asUser: null, }
            emh.quantity = this.state.quantity;
            emh.description = this.state.comments;
            emh.ncpID = this.state.itemPNC.idNCP;
            emh.type = this.state.finalSouce;
            emh.asUser = this.state.userLogin.idUser;
            emh.listTasks = this.state.listTask;

            if (this.state.finalSouce == 'Solicitud de Concesión') {
                var concession = getDataConcessionRequest();
                emh.concessionRequest = concession;
            }

            SaveExitMaterialHistory(emh, function (data, status, msg) {
                console.log(data);
                switch (status) {
                    case 'OK':
                        setDataAfterSaveExitMaterial(data, status, msg);
                        setDataDefaultConcessionRequest();
                        that.showSuccess(msg);
                        that.setState({ finalSouce: null, quantity: null, itemPNC: null, unit: null, });
                        break;
                    case 'ERROR':
                        that.showError(msg);
                        break;
                }

            })
        } catch (e) {
            console.log(e);
        }
    }

    componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    }

    render() {
        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="Descripción" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="Cumplimiento" style={{ backgroundColor: '#bbdefb', width: '20%' }} />
            </Row>
        </ColumnGroup>
        let footerEA = <div className="ui-helper-clearfix" style={{ width: '3%' }} >
            <Button style={{ float: 'left' }} onClick={this.addNewTask}>
                <i className='fa fa-plus-circle'></i>
            </Button>
        </div>;
        let dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button className='ui-button-danger' icon="fa fa-trash" label="Eliminar" onClick={this.deleteTask} />
            <Button label="Aceptar" icon="fa-save" onClick={this.saveTask} />
        </div>;
        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <Card>
                    <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                        <div className='ui-g-12 ui-lg-8'>
                            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#337ab7' }}>REGISTRO SALIDA DE MATERIAL</span>
                        </div>
                        <div className='ui-g-12 ui-lg-12' style={{ textAlign: 'center', padding: '0px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>PRODUCTO:</span>
                            <span style={{ marginLeft: '3px', color: '#337ab7', fontWeight: 'bold', fontSize: '15px' }}>{this.state.itemPNC !== null ? this.state.itemPNC.product.nameProduct.toUpperCase() : null}</span>
                            <span style={{ marginLeft: '10px', fontSize: '15px', fontWeight: 'bold' }}>DISPONIBLE:</span>
                            <span style={{ marginLeft: '3px', color: '#337ab7', fontWeight: 'bold', fontSize: '15px' }}>{this.state.itemPNC !== null ? this.state.itemPNC.existingMaterial + this.state.itemPNC.unitNCP : null}</span>
                        </div>
                        <div className='ui-g-12 ui-lg-4'>
                            <label htmlFor="float-input">Cantidad</label>
                            <div className="ui-inputgroup">
                                <span className="ui-inputgroup-addon" style={{ background: '#337ab7', color: '#ffffff' }}>
                                    <i className="fa fa-balance-scale"></i>
                                </span>
                                <InputText placeholder='cantidad' keyfilter="num" onChange={(e) => this.setState({ quantity: e.target.value })} value={this.state.quantity} />
                                <Dropdown options={unidadesMedida} value={this.state.unit} onChange={this.onDropdownChangeUnit} autoWidth={false} placeholder="Seleccione UM" />
                            </div>
                        </div>
                        <div className='ui-g-12 ui-lg-4' style={{ justifyContent: 'left' }}>
                            <label htmlFor="float-input">Destino Final</label>
                            <Dropdown options={finaltSource} value={this.state.finalSouce} onChange={this.onDropdownChangeFinaltSource} autoWidth={false} placeholder="Selecione" />
                        </div>

                        <div className='ui-g-12 ui-lg-8' style={{ display: this.state.finalSouce == 'Solicitud de Concesión' ? '' : 'none' }}>
                            <ConcessionR />
                        </div>

                        <div className='ui-g-12 ui-lg-8' style={{ display: (this.state.finalSouce == 'Desecho') || (this.state.finalSouce == 'Donación') || (this.state.finalSouce == 'Solicitud de Concesión') || (this.state.finalSouce == null) ? 'none' : '' }}>
                            <span style={{ fontWeight: 'bold' }}>VERIFICACIÓN DE CALIDAD</span>
                            <DataTable value={this.state.listTask} headerColumnGroup={headerGroup} responsive={true} footer={footerEA}
                                selectionMode="single" selection={this.state.selectedTask} onSelectionChange={(e) => { this.setState({ selectedTask: e.data }); }}
                                onRowSelect={this.onTaskSelect} scrollable={true} scrollHeight="250px" >
                                <Column field="descriptionTask" sortable={true} />
                                <Column field="percentTask" sortable={true} style={{ width: '20%', textAlign: 'center' }} />
                            </DataTable>
                            <Dialog visible={this.state.displayDialog} header="Crear/Editar" modal={true} style={{ width: '200px' }} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}
                                style={{ background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)' }}>
                                {this.state.task && <div className="ui-grid ui-grid-responsive ui-fluid">
                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Cumplimiento</label></div>
                                        <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                            <InputText rows={4} cols={90} value={this.state.task.percentTask} onChange={(e) => { this.updatePropertyTask('percentTask', e.target.value) }} />
                                        </div>
                                    </div>
                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-2" style={{ padding: '4px 10px' }}><label htmlFor="accion">Descripción</label></div>
                                        <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                            <InputTextarea rows={4} cols={90} value={this.state.task.descriptionTask} onChange={(e) => { this.updatePropertyTask('descriptionTask', e.target.value) }} />
                                        </div>
                                    </div>
                                </div>}
                            </Dialog>
                        </div>
                        <div className='ui-g-12 ui-lg-8'>
                            <label htmlFor="float-input">Observaciones Adicionales</label>
                            <InputTextarea placeholder='Describa' rows='4' onChange={(e) => this.setState({ comments: e.target.value })} />
                        </div>
                        <div className='ui-g-12 ui-lg-8'>
                            <div className='ui-g-12 ui-lg-8' />
                            <div className='ui-g-12 ui-lg-2'>
                                <Button label='Aceptar' icon='fa fa-save' className='' onClick={() => this.saveExitMaterial()} />
                            </div>
                            <div className='ui-g-12 ui-lg-2'>
                                <Button label='Cancelar' icon='fa fa-close' className='danger-btn' onClick={() => this.cancelOutputMaterial()} />
                            </div>
                        </div>
                    </div>
                </Card>

            </div>
        )
    }
}

export function setDataOutputMaterial(itemPNCS) {
    if (itemPNCS !== null) {
        console.log(itemPNCS)

        that.setState({ itemPNC: itemPNCS, unit: itemPNCS.unitNCP });
    }
}