import { AutoMapper } from '../../../src/ts/AutoMapper';
import { DestinationTransformationType } from '../../../src/ts/AutoMapperEnumerations';
import { IMapping } from '../../../src/ts/interfaces/IMapping';
import {
    IMemberConfigurationOptions
} from '../../../src/ts/interfaces/IMemberConfigurationOptions';
import {
    ISourceMemberConfigurationOptions
} from '../../../src/ts/interfaces/ISourceMemberConfigurationOptions';
import { ISourceProperty } from '../../../src/ts/interfaces/ISourceProperty';

describe('AutoMapper.createMap.forSourceMember', () => {
    const postfix = ' [5fbe5d7c-9348-4c0b-a2d8-21f7d16fd7d4]';
    const automapper = AutoMapper.getInstance();

    it('should be able to use forSourceMember to ignore a property', () => {
        // arrange
        const fromKey = 'should be able to use ';
        const toKey = 'forSourceMember to ignore a property' + postfix;

        const ignoreFunc = (opts: ISourceMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop', ignoreFunc);

        // assert
        const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).toBe(1);
        expect(properties[0]).toMatchObject({
            name: 'prop',
            destinationPropertyName: 'prop',
            parent: null,
            level: 0,
            children: [],
            destination: { name: 'prop', parent: null, level: 0, child: null, transformations: [{ transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreFunc }], sourceMapping: true, ignore: true },
        });
    });

    it('should be able to custom map a source property using the forSourceMember function', () => {
        // arrange
        const fromKey = 'should be able to custom map a source ';
        const toKey = 'property using the forSourceMember function' + postfix;

        const customMappingFunc = (opts: ISourceMemberConfigurationOptions) => 'Yeah!';

        // act
        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop', customMappingFunc);

        // assert
        const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).toBe(1);
        expect(properties[0]).toMatchObject({
            name: 'prop',
            destinationPropertyName: 'prop',
            parent: null,
            level: 0,
            children: [],
            destination: { name: 'prop', parent: null, level: 0, child: null, transformations: [{ transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: customMappingFunc }], sourceMapping: true, ignore: false },
        });
    });

    it('should be able to ignore a source property already specified (by forMember) using the forSourceMember function', () => {
        // arrange
        const fromKey = 'should be able to ignore a source property already specified ';
        const toKey = '(by forMember) using the forSourceMember function' + postfix;

        const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('prop2');
        const ignoreFunc = (opts: ISourceMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forMember('prop1', mapFromFunc)
            .forSourceMember('prop2', ignoreFunc);

        // assert
        const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).toBe(1);
        expect(properties[0]).toMatchObject({
            name: 'prop2',
            destinationPropertyName: 'prop1',
            parent: null,
            level: 0,
            children: [],
            destination: {
                name: 'prop1',
                parent: null,
                level: 0,
                child: null,
                transformations: [
                    { transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc },
                    { transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreFunc },
                ],
                ignore: true,
                sourceMapping: true,
            },
        });
    });

    it('should be able to use forSourceMember to ignore a property and use forMember.mapFrom to write to a custom destination at the same time', () => {
        // arrange
        const fromKey = 'should be able to use forSourceMember to ignore a property ';
        const toKey = 'and use forMember.mapFrom to write to a custom destination at the same time' + postfix;

        const mapFromFunc = (opts: IMemberConfigurationOptions) => opts.mapFrom('prop2');
        const ignoreFunc = (opts: ISourceMemberConfigurationOptions) => opts.ignore();

        // act
        automapper
            .createMap(fromKey, toKey)
            .forSourceMember('prop1', ignoreFunc)
            .forMember('prop1', mapFromFunc);

        // assert
        const properties = TestHelper.assertAndGetProperty(fromKey, toKey);
        expect(properties.length).toBe(2);
        expect(properties[0]).toMatchObject({
            name: 'prop1',
            destinationPropertyName: 'prop1',
            parent: null,
            level: 0,
            children: [],
            destination: { name: 'prop1', parent: null, level: 0, child: null, transformations: [{ transformationType: DestinationTransformationType.SourceMemberOptions, sourceMemberConfigurationOptionsFunc: ignoreFunc }], ignore: true, sourceMapping: true },
        });
        expect(properties[1]).toMatchObject({
            name: 'prop2',
            destinationPropertyName: 'prop1',
            parent: null,
            level: 0,
            children: [],
            destination: { name: 'prop1', parent: null, level: 0, child: null, transformations: [{ transformationType: DestinationTransformationType.MemberOptions, memberConfigurationOptionsFunc: mapFromFunc }], ignore: false, sourceMapping: false },
        });
    });

    it('should fail when forSourceMember is used with anything else than a function', () => {
        // arrange


        const fromKey = 'should be able to use ';
        const toKey = 'forSourceMember to ignore a property' + postfix;

        //const ignoreFunc = (opts: ISourceMemberConfigurationOptions) => opts.ignore();

        expect(() => {
            automapper
                .createMap(fromKey, toKey)
                .forSourceMember('prop', 12 as any);
        }).toThrow(
            'Configuration of forSourceMember has to be a function with one (sync) or two (async) options parameters.'
        );
        // try {
        // // act
        // automapper
        //     .createMap(fromKey, toKey)
        //     .forSourceMember('prop', 12 as any);
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
});

class TestHelper {
    public static assertAndGetMapping(fromKey: string, toKey: string): IMapping {
        const automapper = AutoMapper.getInstance();
        const mapping = (automapper as any)._mappings[fromKey + toKey] as IMapping; // test only => unsupported in production!
        expect(mapping).not.toBeNull();
        return mapping;
    }

    public static assertAndGetProperty(fromKey: string, toKey: string): ISourceProperty[] {
        const mapping = TestHelper.assertAndGetMapping(fromKey, toKey);
        return mapping.properties;
    }
}
