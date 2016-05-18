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
        output += Internals.renderJsDocForMethodArguments(args);

        output +=
            (args.length > 0 && returnType ? "    *\n" : '' ) +
(returnType ?
`    * @returns {${returnType}}` + "\n" : '') +
`    */`
;

        return output;
    }

    /**
     * @param {ClassMethodArgument[]} args
     * @returns {string}
     */
    static renderJsDocForMethodArguments(args) {
        let output = '';
        args.forEach((arg) => {
            output += Internals.renderJsDocForMethodArgument(arg);
        });
        return output;
    }

    /**
     * @param {ClassMethodArgument} arg
     * @returns {string}
     */
    static renderJsDocForMethodArgument(arg) {
        let output =
`    * @param {${arg.type}} ${arg.name}
`;
        output += arg.jsDocTypes ? Internals.renderJsDocForMethodArguments(arg.jsDocTypes) : '';
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
