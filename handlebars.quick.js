/**!
 * @license Handlebars Quick (https://github.com/shamasis/handlebars-quick)
 *
 * Third-party attributions:
 * microAjax - Copyright (c) 2008 Stefan Lange-Hegermann
 */
(function (glob) {
    var E = '',
        MicroAjax,
        Handlebars = glob.Handlebars; // fn

    MicroAjax = function (url, callbackFunction) {
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

        this.postBody = (arguments[2] || E);
        this.callbackFunction = callbackFunction;
        this.url = url;
        this.request = this.getRequest();

        if (this.request) {
            var req = this.request;
            req.onreadystatechange = this.bindFunction(this.stateChange, this);

            if (this.postBody !== E) {
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

    /**
     * `Handlebars.quick` will accept a handlebar template and its associated specifications object and after compiling
     * it set the result to the target HTMLDOM element provided.
     *
     * @param {object} options
     * @param {string} optioms.target
     * @param {string} options.template
     * @param {object} options.spec
     */
    Handlebars.quick = function (options) {

        // validate options object
        (typeof options !== 'object') && (options = {});

        // ensure that the target element provided is a valid HTML DOM object in case param is a string
        (typeof options.target === 'string') && (options.target =
            glob.document.getElementById(options.target.replace(/^#/g, E)));

        // Compile the template
        options.target.innerHTML = Handlebars.compile(options.template)(options.spec);
    };

    /**
     * @param {object} options
     * @param {string} options.templateUrl
     * @param {string} options.specUrl
     * @param {string} options.target
     * @param {function} callback
     */
    Handlebars.quickAsync = function (options, callback) {

        // validate options object
        (typeof options !== 'object') && (options = {});

        /**
         * When AJAX response is received, we would process the result and execute callback.
         */
        var process = function () {
            if (options.hasOwnProperty('template') && options.hasOwnProperty('spec')) {
                Handlebars.quick(options);
                callback(options);
            }
        };

        new MicroAjax(options.templateUrl, function (response) {
            options.template = response;
            process();
        });

        new MicroAjax(options.specUrl, function (response) {
            options.spec = JSON.parse(response);
            process();
        });
    };

}(this));
