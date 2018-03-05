

import { SendPostRequestToService } from './comunication-handler'

/* LIBRERIAS  */
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var MD5 = require('crypto-js/md5');



var TransactionsCore = {
    LoginValidate: { transactionName: 'loginValidate', transactioncode: 'TR001', parameters: { userName: '', pass: '' }, },
    ActaSave: { transactionName: 'actaSave', transactioncode: 'TR002', parameters: {} },
    GetAllProperty: { transactionName: 'GetAllOnlyPL', transactionCode: 'TxQQRgetOnlyPL', parameters: {} }
}

export function loginValidate(user, password, addFunction) {
    debugger;
    var transaction = TransactionsCore.LoginValidate;
    transaction.parameters.userName = user;
    transaction.parameters.pass = password;
    SendPostRequestToService(transaction, addFunction);
}

