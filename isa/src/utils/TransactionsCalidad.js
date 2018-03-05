

import { SendPostRequestToService } from './comunication-handler'

/* LIBRERIAS  */
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var MD5 = require('crypto-js/md5');



var Transactions = {
    LoginValidate: { transactionName: 'loginValidate', transactioncode: 'TR001', parameters: { userName: '', pass: '' }, },
    GetAllProducts:{ transactionName: "GetAllProducts",transactionCode: "TxQQRgetProducts",parameters:{}},
    GetProductByID:{transactionName: "GetProductById", transactionCode: "TxQQRgetProductById", parameters:{"idProduct": ''}},
    ProductSave: { transactionName: 'PRODUCTSAVE', transactionCode: 'TxQQRsetProduct', parameters: {typeProduct:'',itcdq:'IT-CDQ-03.12', nameProduct:'', sapCode:'', descProduct:'' }},
    ObtenerDataProducto:{}
}

export function productSave(producto, addFunction) {
    debugger;
    var transaction = Transactions.ProductSave;
    transaction.parameters.descProduct='';
    transaction.parameters.nameProduct='';
    transaction.parameters.typeProduct='';
    transaction.parameters.sapCode='';

    transaction.parameters.typeProduct = producto.typeProduct;
    transaction.parameters.nameProduct = producto.nameProduct;
    transaction.parameters.sapCode = producto.sapCode;
    transaction.parameters.descProduct = producto.descProduct;
    SendPostRequestToService(transaction, addFunction);
};

export function GetAllProducts(addFunction){
    var transaction = Transactions.GetAllProducts;
    SendPostRequestToService(transaction, addFunction);
};

export function GetProductById(id, addFunction){
    var transaction = Transactions.GetProductByID;
    transaction.parameters.idProduct=id;
    SendPostRequestToService(transaction,addFunction);
};
