define(function (require) {
    'use strict';

    /**
     * @constructor
     */
    var Collection = function(modelName, parent) {
        this.modelName = modelName;
        this.parent = parent;
    };

    Collection.prototype = {
        modeler: undefined,

        /**
         * Sets Modeler
         *
         * @param {Modeler} Modeler
         * @returns {Collection}
         */
        setModeler: function(Modeler) {
            this.modeler = Modeler;
            return this;
        },

        fetch: function(property, list) {
            if (!(list instanceof Array) && list !== null) {
                throw new Error(
                    "Invalid argument 'list' type. It must be Array or null. "+
                    (list !== undefined ? list.constructor : list)+" given for '"+property+"' fetch."
                );
            }
            list = list || [];
            this.modeler.map(this.modelName, list, function(data) {
                this.parent[property] = data;
            }.bind(this))
        }
    };

    return Collection;
});