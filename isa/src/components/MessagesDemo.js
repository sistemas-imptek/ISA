import React, { Component } from 'react';
import {Messages} from 'primereact/components/messages/Messages';
import {Growl} from 'primereact/components/growl/Growl';
import {Button} from 'primereact/components/button/Button';

export class MessagesDemo extends Component {

    constructor() {
        super();
        this.state = {
            messages: null
        };

        this.showInfo = this.showInfo.bind(this);
        this.showSuccess = this.showSuccess.bind(this);
        this.showWarn = this.showWarn.bind(this);
        this.showError = this.showError.bind(this);
        this.showMultiple = this.showMultiple.bind(this);
    }

    showInfo() {
        this.setState({messages:[{severity:'info', summary:'Info Message', detail:'PrimeReact rocks'}]});
    }
    
    showSuccess() {
        this.setState({messages:[{severity:'success', summary:'Success Message', detail:'Order submitted'}]});
    }

    showWarn() {
        this.setState({messages:[{severity:'warn', summary:'Warn Message', detail:'There are unsaved changes'}]});
    }

    showError() {
        this.setState({messages:[{severity:'error', summary:'Error Message', detail:'Validation failed'}]});
    }

    showMultiple() {
        this.setState({messages:[
            {severity:'info', summary:'Message 1', detail:'PrimeNG rocks'},
            {severity:'info', summary:'Message 2', detail:'PrimeReact rocks'},
            {severity:'info', summary:'Message 3', detail:'PrimeFaces rocks'}
        ]});
    }

    render() {
        return(
            <div className="ui-g">
                <div className="ui-g-12">
                    <div className="card">
                        <h1>Messages and Growl</h1>
                        
                        <Messages value={this.state.messages} />
                        <Growl value={this.state.messages} />
            
                        <Button onClick={this.showInfo} label="Info" style={{width:'100px'}} />
                        <Button onClick={this.showSuccess} label="Success" style={{width:'100px'}} className="success-btn" />
                        <Button onClick={this.showWarn} label="Warn" className="warning-btn" style={{width:'100px'}} />
                        <Button onClick={this.showError} label="Error" className="danger-btn" style={{width:'100px'}} />
                        <Button onClick={this.showMultiple} label="Multiple" className="info-btn" style={{width:'100px'}} />
                    </div>
                </div>
            </div>
        )
    }
}