import { IMapCallback } from './IMapCallback';
import { IAsyncMapItemFunction, IMapItemFunction } from './IMapItemFunction';
import { IProfile } from './IProfile';
import { IResolutionContext } from './IResolutionContext';
import { ISourceProperty } from './ISourceProperty';

export interface IMapping {
    /** The mapping source key. */
    sourceKey: string;

    /** The mapping destination key. */
    destinationKey: string;

    /** The mappings for forAllMembers functions. */
    forAllMemberMappings: Array<(destinationObject: any, destinationPropertyName: string, value: any) => void>;

    // propertiesOld: IPropertyOld[];
    properties: ISourceProperty[];

    /**
     * Skip normal member mapping and convert using a type converter.
     * @param resolutionContext Context information regarding resolution of a destination value
     * @returns {any} Destination object.
     */
    typeConverterFunction: ((resolutionContext: IResolutionContext) => any) |
    ((resolutionContext: IResolutionContext, callback: IMapCallback) => void);

    /** The source type class to convert from. */
    sourceTypeClass: any;

    /** The destination type class to convert to. */
    destinationTypeClass: any;

    /** The profile used when mapping. */
    profile?: IProfile;

    /** Whether or not to ignore all properties not specified using createMap. */
    ignoreAllNonExisting?: boolean;

    /** Whether or not an mapping has to be asynchronous. */
    async: boolean;

    /*
     * PERFORMANCE ENHANCEMENTS
     */

    /**
     * Item mapping function to use.
     */
    mapItemFunction: IMapItemFunction | IAsyncMapItemFunction;
}
