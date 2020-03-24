const chai = require('chai');
const postcss = require('postcss');
const selectorLint = require('../src/index');

const {assert} = chai;

describe('postcss-selector-lint', () => {
    it('should be importable', () => assert.ok(selectorLint));

    it('should inform the user about invalid CSS rules', () => {
        const input = `
            > foo {
                color: blue;
            }
        `;

        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                const warnings = result.warnings();
                assert.lengthOf(warnings, 1);
                assert.equal(warnings[0].text, '🐶 Found invalid CSS rule (:2,13 "> foo").' );
            })
            .catch(e => assert.notOk(e.message));
    });

    it('should inform the user about disallowed CSS rules at global level', () => {
        const input = `
            foo {
                color: blue;
            }
        `;

        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                const warnings = result.warnings();
                assert.lengthOf(warnings, 1);
                assert.equal(warnings[0].text, '🐱 Please don\'t use CSS selectors of type "type" in global scope (:2,13 "foo").');
            })
            .catch(e => assert.notOk(e.message));
    });

    it('should inform the user about disallowed CSS rules at local level', () => {
        const input = `
            .foo #bar {
                color: blue;
            }
        `;

        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                const warnings = result.warnings();
                assert.lengthOf(warnings, 1);
                assert.equal(warnings[0].text, '🐱 Please don\'t use CSS selectors of type "id" in local scope (:2,13 "#bar").');
            })
            .catch(e => assert.notOk(e.message));
    });
});
