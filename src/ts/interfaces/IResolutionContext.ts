export interface IResolutionContext {
    /** Source value */
    sourceValue: any;

    /** Destination value */
    destinationValue: any;

    /** Source property name */
    sourcePropertyName?: string;

    /** Destination property name */
    destinationPropertyName?: string;

    /** Index of current collection mapping */
    arrayIndex?: number;
}
