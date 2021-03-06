 import {SuccessServiceCall, ServiceFailed, AnalizeServerResponse} from './comunication-handler';
 import {decryptAES} from './cryptography/crypto3DESHandler';
 import $ from 'jquery';

/* export function AjaxPostService(WebRequest, addFunction, isAsync, esReconexion) {
    try {
        var ResponseAjaxCall = $.ajax({
            type: "POST",
            dataType: "json",
            scriptCharset: "utf-8",
            url: 'http://192.168.20.145:8080/qualityQR/api',
            data: WebRequest,
            success: function (data) {
                debugger;
                SuccessServiceCall(data, WebRequest, addFunction);
            },
            error: function (result) {
                //ServiceFailed(result, WebRequest, addFunction, isAsync);
            },
            async: isAsync
        });
        if (isAsync == false) {
            var responseClaro = decryptAES(ResponseAjaxCall.responseJSON);
            var ObjetoRespuesta = AnalizeServerResponse(JSON.parse(decodeURIComponent(escape(responseClaro))));
            return ObjetoRespuesta;
        }
    } catch (e) {
        throw e;
    }
} */

export function FetchAjax(WebRequest, addFunction, Uri){
    fetch(Uri, 
    {   method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(WebRequest)
    })
    .then( 
        (response)=>{
            return response.json();
        }).then((wri2)=>{
        //var resp= decryptAES(responseData, true);
        debugger;
        SuccessServiceCall(wri2,WebRequest,addFunction);
        //return (responseData.d);  						    			
    }).catch( err => console.error(err))  
}

/*
function AjaxPostServiceMobile(MovilRequest, addFunction, isAsync, esReconexion) {
    try {
        var ResponseAjaxCall = $.ajax({
            type: "POST",
            dataType: "json",
            scriptCharset: "utf-8",
            url: Parameters.ServiceUri,
            data: MovilRequest,
            success: function (data) {
                SuccessServiceCall(data, MovilRequest, addFunction);
            },
            error: function (result) {
                ServiceFailed(result, MovilRequest, addFunction, isAsync);
            },
            async: isAsync
        });
    } catch (e) {
        throw e;
    }
}*/
