'use strict';

const ClassDependencyRenderer = require('./classDependencyRenderer');
const ClassMethodRenderer = require('./classMethodRenderer');

class ClassRenderer {

    /**
     * @param {Class} classObj
     */
    static render(classObj) {

        const extendsString = classObj.extends ? ` extends ${classObj.extends}` : '';
        let dependenciesOutput = ClassDependencyRenderer.renderMany(classObj.dependencies);
        dependenciesOutput = (dependenciesOutput !== '') ? "\n" + dependenciesOutput + "\n" : '';
        const methodsOutput = ClassMethodRenderer.renderMany(classObj.methods);

        let output =
`'use strict';
${dependenciesOutput}
class ${classObj.name}${extendsString} {

${methodsOutput}
}

module.exports = ${classObj.name};`;

        return output;
    }

}

module.exports = ClassRenderer;
