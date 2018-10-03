import { IMappingConfigurationOptions } from './IMappingConfigurationOptions';

export interface ISourceMemberConfigurationOptions extends IMappingConfigurationOptions {
    /**
     * When this configuration function is used, the property is ignored
     * when mapping.
     */
    ignore: () => void;
}
