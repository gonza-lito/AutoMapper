import { AutoMapper } from '../../../src/ts/AutoMapper';
import { DestinationTransformationType } from '../../../src/ts/AutoMapperEnumerations';
import { IDestinationProperty } from '../../../src/ts/interfaces/IDestinationProperty';
import { IDestinationTransformation } from '../../../src/ts/interfaces/IDestinationTransformation';
import { IMapping } from '../../../src/ts/interfaces/IMapping';
import {
    IMemberConfigurationOptions
} from '../../../src/ts/interfaces/IMemberConfigurationOptions';
import {
    ISourceMemberConfigurationOptions
} from '../../../src/ts/interfaces/ISourceMemberConfigurationOptions';
import { ISourceProperty } from '../../../src/ts/interfaces/ISourceProperty';

    describe('AutoMapper.createMap.forMember', () => {
        let postfix = ' [f0e5ef36-e1ed-47c4-a86f-48f8b52e6897]';
        const automapper = AutoMapper.getInstance();

        it('should be able to use forMember to ignore a property', () => {
            // arrange
            const fromKey = 'should be able to use ';
            const toKey = 'forMember to ignore a property' + postfix;

            const ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('prop', ignoreFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty('prop', 'prop', 'prop', null, [{
                transformationType: 2,
                memberConfigurationOptionsFunc: ignoreFunc,
            }], true, false);
            const source = TestHelper.createSourceProperty('prop', 'prop', 'prop', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to use forMember with a constant value', () => {
            // arrange
            const fromKey = 'should be able to use forMember ';
            const toKey = 'with a constant value' + postfix;

            const constantResult = 2;

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('prop', constantResult);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty('prop', 'prop', 'prop', null, [{ transformationType: 1, constant: constantResult }], false, false);
            const source = TestHelper.createSourceProperty('prop', 'prop', 'prop', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to use forMember with a function returning a constant value', () => {
            // arrange
            const fromKey = 'should be able to use forMember with ';
            const toKey = 'a function returning a constant value' + postfix;

            const func = () => 12;

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('prop', func);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty('prop', 'prop', 'prop', null, [{ transformationType: 2, memberConfigurationOptionsFunc: func }], false, false);
            const source = TestHelper.createSourceProperty('prop', 'prop', 'prop', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to use forMember to mapFrom and ignore a property', () => {
            // arrange
            const fromKey = 'should be able to use ';
            const toKey = 'forMember to mapFrom and ignore a property' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('prop2');
            const ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('prop1', mapFromFunc)
                .forMember('prop2', ignoreFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(2);

            const destination1 = TestHelper.createDestinationProperty('prop1', 'prop2', 'prop1', null, [{
                transformationType: 2,
                memberConfigurationOptionsFunc: mapFromFunc,
            }], false, false);
            const source1 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop1', null, destination1);

            const destination2 = TestHelper.createDestinationProperty('prop2', 'prop2', 'prop2', null, [{
                transformationType: 2,
                memberConfigurationOptionsFunc: ignoreFunc,
            }], true, false);
            const source2 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop2', null, destination2);

            expect(properties[0]).toMatchObject(source1);
            expect(properties[1]).toMatchObject(source2);
        });

        it('should be able to use mapFrom to map from property which is ignored itself on destination and do some more', () => {
            // arrange
            const fromKey = 'should be able to use mapFrom to map from ';
            const toKey = 'property which is ignored itself on destination and do some more' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => { opts.mapFrom('prop2'); };
            const ignoreFunc = (opts: IMemberConfigurationOptions) => { opts.ignore(); };
            const ignoreSourceFunc = (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); };
            const constantFunc = () => 12;

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('prop1', mapFromFunc)
                .forMember('prop2', ignoreFunc)
                .forSourceMember('prop3', ignoreSourceFunc)
                .forMember('prop4', constantFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(4);

            const destination1 = TestHelper.createDestinationProperty('prop1', 'prop2', 'prop1', null, [{ transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc }], false, false);
            const source1 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop1', null, destination1);

            const destination2 = TestHelper.createDestinationProperty('prop2', 'prop2', 'prop2', null, [{ transformationType: 2, memberConfigurationOptionsFunc: ignoreFunc }], true, false);
            const source2 = TestHelper.createSourceProperty('prop2', 'prop2', 'prop2', null, destination2);

            const destination3 = TestHelper.createDestinationProperty(
                'prop3', 'prop3', 'prop3', null, [{ transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreSourceFunc }], true, true);
            const source3 = TestHelper.createSourceProperty('prop3', 'prop3', 'prop3', null, destination3);

            const destination4 = TestHelper.createDestinationProperty('prop4', 'prop4', 'prop4', null, [{ transformationType: 2, memberConfigurationOptionsFunc: constantFunc }], false, false);
            const source4 = TestHelper.createSourceProperty('prop4', 'prop4', 'prop4', null, destination4);

            expect(properties[0]).toMatchObject(source1);
            expect(properties[1]).toMatchObject(source2);
            expect(properties[2]).toMatchObject(source3);
            expect(properties[3]).toMatchObject(source4);
        });

        it('should accept multiple forMember calls for the same destination property and overwrite with the last one specified', () => {
            // arrange
            const fromKey = 'should accept multiple forMember calls for ';
            const toKey = 'the same destination property and overwrite with the last one specified' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('prop2');
            const ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('prop1', mapFromFunc)
                .forMember('prop1', ignoreFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty(
                'prop1', 'prop2', 'prop1', null, [
                    { transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc },
                    { transformationType: 2, memberConfigurationOptionsFunc: ignoreFunc },
                ],
                true, false);
            const source = TestHelper.createSourceProperty('prop2', 'prop2', 'prop1', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps', () => {
            // arrange
            const fromKey = 'should be able to use stack forMember calls to map a ';
            const toKey = 'source property to a destination property using multiple mapping steps' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('birthdayString');
            const makeDateFunc = (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue);

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('birthday', mapFromFunc)
                .forMember('birthday', makeDateFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty(
                'birthday', 'birthdayString', 'birthday', null,
                [
                    { transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc },
                    { transformationType: 2, memberConfigurationOptionsFunc: makeDateFunc },
                ], false, false);
            const source = TestHelper.createSourceProperty('birthdayString', 'birthdayString', 'birthday', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to use stack forMember calls to map a source property to a destination property using multiple mapping steps in any order', () => {
            // arrange
            const fromKey = 'should be able to use stack forMember calls to map a source property ';
            const toKey = 'to a destination property using multiple mapping steps in any order' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('birthdayString');
            const makeDateFunc = (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue);

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('birthday', makeDateFunc)
                .forMember('birthday', mapFromFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty(
                'birthday', 'birthdayString', 'birthday', null,
                [
                    { transformationType: 2, memberConfigurationOptionsFunc: makeDateFunc },
                    { transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc },
                ], false, false);
            const source = TestHelper.createSourceProperty('birthdayString', 'birthdayString', 'birthday', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to stack forMember calls and still ignore', () => {
            // arrange
            const fromKey = 'should be able to stack forMember ';
            const toKey = 'calls and still ignore' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('birthdayString');
            const makeDateFunc = (opts: IMemberConfigurationOptions) => new Date(opts.intermediatePropertyValue);
            const ignoreFunc = (opts: IMemberConfigurationOptions) => opts.ignore();

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('birthday', mapFromFunc)
                .forMember('birthday', makeDateFunc)
                .forMember('birthday', ignoreFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const destination = TestHelper.createDestinationProperty(
                'birthday', 'birthdayString', 'birthday', null,
                [
                    { transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc },
                    { transformationType: 2, memberConfigurationOptionsFunc: makeDateFunc },
                    { transformationType: 2, memberConfigurationOptionsFunc: ignoreFunc },
                ], true, false);
            const source = TestHelper.createSourceProperty('birthdayString', 'birthdayString', 'birthday', null, destination);

            expect(properties[0]).toMatchObject(source);
        });

        it('should be able to use forMember to map a nested source property to a flat destination property', () => {
            // arrange
            const fromKey = 'should be able to use forMember to map a nested source ';
            const toKey = 'property to a flat destination property' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1', mapFromFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty(
                'dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null, [{ transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc }], false, false);

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', null, null, null);
            const srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1', srcLevel1, dstLevel1);
            srcLevel1.children.push(srcLevel2);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use stacked forMember calls to map a nested source property to a flat destination property', () => {
            // arrange
            const fromKey = 'should be able to use stacked forMember calls to map a nested source ';
            const toKey = 'property to a flat destination property' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');
            const useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + 'addition';

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1', mapFromFunc)
                .forMember('dstLevel1', useIntermediateFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null,
                [
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc },
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc },
                ], false, false);

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1', null, null);
            const srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1', srcLevel1, dstLevel1);
            srcLevel1.children.push(srcLevel2);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use forMember to map a flat source property to a nested destination property', () => {
            // arrange
            const fromKey = 'should be able to use forMember to map a flat source ';
            const toKey = 'property to a nested destination property' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1');

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1.dstLevel2', mapFromFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, [], false, false);
            const dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1', 'dstLevel1.dstLevel2', dstLevel1, [{ transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc }], false, false);
            dstLevel1.child = dstLevel2;

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, dstLevel1);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use stacked forMember calls to forMember calls to map a flat source property to a nested destination property', () => {
            // arrange
            const fromKey = 'should be able to use stacked forMember calls to forMember calls to map a flat source ';
            const toKey = 'property to a nested destination property' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1');
            const useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + 'addition';

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1.dstLevel2', mapFromFunc)
                .forMember('dstLevel1.dstLevel2', useIntermediateFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, [], false, false);
            const dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1', 'dstLevel1.dstLevel2', dstLevel1,
                [
                    { transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc },
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc },
                ], false, false);
            dstLevel1.child = dstLevel2;

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, dstLevel1);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use stacked forMember calls to forMember calls to map a flat source property to a nested destination property in any order', () => {
            // arrange
            const fromKey = 'should be able to use stacked forMember calls to forMember calls to map a flat source ';
            const toKey = 'property to a nested destination property in any order' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1');
            const useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + 'addition';

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1.dstLevel2', useIntermediateFunc)
                .forMember('dstLevel1.dstLevel2', mapFromFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, [], false, false);
            const dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1', 'dstLevel1.dstLevel2', dstLevel1,
                [
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc },
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc },
                ], false, false);
            dstLevel1.child = dstLevel2;

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1', 'dstLevel1.dstLevel2', null, dstLevel1);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use forMember to map to a nested destination using mapFrom rebasing', () => {
            // arrange
            const fromKey = 'should be able to use forMember to map to a ';
            const toKey = 'nested destination using mapFrom rebasing' + postfix;

            const useIntermediateFunc = (opts: IMemberConfigurationOptions) => opts.intermediatePropertyValue + ' - sure works!';
            const mapFromFunc1 = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2.srcLevel3');
            const mapFromFunc2 = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1.dstLevel2', useIntermediateFunc)
                .forMember('dstLevel1.dstLevel2', mapFromFunc1)
                .forMember('dstLevel1.dstLevel2', mapFromFunc2);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, [], false, false);
            const dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', dstLevel1,
                [
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: useIntermediateFunc },
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc1 },
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc2 },
                ], false, false);
            dstLevel1.child = dstLevel2;

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, null);
            const srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', srcLevel1, dstLevel1);
            srcLevel1.children.push(srcLevel2);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use forMember to map a nested source property to a nested destination property', () => {
            // arrange
            const fromKey = 'should be able to use forMember to map a nested source ';
            const toKey = 'property to a nested destination property' + postfix;

            const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('srcLevel1.srcLevel2');

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('dstLevel1.dstLevel2', mapFromFunc);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(1);

            const dstLevel1 = TestHelper.createDestinationProperty('dstLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, [], false, false);
            const dstLevel2 = TestHelper.createDestinationProperty('dstLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', dstLevel1, [{ transformationType: 2, memberConfigurationOptionsFunc: mapFromFunc }], false, false);
            dstLevel1.child = dstLevel2;

            const srcLevel1 = TestHelper.createSourceProperty('srcLevel1', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', null, null);
            const srcLevel2 = TestHelper.createSourceProperty('srcLevel2', 'srcLevel1.srcLevel2', 'dstLevel1.dstLevel2', srcLevel1, dstLevel1);
            srcLevel1.children.push(srcLevel2);

            expect(properties[0]).toMatchObject(srcLevel1 /* prevent stack overflow exception (parent/child properties) */);
        });

        it('should be able to use forMember to map a couple of nested source properties to a couple of nested destination properties', () => {
            // arrange
            const fromKey = 'should be able to use forMember to map a couple of nested source ';
            const toKey = 'properties to a couple of nested destination properties' + postfix;

            // tslint:disable-next-line:one-variable-per-declaration
            const mapFromHomeAddressAddress2 = (opts: IMemberConfigurationOptions) => { opts.mapFrom('homeAddress.address2'); },
                mapFromHomeAddressCity = (opts: IMemberConfigurationOptions) => { opts.mapFrom('homeAddress.city'); },
                mapFromHomeAddressState = (opts: IMemberConfigurationOptions) => { opts.mapFrom('homeAddress.state'); },
                mapFromHomeAddressZip = (opts: IMemberConfigurationOptions) => { opts.mapFrom('homeAddress.zip'); };

            // tslint:disable-next-line:one-variable-per-declaration
            const mapFromBusinessAddressAddress1 = (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.address1'); },
                mapFromBusinessAddressAddress2 = () => null as any,
                mapFromBusinessAddressCity = (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.city'); },
                mapFromBusinessAddressState = (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.state'); },
                mapFromBusinessAddressZip = (opts: IMemberConfigurationOptions) => { opts.mapFrom('businessAddress.zip'); };

            // act
            automapper
                .createMap(fromKey, toKey)
                .forMember('homeAddress.address2', mapFromHomeAddressAddress2)
                .forMember('homeAddress.city', mapFromHomeAddressCity)
                .forMember('homeAddress.state', mapFromHomeAddressState)
                .forMember('homeAddress.zip', mapFromHomeAddressZip)

                .forMember('businessAddress.address1', mapFromBusinessAddressAddress1)
                .forMember('businessAddress.address2', mapFromBusinessAddressAddress2)
                .forMember('businessAddress.city', mapFromBusinessAddressCity)
                .forMember('businessAddress.state', mapFromBusinessAddressState)
                .forMember('businessAddress.zip', mapFromBusinessAddressZip);

            // assert
            const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
            expect(properties.length).toBe(9);

            const assertFunc = (srcLevel1: string, srcLevel2: string, dstLevel1: string, dstLevel2: string, func: any, propertyIndex: number): void => {
                const dstPropLevel1 = TestHelper.createDestinationProperty(dstLevel1, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, null, [], false, false);
                const dstPropLevel2 = TestHelper.createDestinationProperty(dstLevel2, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, dstPropLevel1, [{ transformationType: 2, memberConfigurationOptionsFunc: func }], false, false);
                dstPropLevel1.child = dstPropLevel2;

                const srcPropLevel1 = TestHelper.createSourceProperty(srcLevel1, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, null, null);
                const srcPropLevel2 = TestHelper.createSourceProperty(srcLevel2, srcLevel1 + '.' + srcLevel2, dstLevel1 + '.' + dstLevel2, srcPropLevel1, dstPropLevel1);
                srcPropLevel1.children.push(srcPropLevel2);

                expect(properties[propertyIndex]).toMatchObject(srcPropLevel1 /* prevent stack overflow exception (parent/child properties) */);
            };

            assertFunc('homeAddress', 'address2', 'homeAddress', 'address2', mapFromHomeAddressAddress2, 0);
            assertFunc('homeAddress', 'city', 'homeAddress', 'city', mapFromHomeAddressCity, 1);
            assertFunc('homeAddress', 'state', 'homeAddress', 'state', mapFromHomeAddressState, 2);
            assertFunc('homeAddress', 'zip', 'homeAddress', 'zip', mapFromHomeAddressZip, 3);

            assertFunc('businessAddress', 'address1', 'businessAddress', 'address1', mapFromBusinessAddressAddress1, 4);
            assertFunc('businessAddress', 'address2', 'businessAddress', 'address2', mapFromBusinessAddressAddress2, 5);
            assertFunc('businessAddress', 'city', 'businessAddress', 'city', mapFromBusinessAddressCity, 6);
            assertFunc('businessAddress', 'state', 'businessAddress', 'state', mapFromBusinessAddressState, 7);
            assertFunc('businessAddress', 'zip', 'businessAddress', 'zip', mapFromBusinessAddressZip, 8);
        });

        // it('should work', () => {
        //     // arrange
        //     // act
        //     // assert
        // });

    });

    class TestHelper {
        public static assertAndGetMapping(fromKey: string, toKey: string): IMapping {
            const mapping = (AutoMapper.getInstance() as any)._mappings[fromKey + toKey] as IMapping; // test only => unsupported in production!
            expect(mapping).not.toBeNull();
            return mapping;
        }

        public static assertAndGetProperty(fromKey: string, toKey: string): ISourceProperty[] {
            const mapping = TestHelper.assertAndGetMapping(fromKey, toKey);
            return mapping.properties;
        }

        public static createDestinationProperty(
            name: string,
            sourceName: string,
            destinationName: string,
            parent: IDestinationProperty,
            transformations: IDestinationTransformation[],
            ignore: boolean,
            sourceMapping: boolean): IDestinationProperty {
            const property = {
                name,
                sourcePropertyName: sourceName,
                destinationPropertyName: destinationName,
                parent,
                level: !parent ? 0 : parent.level + 1,
                child: null,
                transformations: transformations ? transformations : [],
                ignore,
                conditionFunction: null,
                sourceMapping,
            } as IDestinationProperty;
            return property;
        }

        public static createSourceProperty(
            name: string,
            sourceName: string,
            destinationName: string,
            parent: ISourceProperty,
            destination: IDestinationProperty): ISourceProperty {
            const property = {
                name,
                sourcePropertyName: sourceName,
                destinationPropertyName: destinationName,
                parent,
                level: !parent ? 0 : parent.level + 1,
                children: [],
                destination,
            } as ISourceProperty;
            return property;
        }
    }
