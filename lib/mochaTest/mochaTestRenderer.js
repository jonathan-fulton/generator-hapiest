'use strict';

const _ = require('lodash');

class MochaTestRenderer {

    /**
     * @param {MochaTest} test
     *
     * @returns {string}
     */
    static render(test) {
        let output = `'use strict';` + "\n\n";

        output += Internal.renderDependencies(test.dependencies);
        output += test.setupCode || '';
        output += Internal.renderBlocks(test.describeBlocks,0);

        return output;
    }

}

module.exports = MochaTestRenderer;

class Internal {

    /**
     * @param {MochaTestDependency[]} dependencies
     */
    static renderDependencies(dependencies) {
        let output = '';
        dependencies.forEach(dependency => {
            output += `const ${dependency.variableName} = require('${dependency.requireString}')${dependency.postRequireString || ''};` + "\n";
        });
        output += "\n";
        return output;
    }

    /**
     * @param {Array.<MochaTestBlock>} blocks
     * @param {int} level - 0 corresponds to very top level (no indents)
     */
    static renderBlocks(blocks, level) {
        let output = '';

        blocks.forEach(block => {
            output += Internal.renderBlock(block, level);
        });

        return output;
    }

    /**
     * @param {MochaTestBlock|string} block
     * @param {int} level
     */
    static renderBlock(block, level) {
        const singleIndent =
`    `;

        let outerIndentLevel = '';
        for(let i=0; i<level; i++) {
            outerIndentLevel += singleIndent;
        }
        const innerIndentLevel = outerIndentLevel + singleIndent;

        let output = '';

        output += "\n";
        output += outerIndentLevel + `${block.functionName}(${block.description ? "'" + block.description + "', " : ''}function(${block.passDoneToCallback ? 'done' : ''}) {` + "\n";

        if(typeof(block.callbackBody) === 'string') {
            output += block.callbackBody.split("\n")
                .map(blockLine => (innerIndentLevel + blockLine))
                .join("\n");
        } else {
            output += Internal.renderBlocks(block.callbackBody, level+1);
        }

        output += "\n" + outerIndentLevel + "});\n";

        return output;
    }

}