module.exports = {
    /**
     * Include parentheses around a sole arrow function parameter.
     *
     * avoid - Omit parens when possible. Example: `x => x`
     * always - Always include parens. Example: `(x) => x`
     */
    arrowParens: 'always',

    /** Print spaces between brackets. */
    bracketSpacing: true,

    /**
     * Print (to stderr) where a cursor at the given position would move to after formatting.
     * This option cannot be used with --range-start and --range-end.
     */
    cursorOffset: -1,

    /**
     * Which end of line characters to apply.
     *
     * auto - Maintain existing (mixed values within one file are normalised by looking at what's used after the first line)
     * lf - Line Feed only (\n), common on Linux and macOS as well as inside git repos
     * crlf - Carriage Return + Line Feed characters (\r\n), common on Windows
     * cr - Carriage Return character only (\r), used very rarely
     */
    endOfLine: 'lf',

    /** The line length where Prettier will try wrap. */
    printWidth: 120,

    /**
     * How to wrap prose.
     *
     * always - Wrap prose if it exceeds the print width.
     * never - Do not wrap prose.
     * preserve - Wrap prose as-is.
     */
    proseWrap: 'preserve',

    /**
     * Change when properties in objects are quoted.
     *
     * as-needed - Only add quotes around object properties where required.
     * consistent - If at least one property in an object requires quotes, quote all properties.
     * preserve - Respect the input use of quotes in object properties.
     */
    quoteProps: 'consistent',

    /** Print semicolons. */
    semi: true,

    /** Use single quotes instead of double quotes. */
    singleQuote: true,

    /** Number of spaces per indentation level. */
    tabWidth: 4,

    /**
     * Print trailing commas wherever possible when multi-line.
     *
     * none - No trailing commas.
     * es5 - Trailing commas where valid in ES5 (objects, arrays, etc.)
     * all - Trailing commas wherever possible (including function arguments).
     */
    trailingComma: 'es5',

    /** Indent with tabs instead of spaces. */
    useTabs: false,
};