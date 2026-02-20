/**
 * Converts a string to kebab-case.
 * Handles camelCase, PascalCase, spaces, underscores, and mixed input.
 *
 * @example
 * kebabCase("helloWorld")      // "hello-world"
 * kebabCase("Hello World")     // "hello-world"
 * kebabCase("foo_bar_baz")     // "foo-bar-baz"
 * kebabCase("XMLParser")       // "xml-parser"
 */
export function kebabCase(string: string): string {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2") // camelCase → camel-Case
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2") // XMLParser → XML-Parser
    .replace(/[\s_]+/g, "-") // spaces/underscores → hyphens
    .replace(/[^a-zA-Z0-9-]/g, "") // strip non-alphanumeric (except hyphens)
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, "") // trim leading/trailing hyphens
    .toLowerCase();
}

/**
 * Converts a string to kebab-case using only alphabetic characters (a–z).
 * Strips digits and all non-alpha characters before converting.
 *
 * @example
 * kebabCaseForAlpha("hello World 123") // "hello-world"
 * kebabCaseForAlpha("foo_bar2baz")     // "foo-bar-baz"
 * kebabCaseForAlpha("myVar1Name")      // "my-var-name"
 */
export function kebabCaseForAlpha(string: string): string {
  return string
    .replace(/([a-z])([A-Z])/g, "$1-$2") // split camelCase first
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[^a-zA-Z\s-]/g, " ") // replace non-alpha (digits etc.) with space
    .replace(/[\s_]+/g, "-") // spaces → hyphens
    .replace(/-+/g, "-") // collapse hyphens
    .replace(/^-|-$/g, "") // trim edges
    .toLowerCase();
}
