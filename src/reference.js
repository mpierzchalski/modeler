define(function (require) {
    'use strict';

    /**
     * @constructor
     */
    var Reference = function(modelName, parent) {
        this.modelName = modelName;
        this.parent = parent;
    };

    Reference.prototype = {
        modeler: undefined,

        /**
         * Sets Modeler
         *
         * @param {Modeler} Modeler
         * @returns {Reference}
         */
        setModeler: function(Modeler) {
            this.modeler = Modeler;
            return this;
        },

        fetch: function(property, data) {
            if (!(data instanceof Object) && data !== null) {
                throw new Error(
                    "Invalid argument 'data' type. It must be Object or null. "+
                    (data !== undefined ? data.constructor : data)+" given for '"+property+"' fetch."
                );
            }
            this.modeler.get(this.modelName, function(data) {
                this.parent[property] = data;
            }.bind(this), data)
        }
    };

    return Reference;
});