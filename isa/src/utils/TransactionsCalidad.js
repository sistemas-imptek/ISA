

import { SendPostRequestToService } from './comunication-handler'

/* LIBRERIAS  */
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
var MD5 = require('crypto-js/md5');



var Transactions = {
    LoginValidate: { transactionName: 'loginValidate', transactioncode: 'TR001', parameters: { userName: '', pass: '' }, },
    GetAllProducts: { transactionName: "GetAllProducts", transactionCode: "TxQQRgetProducts", parameters: {} },
    GetProductByID: { transactionName: "GetProductById", transactionCode: "TxQQRgetProductById", parameters: { "idProduct": '' } },
    ProductSave: { transactionName: 'PRODUCTSAVE', transactionCode: 'TxQQRsetProduct', parameters: { typeProduct: '', itcdq: 'IT-CDQ-03.12', nameProduct: '', sapCode: '', descProduct: '' } },
    PropertyProductSave: { transactionName: "SetProduct", transactionCode: "TxQQRsetProduct", parameters: {} },
    GenerateHCC: { transactionName: 'GenerateHcc', transactionCode: 'TxQQRgenerateHCC', parameters: { product: { idProduct: '' }, hcchBatch: '', periodicity:'' } },
    HCCSave: { transactionName: "Create/UpdateHcc", transactionCode: "TxQQRsetHCC", parameters: {} },
    ObtenerDataProducto: {}
}

export function productSave(producto, addFunction) {
    debugger;
    var transaction = Transactions.ProductSave;
    transaction.parameters = { typeProduct: '', itcdq: 'IT-CDQ-03.12', nameProduct: '', sapCode: '', descProduct: '' };
    transaction.parameters.descProduct = '';
    transaction.parameters.nameProduct = '';
    transaction.parameters.typeProduct = '';
    transaction.parameters.sapCode = '';

    transaction.parameters.typeProduct = producto.typeProduct;
    transaction.parameters.nameProduct = producto.nameProduct;
    transaction.parameters.sapCode = producto.sapCode;
    transaction.parameters.descProduct = producto.descProduct;
    SendPostRequestToService(transaction, addFunction);
};

export function GetAllProducts(addFunction) {
    var transaction = Transactions.GetAllProducts;
    transaction.parameters = {};
    SendPostRequestToService(transaction, addFunction);
};

export function GetProductById(id, addFunction) {
    try {
        debugger;
        var transaction = Transactions.GetProductByID;
        transaction.parameters = { "idProduct": '' };
        transaction.parameters.idProduct = id;
        SendPostRequestToService(transaction, addFunction);
    } catch (e) {
        console.log(e);
    }
};

export function PropertyProductSave(product, addFunction) {
    var transaction = Transactions.PropertyProductSave;
    transaction.parameters = {};
    transaction.parameters = product;
    SendPostRequestToService(transaction, addFunction);

}

export function GenerateHCC(idProduct, hccBatch,periodicity, addFunction) {
    debugger;
    var transaction = Transactions.GenerateHCC;
    transaction.parameters = { product: { idProduct: '' }, hcchBatch: '', periodicity:'' };
    transaction.parameters.product.idProduct = idProduct;
    transaction.parameters.hcchBatch = hccBatch;
    transaction.parameters.periodicity=periodicity;
    SendPostRequestToService(transaction, addFunction);
}