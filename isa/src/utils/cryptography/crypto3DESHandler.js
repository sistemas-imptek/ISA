/*
	================================================== C R Y P T O G R A P H Y  ========================================================
													=============================
	- Instalar libreria react-native : npm install crypto-js
	- Referencia web https://github.com/brix/crypto-js

*/

'use strict'
//=============================================	VARIABLES NECESARIAS PARA LA ENCRIPTACIÓN======================================================

var keyRAW2 = new Uint8Array([245, 87, 124, 4, 123, 198, 122, 12, 71, 15, 134, 220, 59, 62, 131, 187, 76, 243, 65, 156, 191, 171, 114, 189]);
var keyRAW='abc';
var CryptoJS = require("crypto-js");
var ivRAW = new Uint8Array([62, 81, 92, 156, 178, 142, 221, 199]);
/*
	=================================== FUNCIÓN ENCRYPT3DES QUE USA EL MÉTODO TRIPLE ENCRIPTACIÓN=============================
*/

export function encrypt3DES(input){
	
	let cipherData;

var cipherOption ={
		iv: ivRAW.toString()
	}

	if(input !== null && typeof input === 'object'){

		var bytes = CryptoJS.TripleDES.encrypt(JSON.stringify(input), keyRAW2.toString(), cipherOption);
		cipherData= bytes.toString();

	} else{

		var bytes = CryptoJS.TripleDES.encrypt(input, keyRAW2.toString());
		cipherData= bytes.toString();
	}

	return cipherData;
}


/*
	====================================== FUNCIÓN DECRYPT DISCRIMINA SI ES OBJECT O STRING=============================
*/

export function decrypt(input,isString){

	let decipherData;
var cipherOption ={
		iv: ivRAW.toString()
	}

	if(input!==null && isString === undefined){

		var bytesDecrypt = CryptoJS.TripleDES.decrypt(input, keyRAW2.toString(),cipherOption);
		decipherData= JSON.parse(bytesDecrypt.toString(CryptoJS.enc.Utf8));

	} else {

		var bytesDecrypt = CryptoJS.TripleDES.decrypt(input, keyRAW2.toString());
		decipherData= bytesDecrypt.toString(CryptoJS.enc.Utf8);
	}
	
	return decipherData;

}

 /* ============== E N C R Y P T O     V 2   ================
 		=============== A E S ==============

		 SE UTILIZA EL ALGORITMO AES PARA LA ENCRIPTACIÓN Y DESENCRIPTACION DE LA DATA
 
 */

//=============================================	VARIABLES NECESARIAS PARA LA ENCRIPTACIÓN======================================================

var key = CryptoJS.enc.Utf8.parse('7061737323313233');
var iv = CryptoJS.enc.Utf8.parse('7061737323313233');

/*encryptAES:  funcion para encriptar la data a enviar a los sericios */
export function encryptAES (input){
	let encrypted;
	if(input !== null && typeof input === 'object'){
		
		var objectParse=JSON.stringify(input);
		encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(objectParse), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

	}else{
		encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(input), key,
            {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
	}
	
	return encrypted.toString();
}


/*decryptAES:  funcion para desencriptar la data que recibo de los sericios */
export function decryptAES(input, isObject){
	let decrypted;
	
	if(input!==null && isObject === undefined){
		
		decryptedBytes = CryptoJS.AES.decrypt(input, key, {
			keySize: 128 / 8,
			iv: iv,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7
        });	

		decrypted=decryptedBytes.toString(CryptoJS.enc.Utf8);

	}else{

		var decryptedBytes = CryptoJS.AES.decrypt(input, key, {
            keySize: 128 / 8,
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

		decrypted= JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
	}	

		return decrypted;
}
        