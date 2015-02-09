/*! handlebars-quick v2.0.0-development by Shamasis Bhattacharya <mail@shamasis.net> (2015-02-09) */
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

(function (glob) {
    var E = '',
        TEMPLATE = 'template',
        PARTIAL = 'partial',
        SPEC = 'spec',
        MicroAjax = glob.MicroAjax, // fn
        Handlebars = glob.Handlebars, // fn

        defined = function () {
            for (var i = 0, ii = arguments.length; i < ii; i++) {
                if (arguments[i] !== undefined) {
                    return arguments[i];
                }
            }
        };

    Handlebars.quick = {
        options: {
            templatePath: E,
            templateFileExtension: '.hbs',
            partialPath: E,
            partialFilePrefix: '_',
            specPath: E,
            specFileExtension: '.json'
        },

        /**
         * @private
         *
         * @param {string} url
         * @param {function} callback
         * @param {*} args
         */
        fetch: function (url, callback, args) {
            var scope = this;
            new MicroAjax(url, function (response) {
                callback.call(scope, response, args);
            });
        },

        /**
         * @private
         *
         * @param {string} type `template`, `spec` or `partial`
         * @param {string} name
         * @returns {string}
         */
        getUrl: function (type, name) {
            var url = E;

            switch (type) {
            case 'template':
                url += this.options.templatePath + name + this.options.templateFileExtension;
                break;
            case 'partial':
                url += this.options.partialPath + this.options.partialFilePrefix + name +
                    this.options.templateFileExtension;
                break;
            case 'spec':
                url += this.options.specPath + name + this.options.specFileExtension;
                break;
            }

            return url;
        },

        /**
         * @param {string|array<string>} partials
         * @param {function} callback
         */
        registerPartialAsync: function (partials, callback) {
            var loaded = 0,
                i,
                ii,

                processAsyncPartialResponse = function (response, partial) {
                    Handlebars.registerPartial(partial, response);

                    // execute callback when all partials are loaded
                    // verify requested partial count vs load count so that synchronous ajax calls can be supported
                    if ((++loaded) === partials.length) {
                        Handlebars.Utils.isFunction(callback) && callback.call(this);
                    }

                };

            if (!defined(partials)) {
                Handlebars.Utils.isFunction(callback) && callback.call(this);
                return;
            }

            // convert to array if a single one is sent
            partials = [].concat(partials);

            for (i = 0, ii = partials.length; i < ii; i++) {
                this.fetch(this.getUrl(PARTIAL, partials[i]), processAsyncPartialResponse, partials[i]);
            }
        },

        /**
         * This function will accept a handlebar template and its associated specifications object and after
         * compiling it set the result to the target HTMLDOM element provided.
         *
         * @param {string} target
         * @param {string} template
         * @param {object} spec
         * @param {function} callback
         */
        render: function (target, template, spec, callback) {
            var elements,
                i,
                ii;

            // ensure that the target element provided is a valid set of HTML DOM objects in case param is a string
            switch (target.charAt && target.charAt()) {
            case '#':
                elements = [glob.document.getElementById(target.replace(/^#/g, E))];
                break;

            case '.':
                elements = glob.document.getElementsByClassName(target.replace(/^./g, E));
                break;

            default:
                if (typeof target === 'string') {
                    elements = glob.document.getElementsByTagName(target);
                }
                else if (Handlebars.Utils.isArray(target)) {
                    elements = [].concat(target);
                }
                else if (target) {
                    elements = [target];
                }
            }

            if (elements) {
                for (i = 0, ii = elements.length; i < ii; i++) {
                    if (elements[i]) {
                        elements[i].innerHTML = Handlebars.compile(template || E)(spec || {});
                    }
                }
            }

            Handlebars.Utils.isFunction(callback) && callback();

            // return promise;
        },

        /**
         * @param {string} target
         * @param {string} templateName
         * @param {string|object} specName
         * @param {function} callback
         */
        renderAsync: function (target, templateName, specName, callback) {
            var template,
                spec,

                renderIfPossible = function () {
                    // check if spec and template are both available and then call render.
                    if (template && spec) {
                        this.render(target, template, spec);
                        Handlebars.Utils.isFunction(callback) && callback.call(this);
                    }
                };

            if (typeof specName === 'string') {

                this.fetch(this.getUrl(SPEC, specName), function (response) {
                    spec = JSON.parse(response);
                    renderIfPossible.call(this);
                });
            }
            // in case spec is already a JSON, we use it as spec
            else {
                spec = specName || {};
            }

            this.fetch(this.getUrl(TEMPLATE, templateName), function (response) {
                template = response;
                renderIfPossible.call(this);
            });
        }
    };
}(this));
