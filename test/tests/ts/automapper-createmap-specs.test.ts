import { AutoMapper } from '../../../src/ts/AutoMapper';
import {
    IMemberConfigurationOptions
} from '../../../src/ts/interfaces/IMemberConfigurationOptions';
import { IResolutionContext } from '../../../src/ts/interfaces/IResolutionContext';
import {
    ISourceMemberConfigurationOptions
} from '../../../src/ts/interfaces/ISourceMemberConfigurationOptions';
import { TypeConverter } from '../../../src/ts/TypeConverter';

describe('AutoMapper', () => {
    let postfix = ' [0ef5ef45-4f21-47c4-a86f-48fb852e6897]';
    const automapper = AutoMapper.getInstance();

    it('should have a global automapper object', () => {
        expect(automapper).not.toBeUndefined();
        expect(automapper).not.toBeNull();

        expect(automapper.createMap).not.toBeUndefined();
        expect(automapper.createMap).not.toBeNull();
        expect(typeof automapper.createMap === 'function').toBeTruthy();

        expect(automapper.map).not.toBeUndefined();
        expect(automapper.map).not.toBeNull();
        expect(typeof automapper.map === 'function').toBeTruthy();
    });

    it('should return the Singleton instance when instantiating the Singleton directly', () => {
        // arrange

        // act
        const mapper = new AutoMapper();
        expect(automapper).toBe(mapper);
    });

    it('should use created mapping profile', () => {
        // arrange
        const fromKey = '{5700E351-8D88-4327-A216-3CC94A308EDF}';
        const toKey = '{BB33A261-3CA9-48FC-85E6-2C269F73728D}';

        automapper.createMap(fromKey, toKey);

        // act
        automapper.map(fromKey, toKey, {});

        // assert
    });

    it('should fail when using a non-existing mapping profile', () => {
        // arrange

        const fromKey = '{5AEFD48C-4472-41E7-BA7E-0977A864E116}';
        const toKey = '{568DCA5E-477E-4739-86B2-38BB237B8EF8}';

        expect(() => {
            automapper.map(fromKey, toKey, {});
        }).toThrow(
            'Could not find map object with a source of ' + fromKey + ' and a destination of ' + toKey
        );
        // act
        // try {
        //     automapper.map(fromKey, toKey, {});
        // } catch (e) {
        //     caught = true;

        //     // assert
        //     expect(e.message).toEqual('Could not find map object with a source of ' + fromKey + ' and a destination of ' + toKey);
        // }

        // if (!caught) {
        //     // assert
        //     expect().fail('Using a non-existing mapping profile should result in an error.');
        // }
    });

    it('should be able to use forAllMemberMappings', () => {
        // arrange
        const fromKey = '{5700E351-8D88-4327-A216-3CCBHJ808EDF}';
        const toKey = '{BB33A261-3CA9-48FC-85E6-2C269FDFT28D}';

        const source = { prop1: 'prop1', prop2: 'prop2' };
        const suffix = ' [forAllMembers]';

        automapper.createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
            .forMember('prop2', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
            .forAllMembers((destinationObject: any,
                            destinationPropertyName: string,
                            value: any): void => {
                destinationObject[destinationPropertyName] = value + suffix;
            });

        // act
        const destination = automapper.map(fromKey, toKey, source);

        // assert
        expect(destination.prop1).toEqual(source.prop1 + suffix);
        expect(destination.prop2).toEqual(source.prop2 + suffix);
    });

    it('should be able to use forAllMemberMappings when automapping', () => {
        // arrange
        const fromKey = '{5700E351-8D88-4327-A216-3CCBHJ808EDF}';
        const toKey = '{BB33A261-3CA9-48FC-85E6-2C269FDFT28D}';

        const source = { prop1: 'prop1', prop2: 'prop2' };
        const suffix = ' [forAllMembers]';

        automapper.createMap(fromKey, toKey)
            .forAllMembers((destinationObject: any,
                            destinationPropertyName: string,
                            value: any): void => {
                destinationObject[destinationPropertyName] = value + suffix;
            });

        // act
        const destination = automapper.map(fromKey, toKey, source);

        // assert
        expect(destination.prop1).toEqual(source.prop1 + suffix);
        expect(destination.prop2).toEqual(source.prop2 + suffix);
    });

    it('should accept multiple forMember calls for the same destination property and overwrite with the last one specified', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop2'); })
            .forMember('prop1', (opts: IMemberConfigurationOptions) => { opts.ignore(); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA.prop1 });
    });

    it('should accept multiple forMember calls for the same destination property and overwrite with the last one specified in any order', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837} in any order';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => { opts.ignore(); })
            .forMember('prop1', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop2'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA.prop1 });
    });

    it('should be able to ignore a source property using the forSourceMember function', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{AD88481E-597B-4C1B-967B-3D700B8BAB0F}';
        const toKey = '{2A6714C4-784E-47D3-BBF4-6205834EC8D5}';

        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop1', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: 'From A too' });
    });

    it('should be able to custom map a source property using the forSourceMember function', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{AD88481E-597B-4C1B-967B-3D700B8BAB0F}';
        const toKey = '{2A6714C4-784E-47D3-BBF4-6205834EC8D5}';

        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop1', () => 'Yeah!');

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: 'Yeah!', prop2: 'From A too' });
    });

    it('should be able to ignore a source property already specified (by forMember) using the forSourceMember function', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{AD88481E-597B-4C1B-967B-3D701B8CAB0A}';
        const toKey = '{2A6714C4-784E-47D3-BBF4-620583DEC86A}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', 12)
            .forSourceMember('prop1', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: 'From A too' });
    });

    it('should fail when forSourceMember is used with anything else than a function', () => {
        // arrange

        const fromKey = '{5EE20DF9-84B3-4A6A-8C5D-37AEDC44BE87}';
        const toKey = '{986C959D-2E2E-41FA-9857-8EF519467AEB}';

        expect(() => {
            automapper
                .createMap(fromKey, toKey)
                .forSourceMember('prop', 12 as any);

        }).toThrow(
            'Configuration of forSourceMember has to be a function with one (sync) or two (async) options parameters.'
        );
        // try {
        //     // act
        //     automapper
        //         .createMap(fromKey, toKey)
        //         .forSourceMember('prop1', <any>12);
        // } catch (e) {
        //     // assert
        //     caught = true;
        //     expect(e.message).toEqual('Configuration of forSourceMember has to be a function with one (sync) or two (async) options parameters.');
        // }

        // if (!caught) {
        //     // assert
        //     expect().fail('Using anything else than a function with forSourceMember should result in an error.');
        // }
    });

    it('should be able to use forMember to map a source property to a destination property with a different name', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop2'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA.prop1, prop: objA.prop2 });
    });

    it('should be able to use forMember to do custom mapping using lambda function', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B578E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665737}';

        const mapFromNullable = (opts: IMemberConfigurationOptions, field: string) => {
            if (opts.sourceObject[field]) {
                return opts.sourceObject[field];
            }
            return '';
        };

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => mapFromNullable(opts, 'prop2'));

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA.prop1, prop: objA.prop2 });
    });

    it('should use forAllMembers function for each mapped destination property when specified', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too' };

        const fromKey = '{C4056539-FA86-4398-A10B-C41D3A791F26}';
        const toKey = '{01C64E8D-CDB5-4307-9011-0C7F1E70D115}';

        const forAllMembersSpy = jasmine.createSpy('forAllMembersSpy').and.callFake((destinationObject: any, destinationProperty: string, value: any) => {
            destinationObject[destinationProperty] = value;
        });

        automapper
            .createMap(fromKey, toKey)
            .forAllMembers(forAllMembersSpy);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(forAllMembersSpy).toHaveBeenCalled();
        expect(forAllMembersSpy.calls.count()).toBe(Object.keys(objB).length);
    });

    it('should be able to use forMember with a constant value', () => {
        // arrange
        const objA = { prop: 1 };

        const fromKey = '{54E67626-B877-4824-82E6-01E9F411B78F}';
        const toKey = '{2D7FDB88-97E9-45EF-A111-C9CC9C188227}';

        const constantResult = 2;

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', constantResult);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).toBe(constantResult);
    });

    it('should be able to use forMember with a function returning a constant value', () => {
        // arrange
        const objA = { prop: 1 };

        const fromKey = '{74C12B56-1DD1-4EA0-A640-D1F814971124}';
        const toKey = '{BBC617B8-26C8-42A0-A204-45CC77073355}';

        const constantResult = 3;

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', () => {
                return constantResult;
            });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).toBe(constantResult);
    });

    it('should be able to use forMember with a function using the source object', () => {
        // arrange
        const objA = { prop: { subProp: { value: 1 } } };

        const fromKey = '{54E67626-B877-4824-82E6-01E9F411B78F}';
        const toKey = '{2D7FDB88-97E9-45EF-A111-C9CC9C188227}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => opts.sourceObject[opts.sourcePropertyName].subProp.value * 2);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).toBe(objA.prop.subProp.value * 2);
    });

    it('should be able to use forMember to ignore a property', () => {
        // arrange
        const objA = { prop: 1 };

        const fromKey = '{76D26B33-888A-4DF7-ABDA-E5B99E944272}';
        const toKey = '{18192391-85FF-4729-9A08-5954FCFE3954}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => { opts.ignore(); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.hasOwnProperty('prop')).not.toBeTruthy();
    });

    it('should be able to use forMember to map a source property to a destination property with a different name', () => {
        // arrange
        const objA = { propDiff: 1 };

        const fromKey = '{A317A36A-AD92-4346-A015-AE06FC862DB4}';
        const toKey = '{03B05E43-3028-44FD-909F-652E2DA5E607}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => { opts.mapFrom('propDiff'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.prop).toEqual(objA.propDiff);
    });

    it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps', () => {
        // arrange
        const birthdayString = '2000-01-01T00:00:00.000Z';
        const objA = { birthdayString };

        const fromKey = '{564F1F57-FD4F-413C-A9D3-4B1C1333A20B}';
        const toKey = '{F9F45923-2D13-4EF1-9685-4883AD1D2F98}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', (opts: IMemberConfigurationOptions) => { opts.mapFrom('birthdayString'); })
            .forMember('birthday', (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue));

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.birthday instanceof Date).toBeTruthy();
        expect(objB.birthday.toISOString()).toEqual('2000-01-01T00:00:00.000Z');
    });

    it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps in any order', () => {
        // arrange
        const birthdayString = '2000-01-01T00:00:00.000Z';
        const objA = { birthdayString };

        const fromKey = '{1609A9B5-6083-448B-8FD6-51DAD106B63D}';
        const toKey = '{47AF7D2D-A848-4C5B-904F-39402E2DCDD5}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('birthday', (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue))
            .forMember('birthday', (opts: IMemberConfigurationOptions) => { opts.mapFrom('birthdayString'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.birthday instanceof Date).toBeTruthy();
        expect(objB.birthday.toISOString()).toEqual('2000-01-01T00:00:00.000Z');
    });

    it('should not map properties that are not an object\'s own properties', () => {
        const objA = new ClassA();
        objA.propA = 'propA';

        const fromKey = '{A317A36A-AD92-4346-A015-AE06FC862DB4}';
        const toKey = '{03B05E43-3028-44FD-909F-652E2DA5E607}';

        automapper
            .createMap(fromKey, toKey);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).toEqual(objA.propA);
    });

    it('should be able to use convertUsing to map an object with a custom type resolver function', () => {
        const objA = { propA: 'propA' };

        const fromKey = '{D1534A0F-6120-475E-B7E2-BF2489C58571}';
        const toKey = '{1896FF99-1A28-4FE6-800B-072D5616B02D}';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing((resolutionContext: IResolutionContext) => {
                return { propA: resolutionContext.sourceValue.propA + ' (custom mapped with resolution context)' };
            });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).toEqual(objA.propA + ' (custom mapped with resolution context)');
    });

    it('should be able to use convertUsing to map an object with a custom type resolver class', () => {
        // arrange
        const objA = { propA: 'propA' };

        const fromKey = '{6E7F5757-1E55-4B55-BB86-44FF5B33DE2F}';
        const toKey = '{8521AE41-C3AF-4FCD-B7C7-A915C037D69E}';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(CustomTypeConverterDefinition);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).toEqual(objA.propA + ' (convertUsing with a class definition)');
    });

    it('should be able to use convertUsing to map an object with a custom type resolver instance', () => {
        // arrange
        // NOTE BL The CustomTypeConverter class definition is defined at the bottom, since TypeScript
        //         does not allow classes to be defined inline.

        const objA = { propA: 'propA' };

        const fromKey = '{BDF3758C-B38E-4343-95B6-AE0F80C8B9C4}';
        const toKey = '{13DD7AE1-4177-4A80-933B-B60A55859E50}';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(new CustomTypeConverterInstance());

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.propA).toEqual(objA.propA + ' (convertUsing with a class instance)');
    });

    it('should fail when directly using the type converter base class', () => {
        // arrange

        const objA = { propA: 'propA' };

        const fromKey = 'should fail when directly using ';
        const toKey = 'the type converter base class';

        automapper
            .createMap(fromKey, toKey)
            .convertUsing(TypeConverter);

            expect(() => {
                automapper.map(fromKey, toKey, objA);
            }).toThrow(
                'The TypeConverter.convert method is abstract. Use a TypeConverter extension class instead.'
            );
        // try {
        //     // act
        //     var objB = automapper.map(fromKey, toKey, objA);
        // } catch (e) {
        //     // assert
        //     caught = true;
        //     expect(e.message).toEqual('The TypeConverter.convert method is abstract. Use a TypeConverter extension class instead.');
        // }

        // if (!caught) {
        //     // assert
        //     expect().fail('Using the type converter base class directly should fail.');
        // }
    });

    it('should fail when convertUsing is used with a function not having exactly one (resolutionContext) parameter.', () => {
        // arrange
        const fromKey = '{1EF9AC11-BAA1-48DB-9C96-9DFC40E33BCA}';
        const toKey = '{C4DA81D3-9072-4140-BFA7-431C35C01F54}';

        expect(() => {
            automapper
            .createMap(fromKey, toKey)
            .convertUsing(() => {
                return {};
            });

        }).toThrow(
            'The value provided for typeConverterClassOrFunction is invalid. ' +
            'Error: The function provided does not provide exactly one (resolutionContext) parameter.'
        );
        // try {
        //     // act
        //     automapper
        //         .createMap(fromKey, toKey)
        //         .convertUsing(() => {
        //             return {};
        //         });

        //     //var objB = automapper.map(fromKey, toKey, objA);

        // } catch (e) {
        //     // assert
        //     caught = true;
        //     expect(e.message).toEqual('The value provided for typeConverterClassOrFunction is invalid. ' +
        //         'Error: The function provided does not provide exactly one (resolutionContext) parameter.');
        // }

        // if (!caught) {
        //     // assert
        //     expect().fail('Using anything else than a function with forSourceMember should result in an error.');
        // }
    });

    it('should be able to use convertToType to map a source object to a destination object which is an instance of a given class', () => {
        // arrange
        const objA = { ApiProperty: 'From A' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5C9D8F5B5A7E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CA6C4737}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('property', (opts: IMemberConfigurationOptions) => { opts.mapFrom('ApiProperty'); })
            .convertToType(DemoToBusinessType);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB instanceof DemoToBusinessType).toBeTruthy();
        expect(objB.property).toEqual(objA.ApiProperty);
    });

    it('should be able to use convertToType to map a source object to a destination object with default values defined', () => {
        // arrange
        const objA = { propA: 'another value' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5C9D8F5B5A7E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CA6C4737}';

        automapper
            .createMap(fromKey, toKey)
            .convertToType(ClassWithDefaultValues);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB instanceof ClassWithDefaultValues).toBeTruthy();
        expect(objB.propA).toEqual(objA.propA);
    });

    it('should be able to use a condition to map or ignore a property', () => {
        // arrange
        const objA = { prop: 1, prop2: 2 };

        const fromKey = '{76D23B33-888A-4DF7-BEBE-E5B99E944272}';
        const toKey = '{18192191-85FE-4729-A980-5954FCFE3954}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => { opts.condition((sourceObject: any) => sourceObject.prop === 0); })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => { opts.condition((sourceObject: any) => sourceObject.prop2 === 2); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB.hasOwnProperty('prop')).not.toBeTruthy();
        expect(objB.hasOwnProperty('prop2')).toBeTruthy();
    });

    it('should be able to ignore all unmapped members using the ignoreAllNonExisting function', () => {
        // arrange
        const objA = {
            propA: 'Prop A',
            propB: 'Prop B',
            propC: 'Prop C',
            propD: 'Prop D',
        };

        const fromKey = '{AD88481E-597B-4C1C-9A7B-3D70DB8BCB0F}';
        const toKey = '{2A6614C4-784E-47D3-BBF4-6205834EA8D1}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propA', (opts: IMemberConfigurationOptions) => opts.mapFrom('propA'))
            .ignoreAllNonExisting();

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ propA: 'Prop A' });
    });

    it('should be able to create a map and use it using class types', () => {
        // arrange
        const objA = new ClassA();
        objA.propA = 'Value';

        // act
        automapper.createMap(ClassA, ClassB);
        const objB = automapper.map(ClassA, ClassB, objA);

        // assert
        expect(objB instanceof ClassB).toBeTruthy();
        expect(objB).toMatchObject({ propA: 'Value' });
    });

    it('should throw an error when creating a map using class types and specifying a conflicting destination type', () => {
        // arrange

        expect(() => {
            automapper
            .createMap(ClassA, ClassB)
            .convertToType(ClassC);

        }).toThrow(
            'Destination type class can only be set once.'
        );
        // act
        // try {
        //     automapper
        //         .createMap(ClassA, ClassB)
        //         .convertToType(ClassC);
        // } catch (e) {
        //     caught = true;
        //     // assert
        //     expect(e.message).toEqual('Destination type class can only be set once.');
        // }

        // if (!caught) {
        //     // assert
        //     expect(null).fail('AutoMapper should throw an error when creating a map using class types and specifying a conflicting destination type.');
        // }
    });

    it('should be able to use forMember to map a nested source property to a destination property', () => {
        // arrange
        const objA = { prop1: { propProp1: 'From A' }, prop2: 'From A too' };

        const fromKey = '{7AC4134B-ECC1-464B-B144-5B9D8F5B568E}';
        const toKey = '{2BDE907C-1CE6-4CC5-A601-9A94CC665837}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp1'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 });
    });

    it('should be able to stack forMember calls when mapping a nested source property to a destination property', () => {
        // arrange
        const objA = { prop1: { propProp1: 'From A' }, prop2: 'From A too' };
        const addition = ' - sure works!';

        const fromKey = '{7AC4134B-ECC1-464B-B144-5B99CF5B558E}';
        const toKey = '{2BDE907C-1CE6-4CC5-56A1-9A94CC6658C7}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp1'); })
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + addition);

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 + addition });
    });

    it('should be able to stack forMember calls when mapping a nested source property to a destination property in any order', () => {
        // arrange
        const objA = { prop1: { propProp1: 'From A' }, prop2: 'From A too' };
        const addition = ' - sure works!';

        const fromKey = '{7AC4134B-ECD1-46EB-B14A-5B9D8F5B5F8E}';
        const toKey = '{BBD6907C-ACE6-4FC8-A60D-1A943C66D83F}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + addition)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp1'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 + addition });
    });

    it('should be able to stack forMember mapFrom calls when mapping a nested source property to a destination property', () => {
        // arrange
        const objA = { prop1: { propProp1: 'From A', propProp2: { propProp2Prop: 'From A' } }, prop2: 'From A too' };
        const addition = ' - sure works!';

        const fromKey = '{7AC4134B-ECD1-46EB-B14A-5B9D8F5B5F8E}';
        const toKey = '{BBD6907C-ACE6-4FC8-A60D-1A943C66D83F}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + addition)
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp2.propProp2Prop'); })
            .forMember('propFromNestedSource', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp1'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: objA.prop2, propFromNestedSource: objA.prop1.propProp1 + addition });
    });

    it('should be able to use forMember to map to a nested destination', () => {
        // arrange
        const objA = {
            prop1: { propProp1: 'From A', propProp2: { propProp2Prop: 'From A' } },
            prop2: 'From A too',
        };
        const addition = ' - sure works!';

        const fromKey = '{7AC4134B-ECD1-46EB-B14A-5B9D8F5B5F8E}';
        const toKey = '{BBD6907C-ACE6-4FC8-A60D-1A943C66D83F}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('nested.property', (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + addition)
            .forMember('nested.property', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp2.propProp2Prop'); })
            .forMember('nested.property', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1.propProp1'); });

        // act
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop2: objA.prop2, nested: { property: objA.prop1.propProp1 + addition } });
    });

    it('should be able to use mapFrom to switch properties and ignore a property as well', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too', prop3: 'Also from A (really)' };

        const fromKey = 'should be able to use mapFrom to switch ';
        const toKey = 'properties and ignore a property as well';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop2'); })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop1'); })
            .forSourceMember('prop3', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA.prop2, prop2: objA.prop1 });
    });

    it('should be able to create a new property using a constant value', () => {
        // arrange
        const objA = {};

        const fromKey = 'should be able to create a new property ';
        const toKey = 'using a constant value';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop4', () => 12);

        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop4: 12 });
    });

    it('should just return source object when no properties are created using null source object', () => {
        // arrange
        const objA: any = null;

        const fromKey = 'should just return source object when no ';
        const toKey = 'properties created using null source object';

        // act
        automapper
            .createMap(fromKey, toKey);

        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toBeNull();
    });

    it('should be able to create a new property using a constant value (empty source object)', () => {
        // arrange
        const objA: any = {};

        const fromKey = 'should be able to create a new property ';
        const toKey = 'using a constant value (empty source object)';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop4', () => 12);

        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop4: 12 });
    });

    it('should map a source object with empty nested objects', () => {
        // arrange
        const src: any = {
            // homeAddress: undefined,
            // homeAddress: null,
            businessAddress: {
                address1: '200 Main St',
                // address2: '200 Main St',
                city: 'Los Angeles',
                state: 'CA',
                zip: '90000',
            },
        };

        const fromKey = '{60E9DC56-D6E1-48FF-9BAC-0805FCAF91B7}';
        const toKey = '{AC6D5A97-9AEF-42C7-BD60-A5F3D17E541A}';

        automapper
            .createMap(fromKey, toKey)
            .forMember('homeAddress.address2', (opts: IMemberConfigurationOptions) => { opts.mapFrom('homeAddress.address2'); })

            .forMember('businessAddress.address1', (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.address1'); })
            .forMember('businessAddress.address2', () => null as any)
            .forMember('businessAddress.city', (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.city'); })
            .forMember('businessAddress.state', (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.state'); })
            .forMember('businessAddress.zip', (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.zip'); })
            ;

        // act
        const dst = automapper.map(fromKey, toKey, src);

        // assert
        expect(dst).not.toBeNull();

        expect(dst.homeAddress).toBeUndefined();

        expect(dst.businessAddress.address1).toBe(src.businessAddress.address1);
        expect(dst.businessAddress.address2).toBeNull();
        expect(dst.businessAddress.city).toBe(src.businessAddress.city);
        expect(dst.businessAddress.state).toBe(src.businessAddress.state);
        expect(dst.businessAddress.zip).toBe(src.businessAddress.zip);
    });

    it('should be able to use mapFrom to map from property which is ignored itself on destination', () => {
        // arrange
        const objA = { prop1: 'From A', prop2: 'From A too', prop3: 'Also from A (really)' };

        const fromKey = 'should be able to use mapFrom to map from ';
        const toKey = 'property which is ignored itself on destination';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop2'); })
            .forMember('prop2', (opts: IMemberConfigurationOptions) => { opts.ignore(); }) // changing 'prop2' to e.g. 'destProp2' everything works correctly.
            .forSourceMember('prop3', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); })
            .forMember('prop4', () => 12);

        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA.prop2, prop4: 12 });
    });

    it('should be able to use forMember and use opts.sourceObject', () => {
        // arrange
        const objA = { prop1: 'prop1', prop2: 'prop2' };

        const fromKey = 'should be able to use forMember ';
        const toKey = 'and access opts.sourceObject' + postfix;

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', (opts: IMemberConfigurationOptions) => opts.sourceObject)
            .forMember('prop2', (opts: IMemberConfigurationOptions) => opts.sourceObject.prop1);

        // assert
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop1: objA, prop2: objA.prop1 });
    });

    it('should be able to use forMember and use opts.intermediatePropertyValue', () => {
        // arrange
        const objA = { prop1: 1 };

        const fromKey = 'should be able to use forMember ';
        const toKey = 'and access opts.intermediatePropertyValue' + postfix;

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop', (opts: IMemberConfigurationOptions) => opts.mapFrom('prop1'))
            .forMember('prop', (opts: IMemberConfigurationOptions) => !!opts.intermediatePropertyValue);

        // assert
        const objB = automapper.map(fromKey, toKey, objA);

        // assert
        expect(objB).toMatchObject({ prop: true });
    });

    //     // TODO expand AutoMapperBase.handleItem to also handle nested properties (not particularly hard to do anymore, but still requires quite a bit of work)
    //     it('should map a source object with nested objects using mapping functions and automapping at the same time', () => {
    //         // arrange
    //         var src: any = {
    //             businessAddress: {
    //                 address1: '200 Main St',
    //                 city: 'Los Angeles',
    //                 state: 'CA',
    //                 zip: '90000'
    //             }
    //         };

    //         var fromKey = '{60E9DC56-D6E1-48FF-9BAC-0805FCAF91B7}';
    //         var toKey = '{AC6D5A97-9AEF-42C7-BD60-A5F3D17E541A}';

    //         automapper
    //             .createMap(fromKey, toKey)
    //             .forMember('businessAddress.address2', (opts: IMemberConfigurationOptions) => <any>null);
    //         // the forMember call currently fails the test. Automapping on nested properties is currently
    //         // not implemented when a forMember call is present! Should work somewhat like the handleItem
    //         // function at 'root level'.

    //         // act
    //         var dst = automapper.map(fromKey, toKey, src);

    //         // assert
    //         expect(dst).not.toBeNull();

    //         expect(dst.homeAddress).toBeUndefined();
    //         console.log(dst);
    //         expect(dst.businessAddress.address1).toBe(src.businessAddress.address1);
    //         expect(dst.businessAddress.address2).toBeUndefined();
    //         expect(dst.businessAddress.city).toBe(src.businessAddress.city);
    //         expect(dst.businessAddress.state).toBe(src.businessAddress.state);
    //         expect(dst.businessAddress.zip).toBe(src.businessAddress.zip);
    //     });
});

class ClassA {
    public propA: string = null;
}

class ClassB {
    public propA: string = null;
}

// Initialization of property necessary to force Javascript create this property on class
class ClassC {
    public propA: string = null;
}

class ClassWithDefaultValues {
    public propA = 'default value';
}

class DemoToBusinessType {
}

class CustomTypeConverterInstance extends TypeConverter {
    public convert(resolutionContext: IResolutionContext): any {
        return { propA: resolutionContext.sourceValue.propA + ' (convertUsing with a class instance)' };
    }
}

class CustomTypeConverterDefinition extends TypeConverter {
    public convert(resolutionContext: IResolutionContext): any {
        return { propA: resolutionContext.sourceValue.propA + ' (convertUsing with a class definition)' };
    }
}
