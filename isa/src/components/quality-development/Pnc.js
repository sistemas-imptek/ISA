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
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { TabView, TabPanel } from 'primereact/components/tabview/TabView';
import { ScrollPanel } from 'primereact/components/scrollpanel/ScrollPanel';


/* ====================  T R A N S A C T I O N S ======== */
import { GetAllProducts, GetCatalogsPNC, GetAllPncs, ClosedPNC, PNCSave } from '../../utils/TransactionsCalidad';

/* ============  D A T A    C A T A L O G O  S =============== */
import { procedencia, unidadesMedida, cincoMs } from '../../global/catalogs';

/* ====================  U T I L S  ======== */
import { formattedDate } from '../../utils/FormatDate';

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
            unitNCP: undefined,
            exitMaterial: 0,
            balanceMaterial: undefined,
            tasks: [],
            defect: undefined,
            defectDescription: undefined,
            defectPercent: undefined,
            fiveM: undefined,
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
            pncFiles: '',
            visibleFormPNC: false,
            idPNC: undefined,
            foundProduct: undefined,

        };
        that = this;
        this.onDropdownChangeOrigin = this.onDropdownChangeOrigin.bind(this);
        this.onDropdownChangeUnitNCP = this.onDropdownChangeUnitNCP.bind(this);
        this.onDropdownChangeArea = this.onDropdownChangeArea.bind(this);
        this.onDropdownChangeDefect = this.onDropdownChangeDefect.bind(this);
        this.onDropdownChangeOutMethod = this.onDropdownChangeOutMethod.bind(this);
        this.onDropdownChangeFiveM = this.onDropdownChangeFiveM.bind(this);
        this.addNew = this.addNew.bind(this);
        this.updateProperty = this.updateProperty.bind(this);
        this.save = this.save.bind(this);
        this.onTaskSelect = this.onTaskSelect.bind(this);
        this.findSelectedTaskIndex = this.findSelectedTaskIndex.bind(this);
        this.productFind = this.productFind.bind(this);
        this.convertDataToCatalogAreas = this.convertDataToCatalogAreas.bind(this);
        this.convertDataToCatalogDefects = this.convertDataToCatalogDefects.bind(this);
        this.convertDataToCatalogOutMethods = this.convertDataToCatalogOutMethods.bind(this);
        this.savePNC = this.savePNC.bind(this);
        this.setCNC = this.setCNC.bind(this);
        this.setExitMaterial = this.setExitMaterial.bind(this);
        this.actionTemplate = this.actionTemplate.bind(this);
        this.statusTemplate = this.statusTemplate.bind(this);
        this.editPNCFile = this.editPNCFile.bind(this);
        this.changeTab = this.changeTab.bind(this);
        this.onHideFormPNC = this.onHideFormPNC.bind(this);
        this.closePNC = this.closePNC.bind(this);
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
    onDropdownChangeDefect(event) {
        debugger
        if (event.value == 'Otro') {
            this.setState({ defect: event.value, viewOtherDefect: '' });
        } else {
            this.setState({ defect: event.value, viewOtherDefect: 'none' });
        }
    }
    onDropdownChangeOutMethod(event) {
        if (event.value == 'Otro') {
            this.setState({ outMethod: event.value, viewOtherOutMethod: '' });
        } else {
            this.setState({ outMethod: event.value, viewOtherOutMethod: 'none' });
        }
    }
    onDropdownChangeFiveM(event) {
        if (event.value == 'Otro') {
            this.setState({ fiveM: event.value, viewOtherFiveM: '' });
        } else {
            this.setState({ fiveM: event.value, viewOtherFiveM: 'none' });
        }
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

    /* Metodos Tareas */
    save() {
        if (this.newCar) {
            this.state.tasks.push(this.state.task);
            this.showSuccess('Tarea Registrada');
        }
        else {
            this.state.tasks[this.findSelectedTaskIndex()] = this.state.task;
            this.showSuccess('Tarea Actualizada');
        }

        this.setState({ selectedTask: null, task: null, displayDialog: false });
    }
    findSelectedTaskIndex() {
        return this.state.tasks.indexOf(this.state.selectedTask);
    }
    updateProperty(property, value) {
        let task = this.state.task;
        task[property] = value;
        this.setState({ task: task });
    }
    onTaskSelect(e) {
        this.newCar = false;
        this.setState({
            displayDialog: true,
            task: Object.assign({}, e.data)
        });
    }

    addNew() {
        this.newCar = true;
        this.setState({
            task: { descriptionTask: '', percentTask: '' },
            displayDialog: true
        });
    }
    /* Fin Metodos Tareas */
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
        data.map(function (value) {
            let newData = { label: '', value: '' }
            newData.label = value.nameArea;
            newData.value = value.idArea;
            areas.push(newData);
        })
    }
    convertDataToCatalogDefects(data) {
        data.map(function (value, index) {
            let newData = { label: '', value: '' }
            newData.label = value.desciption;
            newData.value = value.idDefect;
            defects.push(newData);
            if (data.length - 1 == index) {
                newData.label = 'Otro';
                newData.value = 'Otro';
            }
        })
    }
    convertDataToCatalogOutMethods(data) {
        data.map(function (value, index) {
            let newData = { label: '', value: '' }
            newData.label = value.descrption;
            newData.value = value.idOM;
            outMethods.push(newData);
            if (data.length - 1 == index) {
                newData.label = 'Otro';
                newData.value = 'Otro';
            }
        })
    }
    /* Metodo para calculos */
    setCNC(e) {
        debugger;
        let calc = e.target.value - this.state.exitMaterial;
        this.setState({ amountNonConforming: e.target.value, balanceMaterial: calc })
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
    /* FIN Metodos Mensajes Mostrar */
    /* Metodo para guardar el PNC */
    savePNC() {
        debugger;
        var pncNew = {};
        pncNew.aditionalRemarks = this.state.aditionalRemarks;
        pncNew.amountNonConforming = this.state.amountNonConforming;
        pncNew.amountProduced = this.state.amountProduced;
        pncNew.balanceMaterial = this.state.balanceMaterial;
        pncNew.batch = this.state.batch;
        pncNew.dateDetection = formattedDate(this.state.detectionnDate);
        pncNew.dateProduction = formattedDate(this.state.productionDate);
        pncNew.defect = { idDefect: this.state.defect };
        pncNew.exitMaterial = this.state.exitMaterial;
        pncNew.finalDestination = this.state.finalDestination;
        pncNew.fiveM = this.state.fiveM;
        pncNew.hccFreeUse = this.state.hccFreeUse;
        pncNew.orderProduction = this.state.orderProduction;
        pncNew.outputMethod = { idOM: this.state.outMethod };
        pncNew.product = { idProduct: this.state.foundProduct.idProduct };
        pncNew.tasks = this.state.tasks;
        pncNew.area = { idArea: this.state.area };
        pncNew.source = this.state.source;
        pncNew.unitNCP = this.state.unitNCP;

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
            {rowData.close ? 'Cerrado' : 'Abierto'}
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
            tasks: [],
            aditionalRemarks: ''
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
                        that.setState({ pncFiles: items })
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
            that.setState({ pncFiles: items })
        })
        GetCatalogsPNC(function (catalogo) {
            console.log(catalogo);
            that.convertDataToCatalogAreas(catalogo.areas);
            that.convertDataToCatalogDefects(catalogo.defects);
            that.convertDataToCatalogOutMethods(catalogo.outMethods);
        })
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
        let dialogFooter = <div className="ui-dialog-buttonpane ui-helper-clearfix">
            <Button className='ui-button-danger' icon="fa fa-trash" label="Eliminar" onClick={this.delete} />
            <Button className='ui-button-success' label="Guardar" icon="fa-save" onClick={this.save} />
        </div>;
        var header = <div style={{ 'textAlign': 'right ' }}>
            <i className="fa fa-search" style={{ margin: '4px 4px 0 0' }}></i>
            <InputText type="search" onInput={(e) => this.setState({ globalFilter: e.target.value })} placeholder="Buscar" size="35" />
        </div>
        let footerDialog = <div>
            <Button className='ui-button-success' label="Aceptar" icon="fa-check" onclick={() => this.PNCSave} />
            <Button className='ui-button-danger' label="Cancelar" icon="fa-close" onClick={this.onHideFormPNC} />
            <Button label="Cerrar PNC" icon="fa-times-circle" onClick={this.closePNC} />
        </div>;

        var formPNC = <div>
            <Card style={{ display: this.state.viewForm }}>
                <div className='ui-g form-group ui-fluid'>
                    <div className='ui-g-12 ui-lg-12' style={{
                        justifyContent: 'center', textAlign: 'center', paddingTop: '0px', background: 'linear-gradient(to bottom, #e3f2fd, #f1f8e9)',
                        borderTopColor: '#337ab7', borderLeftColor: '#337ab7', borderRightColor: '#337ab7', borderRadius: 5, borderStyle: 'solid', borderBottomColor: '#d4e157'
                    }}>
                        <br /><span style={{ fontSize: '20px', fontWeight: 'bold' }}>FORMATO DEL REGISTRO</span><br />
                        <span style={{ fontWeight: 'inherit' }}>Referencia: MP-PNC.01</span><br />
                        <span style={{ fontWeight: 'lighter' }}>Tratamiento Del Producto No Conforme</span><br />
                        <span style={{ color: '#457fca', fontSize: '20px', marginBottom: '0px' }}>{this.state.productName}</span>

                    </div>
                    <div className='ui-g-12 ui-lg-12' style={{ borderColor: '#337ab7', borderRadius: '8px', borderStyle: 'solid' }}>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Fecha De Producción</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.productionDate} locale={es} showIcon="true" onChange={(e) => this.setState({ productionDate: e.value })}></Calendar>
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Fecha De Detección</label>
                            <Calendar dateFormat="yy/mm/dd" value={this.state.detectionnDate} locale={es} showIcon="true" onChange={(e) => this.setState({ detectionnDate: e.value })}></Calendar>
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Lote</label>
                            <InputText placeholder='lote' onChange={(e) => this.setState({ batch: e.target.value })} value={this.state.batch} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Orden de Producción</label>
                            <InputText placeholder='orden' onChange={(e) => this.setState({ orderProduction: e.target.value })} value={this.state.orderProduction} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">HCC Traspaso Libre Utilización</label>
                            <InputText placeholder='codigo' onChange={(e) => this.setState({ hccFreeUse: e.target.value })} value={this.state.hccFreeUse} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Procedencia</label>
                            <Dropdown options={procedencia} value={this.state.source} onChange={this.onDropdownChangeOrigin} autoWidth={false} placeholder="Selecione" />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Cantidad Producida</label>
                            <InputText placeholder='cantidad' keyfilter="money" onChange={(e) => this.setState({ amountProduced: e.target.value })} value={this.state.amountProduced} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Cantidad No Conforme</label>
                            <InputText placeholder='cantidad' keyfilter="money" onChange={(e) => this.setCNC(e)} value={this.state.amountNonConforming} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Unidad</label>
                            <Dropdown options={unidadesMedida} value={this.state.unitNCP} onChange={this.onDropdownChangeUnitNCP} autoWidth={false} placeholder="Selecione" />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Salida de Material</label>
                            <InputText placeholder='cantidad' keyfilter="money" onChange={(e) => this.setExitMaterial(e)} value={this.state.exitMaterial} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Saldo de Material</label>
                            <InputText className={this.state.validationTextBalancedMaterial} style={{ background: this.state.vaidationFontTextBalanceMaerial }} disabled={true} keyfilter="money" onChange={(e) => this.setState({ balanceMaterial: e.target.value })} value={this.state.balanceMaterial} />
                        </div>
                        <div className='ui-g-12 ui-lg-2'>
                            <label htmlFor="float-input">Área</label>
                            <Dropdown options={areas} value={this.state.area} onChange={this.onDropdownChangeArea} autoWidth={false} placeholder="Selecione" />
                        </div>

                        <div className='ui-g-12 ui-lg-6'>
                            <label htmlFor="float-input">Defectos</label>
                            {/* <Dropdown options={defects} value={this.state.defect} onChange={this.onDropdownChangeDefect} autoWidth={false} placeholder="Selecione" /> */}
                            <InputTextarea rows={3} value={this.state.defect} onChange={(e) => this.setState({ defect: e.target.value })} />
                            <div className='ui-g-8' style={{ display: this.state.viewOtherDefect }}>
                                <div style={{ marginTop: '10px' }}>
                                    <label htmlFor="float-input">Describa</label>
                                    <InputText placeholder='describa' onChange={(e) => this.setState({ defectDescription: e.target.value })} value={this.state.defectDescription} />
                                </div>
                            </div>
                            <div className='ui-g-4' style={{ marginTop: '10px', display: this.state.viewOtherDefect }}>
                                <label htmlFor="float-input">Porcentaje</label>
                                <div className="ui-inputgroup">
                                    <InputText placeholder='valor numérico' onChange={(e) => this.setState({ defectPercent: e.target.value })} value={this.state.defectPercent} />
                                    <span className="ui-inputgroup-addon">%</span>
                                </div>
                            </div>
                        </div>
                        <div className='ui-g-12 ui-lg-6'>
                            <label htmlFor="float-input">Observaciones</label>
                            <Dropdown options={cincoMs} value={this.state.fiveM} onChange={this.onDropdownChangeFiveM} autoWidth={false} placeholder="Selecione" />
                            <div style={{ marginTop: '10px', display: this.state.viewOtherFiveM }}>
                                <label htmlFor="float-input">Describa</label>
                                <InputText placeholder='describa' onChange={(e) => this.setState({ fiveMDescription: e.target.value })} value={this.state.fiveMDescription} />
                            </div>
                        </div>
                        <div className='ui-g-12 ui-lg-6'>
                            <label htmlFor="float-input">Destino Final</label>
                            <Dropdown options={outMethods} value={this.state.outMethod} onChange={this.onDropdownChangeOutMethod} autoWidth={false} placeholder="Selecione" />
                            <div style={{ marginTop: '10px', display: this.state.viewOtherOutMethod }}>
                                <label htmlFor="float-input">Describa</label>
                                <InputText placeholder='describa' onChange={(e) => this.setState({ otherOutMethod: e.target.value })} value={this.state.otherOutMethod} />
                            </div>
                        </div>
                        <div className='ui-g-12 ui-lg-6'>
                            <label htmlFor="float-input">Descripción del destino del material</label>
                            <InputTextarea rows={7} value={this.state.finalDestination} onChange={(e) => this.setState({ finalDestination: e.target.value })} />
                        </div>
                        <div className='ui-g-12 ui-lg-6'>
                            {/* <h3>Verificación de Calidad</h3> */}
                            <label htmlFor="float-input">Verificación de Calidad</label>
                            <DataTable value={this.state.tasks} footer={footer}
                                selectionMode="single" selection={this.state.selectedTask} onSelectionChange={(e) => { this.setState({ selectedTask: e.data }); }}
                                onRowSelect={this.onTaskSelect}>
                                <Column field="descriptionTask" header="Tarea" sortable={true} />
                                <Column field="percentTask" header="Cumplimento (%)" sortable={true} style={{ width: '20%', textAlign: 'center' }} />
                            </DataTable>

                        </div>
                        <Dialog visible={this.state.displayDialog} header="Nueva Tarea" modal={false} style={{ width: '40%' }} footer={dialogFooter} onHide={() => this.setState({ displayDialog: false })}>
                            {this.state.task && <div className="ui-grid ui-grid-responsive ui-fluid">
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label htmlFor="tarea">Tarea</label></div>
                                    <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                                        <InputTextarea rows={5} value={this.state.task.descriptionTask} onChange={(e) => { this.updateProperty('descriptionTask', e.target.value) }} />
                                    </div>
                                </div>
                                <div className="ui-grid-row">
                                    <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label htmlFor="year">Cumplimiento</label></div>
                                    <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                                        <div className="ui-inputgroup">
                                            <InputText onChange={(e) => { this.updateProperty('percentTask', e.target.value) }} value={this.state.task.percentTask} />
                                            <span className="ui-inputgroup-addon">%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </Dialog>
                        <div className='ui-g-12 ui-lg-6'>
                            <label htmlFor="float-input">Observaciones Adicionales</label>
                            <InputTextarea rows={8} value={this.state.aditionalRemarks} onChange={(e) => this.setState({ aditionalRemarks: e.target.value })} />
                        </div>
                    </div>

                    <div className='ui-g-12'>

                    </div>
                    <div className='ui-g-12'>

                    </div>
                    <div className='ui-g-12'>

                    </div>
                </div>
            </Card>
        </div>

        return (
            <div>
                <Growl ref={(el) => this.growl = el} />
                <Button label='Guardar' icon='fa fa-save' onClick={this.savePNC} style={{
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
                }} />
                <TabView style={{ marginBottom: '10px' }} selected={1}>
                    <TabPanel header="Consultar PNC" leftIcon="fas fa-search" onTabChange={this.changeTab} activeIndex={0} >
                        <DataTable value={this.state.pncFiles} paginator={true} rows={15} header={header} globalFilter={this.state.globalFilter}>
                            <Column field="idNCP" header="PNC" style={{ width: '10%' }} />
                            <Column field="batch" header="Lote" style={{ width: '10%' }} />
                            <Column field="product.nameProduct" header="Producto" style={{ width: '30%' }} />
                            <Column field="dateProduction" header="Fecha Producción" style={{ width: '10%' }} />
                            <Column field="dateDetection" header="Fecha Detección" style={{ width: '10%' }} />
                            <Column body={this.statusTemplate} header="Estado" style={{ width: '10%' }} />
                            <Column body={this.actionTemplate} style={{ width: '10%' }} />
                        </DataTable>
                    </TabPanel>

                    <TabPanel header="PNC" leftIcon="fas fa-file" onTabChange={this.changeTab} activeIndex={1}  >
                        <Card style={{ backgroundColor: '#d4e157' }}>
                            <div className='ui-g form-group ui-fluid' style={{ justifyContent: 'center' }}>
                                <div className='ui-g-4'>
                                    <label htmlFor="float-input">Buscar Producto</label>
                                    <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                        suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                        onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                                    />
                                </div>
                                <div className='ui-g-2' style={{ marginTop: '23px' }}>
                                    <Button label='Aceptar' onClick={this.productFind} />
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
        )
    }
}