import React, { Component } from 'react';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dropdown } from 'primereact/components/dropdown/Dropdown';
import { Card } from 'primereact/components/card/Card';
import { AutoComplete } from 'primereact/components/autocomplete/AutoComplete';

/* ====================  T R A N S A C T I O N S ======== */
import { GetAllProducts, } from '../../utils/TransactionsCalidad';


var nameProducts = []; // Variable para fomrar el Array de nombre de productos.
var that;

export class ProductoNoConforme extends Component {

    constructor() {
        super();
        this.state = {
            products: [],
        };
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
                    if (obj.typeProduct == 'MP') {
                        that.setState({ enabledFrecuencia: true });
                    }
                }
            })
        }
        this.setState({ productName: e.value, filteredProducts: null });
    }
    /* FIn Métodos  Auto Completado */
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
        return (
            <div>
                <Card style={{ backgroundColor: '#d4e157' }}>
                    <div className='ui-g form-group ui-fluid'>
                        <div className='ui-g-4'>
                            <label htmlFor="float-input">Buscar Producto</label>
                            <AutoComplete minLength={1} placeholder="Buscar por nombre de producto" id="acAdvanced"
                                suggestions={this.state.filteredProducts} completeMethod={this.filterProducts.bind(this)} value={this.state.productName}
                                onChange={this.onProductValueChange.bind(this)} onDropdownClick={this.handleDropdownClick.bind(this)}
                            />
                        </div>

                        <div className='ui-g-2' style={{ marginTop: '23px' }}>
                            <Button label='Aceptar' onClick={this.generateHCC} />
                        </div>

                    </div>
                </Card>
                <Card>
                    <div className='ui-g form-group ui-fluid'>
                        <div className='ui-g-2'>
                            <label htmlFor="float-input">Lote</label>
                            <InputText placeholder='Lote' keyfilter="int" onChange={(e) => this.setState({ lote: e.target.value })} value={this.state.lote} />
                        </div>
                    </div>

                </Card>
            </div>
        )
    }
}