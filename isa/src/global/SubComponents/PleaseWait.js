import React, { Component } from 'react';

import { Dialog } from 'primereact/components/dialog/Dialog';
import { ProgressSpinner } from 'primereact/components/progressspinner/ProgressSpinner';

//import {Card} from 'primereact/components/card/Card';


/* Component que sirver para mostrar el mensaje de Espere por favor */
var that;
export class PW extends Component {

    constructor() {
        super();
        this.state = {
            waitModalView: false,
        };
        that = this;
    }

    render() {
        return (
            <div className="ui-g-12">
                <Dialog visible={this.state.waitModalView} style={{ width: '20vw' }} modal={true} showHeader={false} closeOnEscape={false} onHide={() => this.setState({ waitModalView: false })}>
                    <div className="ui-grid ui-grid-responsive ui-fluid">
                        <div className="ui-grid-row" style={{ marginRight: '10px' }}>
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="#EEEEEE" animationDuration="4s" />
                        </div>
                        <div className="ui-grid-row" style={{ textAlign: 'center', justifyContent: 'center', marginBottom: '10px', marginTop: '15px' }}>
                            <span style={{ fontWeight: 'bold', textAlign: 'center' }}>Espere por favor... !</span>
                        </div>
                    </div>
                </Dialog>

            </div>
        )
    }
}

export function show_msgPW() {
    that.setState({ waitModalView: true });
}

export function hide_msgPW() {
    that.setState({ waitModalView: false });
}