import React, { Component } from 'react';

export class Acta extends Component {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        return <div className="ui-g">
            <div className="ui-g-12">
                <div className="card">
                    <h1>Acta</h1>
                    <p>Aqui se creará el acta</p>
                    <i class="fa fa-refresh fa-spin fa-3x fa-fw" aria-hidden="true"></i>
<span class="sr-only">Refreshing...</span>
                </div>
            </div>
        </div>
    }
}