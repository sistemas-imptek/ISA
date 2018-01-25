import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './App';
import {Home} from './components/Home';
import {Acta} from './components/sgc/Acta';
import {Documentation} from './components/Documentation';
import {Login} from './components/autentication/login';

import {Router,Route,hashHistory} from 'react-router';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(

   <Login/>,
   document.getElementById('root')
);

registerServiceWorker();