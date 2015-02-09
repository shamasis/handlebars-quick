/**
 * microAjax - Copyright (c) 2008 Stefan Lange-Hegermann
 */
(function (glob) {
    glob.MicroAjax = function (url, callbackFunction) {
        this.bindFunction = function (caller, object) {
            return function () {
                return caller.apply(object, [object]);
            };
        };

        this.stateChange = function () {
            if (this.request.readyState == 4) {
                this.callbackFunction(this.request.responseText, this.request);
            }
        };

        this.getRequest = function () {
            if (glob.ActiveXObject) {
                return new glob.ActiveXObject('Microsoft.XMLHTTP');
            }
            else if (glob.XMLHttpRequest) {
                return new glob.XMLHttpRequest();
            }

            return false;
        };

        this.postBody = (arguments[2] || '');
        this.callbackFunction = callbackFunction;
        this.url = url;
        this.request = this.getRequest();

        if (this.request) {
            var req = this.request;
            req.onreadystatechange = this.bindFunction(this.stateChange, this);

            if (this.postBody !== '') {
                req.open('POST', url, true);
                req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                req.setRequestHeader('Connection', 'close');
            }
            else {
                req.open('GET', url, true);
            }

            req.send(this.postBody);
        }
    };
}(this));
