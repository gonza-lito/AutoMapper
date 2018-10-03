import { IMapCallback } from './IMapCallback';
import { IMemberCallback } from './IMemberCallback';
import { IMemberConfigurationOptions } from './IMemberConfigurationOptions';
import { IResolutionContext } from './IResolutionContext';
import { ISourceMemberConfigurationOptions } from './ISourceMemberConfigurationOptions';
import { ITypeConverter } from './ITypeConverter';

export interface ICreateMapFluentFunctions {
    /**
     * Customize configuration for an individual destination member.
     * @param sourceProperty The destination member property name.
     * @param valueOrFunction The value or function to use for this individual member.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    forMember: (sourceProperty: string, valueOrFunction: any |
        ((opts: IMemberConfigurationOptions) => any) |
        ((opts: IMemberConfigurationOptions, cb: IMemberCallback) => void)) => ICreateMapFluentFunctions;

    /**
     * Customize configuration for an individual source member.
     * @param sourceProperty The source member property name.
     * @param sourceMemberConfigFunction The function to use for this individual member.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    forSourceMember: (sourceProperty: string,
                      sourceMemberConfigFunction: ((opts: ISourceMemberConfigurationOptions) => any) |
            ((opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => void)
    ) => ICreateMapFluentFunctions;

    /**
     * Customize configuration for all destination members.
     * @param func The function to use for this individual member.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    forAllMembers: (func: (destinationObject: any, destinationPropertyName: string, value: any) => void) => ICreateMapFluentFunctions;

    /**
     * Ignore all members not specified explicitly.
     */
    ignoreAllNonExisting: () => ICreateMapFluentFunctions;

    /**
     * Skip normal member mapping and convert using a custom type converter (instantiated during mapping).
     * @param typeConverterClassOrFunction The converter class or function to use when converting.
     */
    convertUsing: (typeConverterClassOrFunction: ((resolutionContext: IResolutionContext) => any) |
        ((resolutionContext: IResolutionContext, callback: IMapCallback) => void) |
        ITypeConverter |
        (new () => ITypeConverter)
    ) => void;

    /**
     * Specify to which class type AutoMapper should convert. When specified,
     * AutoMapper will create an instance of the given type, instead of returning a new object literal.
     * @param typeClass The destination type class.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    convertToType: (typeClass: new () => any) => ICreateMapFluentFunctions;

    /**
     * Specify which profile should be used when mapping.
     * @param {string} profileName The profile name.
     * @returns {IAutoMapperCreateMapChainingFunctions}
     */
    withProfile: (profileName: string) => void;
}
