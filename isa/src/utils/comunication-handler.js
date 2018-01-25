
import {encryptAES, decryptAES} from './cryptography/crypto3DESHandler';
import {AjaxPostService} from './ajax-handler';

/* LIBRERIAS  */
var intentosConexion = 0;
var Request;



export function SendPostRequestToService(WebRequest, addFunction, LoadScreen, platForm) {
   debugger;    
    WebRequest.parameters = encryptAES(WebRequest.parameters);
    var isAsync = true;
    return AjaxPostService(WebRequest, addFunction, isAsync);

}

export function SuccessServiceCall(data, CoreRequest, addFunction) {
    var parameters = JSON.parse(decryptAES(CoreRequest.Parameters));
    var responseClaro = decryptAES(data);
    var result = JSON.parse(decodeURIComponent(escape(responseClaro)));
    if (addFunction) {

        var isOk = addFunction.handlerError(result, parameters);
        if (isOk)
            addFunction(result.ResponseElements);
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