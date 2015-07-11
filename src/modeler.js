define(function (require) {
    'use strict';

    var ReflectionModel = require('inl/reflectionModel'),
        Reference = require('inl/reference'),
        Collection = require('inl/collection');

    /**
     * @constructor
     */
    var Modeler = function(mapping) {
        this.mapping = mapping || {};
    };

    Modeler.prototype = {

        /**
         * Reflected data from loaded models
         */
        _metadata: {},

        _namespace_separator: '/',

        /**
         * Registers model in modeler
         *
         * @param {string} name     Model's name
         * @param {string} mapping  requireJs source path
         */
        register: function(name, mapping) {
            if (this.mapping.hasOwnProperty(name)) {
                throw new Error("Model '"+name+"' is already registered.");
            }
            this.mapping[name] = mapping;
        },

        /**
         * @param {string} name     Model's name
         * @returns {string}
         */
        normalizeModel: function(name) {
            var normalizedData = this._normalizeModelName(name);
            if (normalizedData.mapping) {
                try { this.register(normalizedData.name, normalizedData.mapping); } catch (err) {}
            }
            return normalizedData.name;
        },

        /**
         * @param {string} name     Model's name
         * @returns {{
         *      name: string,
         *      mapping: string
         *  }}
         * @private
         */
        _normalizeModelName: function(name) {
            var _result = {
                name: name,
                mapping: ''
            };
            if (name.indexOf(this._namespace_separator) >= 0) {
                var parts = name.split(this._namespace_separator);
                _result.name = parts[parts.length-1];
                _result.mapping = name;
            }
            return _result;
        },

        /**
         * Gets model and invokes callback on complete loading
         *
         * @param {string} name             Model's name
         * @param {function} callback       Callback invoked after model loading
         * @param {object} data [optional]  Data fetched into model
         */
        get: function(name, callback, data) {
            this._load(name, function(Model) {

                this._extend(Model);

                var _m = new Model();
                if (data !== undefined) {
                    _m.fetch(data);
                }
                callback.apply(this, [_m]);

            }.bind(this));
        },

        /**
         * Maps data listing into models
         *
         * @param {string} name         Model's name
         * @param {Array} list          List of data
         * @param {function} callback   Callback invoked after model loading
         */
        map: function(name, list, callback) {
            if (!(list instanceof Array) && list !== null) {
                throw new Error(
                    "Invalid argument 'list' type. It must be Array or null. "+
                    (list !== undefined ? list.constructor : list)+" given."
                );
            }
            list = list || [];
            this._load(name, function(Model) {

                this._extend(Model);

                var _result = [];
                for (var i = 0; i < list.length; i++) {
                    _result.push(new Model().fetch(list[i]));
                }
                callback.apply(this, [_result]);

            }.bind(this));
        },

        /**
         * Loads model with all referenced ones
         *
         * @param {string}      name        Model's name
         * @param {function}    callback    Callback
         * @param {string}      rootModel   [optional]
         * @private
         */
        _load: function(name, callback, rootModel) {

            name = this.normalizeModel(name);
            if (!this.mapping.hasOwnProperty(name)) {
                throw new Error("Model '"+name+"' not found.");
            }

            if (this._metadata[name]) {
                callback.apply(this, [this._metadata[name].Model]);

            } else {
                requirejs([this.mapping[name]], function(callback, rootModel, Model) {

                    var _internally = true;

                    if (typeof rootModel === 'undefined') {
                        rootModel = Model;
                        _internally = false;
                    }

                    var ref = this._metadata[name] = new ReflectionModel(Model);

                    Model.prototype.__modelName = ref.getName();

                    var references = ref.getReferences();
                    for (var r in references) {
                        if (!references.hasOwnProperty(r)) continue;
                        var loadCallback = ReflectionModel.prototype.persistReference.bind(
                            ref,
                            this,
                            references[r],
                            rootModel,
                            callback
                        );
                        this._load(references[r], loadCallback, rootModel);
                    }
                    if (_internally) {
                        callback.apply(this, [Model])
                    }
                }.bind(this, callback, rootModel));
            }
        },

        /**
         * Binds prototype methods
         *
         * @param {function} Model
         * @private
         */
        _extend: function(Model) {
            var Modeler = this;

            Model.prototype.__state = 'NEW';

            Model.prototype.isEmpty = function() {
                return this.__state === 'NEW';
            };

            Model.prototype.fetch = function(data) {
                if (this.__state !== 'NEW') {
                    throw new Error(
                        "Model object "+this.__modelName+" cannot be fetched. It's in "+this.__state+" state"
                    );
                }

                if (null === data) {
                    return this;
                }

                for (var k in this) {
                    if (!this.hasOwnProperty(k)) continue;
                    var _data = (data.hasOwnProperty(k)) ? data[k] : null;

                    if (this[k] instanceof Collection || this[k] instanceof Reference) {
                        this[k].setModeler(Modeler).fetch(k, _data);

                    } else {
                        this[k] = _data;
                    }
                }
                this.__state = 'FETCHED';
                return this;
            };
        }
    };

    return Modeler;
});