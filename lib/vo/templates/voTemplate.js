'use strict';

const VO = require('hapiest-vo');

class <%= voClassName %> extends VO {

    /**
     * @param {object} obj
     <% voClassProperties.forEach((property) => { %>* @param {<%= property.type %>} obj.<%= property.name %>
     <% }); %>*/
    constructor(obj) {
        super();
        this._addProperties(obj);
    }

    <% voClassProperties.forEach((property) => { %>
    /**
     * @return {<%= property.type %>}
     */
    get <%= property.name %>() {return this.get('<%= property.name %>');}
    <% }); %>
}

module.exports = <%= voClassName %>;