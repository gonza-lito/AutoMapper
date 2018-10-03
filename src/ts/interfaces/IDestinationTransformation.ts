import { IMemberCallback } from './IMemberCallback';
import { IMemberConfigurationOptions } from './IMemberConfigurationOptions';
import { ISourceMemberConfigurationOptions } from './ISourceMemberConfigurationOptions';

export interface IDestinationTransformation {
    transformationType: number; // Ideal: AutoMapperJs.DestinationTransformationType (but not as easy as it appears to be);
    constant?: any;
    memberConfigurationOptionsFunc?: (opts: IMemberConfigurationOptions) => void;
    asyncMemberConfigurationOptionsFunc?: (opts: IMemberConfigurationOptions, cb: IMemberCallback) => void;
    sourceMemberConfigurationOptionsFunc?: (opts: ISourceMemberConfigurationOptions) => void;
    asyncSourceMemberConfigurationOptionsFunc?: (opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => void;
}
