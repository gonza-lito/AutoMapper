export interface INamingConvention {
    /** Regular expression on how to tokenize a member. */
    splittingExpression: RegExp;

    /** Character to separate on. */
    separatorCharacter: string;

    /**
     * Transformation function called when this convention is the destination naming convention.
     * @param {string[]} sourcePropertyNameParts Array containing tokenized source property name parts.
     * @returns {string} Destination property name
     */
    transformPropertyName: (sourcePropertyNameParts: string[]) => string;
}