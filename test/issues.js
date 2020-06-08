const chai = require('chai');
const postcss = require('postcss');
const selectorLint = require('../src/index');

const {assert} = chai;

describe('postcss-selector-lint (issues)', () => {
    it('issue #1: Usage of keyframes result in invalid CSS message.', () => {
        const input = `
            .foo {
              @keyframes spin {
                0% {
                  transform: rotate(0deg);
                }
                100% {
                  transform: rotate(360deg);
                }
              }
            }
        `;

        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                const warnings = result.warnings();
                assert.lengthOf(warnings, 0);
            })
            .catch(e => assert.notOk(e.message));
    });

    it('issue #3: Pseudo configuration is ignored.', () => {
        const config = {
            global: {
                pseudo: true,
            },

            local: {
                pseudo: true,
            },
        };

        const input = `
            :foo {
            }

            .foo :bar {
            }
        `;

        return postcss([selectorLint(config)]).process(input, {from: undefined})
            .then(result => {
                const warnings = result.warnings();
                assert.lengthOf(warnings, 0);
            })
            .catch(e => assert.notOk(e.message));
    });
});
