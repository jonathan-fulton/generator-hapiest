'use strict';

class ClassDependencyRenderer {

    /**
     * @param {ClassDependency} classDependency
     * @returns {string}
     */
    static render(classDependency) {
        return `const ${classDependency.variableName} = require('${classDependency.requireString}');`;
    }

    /**
     * @param {ClassDependency[]} classDependencies
     * @returns {string}
     */
    static renderMany(classDependencies) {
        let output = '';
        classDependencies.forEach((dependency,index) => {
            output += (index > 0 ? "\n" : '') + ClassDependencyRenderer.render(dependency);
        });
        return output;
    }

}

module.exports = ClassDependencyRenderer;