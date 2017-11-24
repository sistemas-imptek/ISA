import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './App';
import {Home} from './components/Home';
import {Acta} from './components/sgc/Acta';
import {Documentation} from './components/Documentation';

import {Router,Route,hashHistory} from 'react-router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <Route path="/home" component={Home} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/acta" component={Acta} />           
        </Route>
    </Router>,
    document.getElementById('root')
);

registerServiceWorker();