'use strict';

class ClassMethodRenderer {

    /**
     * @param {ClassMethod} classMethod
     * @returns {string}
     */
    static render(classMethod) {
        const type = (classMethod.type === 'instance') ? '' : classMethod.type+' ';
        const jsDoc = Internals.renderJSDoc(classMethod.args, classMethod.returnType);
        const argList = Internals.renderArgList(classMethod.args);
        const output =
`${jsDoc}
    ${type}${classMethod.name}(${argList}) {
${classMethod.body}
    }
`;
        return output;
    }

    /**
     * @param {ClassMethod[]} classMethods
     * @returns {string}
     */
    static renderMany(classMethods) {
        let output = '';
        classMethods.forEach((method,index) => {
            output += (index > 0 ? "\n" : '') + ClassMethodRenderer.render(method);
        });
        return output;
    }

}

module.exports = ClassMethodRenderer;

class Internals {

    /**
     * @param {ClassMethodArgument[]} args
     * @param {string} returnType
     *
     * @returns {string}
     */
    static renderJSDoc(args, returnType) {
        let output =
`   /**
`;
        args.forEach((arg) => {
            output +=
`    * @param {${arg.type}} ${arg.name}
`;
        });

        output +=
            (args.length > 0 ? "    *\n" : '' ) +
`    * @returns {${returnType}}
    */`;

        return output;
    }

    /**
     * @param {ClassMethodArgument[]} args
     *
     * @returns {string}
     */
    static renderArgList(args) {
        return args.map(arg => arg.name).join(', ');
    }
    
}
