﻿import { AsyncAutoMapper } from './AsyncAutoMapper';
import { AutoMapperBase } from './AutoMapperBase';
import { DestinationTransformationType } from './AutoMapperEnumerations';
import { AutoMapperHelper } from './AutoMapperHelper';
import { AutoMapperValidator } from './AutoMapperValidator';
import { IConfiguration } from './interfaces/IConfiguration';
import { ICreateMapFluentFunctions } from './interfaces/ICreateMapFluentFunctions';
import { ICreateMapForMemberParameters } from './interfaces/ICreateMapForMemberParameters';
import { IDestinationProperty } from './interfaces/IDestinationProperty';
import { IDestinationTransformation } from './interfaces/IDestinationTransformation';
import { IMapCallback } from './interfaces/IMapCallback';
import { IMapItemFunction } from './interfaces/IMapItemFunction';
import { IMapping } from './interfaces/IMapping';
import { IMemberCallback } from './interfaces/IMemberCallback';
import { IMemberConfigurationOptions } from './interfaces/IMemberConfigurationOptions';
import { IMemberMappingMetaData } from './interfaces/IMemberMappingMetaData';
import { IProfile } from './interfaces/IProfile';
import { IProperty } from './interfaces/IProperty';
import { IResolutionContext } from './interfaces/IResolutionContext';
import { ISourceMemberConfigurationOptions } from './interfaces/ISourceMemberConfigurationOptions';
import { ISourceProperty } from './interfaces/ISourceProperty';
import { TypeConverter } from './TypeConverter';

    // interface shorthands
    type IFluentFunc = ICreateMapFluentFunctions;
    type IDMCO = IMemberConfigurationOptions;
    type ISMCO = ISourceMemberConfigurationOptions;
    type IMC = IMemberCallback;
    type IRC = IResolutionContext;
    type TC = TypeConverter;
    // method overload shorthands
    type stringOrClass = string | (new () => any);
    type forMemberValueOrFunction = any | ((opts: IDMCO) => any) | ((opts: IDMCO, cb: IMC) => void);
   // type forSourceMemberFunction = ((opts: ISMCO) => any) | ((opts: ISMCO, cb: IMC) => void);
    type convertUsingClassOrInstanceOrFunction = ((ctx: IRC) => any) | ((ctx: IRC, callback: IMapCallback) => void) | TC | (new () => TC);

    export class AutoMapper extends AutoMapperBase {
        public static getInstance(): AutoMapper {
            return AutoMapper._instance;
        }
        private static _instance = new AutoMapper();

        private _profiles: { [name: string]: IProfile };
        private _mappings: { [key: string]: IMapping };

        private _asyncMapper: AsyncAutoMapper;

        /**
         * This class is intended to be a Singleton. Preferrably use getInstance()
         * function instead of using the constructor directly from code.
         */
        constructor() {
            super();

            if (AutoMapper._instance) {
                return AutoMapper._instance;
            } else {
                AutoMapper._instance = this;

                this._profiles = {};
                this._mappings = {};

                this._asyncMapper = new AsyncAutoMapper();
            }
        }

        /**
         * Initializes the mapper with the supplied configuration.
         * @param {(config: IConfiguration) => void} configFunction Configuration function to call.
         */
        public initialize(configFunction: (config: IConfiguration) => void): void {
            const that = this;

            const configuration: IConfiguration = {
                addProfile: (profile: IProfile): void => {
                    profile.configure();
                    that._profiles[profile.profileName] = profile;
                },
                createMap(sourceKey: string, destinationKey: string): IFluentFunc {
                    // pass through using arguments to keep createMap's currying support fully functional.
                    return that.createMap.apply(that, arguments);
                },
            } as any;

            configFunction(configuration);
        }

        /**
         * Create a mapping profile.
         * @param {string} sourceKey The map source key.
         * @param {string} destinationKey The map destination key.
         * @returns {Core.ICreateMapFluentFunctions}
         */
        public createMap(sourceKeyOrType: string | (new () => any), destinationKeyOrType: string | (new () => any)):  IFluentFunc {
            // provide currying support.
            // if (arguments.length < 2) {
            //     return AutoMapperHelper.handleCurrying(this.createMap, arguments, this);
            // }

            const mapping = this.createMappingObjectForGivenKeys(sourceKeyOrType, destinationKeyOrType);

            return this.createMapGetFluentApiFunctions(mapping);
        }

        /**
         * Execute a mapping from the source object to a new destination
         * object with explicit mapping configuration and supplied mapping options (using createMap).
         * @param sourceKey Source key, for instance the source type name.
         * @param destinationKey Destination key, for instance the destination type name.
         * @param sourceObject The source object to map.
         * @returns {any} Destination object.
         */
        public map(sourceKeyOrType: stringOrClass, destinationKeyOrType?: stringOrClass, sourceObject?: any): any {
            if (arguments.length === 3) {
                return this.mapInternal(super.getMapping(this._mappings, sourceKeyOrType, destinationKeyOrType), sourceObject);
            }

            // provide performance optimized (preloading) currying support.
            if (arguments.length === 2) {
                return (srcObj: any): any => this.mapInternal(super.getMapping(this._mappings, sourceKeyOrType, destinationKeyOrType), srcObj);
            }

            if (arguments.length === 1) {
                return (dstKey: string | (new () => any), srcObj: any): any => this.map(sourceKeyOrType, dstKey, srcObj);
            }

            return (srcKey: string | (new () => any), dstKey: string | (new () => any), srcObj: any): any => this.map(srcKey, dstKey, srcObj);
        }

        /**
         * Execute an asynchronous mapping
         * from the source object to a new destination object with explicit mapping configuration and supplied mapping options (using createMap).
         * @param sourceKey Source key, for instance the source type name.
         * @param destinationKey Destination key, for instance the destination type name.
         * @param sourceObject The source object to map.
         * @param {IMapCallback} callback The callback to call when asynchronous mapping is complete.
         */
        public mapAsync(
            sourceKeyOrType: string | (new () => any),
            destinationKeyOrType?: string | (new () => any),
            sourceObject?: any,
            callback?: IMapCallback): any {
            switch (arguments.length) {
                case 4:
                    return this._asyncMapper.map(this._mappings, sourceKeyOrType, destinationKeyOrType, sourceObject, callback);
                case 3:
                    return this._asyncMapper.map(this._mappings, sourceKeyOrType, destinationKeyOrType, sourceObject);
                case 2:
                    return this._asyncMapper.map(this._mappings, sourceKeyOrType, destinationKeyOrType);
                case 1:
                    return this._asyncMapper.map(this._mappings, sourceKeyOrType);
                default:
                    throw new Error('The mapAsync function expects between 1 and 4 parameters, you provided ' + arguments.length + '.');
            }
        }

        /**
         * Validates mapping configuration by dry-running. Since JS does not fully support typing, it only checks if properties match on both
         * sides. The function needs IMapping.sourceTypeClass and IMapping.destinationTypeClass to function.
         * @param {boolean} strictMode Whether or not to fail when properties sourceTypeClass or destinationTypeClass are unavailable.
         */
        public assertConfigurationIsValid(strictMode: boolean = true): void {
            AutoMapperValidator.assertConfigurationIsValid(this._mappings, strictMode);
        }

        private createMapForAllMembers(mapping: IMapping, fluentFunc: IFluentFunc, func: (dstObj: any, dstProp: string, val: any) => void): IFluentFunc {
            mapping.forAllMemberMappings.push(func);
            return fluentFunc;
        }

        private createMapIgnoreAllNonExisting(mapping: IMapping, fluentFunc: IFluentFunc): IFluentFunc {
            mapping.ignoreAllNonExisting = true;
            return fluentFunc;
        }

        private createMapConvertToType(mapping: IMapping, fluentFunc: IFluentFunc, typeClass: new () => any): IFluentFunc {
            if (mapping.destinationTypeClass) {
                throw new Error('Destination type class can only be set once.');
            }

            mapping.destinationTypeClass = typeClass;
            return fluentFunc;
        }

        private createMapConvertUsing(mapping: IMapping, tcClassOrFunc: convertUsingClassOrInstanceOrFunction): void {
            const configureSynchronousConverterFunction = (converterFunc: any): void => {
                if (!converterFunc || AutoMapperHelper.getFunctionParameters(converterFunc.toString()).length !== 1) {
                    throw new Error('The function provided does not provide exactly one (resolutionContext) parameter.');
                }

                mapping.typeConverterFunction = converterFunc as (resolutionContext: IResolutionContext) => any;
                mapping.mapItemFunction = (m: IMapping, srcObj: any, dstObj: any): any => this.mapItemUsingTypeConverter(m, srcObj, dstObj);
            };

            try {
                // check if sync: TypeConverter instance
                if (tcClassOrFunc instanceof TypeConverter) {
                    configureSynchronousConverterFunction(tcClassOrFunc.convert);
                    return;
                }

                const functionParameters = AutoMapperHelper.getFunctionParameters(tcClassOrFunc.toString());
                const isClass = AutoMapperHelper.isClassConstructor(tcClassOrFunc.toString());

                if (isClass) {
                        let typeConverter: TypeConverter;
                        try {
                            typeConverter = (new (tcClassOrFunc as new () => TypeConverter)());
                            // typeConverter = (new (tcClassOrFunc as new () => TypeConverter)() as TypeConverter);
                        } catch (e) {
                            // Obviously, typeConverterClassOrFunction is not a TypeConverter class definition
                        }
                        if (typeConverter instanceof TypeConverter) {
                            configureSynchronousConverterFunction(typeConverter.convert);
                            return;
                        }
                }
                switch (functionParameters.length) {
                    default:
                    case 0:

                        // check if sync: TypeConverter class definition

                        break;
                    case 1:
                        // sync: function with resolutionContext parameter
                        configureSynchronousConverterFunction(tcClassOrFunc as (resolutionContext: IResolutionContext) => any);
                        return;
                    case 2:
                        // check if async: function with resolutionContext and callback parameters
                        this._asyncMapper.createMapConvertUsing(mapping, tcClassOrFunc as (ctx: IResolutionContext, cb: IMapCallback) => void);
                        return;
                }

                // okay, just try feeding the function to the configure function anyway...
                configureSynchronousConverterFunction(tcClassOrFunc as any);
            } catch (e) {
                throw new Error(`The value provided for typeConverterClassOrFunction is invalid. ${e}`);
            }
        }

        private createMapWithProfile(mapping: IMapping, profileName: string): void {
            // check if given profile exists
            const profile = this._profiles[profileName];
            if (typeof profile === 'undefined' || profile.profileName !== profileName) {
                throw new Error(`Could not find profile with profile name '${profileName}'.`);
            }

            mapping.profile = profile;
            // merge mappings
            this.createMapWithProfileMergeMappings(mapping, profileName);
        }

        private createMapWithProfileMergeMappings(mapping: IMapping, profileName: string): void {
            const profileMappingKey = `${profileName}=>${mapping.sourceKey}${profileName}=>${mapping.destinationKey}`;
            const profileMapping: IMapping = this._mappings[profileMappingKey];
            if (!profileMapping) {
                return;
            }

            // append forAllMemberMappings calls to the original array.
            if (profileMapping.forAllMemberMappings.length > 0) {
                mapping.forAllMemberMappings.push(...profileMapping.forAllMemberMappings);
            }

            // overwrite original type converter function
            if (profileMapping.typeConverterFunction) {
                mapping.typeConverterFunction = profileMapping.typeConverterFunction;
                mapping.mapItemFunction = profileMapping.mapItemFunction;
            }

            // overwrite original type converter function
            if (profileMapping.destinationTypeClass) {
                mapping.destinationTypeClass = profileMapping.destinationTypeClass;
            }

            // walk through all the profile's property mappings
            for (const property of profileMapping.properties) {
                // TODO Awkward way of locating sourceMapping ;) ...
                const sourceMapping = this.getDestinationProperty(property.destinationPropertyName, property).sourceMapping;
                if (!this.mergeSourceProperty(property, mapping.properties, sourceMapping)) {
                    mapping.properties.push(property);
                }
            }
        }

        private mapInternal(mapping: IMapping, sourceObject: any): any {
            if (sourceObject === null || typeof sourceObject === 'undefined') {
                return sourceObject;
            }

            if (mapping.async) {
                throw new Error('Impossible to use asynchronous mapping using automapper.map(); use automapper.mapAsync() instead.');
            }

            if (super.isArray(sourceObject)) {
                return this.mapArray(mapping, sourceObject);
            }

            return (mapping.mapItemFunction as IMapItemFunction)(mapping, sourceObject, super.createDestinationObject(mapping.destinationTypeClass));
        }

        private mapArray(mapping: IMapping, sourceArray: any[]): any[] {
            const destinationArray = super.handleArray(mapping, sourceArray, (sourceObject: any, destinationObject: any) => {
                (mapping.mapItemFunction as IMapItemFunction)(mapping, sourceObject, destinationObject);
            });
            return destinationArray;
        }

        private mapItem(mapping: IMapping, sourceObject: any, destinationObject: any): void {
            destinationObject = super.handleItem(mapping, sourceObject, destinationObject, (propertyName: string) => {
                this.mapProperty(mapping, sourceObject, destinationObject, propertyName);
            });
            return destinationObject;
        }

        private mapItemUsingTypeConverter(mapping: IMapping, sourceObject: any, destinationObject: any, arrayIndex?: number): void {
            const resolutionContext: IResolutionContext = {
                sourceValue: sourceObject,
                destinationValue: destinationObject,
            };
            return (mapping.typeConverterFunction as (ctx: IResolutionContext) => any)(resolutionContext);
        }

        private mapProperty(mapping: IMapping, sourceObject: any, destinationObject: any, sourceProperty: string): void {
            super.handleProperty(mapping, sourceObject, sourceProperty, destinationObject, (destinationProperty: IDestinationProperty, options: IDMCO) =>
                this.transform(mapping, sourceObject, destinationProperty, destinationObject, options)
            );
        }

        private transform(mapping: IMapping, sourceObject: any, destinationProperty: IDestinationProperty, destinationObject: any, options: IDMCO): boolean {
            const childDestinationProperty = destinationProperty.child;
            if (childDestinationProperty) {
                let childDestinationObject = destinationObject[destinationProperty.name];
                if (!childDestinationObject) {
                    // no child source object? create.
                    childDestinationObject = {} as any;
                }

                // transform child by recursively calling the transform function.
                const transformed = this.transform(mapping, sourceObject, childDestinationProperty, childDestinationObject, options /*, callback*/);
                if (transformed) {
                    // only set child destination object when transformation has been successful.
                    destinationObject[destinationProperty.name] = childDestinationObject;
                }

                return transformed;
            }

            if (!super.shouldProcessDestination(destinationProperty, sourceObject)) {
                return false;
            }

            // actually transform destination property.
            for (const transformation of destinationProperty.transformations) {
                if (!this.processTransformation(destinationProperty, transformation, options)) {
                    return false;
                }
            }

            super.setPropertyValue(mapping, destinationProperty, destinationObject, options.intermediatePropertyValue);
            return true;
        }

        private processTransformation(property: IDestinationProperty, transformation: IDestinationTransformation, options: IDMCO): boolean {
            switch (transformation.transformationType) {
                case DestinationTransformationType.Constant:
                    options.intermediatePropertyValue = transformation.constant;
                    return true;
                case DestinationTransformationType.MemberOptions: {
                    const result = transformation.memberConfigurationOptionsFunc(options);
                    if (typeof result !== 'undefined') {
                        options.intermediatePropertyValue = result;
                    } else if (!options.sourceObject) {
                        return false;
                    }
                    return true;
                }
                case DestinationTransformationType.SourceMemberOptions: {
                    const result = transformation.sourceMemberConfigurationOptionsFunc(options as ISMCO);
                    if (typeof result !== 'undefined') {
                        options.intermediatePropertyValue = result;
                    } else if (!options.sourceObject) {
                        return false;
                    }

                    return true;
                }
                default:
        // this.throwMappingException(property, `AutoMapper.handlePropertyMappings: Unexpected transformation type ${transformation.transformationType}`);
                    return false;
            }
        }

        private createMappingObjectForGivenKeys(srcKeyOrType: string | (new () => any), dstKeyOrType: string | (new () => any)): IMapping {
            const mapping: IMapping = {
                sourceKey: super.getKey(srcKeyOrType),
                destinationKey: super.getKey(dstKeyOrType),
                forAllMemberMappings: new Array<(destinationObject: any, destinationPropertyName: string, value: any) => void>(),
                properties: [],
                typeConverterFunction: undefined,
                mapItemFunction: (m: IMapping, srcObj: any, dstObj: any): any => this.mapItem(m, srcObj, dstObj),
                sourceTypeClass: (typeof srcKeyOrType === 'string' ? undefined : srcKeyOrType),
                destinationTypeClass: (typeof dstKeyOrType === 'string' ? undefined : dstKeyOrType),
                profile: undefined,
                async: false,
            };
            this._mappings[mapping.sourceKey + mapping.destinationKey] = mapping;
            return mapping;
        }

        private createMapGetFluentApiFunctions(mapping: IMapping): IFluentFunc {
            // create a fluent interface / method chaining (e.g. automapper.createMap().forMember().forMember() ...)
            const fluentFunc: IFluentFunc = {
                forMember: (prop: string, valFunc: forMemberValueOrFunction): IFluentFunc =>
                    this.createMapForMember({ mapping, propertyName: prop, transformation: valFunc, sourceMapping: false, fluentFunctions: fluentFunc }),
                forSourceMember: (prop: string, cfgFunc: ((opts: ISMCO) => any) | ((opts: ISMCO, cb: IMC) => void)): IFluentFunc =>
                    this.createMapForMember({ mapping, propertyName: prop, transformation: cfgFunc, sourceMapping: true, fluentFunctions: fluentFunc }),
                forAllMembers: (func: (dstObj: any, dstProp: string, value: any) => void): IFluentFunc =>
                    this.createMapForAllMembers(mapping, fluentFunc, func),
                ignoreAllNonExisting: (): IFluentFunc => this.createMapIgnoreAllNonExisting(mapping, fluentFunc),
                convertToType: (type: new () => any): IFluentFunc => this.createMapConvertToType(mapping, fluentFunc, type),
                convertUsing: (tcClassOrFunc: convertUsingClassOrInstanceOrFunction): void =>
                    this.createMapConvertUsing(mapping, tcClassOrFunc),
                withProfile: (profile: string): void => this.createMapWithProfile(mapping, profile),
            };

            return fluentFunc;
        }

        private createMapForMember(parameters: ICreateMapForMemberParameters): IFluentFunc {
            const { mapping, propertyName, transformation, sourceMapping, fluentFunctions } = parameters;

            // extract source/destination property names
            const metadata = AutoMapperHelper.getMappingMetadataFromTransformationFunction(propertyName, transformation, sourceMapping);
            this.validateForMemberParameters(metadata);

          // var { source, destination } = metadata;

            // create property (regardless of current existance)
            const property = this.createSourceProperty(metadata, null);

            // merge with existing property or add property
            if (!this.mergeSourceProperty(property, mapping.properties, sourceMapping)) {
                mapping.properties.push(property);
            }

            if (metadata.async) {
                this._asyncMapper.createMapForMember(mapping, this.findProperty(property.name, mapping.properties));
            }

            return fluentFunctions;
        }

        private validateForMemberParameters(metadata: IMemberMappingMetaData): void {
            if (!metadata.sourceMapping) {
                return;
            }

            // validate forSourceMember parameters
            if (metadata.transformation.transformationType === DestinationTransformationType.Constant) {
                throw new Error('Configuration of forSourceMember has to be a function with one (sync) or two (async) options parameters.');
            }
        }

        private createSourceProperty(metadata: IMemberMappingMetaData, parent: ISourceProperty): ISourceProperty {
            const level = !parent ? 0 : parent.level + 1;
            const sourceNameParts = metadata.source.split('.');

            const source = {
                name: sourceNameParts[level],
                sourcePropertyName: metadata.source,
                destinationPropertyName: metadata.destination,
                parent,
                level,
                children: [] as ISourceProperty[],
                destination: null as IDestinationProperty,
            } as ISourceProperty;

            if ((level + 1) < sourceNameParts.length) {
                // recursively add child source properties ...
                const child = this.createSourceProperty(metadata, source);
                if (child) { // TODO should not be necessary, test thoroughly!
                    source.children.push(child);
                }
                source.destination = null;
            } else {
                // ... or (!) add destination
                source.destination = this.createDestinationProperty(metadata, null);
            }
            return source;
        }

        private createDestinationProperty(metadata: IMemberMappingMetaData, parent: IDestinationProperty): IDestinationProperty {
            const level = !parent ? 0 : parent.level + 1;
            const destinationNameParts = metadata.destination.split('.');

            const destination = {
                name: destinationNameParts[level],
                sourcePropertyName: metadata.source,
                destinationPropertyName: metadata.destination,
                parent,
                level,
                child: null as IDestinationProperty,
                transformations: [] as IDestinationTransformation[],
                conditionFunction: null,
                ignore: false,
                sourceMapping: false,
            } as IDestinationProperty;

            if ((level + 1) < destinationNameParts.length) {
                // recursively add child destination properties
                destination.child = this.createDestinationProperty(metadata, destination);
            } else {
                // add/merge properties
                destination.sourceMapping = metadata.sourceMapping;
                destination.conditionFunction = metadata.condition;
                destination.ignore = metadata.ignore;
                destination.transformations.push(metadata.transformation);
            }

            return destination;
        }

        private mergeSourceProperty(property: ISourceProperty, existingProperties: ISourceProperty[], sourceMapping: boolean): boolean {
            // find source property
            const existing = sourceMapping
                ? this.findProperty(property.name, existingProperties)
                : this.matchSourcePropertyByDestination(property, existingProperties);

            if (!existing) {
                return false;
            }

            if (property.destination) { // new source is not (further) nested.
                if (existing.children.length > 0) {
                    const existingDestination = this.getDestinationProperty(existing.destinationPropertyName, existing);

                    // existing is (further) nested => rebase and/or merge
                    if (this.handleMapFromProperties(property, existing)) {
                        // merge and rebase existing destination to current source level
                        if (!this.mergeDestinationProperty(property.destination, existingDestination)) {
                            return false;
                        }

                        existing.destination = existingDestination;
                        existing.children = [];
                        return true;
                    }

                    // merge property.destination with existing mapFrom() destination (don't care about nesting depth here)
                    return this.mergeDestinationProperty(property.destination, existingDestination);
                }

                // both are at same level => simple merge.
                if (!this.mergeDestinationProperty(property.destination, existing.destination)) {
                    return false;
                }

                this.handleMapFromProperties(property, existing);
                return true;
            }

            // new source is (further) nested (has children).
            if (existing.children.length > 0) {
                // both have further nesting, delegate merging child(ren) by recursively calling this function.
                for (const child of property.children) {
                    if (!this.mergeSourceProperty(child, existing.children, sourceMapping)) {
                        return false;
                    }
                }

                if (property.destinationPropertyName !== property.sourcePropertyName) {
                    // this is a mapFrom() registration. It is handled using the nested source properties,
                    // we only are responsible for syncing the name properties.
                    existing.name = property.name;
                    existing.sourcePropertyName = property.sourcePropertyName;
                }
                return true;
            }

            // existing is not (further) nested. this is always a mapFrom() situation.
            // if (property.sourcePropertyName !== existing.sourcePropertyName) {
                const newDestination = this.getDestinationProperty(existing.destinationPropertyName, property);

                if (property.destinationPropertyName !== property.sourcePropertyName) {
                    // this is a mapFrom() registration. In that case:
                    // 1) merge destinations, 2) add source child and 3) move destination to (youngest) child
                    // NOTE special mergeDestinationProperty call => we use the new destination as 'target',
                    //      because that will save us trouble overwriting ;)...
                    if (!this.mergeDestinationProperty(existing.destination, newDestination, true)) {
                        return false;
                    }

                    existing.children = property.children;
                    existing.name = property.name;
                    existing.sourcePropertyName = property.sourcePropertyName;
                    existing.destination = null;
                    // TODO Should never be necessary (test): existing.destinationPropertyName = property.destinationPropertyName;
                    return true;
                }

                // ... nope, it is a destination which has previously been registered using mapFrom. just merge
                return this.mergeDestinationProperty(newDestination, existing.destination);
            // }
        }

        /**
         * handle property naming when the current property to merge is a mapFrom property
         */
        private handleMapFromProperties<TProperty extends IProperty>(property: TProperty, existingProperty: TProperty): boolean {
            if (property.destinationPropertyName === property.sourcePropertyName ||
                property.sourcePropertyName === existingProperty.sourcePropertyName) {
                return false;
            }

            // only overwrite name when a mapFrom situation applies
            existingProperty.name = property.name;
            existingProperty.sourcePropertyName = property.sourcePropertyName;
            // TODO Should never be necessary (test) => existingProperty.destinationPropertyName = property.destinationPropertyName;

            return true;
        }

        private getDestinationProperty(destinationPropertyName: string, existingSource: ISourceProperty): IDestinationProperty {
            if (existingSource.destination) {
                return existingSource.destination;
            }

            for (const child of existingSource.children) {
                const destination = this.getDestinationProperty(destinationPropertyName, child);
                if (destination) {
                    return destination;
                }
            }

            return null;
        }

        private mergeDestinationProperty(
            destination: IDestinationProperty,
            existingDestination: IDestinationProperty,
            swapTransformations: boolean = false): boolean {

            if (destination.child) { // destination is (further) nested
                if (existingDestination.child) {
                    // both have further nesting, delegate merging children by recursively calling this function.
                    if (!this.mergeDestinationProperty(destination.child, existingDestination.child, swapTransformations)) {
                        return false;
                    }

                    this.handleMapFromProperties(destination, existingDestination);
                    return true;
                }

                // the current destination is not (further) nested. a destination property registration has one of both:
                // a) children or b) transformations. returning false will cause creating a duplicate source property entry instead.
                return false;
            }

            if (existingDestination.sourceMapping !== destination.sourceMapping &&
                existingDestination.sourcePropertyName !== destination.sourcePropertyName) {
                // unable to perform mapFrom() on a property which is being registered using forSourceMember.
                return false;
                // TODO: Unpredictable? Idea: throw new Error('Unable to perform mapFrom() on a property which is being registered using forSourceMember.');
            }

            // merge destination properties
            if (destination.sourceMapping) {
                // only set source mapping when not yet set to true, once source mapped is source mapped forever.
                // TODO Verify edge cases!
                existingDestination.sourceMapping = destination.sourceMapping;
            }

            if (destination.ignore) {
                // only set ignore when not yet set, once ignored is ignored forever.
                existingDestination.ignore = destination.ignore;
            }

            if (destination.conditionFunction) {
                // overwrite condition function by the latest one specified.
                existingDestination.conditionFunction = destination.conditionFunction;
            }

            const transformations: IDestinationTransformation[] = [];
            if (swapTransformations) {
                for (const transformation of destination.transformations) {
                    transformations.push(transformation);
                }
                for (const transformation of existingDestination.transformations) {
                    transformations.push(transformation);
                }
            } else {
                for (const transformation of existingDestination.transformations) {
                    transformations.push(transformation);
                }
                for (const transformation of destination.transformations) {
                    transformations.push(transformation);
                }
            }
            existingDestination.transformations = transformations;

            this.handleMapFromProperties(destination, existingDestination);
            return true;
        }

        private matchSourcePropertyByDestination(source: ISourceProperty, properties: ISourceProperty[]): ISourceProperty {
            if (!properties) {
                return null;
            }

            for (const property of properties) {
                if (property.destinationPropertyName === source.destinationPropertyName) {
                    return property;
                }
            }

            return null;
        }

        private findProperty<TProperty extends IProperty>(name: string, properties: TProperty[]): TProperty {
            if (!properties) {
                return null;
            }

            for (const property of properties) {
                if (property.name === name) {
                    return property;
                }
            }

            return null;
        }

    }