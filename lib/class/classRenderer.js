'use strict';

const ClassDependencyRenderer = require('./classDependencyRenderer');
const ClassMethodRenderer = require('./classMethodRenderer');

class ClassRenderer {

    /**
     * @param {Class} classObj
     */
    static render(classObj) {

        const dependenciesOutput = ClassDependencyRenderer.renderMany(classObj.dependencies);
        const methodsOutput = ClassMethodRenderer.renderMany(classObj.methods);

        let output =
`'use strict';

${dependenciesOutput}

class ${classObj.name} {

${methodsOutput}
}

module.exports = ${classObj.name};`;

        return output;
    }

}

module.exports = ClassRenderer;
