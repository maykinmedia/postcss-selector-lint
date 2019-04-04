const chai = require('chai');
const postcss = require('postcss');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const selectorLint = require('../src/index');

const {assert, expect} = chai;
chai.use(sinonChai);

describe('postcss-selector-lint', () => {
    it('should be importable', () => assert.ok(selectorLint));

    it('should inform the user about invalid CSS rules', () => {
        const input = `
            > foo {
                color: blue;
            }
        `;

        sinon.stub(console, 'warn');
        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                expect(console.warn).to.have.been.calledWith(`🐶 Found invalid CSS rule (:2,13 "> foo").`);
                sinon.restore();
            })
            .catch(e => assert.notOk(e.message));
    });

    it('should inform the user about disallowed CSS rules at global level', () => {
        const input = `
            foo {
                color: blue;
            }
        `;

        sinon.stub(console, 'warn');
        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                expect(console.warn).to.have.been.calledWith(`🐱 Please don\'t use CSS selectors of type "type" in global scope (:2,13 "foo").`);
                sinon.restore();
            })
            .catch(e => assert.notOk(e.message));
    });

    it('should inform the user about disallowed CSS rules at local level', () => {
        const input = `
            .foo #bar {
                color: blue;
            }
        `;

        sinon.stub(console, 'warn');
        return postcss([selectorLint()]).process(input, {from: undefined})
            .then(result => {
                expect(console.warn).to.have.been.calledWith(`🐱 Please don\'t use CSS selectors of type "id" in local scope (:2,13 "#bar").`);
                sinon.restore();
            })
            .catch(e => assert.notOk(e.message));
    });
});