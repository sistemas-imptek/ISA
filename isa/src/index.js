import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './App';
import {Dashboard} from './components/Dashboard';
import {FormsDemo} from './components/FormsDemo';
import {SampleDemo} from './components/SampleDemo';
import {DataDemo} from './components/DataDemo';
import {PanelsDemo} from './components/PanelsDemo';
import {OverlaysDemo} from './components/OverlaysDemo';
import {MenusDemo} from './components/MenusDemo';
import {MessagesDemo} from './components/MessagesDemo';
import {ChartsDemo} from './components/ChartsDemo';
import {MiscDemo} from './components/MiscDemo';
import {EmptyPage} from './components/EmptyPage';
import {Documentation} from './components/Documentation';
import {UtilsDemo} from './components/UtilsDemo';
import {Router,Route,hashHistory} from 'react-router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/forms" component={FormsDemo} />
            <Route path="/sample" component={SampleDemo} />
            <Route path="/data" component={DataDemo} />
            <Route path="/panels" component={PanelsDemo} />
            <Route path="/overlays" component={OverlaysDemo} />
            <Route path="/menus" component={MenusDemo} />
            <Route path="/messages" component={MessagesDemo} />
            <Route path="/charts" component={ChartsDemo} />
            <Route path="/misc" component={MiscDemo} />
            <Route path="/empty" component={EmptyPage} />
            <Route path="/utils" component={UtilsDemo} />
            <Route path="/documentation" component={Documentation} />
        </Route>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();