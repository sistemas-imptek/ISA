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
import { Row } from 'primereact/components/row/Row';
import { ColumnGroup } from 'primereact/components/columngroup/ColumnGroup';
import { DataList } from 'primereact/components/datalist/DataList';
import { TabView, TabPanel } from 'primereact/components/tabview/TabView';
import { ToggleButton } from 'primereact/components/togglebutton/ToggleButton';
import { Card } from 'primereact/components/card/Card';
import { RadioButton } from 'primereact/components/radiobutton/RadioButton';

/* ============  D A T A    C A T A L O G O  S =============== */
import { mpEntry, placesRMP, unidadesMedida } from '../../../global/catalogs';

/* ====================  U T I L S  ======== */
import { formattedDate, formattedDateAndHour, formattedHour, formattedStringtoDate } from '../../../utils/FormatDate';

/* ====================  T R A N S A C T I O N S ======== */
import { SaveTest, GetTestBatchAndIpProduct, SaveComplaintRMP } from '../../../utils/TransactionsCalidad';

/* =================== FUNCIONES HEREDADAS ============= */
import { getPropertyInformation, getProductFound, setnewTest, getProviders } from '../TestResuts';

var DataResult = {};
var that;
export class IngresoMPForm extends Component {
    constructor() {
        super();
        this.state = {
            dataProductProperties: null,
            dataProduct: null,
            dynamicData: [],
            headerForm: null,
            dynamicObjects: null,
            date: new Date(),
            provider: null,
            providersGot: [],
            dataPV: [],
            flagForm: null, //varible para determinar que formulario estamos renderizando.
            visibleModalP: false,
            visibleModalEditar: false,
            batchFound: null,
            batchEnter: null,
            testsGot: null, //variable para guardar los test guardados
            userLogin: null,
            dataTableTest: null,//variable para tabla editar lote
            batchUpdate: null,
            checkProductMP: false,
            visibleModalRMP: false,
            dateRMP: null, //desde aqui empiezan las variables de Reclamo de Materia Prima
            batchProvider: null,
            palletNumber: null,
            unit: null,
            affectProduct: null,
            place: null,
            totalAm: null,
            affectAm: null,
            porcentPNC: null,
            nameProductRMP: null,
            returnApply: null, // finaliza variales de Reclamo de Materia Prima
        }
        that = this;
        this.analysisProduct = this.analysisProduct.bind(this);
        this.buildDataForm = this.buildDataForm.bind(this);
        this.headerColumns = this.headerColumns.bind(this);
        this.getDataMatchPropertiesAndCatalogForm = this.getDataMatchPropertiesAndCatalogForm.bind(this);
        this.inputTextEditor = this.inputTextEditor.bind(this);
        this.editorField = this.editorField.bind(this);
        this.onEditorValueChange = this.onEditorValueChange.bind(this);
        this.themeColumn = this.themeColumn.bind(this);
        this.showError = this.showError.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.setFieldsNewTest = this.setFieldsNewTest.bind(this);
        this.onProviderChange = this.onProviderChange.bind(this);
        this.saveDataTest = this.saveDataTest.bind(this);
        this.onShowModalTest = this.onShowModalTest.bind(this);
        this.onHideModalTest = this.onHideModalTest.bind(this);
        this.findTests = this.findTests.bind(this);
        this.showModalEditar = this.showModalEditar.bind(this);
        this.updateDataTest = this.updateDataTest.bind(this);
        this.onPlaceChange = this.onPlaceChange.bind(this);
        this.onUnitChange = this.onUnitChange.bind(this);
        this.onRadioChange = this.onRadioChange.bind(this);
        this.dataMergeNP = this.dataMergeNP.bind(this);
        this.saveComplaintMP = this.saveComplaintMP.bind(this);
    }

    /* Método para Mostrar mensajes de Información */
    /* Mostrar Mensajes */
    showError(message) {
        this.growl.show({ severity: 'error', summary: 'Error', detail: message });
    }
    showSuccess(message) {
        this.growl.show({ severity: 'success', summary: 'Mensaje Exitoso', detail: message });
    }
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

    /* Metodo para realizar nuevo ensayo */
    setFieldsNewTest() {
        setnewTest();
    }

    /* Metodos para ver/ocultar PopUp  */
    onShowModalTest(event) {
        this.setState({ visibleModalP: true });
    }

    onHideModalTest(event) {
        this.setState({ visibleModalP: false });
    }

    /* Metodo para cambiar la lista desplegable */
    /* Proveedor */
    onProviderChange(e) {
        this.setState({ provider: e.value });
    }

    /* Unidad */
    onUnitChange(e) {
        this.setState({ unit: e.value });
    }
    /* Lugar */
    onPlaceChange(e) {
        this.setState({ place: e.value });
    }
    /* Metodo para RadioButton */
    /* Aplica Devolucion */
    onRadioChange(event) {

        this.setState({ returnApply: event.value })
    }



    /* Método que analisa el nombre de produto y realiza la  */
    analysisProduct(nameProduct) {
        var nameFragments = nameProduct.split(' ');
        switch (nameFragments[0].toLowerCase()) {
            case 'envase':
                return 'envase';
            case 'granulo':
                return 'granulo';
            case 'caja':
                return 'caja';
            case 'tubo':
                return 'tubo';
            case 'manga':
                return 'manga';
            case 'tapa':
                return 'tapa';
            case 'cinta':
                return nameFragments[0].toLowerCase();
            case 'sticker':
                return nameFragments[0].toLowerCase();
            case 'etiqueta':
                return nameFragments[0].toLowerCase();
            default:
                return nameFragments[0].toLowerCase();
        }

    }
    /* Metodo paara cambiar el valor de la dataTable */
    onEditorValueChange(props, value) {
        let updatedTestData = this.state.dynamicData;
        updatedTestData[props.rowIndex][props.field] = value;
        this.setState({ dynamicData: updatedTestData });
    }

    /* Metodo que renderiza el objeto Input */
    inputTextEditor(props, field) {
        return <InputText type="text" value={props.rowData[field]} onChange={(e) => this.onEditorValueChange(props, e.target.value)} />;
    }

    /* Metodos para editar cada uno de los campos de la tabla */
    editorField(props) {
        return this.inputTextEditor(props, props.field);
    }
    /* Método que personalización a la columna */
    themeColumn = (value, column) => {
        debugger
        var m1 = 0;
        var m2 = 0;
        var m3 = 0;
        var count = 0;
        var prom = null;
        switch (column.field) {
            case 'resultTest':
                if (value.m1Ini !== null) {
                    m1 = parseFloat(value.m1Ini);
                    count = count + 1;
                }
                if (value.m2Ini !== null) {
                    m2 = parseFloat(value.m2Ini);
                    count = count + 1;
                }
                if ((value.m3Ini !== null) && (value.m3Ini !== undefined)) {
                    m3 = parseFloat(value.m3Ini);
                    count = count + 1;
                }
                if (this.state.flagForm == 'granulo') {
                    if (count !== 0)
                        prom = Math.abs((m1 - m2).toFixed(2));
                    this.state.dynamicData[column.rowIndex][column.field] = prom;
                } else {
                    if (count !== 0)
                        prom = ((m1 + m2 + m3) / count).toFixed(2);
                    this.state.dynamicData[column.rowIndex][column.field] = prom;
                }


                if (prom !== null) {
                    if ((prom <= value.max) & (prom >= value.min))
                        return <span>{prom}</span>;
                    else
                        return <div style={{ borderBottomColor: '#ff8a80', borderWidth: '1%', borderBottomStyle: 'solid', paddingLeft: '2px', textAlign: 'center', fontWeight: 'bold' }}>{prom}</div>
                }
                break;
            default:
                break;
        }
    }

    /* Método que construye las columnas para la data de la tabla  */
    templateColumns(dataOBJ) {
        var generateColumns = [];
        Object.keys(dataOBJ).map(function (o) {
            if (o !== 'idProperty') {
                if ((o == 'caracteristica') || (o == 'min') || (o == 'max') || (o == 'unit')) {
                    generateColumns.push(
                        <Column field={o} style={{ height: '3.5em' }} />
                    )
                } else if (o == 'resultTest') {
                    generateColumns.push(
                        <Column field={o} style={{ height: '3.5em' }} body={that.themeColumn} />
                    )

                } else {
                    generateColumns.push(
                        <Column field={o} style={{ height: '3.5em' }} editor={that.editorField} />
                    )
                }
            }
        })
        return generateColumns;
    }

    /* Método que devuelve la cabecera de la tabla, depende del formulario */
    headerColumns(idForm) {
        if ((idForm == 'caja') || (idForm == 'envase') || (idForm == 'tubo') || (idForm == 'manga') || (idForm == 'cinta') ||
            (idForm == 'sticker') || (idForm == 'etiqueta') || (idForm == 'tapa')) {
            return (<ColumnGroup>
                <Row>
                    <Column header="Característica" rowSpan={2} />
                    <Column header="Unidades" rowSpan={2} style={{ width: '10%' }} />
                    <Column header="Especificaciones" colSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                    <Column header="Mediciones" colSpan={3} style={{ width: '40%', backgroundColor: '#bbdefb' }} />
                    <Column header="Resultado" rowSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                </Row>
                <Row>
                    <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M3" style={{ backgroundColor: '#bbdefb' }} />
                </Row>
            </ColumnGroup>);
        } else if (idForm == 'granulo') {
            return (<ColumnGroup>
                <Row>
                    <Column header="Característica" rowSpan={2} />
                    <Column header="Unidades" rowSpan={2} style={{ width: '10%' }} />
                    <Column header="Especificaciones" colSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                    <Column header="Mediciones" colSpan={2} style={{ width: '40%', backgroundColor: '#bbdefb' }} />
                    <Column header="Resultado" rowSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                </Row>
                <Row>
                    <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                </Row>
            </ColumnGroup>);
        } else {
            return (<ColumnGroup>
                <Row>
                    <Column header="Característica" rowSpan={2} />
                    <Column header="Unidades" rowSpan={2} style={{ width: '10%' }} />
                    <Column header="Especificaciones" colSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                    <Column header="Mediciones" colSpan={3} style={{ width: '40%', backgroundColor: '#bbdefb' }} />
                    <Column header="Resultado" rowSpan={2} style={{ width: '15%', backgroundColor: '#dcedc8' }} />
                </Row>
                <Row>
                    <Column header="MIN" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="MAX" style={{ backgroundColor: '#dcedc8' }} />
                    <Column header="M1" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M2" style={{ backgroundColor: '#bbdefb' }} />
                    <Column header="M3" style={{ backgroundColor: '#bbdefb' }} />
                </Row>
            </ColumnGroup>)
        }
    }

    /* Método que devuelve la data final de la Table haciendo Match entre Propiedades del producto y las del formulario */
    getDataMatchPropertiesAndCatalogForm(dataProperties, valueName) {
        try {
            var data = [];
            var dPV = [];
            dataProperties.properties.map(function (obj) {
                switch (valueName) {
                    case 'envase':
                        mpEntry[0].envases.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                debugger;
                                datForm.caracteristica = obj.propertyList.nameProperty;
                                datForm.idProperty = obj.propertyList.idProperty;
                                datForm.unit = obj.unitProperty;
                                datForm.min = obj.minProperty;
                                datForm.max = obj.maxProperty;
                                data.push(datForm);
                            }
                        })
                        break;
                    case 'granulo':
                        mpEntry[1].granulo.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                if (obj.typeProperty == 'T') {
                                    var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, resultTest: null };
                                    datForm.caracteristica = obj.propertyList.nameProperty;
                                    datForm.idProperty = obj.propertyList.idProperty;
                                    datForm.unit = obj.unitProperty;
                                    datForm.min = obj.minProperty;
                                    datForm.max = obj.maxProperty;
                                    data.push(datForm);
                                } else {
                                    var pvO = { idProperty: null, caracteristica: null, test_result_view: null }
                                    pvO.caracteristica = obj.propertyList.nameProperty;
                                    pvO.idProperty = obj.propertyList.idProperty;
                                    dPV.push(pvO);
                                }
                            }
                        })
                        break;
                    case 'caja':
                        mpEntry[2].caja.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                datForm.caracteristica = obj.propertyList.nameProperty;
                                datForm.idProperty = obj.propertyList.idProperty;
                                datForm.unit = obj.unitProperty;
                                datForm.min = obj.minProperty;
                                datForm.max = obj.maxProperty;
                                data.push(datForm);
                            }
                        })
                        break;
                    case 'tubo':
                        mpEntry[3].tubos.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                datForm.caracteristica = obj.propertyList.nameProperty;
                                datForm.idProperty = obj.propertyList.idProperty;
                                datForm.unit = obj.unitProperty;
                                datForm.min = obj.minProperty;
                                datForm.max = obj.maxProperty;
                                data.push(datForm);
                            }
                        })
                        break;
                    case 'manga':
                        mpEntry[5].mangaTermoencogible.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                datForm.caracteristica = obj.propertyList.nameProperty;
                                datForm.idProperty = obj.propertyList.idProperty;
                                datForm.unit = obj.unitProperty;
                                datForm.min = obj.minProperty;
                                datForm.max = obj.maxProperty;
                                data.push(datForm);
                            }
                        })
                        break;
                    case 'cinta':
                        mpEntry[6].cintaStickerEtiqueta.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                if (obj.typeProperty == 'T') {
                                    var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                    datForm.caracteristica = obj.propertyList.nameProperty;
                                    datForm.idProperty = obj.propertyList.idProperty;
                                    datForm.unit = obj.unitProperty;
                                    datForm.min = obj.minProperty;
                                    datForm.max = obj.maxProperty;
                                    data.push(datForm);
                                } else {
                                    var pvO = { idProperty: null, caracteristica: null, test_result_view: null }
                                    pvO.caracteristica = obj.propertyList.nameProperty;
                                    pvO.idProperty = obj.propertyList.idProperty;
                                    dPV.push(pvO);
                                }
                            }
                        })
                        break;
                    case 'sticker':
                        mpEntry[6].cintaStickerEtiqueta.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                if (obj.typeProperty == 'T') {
                                    var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                    datForm.caracteristica = obj.propertyList.nameProperty;
                                    datForm.idProperty = obj.propertyList.idProperty;
                                    datForm.unit = obj.unitProperty;
                                    datForm.min = obj.minProperty;
                                    datForm.max = obj.maxProperty;
                                    data.push(datForm);
                                } else {
                                    var pvO = { idProperty: null, caracteristica: null, test_result_view: null }
                                    pvO.caracteristica = obj.propertyList.nameProperty;
                                    pvO.idProperty = obj.propertyList.idProperty;
                                    dPV.push(pvO);
                                }
                            }
                        })
                        break;
                    case 'etiqueta':
                        mpEntry[6].cintaStickerEtiqueta.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                if (obj.typeProperty == 'T') {
                                    var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                    datForm.caracteristica = obj.propertyList.nameProperty;
                                    datForm.idProperty = obj.propertyList.idProperty;
                                    datForm.unit = obj.unitProperty;
                                    datForm.min = obj.minProperty;
                                    datForm.max = obj.maxProperty;
                                    data.push(datForm);
                                } else {
                                    var pvO = { idProperty: null, caracteristica: null, test_result_view: null }
                                    pvO.caracteristica = obj.propertyList.nameProperty;
                                    pvO.idProperty = obj.propertyList.idProperty;
                                    dPV.push(pvO);
                                }
                            }
                        })
                        break;
                    case 'tapa':
                        mpEntry[7].tapa.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                datForm.caracteristica = obj.propertyList.nameProperty;
                                datForm.idProperty = obj.propertyList.idProperty;
                                datForm.unit = obj.unitProperty;
                                datForm.min = obj.minProperty;
                                datForm.max = obj.maxProperty;
                                data.push(datForm);
                            }
                        })
                        break;
                    default:
                        mpEntry[4].armadurasPolietilenos.map(function (x) {
                            if (obj.propertyList.idProperty == x) {
                                var datForm = { idProperty: null, caracteristica: null, unit: null, min: null, max: null, m1Ini: null, m2Ini: null, m3Ini: null, resultTest: null };
                                datForm.caracteristica = obj.propertyList.nameProperty;
                                datForm.idProperty = obj.propertyList.idProperty;
                                datForm.unit = obj.unitProperty;
                                datForm.min = obj.minProperty;
                                datForm.max = obj.maxProperty;
                                data.push(datForm);
                            }
                        })
                        break;
                }
            })
            this.state.dataPV = dPV;
            return data;
        } catch (e) {
            console.log(e);
        }
    }
    /* Método que captura el valor de InputText del DataList */
    onWriting(e, id) {
        debugger;
        DataResult[id] = e.target.value;
        this.setState({ reloadTextInput: true });
    }

    /* Método para crear los componentes del Datalista para las propiedades Visibles */
    propertyTemplateDL(prop) {
        debugger
        return (
            <div className="ui-g ui-fluid car-item" >
                <div className="ui-g-12 ui-md-2">
                    {prop.caracteristica}
                </div>

                <div className="ui-g-12 ui-md-6 ui-fluid">
                    <InputText style={{ marginLeft: '50px' }} placeholder='Resultado' value={DataResult[prop.idProperty] ? DataResult[prop.idProperty] : ''} onChange={(e) => this.onWriting(e, prop.idProperty)} />
                </div>
            </div>
        );
    }

    /* Método que construye el formulario para cada tipo de producto */
    buildDataForm(dataProduct) {
        if (dataProduct !== null) {
            var foundValue = this.analysisProduct(dataProduct.nameProduct);
            if (foundValue !== null) {
                var header = that.headerColumns(foundValue);
                debugger
                var data = this.getDataMatchPropertiesAndCatalogForm(dataProduct, foundValue);
                var dF = that.templateColumns(data[0]);
                that.setState({ headerForm: header, dynamicData: data, dynamicObjects: dF, flagForm: foundValue });

            } else {
                //that.showError('Producto no mapeado \n contacte al Administrador');
                console.log('Error nombre')
            }

        } else {
            console.log('Data no encontrada')
        }
    }

    /* Método para hacer merg entre data guardada con nombres de las propiedades */
    dataMergeNP(data, nUP) {
        debugger
        if (data != null) {
            data.map(function (d) {
                nUP.map(function (x) {
                    if (x.id == d.idProperty) {
                        d.caracteristica = x.name;
                        d.unit = x.unit;
                    }
                })
            })
        }
    }

    /* Método para guardar la data del TEST */
    saveDataTest() {
        debugger

        var objAUX = this.state.dynamicData;
        var nameUnitProperty = [];
        var dataSend = [];
        var objPV = DataResult;
        objAUX.map(function (obj) {
            if (obj.testResult !== null) {
                obj.idProvider = that.state.provider;
                obj.dateLog = formattedDateAndHour(that.state.date);
                obj.sapCode = that.state.dataProduct.sapCode;
                obj.productName = that.state.dataProduct.nameProduct;
                obj.idProduct = that.state.dataProduct.idProduct;
                obj.batchTest = that.state.batchEnter;
                obj.owner = that.state.userLogin.idUser;
                obj.prommissing = true;
                let nu = { name: null, unit: null, id: null };
                nu.name = obj.caracteristica;
                nu.unit = obj.unit;
                nu.id = obj.idProperty;
                nameUnitProperty.push(nu);
                delete obj.caracteristica;
                delete obj.unit;
                dataSend.push(obj);
            }
        })

        if (Object.entries(objPV).length !== 0) {
            objPV.idProvider = that.state.provider;
            objPV.dateLog = formattedDateAndHour(that.state.date);
            objPV.sapCode = that.state.dataProduct.sapCode;
            objPV.productName = that.state.dataProduct.nameProduct;
            objPV.idProduct = that.state.dataProduct.idProduct;
            objPV.batchTest = that.state.batchEnter;
            objPV.prommissing = true;
            objPV.owner = that.state.userLogin.idUser;
            dataSend.push(objPV);
        }
        if (dataSend.length !== 0) {
            SaveTest(dataSend, function (data, status, msg) {
                debugger
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        that.dataMergeNP(data, nameUnitProperty);
                        that.buildDataForm(that.state.dataProductProperties);
                        if (that.state.checkProductMP) {
                            that.setState({ testsGot: data, visibleModalP: false });
                        } else {
                            var npD = that.state.dataProduct.nameProduct;
                            var up = that.state.dataProduct.unit;
                            var d = that.state.date;
                            that.setState({ testsGot: data, visibleModalP: false, visibleModalRMP: true, dateRMP: d, nameProductRMP: npD, unit: up });
                        }
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        that.setState({ visibleModalP: false });
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            that.showMessage('Ingrese los datos solicitados', 'error');
        }
    }

    /* Metodo para acutlizar el lote de los test cosultados */
    updateDataTest() {
        if (this.state.batchUpdate !== null) {
            this.state.testsGot.map(function (obj) {
                obj.batchTest = that.state.batchUpdate;
            })
            SaveTest(this.state.testsGot, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        var aux = [];
                        aux.push(data[0]);
                        that.setState({ testsGot: data, dataTableTest: aux, visibleModalEditar: false, batchUpdate: null });
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            this.showMessage('Ingrese el número de Lote', 'error');
        }

    }


    /* Metodo para conusltar a la BBDD los test por lote y productoID */
    findTests() {
        debugger;
        var testTMP = { batchTest: null, idProduct: null };
        if (this.state.batchFound !== null) {
            testTMP.batchTest = this.state.batchFound;
            testTMP.idProduct = this.state.dataProduct.idProduct;
            GetTestBatchAndIpProduct(testTMP, function (data, status, msg) {
                switch (status) {
                    case 'OK':
                        that.showMessage(msg, 'success');
                        var aux = [];
                        aux.push(data[0]);
                        that.setState({ testsGot: data, dataTableTest: aux });
                        break;
                    case 'ERROR':
                        that.showMessage(msg, 'error');
                        break;
                    default:
                        that.showMessage(msg, 'info');
                        break;
                }
            })
        } else {
            that.showMessage('Ingrese el número de lote', 'error');
        }
    }

    /* Metodo para guardar el Reclamo Materia Prima */
    saveComplaintMP() {
        var comp = {
            idProduct: null, idProvider: null, batchProvider: null, palletNumber: null, affectedProduct: null, affectedProduct: null, totalAmount: null, place: null, dateComplaint: null,
            applyReturn: null, porcentComplaint: null, asUser: null, state: null
        };
        comp.idProduct = this.state.dataProduct.idProduct;
        comp.idProvider = this.state.provider;
        comp.place = this.state.place;
        comp.unitP = this.state.unit;
        comp.batchProvider = this.state.batchProvider;
        comp.palletNumber = this.state.palletNumber;
        comp.affectedAmount = this.state.affectAm;
        comp.affectedProduct = this.state.affectProduct
        comp.totalAmount = this.state.totalAm;
        comp.dateComplaint = formattedDateAndHour(this.state.dateRMP);
        if (this.state.returnApply == 'SI')
            comp.applyReturn = 1;
        else
            comp.applyReturn = 0;
        comp.porcentComplaint = this.state.porcentPNC;
        comp.asUser = this.state.userLogin.idUser;
        comp.state = 'Abierto';
        SaveComplaintRMP(comp, function (data, status, msg) {
            switch (status) {
                case 'OK':
                    that.showMessage(msg, 'success');
                    that.setState({ visibleModalRMP: false });
                    break;
                case 'ERROR':
                    that.showMessage(msg, 'error');
                    break;
                default:
                    that.showMessage(msg, 'info');
                    break;
            }
        })


    }

    /* Metodo para crear template de la tabla */
    actionTemplate(rowData, column) {
        return (<div>
            <Button type="button" icon='fa fa-pencil-square-o' style={{ width: '20%' }} className="ui-button-success" onClick={() => that.showModalEditar()}></Button>
        </div>);
    }

    showModalEditar() {
        this.setState({ visibleModalEditar: true });
    }

    componentWillMount() {
        var pp = getPropertyInformation();
        var productoF = getProductFound();
        var providersFound = getProviders();
        console.log(productoF);
        this.setState({ dataProductProperties: pp, dataProduct: productoF, providersGot: providersFound });
        this.buildDataForm(pp);
    }

    componentDidMount() {
        var sesion = JSON.parse(localStorage.getItem('dataSession'));
        this.setState({ userLogin: sesion });
    }

    render() {
        const footer = (
            <div>
                <Button label="Aceptar" icon="fa-check" className="ui-button-primary" onClick={() => this.saveDataTest()} />
                <Button label="Cancelar" icon="fa-close" onClick={() => this.setState({ visibleModalP: false })} className="ui-button-danger" />
            </div>
        );
        const footerEditar = (
            <div>
                <Button label="Aceptar" icon="fa-check" className="ui-button-primary" onClick={() => this.updateDataTest()} />
                <Button label="Cancelar" icon="fa-close" onClick={() => this.setState({ visibleModalEditar: false })} className="ui-button-danger" />
            </div>
        );
        const footerRMP = (
            <div>
                <Button label="Omitir" icon="fa fa-arrow-right" className="ui-button-warning" onClick={() => this.saveComplaintMP()} />
                <Button label="Aceptar" icon="fa-check" className="ui-button-primary" onClick={() => this.saveComplaintMP()} />
            </div>
        );
        let es = {
            firstDayOfWeek: 1,
            dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
            dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
            dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
            monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        };
        return (
            <div className="ui-g" >
                <Growl ref={(el) => this.growl = el} />
                <div className="ui-g-12" style={{ paddingTop: 0 }}>
                    <div className="card" style={{ backgroundColor: '#457fca', justifyContent: 'center', textAlign: 'center', marginTop: '2%', marginBottom: '2%' }}>
                        <h3 style={{ color: '#ffff', fontWeight: 'bold' }}>BITÁCORA INGRESO MATERIA PRIMA </h3>
                    </div>
                    <TabView style={{ marginBottom: '10px' }}>
                        <TabPanel header="Consultas" leftIcon="fa fa-list">
                            <div className="card" style={{ backgroundColor: '#ECEFF1' }}>
                                <div className="ui-grid ui-grid-responsive ui-fluid">
                                    <div className="ui-grid-row">
                                        <div className="ui-grid-col-1" style={{ padding: '4px 10px', fontWeight: 'bold' }}><label htmlFor="year">Lote Ensayo</label></div>
                                        <div className="ui-grid-col-5" style={{ padding: '0px 10px' }}>
                                            <InputText placeholder='20190810' value={this.state.batchFound} onChange={(e) => this.setState({ batchFound: e.target.value })} />
                                        </div>
                                        <div className="ui-grid-col-2" style={{ padding: '0px 10px' }}>
                                            <Button label="Buscar" icon="fa fa-search" onClick={() => this.findTests()} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <DataTable value={this.state.dataTableTest} paginator={true} rows={10} >
                                <Column field="dateLog" header="Fecha" style={{ width: '15%', justifyContent: 'center', textAlign: 'center', }} />
                                <Column field="batchTest" header="Lote" style={{ width: '10%', justifyContent: 'center', textAlign: 'center', }} />
                                <Column field="productName" header="Producto" style={{ justifyContent: 'center', textAlign: 'center', }} />
                                <Column header="Editar" body={this.actionTemplate} style={{ justifyContent: 'center', textAlign: 'center', width: '25%' }} />
                            </DataTable>
                        </TabPanel>
                        <TabPanel header="Ingreso" leftIcon="fa fa-plus">
                            <Toolbar>
                                <div className="ui-toolbar-group-right">
                                    <Button label="Nuevo Ensayo" icon="fa-flask" className="ui-button-warning" onClick={() => this.setFieldsNewTest()} />
                                    <Button label="Guardar" icon="fa-save" className="ui-button-success" onClick={() => this.onShowModalTest()} />
                                </div>
                                <div className="ui-toolbar-group-left">
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.date} locale={es} showTime={true} onChange={(e) => this.setState({ date: e.value })} showIcon={true} />
                                    <Dropdown style={{ marginLeft: '35px' }} value={this.state.provider} options={this.state.providersGot} onChange={this.onProviderChange} placeholder="Proveedor" />
                                    <InputText style={{ marginLeft: '10px' }} placeholder='Lote' value={this.state.batchEnter} onChange={(e) => this.setState({ batchEnter: e.target.value })} />
                                </div>
                            </Toolbar>
                            <DataTable value={this.state.dynamicData} editable={true} headerColumnGroup={this.state.headerForm}>
                                {this.state.dynamicObjects}
                            </DataTable>
                            <DataList value={this.state.dataPV} itemTemplate={this.propertyTemplateDL.bind(this)} paginator={true} rows={70} paginator={false}></DataList>

                        </TabPanel>
                    </TabView>
                </div>
                <Dialog header="Confirmación" visible={this.state.visibleModalP} style={{ width: '35vw' }} footer={footer} modal={true} onHide={() => this.setState({ visibleModalP: false })}>
                    <div className="ui-grid-row" style={{ marginBottom: '10px', justifyContent: 'center' }}>
                        <label style={{ color: '#1e88e5' }}> Para guardar/salvar la información ingresada </label>
                    </div>
                    <div className="ui-grid-row">
                        <div className="ui-grid-col-4" style={{ padding: '4px 10px' }}><label style={{ fontWeight: 'bold', color: '#1e88e5' }} htmlFor="year">Se acepta el producto ?</label></div>
                        <div className="ui-grid-col-8" style={{ padding: '4px 10px' }}>
                            <ToggleButton style={{ width: '150px' }} onLabel="SI" offLabel="NO" onIcon="fa fa-check" offIcon="fa fa-times"
                                checked={this.state.checkProductMP} onChange={(e) => this.setState({ checkProductMP: e.value })} />
                        </div>
                    </div>
                </Dialog>
                <Dialog header="Editar" visible={this.state.visibleModalEditar} style={{ width: '40vw' }} footer={footerEditar} modal={true} onHide={() => this.setState({ visibleModalEditar: false })}>
                    <div className="ui-grid ui-grid-responsive ui-fluid">
                        <div className="ui-grid-row">
                            <div className="ui-grid-col-3" style={{ padding: '4px 10px' }}><label htmlFor="year">Lote</label></div>
                            <div className="ui-grid-col-9" style={{ padding: '4px 10px' }}>
                                <InputText placeholder='Lote' value={this.state.batchUpdate} onChange={(e) => this.setState({ batchUpdate: e.target.value })} />
                            </div>
                        </div>
                    </div>
                </Dialog>
                <Dialog header="Registrar Reclamo Materia Prima" visible={this.state.visibleModalRMP} style={{ width: '60%', backgroundColor: '#eceff1' }} footer={footerRMP} modal={true} onHide={() => this.setState({ visibleModalRMP: false })}>
                    <Card style={{ backgroundColor: '', marginBottom: '5%' }}>
                        <div className='ui-g ui-fluid'>
                            <div className="ui-g form-group">
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Producto</label>
                                    <InputText value={this.state.nameProductRMP} disabled={true} />
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Fecha</label>
                                    <Calendar dateFormat="yy/mm/dd" value={this.state.dateRMP} locale={es} showTime={true} onChange={(e) => this.setState({ dateRMP: e.value })} showIcon={true} />
                                </div>
                                <div className="ui-g-12 ui-md-4"></div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Lote Proveedor</label>
                                    <div className="ui-inputgroup">
                                        <InputText placeholder='Lote' value={this.state.batchProvider} onChange={(e) => this.setState({ batchProvider: e.target.value })} />
                                        <span className="ui-inputgroup-addon">
                                            <i className="fa fa-car"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Lote Interno #Pallet</label>
                                    <InputText placeholder='Pallet número' value={this.state.palletNumber} onChange={(e) => this.setState({ palletNumber: e.target.value })} />
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Unidad</label>
                                    <Dropdown value={this.state.unit} options={unidadesMedida} autoWidth={false} onChange={this.onUnitChange} placeholder="Seleccione" />
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Producto Afectado</label>
                                    <div className="ui-inputgroup">
                                        <InputText placeholder='Nombre' value={this.state.affectProduct} onChange={(e) => this.setState({ affectProduct: e.target.value })} />
                                        <span className="ui-inputgroup-addon">
                                            <i className="fa fa-product-hunt"></i>
                                        </span>
                                    </div>

                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Lugar</label>
                                    <Dropdown value={this.state.place} options={placesRMP} autoWidth={false} onChange={this.onPlaceChange} placeholder="Seleccione" />
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Cantidad Total</label>
                                    <div className="ui-inputgroup">
                                        <InputText placeholder='Número de unidades' keyfilter="num" value={this.state.totalAm} onChange={(e) => this.setState({ totalAm: e.target.value })} />
                                        <span className="ui-inputgroup-addon">
                                            <i className="fa fa-sort-amount-asc"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">Cantidad Afectada</label>
                                    <div className="ui-inputgroup">
                                        <InputText placeholder='Número de unidades' keyfilter="num" value={this.state.affectAm} onChange={(e) => this.setState({ affectAm: e.target.value })} />
                                        <span className="ui-inputgroup-addon">
                                            <i className="fa fa-sort-amount-asc"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="ui-g-12 ui-md-4">
                                    <label htmlFor="float-input">PNC Reclamo</label>
                                    <div className="ui-inputgroup">
                                        <InputText placeholder='' keyfilter="num" value={this.state.porcentPNC} onChange={(e) => this.setState({ porcentPNC: e.target.value })} />
                                        <span className="ui-inputgroup-addon">
                                            <i className="fa fa-percent"></i>
                                        </span>
                                    </div>
                                </div>
                                <div className="ui-g-12 ui-md-4" style={{ marginBottom: '5%' }}>
                                    <div className="ui-g-12 ui-md-12">
                                        <label htmlFor="float-input">Aplica Devolución</label>
                                    </div>
                                    <div className="ui-g-12 ui-md-2">
                                        <RadioButton value="SI" inputId="rb1" onChange={this.onRadioChange} checked={this.state.returnApply === "SI"} />
                                        <label htmlFor="rb1" style={{ marginLeft: '5px' }}>Si</label>
                                    </div>
                                    <div className="ui-g-12 ui-md-2">
                                        <RadioButton value="NO" inputId="rb2" onChange={this.onRadioChange} checked={this.state.returnApply === "NO"} />
                                        <label htmlFor="rb2" style={{ marginLeft: '5px' }}>No</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Dialog>
            </div>
        )
    }

}