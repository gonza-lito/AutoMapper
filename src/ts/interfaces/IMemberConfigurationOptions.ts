import { ISourceMemberConfigurationOptions } from './ISourceMemberConfigurationOptions';

export interface IMemberConfigurationOptions extends ISourceMemberConfigurationOptions {
    /**
     * Map from a custom source property name.
     * @param sourcePropertyName The source property to map.
     */
    mapFrom: (sourcePropertyName: string) => void;

    /**
     * If specified, the property will only be mapped when the condition is fulfilled.
     */
    condition: (predicate: ((sourceObject: any) => boolean)) => void;
}
