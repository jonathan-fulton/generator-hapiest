'use strict';

const <%= voClassName %> = require('<%= voFileLocationForRequire %>');

class <%= factoryClassName %> {
<% factoryFunctions.forEach((functionName) => { %>
    /**
     * @param {object} obj<% voClassProperties.forEach((property) => { %>
     * @param {<%= property.type %>} obj.<%= property.name %><% }); %>
     *
     * @returns {<%= voClassName %>}
     */
    static <%= functionName %>(obj) {
        const newArgs = {
          <% voClassProperties.forEach((property, index) => { %><%=property.name%>: obj.<%=property.name%><%if(index < voClassProperties.length-1){%>,
          <%}%><% }) %>
        };
            
        return new <%= voClassName %>(newArgs);
    }
<% }); %>
}

module.exports = <%= factoryClassName %>;