'use strict';

const <%= voClassName %> = require('<%= voFileLocationForRequire %>');

class <%= factoryClassName %> {
<% factoryFunctions.forEach((functionName) => { %>
    /**
     * @returns {<%= voClassName %>}
     */
    static <%= functionName %>() {
        return new <%= voClassName %>({});
    }
<% }); %>
}

module.exports = <%= factoryClassName %>;