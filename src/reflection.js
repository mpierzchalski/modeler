define(function (require) {
    'use strict';

    /**
     * Reflection class for Models
     *
     * @param {function} Model
     * @constructor
     */
    var ReflectionModel = function(Model) {
        this.Model = Model;

        this._model = Model.toString();
        this._name = undefined;
        this._properties = undefined;
        this._references = {
            count: 0,
            data: undefined,
            loaded: []
        };
    };

    /**
     * @returns {string}
     */
    ReflectionModel.prototype.getName = function() {
        if (this._name !== undefined) {
            return this._name;
        }
        return this._name = this._model.match(/^function(.+)\(/)[1].trim();
    };

    /**
     * @returns {{}}
     */
    ReflectionModel.prototype.getProperties = function() {
        if (this._properties !== undefined) {
            return this._properties;
        }
        var result = {};
        var references = {};
        var props = this._model.match(/this\.(.+)\;/g);
        for (var p = 0; p < props.length; p++) {
            var parts = props[p].split('=');
            var _name = parts[0].trim().substr(5);
            var _definition = parts[1].substr(0, parts[1].length-1).trim();
            result[_name] = _definition;

            if (_definition.match(/new Collection|new Reference/)) {
                var _ref = this._retrieveReferences(_definition);
                if (_ref) {
                    references[_name] = _ref;
                }
            }
        }
        this._references['data'] = references;
        var _referencesCount = 0;
        for (var r in references) {
            if (!references.hasOwnProperty(r)) continue;
            _referencesCount++;
        }
        this._references['count'] = _referencesCount;
        return this._properties = result;
    };

    /**
     * @param {string} definition
     * @returns {string}
     * @private
     */
    ReflectionModel.prototype._retrieveReferences = function (definition) {
        var _collection = definition.match(/new Collection(.[^\w]+)([\w\/]+).+\)/);
        if (_collection && typeof _collection[2] !== 'undefined' && _collection[2]) {
            return _collection[2];
        }

        var _reference = definition.match(/new Reference(.[^\w]+)([\w\/]+).+\)/);
        if (_reference && typeof _reference[2] !== 'undefined' && _reference[2]) {
            return _reference[2];
        }
        return null;
    };

    /**
     * @returns {{}}
     */
    ReflectionModel.prototype.getReferences = function() {
        this.getProperties();
        return this._references.data;
    };

    /**
     *
     * @param {Modeler} Modeler
     * @param {string} name
     * @param {function} rootModel
     * @param {function} callback
     */
    ReflectionModel.prototype.persistReference = function(Modeler, name, rootModel, callback) {
        this._references.loaded.push(name);
        if (this._references.loaded.length === this._references.count) {
            callback.apply(Modeler, [rootModel]);
        }
    };

    return ReflectionModel;
});