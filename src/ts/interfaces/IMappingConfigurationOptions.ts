export interface IMappingConfigurationOptions {
    /** The source object to map. */
    sourceObject: any;

    /** The source property to map. */
    sourcePropertyName: string;

    /**
     * The intermediate destination property value, used for stacking multiple for(Source)Member calls
     * while elaborating the intermediate result.
     */
    intermediatePropertyValue: any;
}