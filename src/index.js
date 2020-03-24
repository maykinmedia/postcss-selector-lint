const path = require('path');
const postcss = require('postcss');

module.exports = postcss.plugin('postcss-selector-lint', userConfig => {

    // Default configuration
    // Only classes on root (global) scope, no id's on nested (local) scope.
    //
    // "Only use class names in selectors, no IDs or HTML tag names." -- kandl-style-guide.
    const config = {
        global: {
            // Simple
            type: false,
            class: true,
            id: false,
            universal: false,
            attribute: false,

            // Pseudo
            psuedo: false,
        },

        local: {
            // Simple
            type: true,
            class: true,
            id: false,
            universal: true,
            attribute: true,

            // Pseudo
            psuedo: true,
        },

        options: {
            excludedFiles: [''],
            invalidCSS: true,
        }
    };

    // Apply user configuration.
    if (typeof userConfig === 'object') {
        if (typeof userConfig.options === 'object') {
            Object.assign(config.options, userConfig.options);
            userConfig.options = config.options;
        }
        Object.assign(config, userConfig);
    }

    /**
     * Returns whether filename is excluded from validation.
     * (config.)options.excludedFiles should be an array of exlude patterns.
     * Each value is checked using filname.match(pattern).
     *
     * @param {string} filename - The input filename.
     * @return {string} Whether filename is excluded from validation.
     */
    const isFilenameExluded = filename => {
        return !!config.options.excludedFiles
            .find(pattern => filename.match(pattern));
    };

    /**
     * Validates a root (file).
     * @param {Root} root - PostCSS root.
     * @param {Result} result - PostCSS result.
     */
    const validateRoot = (root, result) => {
        let excluded = false;

        if (root.source.input.file) {
            let filePath = root.source.input.file;
            let filename = path.basename(filePath);
            excluded = isFilenameExluded(filename);
        }

        if (!excluded) {
            root.walkRules(rule => validateRule(rule, result));
        }
    };

    /**
     * Validates a PostCSS rule.
     * @param {Rule} rule - PostCSS rule.
     * @param {Result} result - PostCSS result.
     */
    const validateRule = (rule, result) => {
        rule.selector.split(/\s+/)
            .forEach((selector, index) => validateSelector(selector, index, rule, result));

    };

    /**
     * Validate (partial) selector.
     * @param {string} selector - A (partial) CSS selector.
     * @param {number} depth - The index of the selector part, 0 means global.
     * @param {Rule} rule - PostCSS rule, used to access the complete selector.
     * @param {Result} result - PostCSS result.
     */
    const validateSelector = (selector, depth, rule, result) => {
        const atRule = rule.parent;
        // @keyframes rules don't contain selectors.
        if (atRule && atRule.name && atRule.name.indexOf('keyframes') > -1) {
            return
        }

        // Get the selector type.
        let selectorType = getSelectorType(selector);

        let scope = depth === 0 ? 'global' : 'local';

        // Get meta information.
        let filename = '';
        if (rule.source.input.file) {
            let filePath = rule.source.input.file;
            filename = path.basename(filePath);
        }
        let line = rule.source.start.line;
        let column = rule.source.start.column;
        let position = `${filename}:${line},${column}`;

        // Inform the user about using a non-allowed selector type.
        if (typeof selectorType === 'string' && !config[scope][selectorType]) {
            rule.warn(result, `🐱 Please don't use CSS selectors of type "${selectorType}" in ${scope} scope (${position} "${selector}").`);
        }

        // Inform the user about using an invalid selector type.
        if (typeof selectorType !== 'string' && scope === 'global' && config.options.invalidCSS) {
            rule.warn(result, `🐶 Found invalid CSS rule (${position} "${rule.selector}").`);
        }
    };

    /**
     * Returns the selector type based on the first character of selector.
     * @param {string} selector   A (partial) CSS selector.
     * @return {(string|false)} Type of selector if found, false otherwise.
     */
    const getSelectorType = selector => {
        const firstChar = selector[0];

        // Simple
        if (firstChar.match(/[a-zA-Z_-]/)) {
            return 'type';
        } else if (firstChar === '.') {
            return 'class';
        } else if (firstChar === '#') {
            return 'id';
        } else if (firstChar === '*') {
            return 'universal';
        } else if (firstChar === '[') {
            return 'attribute';
        }

        // Pseudo
        else if (firstChar === ':') {
            return 'pseudo';
        }

        return false;  // No idea what this is...
    };

    // Run the plugin.
    return (root, result) => validateRoot(root, result)
});
