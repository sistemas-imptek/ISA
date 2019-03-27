import React, { Component } from 'react';
import { InputText } from 'primereact/components/inputtext/InputText';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { Calendar } from 'primereact/components/calendar/Calendar';
import { Column } from 'primereact/components/column/Column';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { ColumnGroup } from 'primereact/components/columngroup/ColumnGroup';
import { Row } from 'primereact/components/row/Row';

/* ============  D A T A    C A T A L O G O  S =============== */
import { testList, desicionCMB } from '../../../global/catalogs';

/* ====================  U T I L S  ======== */
import { formattedDate, formattedDateAndHour, formattedHour, formattedStringtoDate } from '../../../utils/FormatDate';

/* ====================  T R A N S A C T I O N S ======== */
import { SaveTest } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getPropertyInformation, setnewTest } from '../TestResuts';

var that;
export class AWeightForm extends Component {
    constructor() {
        super();
        this.state = {
            testPesoAreaData: [
                { item: 1, idProperty: '', dateLog: null, timeLog: '', batchTest: '', m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null, prommissing: '', min: null, max: null },
                { item: 2, idProperty: '', dateLog: null, timeLog: '', batchTest: '', m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null, prommissing: '', min: null, max: null },
                { item: 3, idProperty: '', dateLog: null, timeLog: '', batchTest: '', m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null, prommissing: '', min: null, max: null },

            ],
            dataProperty: undefined,
            userLogin: undefined,
            visibleModalP: false
        }
        that = this;
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.dateEditor = this.dateEditor.bind(this);
        this.batchEditor = this.batchEditor.bind(this);
        this.m1Ini = this.m1Ini.bind(this);
        this.m2Ini = this.m2Ini.bind(this);
        this.m3Ini = this.m3Ini.bind(this);
        this.averagEditor = this.averagEditor.bind(this);
        this.observationEditor = this.observationEditor.bind(this);
        this.colorTemplate = this.colorTemplate.bind(this);
        this.addLineData = this.addLineData.bind(this);
        this.saveData = this.saveData.bind(this);
        this.dataTratamient = this.dataTratamient.bind(this);
        this.onShowModalTest = this.onShowModalTest.bind(this);
        this.onHideModalTest = this.onHideModalTest.bind(this);
        this.setFieldsNewTest = this.setFieldsNewTest.bind(this);
    }


    /* ========================   Metodos tabla editable ===========================*/
    /* Metodo paara cambiar el valor de la dataTable */
    onEditorValueChange(props, value) {
        debugger
        let updatedTestData = this.state.testPesoAreaData;
        updatedTestData[props.rowIndex][props.field] = value;
        this.setState({ testPesoAreaData: updatedTestData });
    }
    /* Metodo para renderizar el componente Calendar junto a la Hora */
    inputDateEditor(props, field) {
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        return <Calendar id={props.rowIndex} dateFormat="yy/mm/dd" value={this.state.testPesoAreaData[props.rowIndex][field]} locale={es} showTime={true} onChange={(e) => this.onEditorValueChange(props, e.value)} />
    }
    /* Metodo para ver el valor en la celda de la tabla Calendar y Hora */
    renderDate = (value, column) => {
        var dateAux = formattedDateAndHour(value[column.field]);
        return (
            value[column.field] instanceof Date && dateAux
        );
    };

    /* Metodo que renderiza el objeto Input */
    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }
    /* Metodo para renderizar listas despleglables */
    inputDropDownEditor(props, field) {
        return <Dropdown value={this.state.testPesoAreaData[props.rowIndex][field]} options={desicionCMB}
            onChange={(e) => this.onEditorValueChange(props, e.value)} style={{ width: '100%' }} />

    }


    /* Metodos para editar cada uno de los campos de la tabla */
    dateEditor(props) {
        return this.inputDateEditor(props, 'dateLog');
    }
    batchEditor(props) {
        return this.inputTextEditor(props, 'batchTest');
    }
    m1Ini(props) {
        return this.inputTextEditor(props, 'm1Ini');
    }
    m2Ini(props) {
        return this.inputTextEditor(props, 'm2Ini');
    }
    m3Ini(props) {
        return this.inputTextEditor(props, 'm3Ini');
    }
    observationEditor(props) {
        return this.inputTextEditor(props, 'comment');
    }
    averagEditor(props) {
        return this.inputDropDownEditor(props, 'prommissing');
    }
    colorTemplate = (value, column) => {
        debugger;
        var m1 = 0;
        var m2 = 0;
        var m3 = 0;
        var prom = null;
        var count = 0;
        if (value.m1Ini !== null) {
            m1 = parseFloat(value.m1Ini);
            count = count + 1;
        }

        if (value.m2Ini !== null) {
            m2 = parseFloat(value.m2Ini);
            count = count + 1;
        }

        if (value.m3Ini !== null) {
            m3 = parseFloat(value.m3Ini);
            count = count + 1;
        }
        if (count !== 0)
            prom = ((m1 + m2 + m3) / count).toFixed(2);

        this.state.testPesoAreaData[column.rowIndex][column.field] = prom;



        if ((prom != null) & (prom != '') & (prom !== NaN)) {
            if ((prom <= this.state.dataProperty.propertyMax) & (prom >= this.state.dataProperty.propertyMin))
                return <span>{value[column.field]}</span>;
            else
                return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px' }}>{prom}</div>
        } else {
            return null;
        }

    }

    /* Método para Mostrar mensajes de Información */
    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        let msg = { severity: 'success', summary: 'éxito', detail: message };
        this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
    }

    /* Metodo para aumentar un registro a la Data */
    addLineData() {
        var index = this.state.testPesoAreaData.length + 1;
        var dataTMP = this.state.testPesoAreaData;
        var registerNew = { item: index, idProperty: '', dateLog: null, timeLog: '', batchTest: '', m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null, prommissing: '', min: this.state.dataProperty.propertyMin, max: this.state.dataProperty.propertyMax }
        dataTMP.push(registerNew);
        this.setState({ testPesoAreaData: dataTMP });
    }
    /* Metodos para ver/ocultar PopUp  */
    onShowModalTest(event) {
        this.setState({ visibleModalP: true });
    }

    onHideModalTest(event) {
        this.setState({ visibleModalP: false });
    }

    /* Metodo para guardar la Data */
    saveData() {
        debugger
        var capturedData = this.state.testPesoAreaData;
        var property = this.state.dataProperty;
        var Test = [];
        this.setState({ visibleModalP: false });
        capturedData.forEach(function (obj) {
            if ((obj.resultTest) !== null) {
                delete obj.item;
                obj.idProperty = property.propertyId;
                obj.dateLog = formattedDateAndHour(obj.dateLog);
                obj.sapCode = property.productsapCode;
                obj.productName = property.productName;
                obj.idProduct = property.productId;
                if ((parseFloat(obj.resultTest) >= property.propertyMin) & (parseFloat(obj.resultTest) <= property.propertyMax))
                    obj.passTest = true;
                else
                    obj.passTest = false;
                obj.owner = that.state.userLogin.idUser;
                if (obj.prommissing == 'Si')
                    obj.prommissing = true;
                else
                    obj.prommissing = false;

                Test.push(obj);
            }

        })
        if (Test.length != 0) {
            SaveTest(Test, function (data, status, msg) {
                that.dataTratamient(data);
                switch (status) {
                    case 'OK':
                        that.showSuccess(msg);
                        that.setState({ testPesoAreaData: data })
                        break;
                    case 'ERROR':
                        that.showError(msg);
                        break;
                    case 'INFO':
                        that.showError(msg);
                        break;
                    default:
                        break;
                }
            })
        } else {
            this.showError('Favor ingresar la información del formulario respectiva');
        }

    }
    /* Metodo para transformar la data y poder visulizarla */
    dataTratamient(dataTest) {
        if (dataTest != null) {
            return dataTest.map(function (obj, index) {
                obj.dateLog = formattedStringtoDate(obj.dateLog);
                if (obj.prommissing == true)
                    obj.prommissing = 'Si'
                else
                    obj.prommissing = 'No'
                obj.item = index + 1;
                console.log(obj.dateLog);
            })
        }
    }



    /* Metodo para realizar nuevo ensayo */
    setFieldsNewTest() {
        setnewTest();
    }

    componentWillMount() {
        var pp = getPropertyInformation();
        var addMinMax = this.state.testPesoAreaData.map(function (o) {
            o.min = pp.propertyMin;
            o.max = pp.propertyMax;

        })
        this.setState({ dataProperty: getPropertyInformation() })
    }
    componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    }

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="fa-check" className="ui-button-primary" onClick={() => this.saveData()} />
                <Button label="Cancelar" icon="fa-close" onClick={() => this.setState({ visibleModalP: false })} className="ui-button-danger" />
            </div>
        );
        let headerGroup = <ColumnGroup>
            <Row>
                <Column header="" rowSpan={2} style={{ width: '2%' }} />
                <Column header="Fecha" rowSpan={2} />
                <Column header="Lote" rowSpan={2} />
                <Column header="Medición (KG/M2)" colSpan={4} style={{ width: '40%' }} />
                <Column header="Especificación (KG/M2)" colSpan={2} style={{ width: '10%' }} />
                <Column header="Promediar" rowSpan={2} />
            </Row>
            <Row>
                <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="M3" style={{ backgroundColor: '#bbdefb' }} />
                <Column header="Promedio" />
                <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />

            </Row>
        </ColumnGroup>;
        return (
            <div className="ui-g">
                <Growl ref={(el) => this.growl = el} />
                <div className="ui-g-12">
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginTop: '2%', marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold'  }}>BITÁCORA DE CONTROL PESO POR ÁREA </h3>
                    </div>
                    <Toolbar>
                        <div className="ui-toolbar-group-right">
                            <Button label="Nuevo Item" icon="fa-plus" onClick={this.addLineData} />
                            <Button label="Nuevo Ensayo" icon="fa-flask" className="ui-button-warning" onClick={() => this.setFieldsNewTest()} />
                            <Button label="Guardar" icon="fa-save" className="ui-button-success" onClick={() => this.onShowModalTest()} />
                        </div>
                    </Toolbar>
                    <DataTable value={this.state.testPesoAreaData} editable={true} headerColumnGroup={headerGroup}>
                        <Column field='item' />
                        <Column field="dateLog" editor={this.dateEditor} body={this.renderDate} style={{ height: '3.5em' }} />
                        <Column field="batchTest" editor={this.batchEditor} style={{ height: '3.5em' }} />
                        <Column field="m1Ini" editor={this.m1Ini} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} />
                        <Column field="m2Ini" editor={this.m2Ini} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} />
                        <Column field="m3Ini" editor={this.m3Ini} style={{ height: '3.5em', backgroundColor: '#bbdefb' }} />
                        <Column field="resultTest" style={{ height: '3.5em' }} body={this.colorTemplate} />
                        <Column field="min" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="max" style={{ height: '3.5em', width: '3%', backgroundColor: '#dcedc8' }} />
                        <Column field="prommissing" editor={this.averagEditor} style={{ height: '3.5em' }} />
                    </DataTable>
                </div>
                <Dialog header="Confirmación" visible={this.state.visibleModalP} style={{ width: '30vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalP: false })}>
                    Desea guardar/salvar la información ingresada ?
                </Dialog>
            </div>
        )
    }
}