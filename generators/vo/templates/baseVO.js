'use strict';

const VO = require('hapiest').VO;

class <%= voClassName %> extends VO {

    /**
     * @param {object} obj
     <% voClassProperties.forEach((property) => { %>* @param {<%= property.propertyType %>} obj.<%= property.propertyName %>
     <% }); %>*/
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    <% voClassProperties.forEach((property) => { %>
    /**
     * @return {<%= property.propertyType %>}
     */
    get <%= property.propertyName %>() {return this.get('<%= property.propertyName %>');}
    <% }); %>
}

module.exports = <%= voClassName %>;