
import { encryptAES, decryptAES } from './cryptography/crypto3DESHandler';
import { AjaxPostService, FetchAjax } from './ajax-handler';

/* LIBRERIAS  */
var intentosConexion = 0;
var Request;
/* ================= URIs PARA ENVIO DE LA DATA ======================*/
var security = 'http://localhost:8440/security/api';
var quality = 'http://localhost:8440/qualityQR/api';
var rrhh = '';
var sgc = '';

function decide(tx) {
    switch (tx) {
        case 'TxCore':
            return security;
            break;
        case 'TxQuality':
            return quality
            break;
    }
}

export function SendPostRequestToService(WebRequest, addFunction, typeTx, platForm) {
    debugger;
    if(WebRequest.parameters!=null){
        WebRequest.parameters = encryptAES(WebRequest.parameters);
    }    
    var isAsync = true;
    var url=decide(typeTx);
    //return AjaxPostService(WebRequest, addFunction, isAsync);
    return FetchAjax(WebRequest, addFunction, url);

}

export function SuccessServiceCall(data, MovilRequest, addFunction) {
    debugger;
    try {
        //var parameters = decryptAES(MovilRequest.parameters, true);
        var responseClaro = undefined;
        let MessageObj = undefined;
        if (data.parameters != null) {
            responseClaro = decryptAES(data.parameters, true);
        } else {
            responseClaro = { message: '', status: '' }
            responseClaro.message = data.message;
            responseClaro.status = data.status;
        }

        //var result = JSON.parse(decodeURIComponent(escape(responseClaro)));
        if (addFunction) {
            addFunction(responseClaro)
            //$.extend(result, { esRegistro: parameters.esRegistro });
            //var isOk = addFunction.handlerError(result);
            // let isOK = errorHandler(responseClaro);
            /*if (isOK) {
                addFunction(responseClaro.ResponseElements);
            } else {
                addFunction(responseClaro.AditionalCoreMessage);
            }*/
        }

    } catch (error) {
        console.log(error);
    }
}


export function AnalizeServerResponse(result) {
    try {
        if (result.TransactionResponseCode != '00') {
            throw result;
        }
        return result.ResponseElements;
    } catch (e) {
        throw e;
    }
}
 /*
function ServiceFailed(result, WebRequest, addFunction, isAsync) {
    stopProcess();
    intentosConexion++;
    if (intentosConexion < 2) {
        SendPostRequestToService(WebRequest, addFunction, function () {
            LoadScreenCore(Request, true);
        });
    } else {
        intentosConexion = 0;
        showErrorMessage('Error de Conexión', 'Error de conexión con el servidor, por favor intente más tarde. ' + result.status + ' ' + result.statusText);
        //Type = null; var Url = null; Data = null; ContentType = null; DataType = null; ProcessData = null;
    }
}
*/