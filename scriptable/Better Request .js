// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: cloud-upload-alt;
/*******************************************
 *                                         *
 *         ____       _   _                *
 *        |  _ \     | | | |               *
 *        | |_) | ___| |_| |_ ___ _ __     *
 *        |  _ < / _ \ __| __/ _ \ '__|    *
 *   _____| |_) |  __/ |_| ||  __/ |  _    *
 *  |  __ \____/ \___|\__|\__\___|_| | |   *
 *  | |__) |___  __ _ _   _  ___  ___| |_  *
 *  |  _  // _ \/ _` | | | |/ _ \/ __| __| *
 *  | | \ \  __/ (_| | |_| |  __/\__ \ |_  *
 *  |_|  \_\___|\__, |\__,_|\___||___/\__| *
 *                 | |                     *
 *                 |_|                     *
 *                                         *
 *                                         *
 *  A better version of the Request API.   *
 *                                         *
 *  It sets the correct content type and   *
 *   formats the body correctly for the    *
 *                  types                  *
 * - json (application/json)               *
 * - forms                                 *
 *   (application/x-www-form-urlencoded)   *
 * - Data (the Scriptable API)             *
 *   (application/octet-stream)            *
 * - strings (text/plain)                  *
 *                                         *
 *  You can do everything what you can do  *
 * with the original Request API. Even if  *
 * it gets new properties, they will also  *
 *      be available on this wrapper.      *
 *                                         *
 * This also fixes ignored properties when *
 *   assigning them with the . operator:   *
                                            
   let req = new Request(url);              
   req.header = {};                         
   req.header.foo = "bar";                  
   log(req.header); // prints "{}"          
                                            
 *                 Usage:                  *
 * Use it like the normal Request API, but *
 *  use the properties "json" and "form"   *
 * for the first two content types listed  *
 *  above and "body" for all other types   *
                                            
   // import this script                    
   let BetterRequest = importModule("BetterRequest"); 
                                            
   // use it                                
   let req = new BetterRequest("https://httpbin.org/post"); 
   req.method = "post";                     
   req.json = {                             
   	foo: "bar"                              
   };                                       
   let res = await req.loadJSON();          
                                            
 * For more examples scroll to the bottom  *
 *   and look through the tests. To run    *
 *   them, simply run this script on its   *
 *                  own.                   *
 *                                         *
 * Made by @schl3ck in April 2019 (Reddit, *
 *            Automators Talk)             *
 *                                         *
 *              Version 1.0.1              *
 *                                         *
 * Changelog is at the end of this script  *
 *                                         *
 *******************************************/


function encodeURL(url) {
	return url.replace(/[^0-9a-zA-Z]/g, (match) => {
		let hex = match.charCodeAt(0).toString(16);
		if (hex.length % 2 !== 0) hex = "0" + hex;
		return hex.replace(/[\S\s]{2}/g, "%$&");
	});
}

let BetterRequest = (function() {
	
	let stringify = JSON.stringify;
	
	function BetterRequest(url) {
		this.request = new Request(url);
		
		this.headers = {};
		this.body = null;
	}
	
	Object.keys(Request.prototype).forEach(p => {
		if (p === "body" || p === "headers") return;
		
		if (p.includes("load")) {
			BetterRequest.prototype[p] = function() {
// 	 			log("inside " + p)
				convert(this);
// 	 			log(this.request)
				return this.request[p]();
			};
			return;
		}
			Object.defineProperty(BetterRequest.prototype, p, {
			enumerable: true,
			get: function() {
				return this.request[p];
			},
			set: function(value) {
				return this.request[p] = value;
			}
		})
	});
		
	function convert(that) {
// 		log(that.headers["Content-Type"]);
// 		log(that.body, that.json, that.form);
		if (!that.headers["Content-Type"] && typeof (that.body || that.json || that.form) !== "undefined") {
			let contentType;
			if (typeof that.json === "object") {
				that.body = that.json;
			}
			if (typeof that.body === "string") {
				contentType = "text/plain";
			} else if (typeof that.body === "object" && that.body != null && !(that.body instanceof Data)) {
				contentType = "application/json";
				that.body = stringify(that.body);
			} else if (typeof that.form === "object") {
				contentType = "application/x-www-form-urlencoded";
				let ar = [];
// 				log(Object.entries(that.form))
				for (let [k, v] of Object.entries(that.form)) {
// 					log(`entry ${k} = ${v}`);
					
					if (v == null) 
						v = "";
					else if (typeof v === "object")
						v = stringify(v);
					
					ar.push(
						`${encodeURL("" + k)}=${encodeURL("" + v)}`
					);
				}
				that.body = ar.join("&");
			} else if (that.body instanceof Data) {
				contentType = "application/octet-stream";
			}
			
			
			that.headers["Content-Type"] = contentType;
			
			that.request.body = that.body;
		}
		that.request.headers = that.headers;
	}
	
	return BetterRequest;
})();

module.exports = BetterRequest;

if (module.filename.replace(/^.*\/([^\/]+)\.js$/, "$1") === Script.name()) {
	logWarning("Running tests...");
	
	let createReq = function() {
		let req = new BetterRequest("https://httpbin.org/post");
		req.method = "post";
		return req;
	}
	
	let jsonReq = createReq();
	jsonReq.json = {
		test: 1234,
		asdf: "foo bar"
	};
	jsonReq.loadJSON().then((res) => {
		log("jsonReq:", jsonReq, "\n\nresponse:", res);
	});
	
	let formReq = createReq();
	formReq.form = {
		test: 1234,
		asdf: "foo bar"
	};
	formReq.loadJSON().then((res) => {
		log("formReq:", formReq, "\n\nresponse:", res);
	});
	
	let dataReq = createReq();
	dataReq.body = Data.fromString("test string");
	dataReq.loadJSON().then((res) => {
		log("dataReq:", dataReq, "\n\nresponse:", res);
	});

}

function log(...args) {
	args = args.map(arg => 
	typeof arg === "object" && arg != null ?
		JSON.stringify(arg, null, 4) :
		arg
	);
	console.log(args.join(" "));
}


/********** Changelog **********

v1.0.1 - 2019-04-18
* Changed example in the comment at the top to not suggest that Request.body = {} works for sending  JSON
* Fixed missing content type for text/plain

v1.0 2019-04-09
Initial release

*/

