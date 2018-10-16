import {
    CamelCaseNamingConvention, IConfiguration, IMemberConfigurationOptions,
    PascalCaseNamingConvention
} from '../../../src/ts/';
import { AutoMapper } from '../../../src/ts/AutoMapperClass';
import { INamingConvention } from '../../../src/ts/interfaces/INamingConvention';
import { IResolutionContext } from '../../../src/ts/interfaces/IResolutionContext';
import { Profile } from '../../../src/ts/Profile';

    class PascalCaseToCamelCaseMappingProfile extends Profile {
        public sourceMemberNamingConvention: INamingConvention;
        public destinationMemberNamingConvention: INamingConvention;

        public profileName = 'PascalCaseToCamelCase';

        public configure() {
            this.sourceMemberNamingConvention = new PascalCaseNamingConvention();
            this.destinationMemberNamingConvention = new CamelCaseNamingConvention();

            super.createMap('a', 'b');
        }
    }

    class ForAllMembersMappingProfile extends Profile {
        public sourceMemberNamingConvention: INamingConvention;
        public destinationMemberNamingConvention: INamingConvention;

        public profileName = 'ForAllMembers';

        private _fromKey: string;
        private _toKey: string;
        private _forAllMembersMappingSuffix: string;

        constructor(fromKey: string, toKey: string, forAllMembersMappingSuffix: string) {
            super();

            this._fromKey = fromKey;
            this._toKey = toKey;
            this._forAllMembersMappingSuffix = forAllMembersMappingSuffix;
        }

        public configure() {
            super.createMap(this._fromKey, this._toKey)
                .forMember('prop1', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
                .forMember('prop2', (opts: IMemberConfigurationOptions): any => opts.intermediatePropertyValue)
                .forAllMembers((destinationObject: any,
                    destinationPropertyName: string,
                    value: any): void => {
                    destinationObject[destinationPropertyName] = value + this._forAllMembersMappingSuffix;
                });
        }
    }

    class ConvertUsingMappingProfile extends Profile {
        public sourceMemberNamingConvention: INamingConvention;
        public destinationMemberNamingConvention: INamingConvention;

        public profileName = 'ConvertUsing';

        private _fromKey: string;
        private _toKey: string;
        private _convertUsingSuffix: string;

        constructor(fromKey: string, toKey: string, convertUsingSuffix: string) {
            super();

            this._fromKey = fromKey;
            this._toKey = toKey;
            this._convertUsingSuffix = convertUsingSuffix;
        }

        public configure() {
            super.createMap(this._fromKey, this._toKey)
                .convertUsing((resolutionContext: IResolutionContext): any => {
                    return {
                        prop1: resolutionContext.sourceValue.prop1 + this._convertUsingSuffix,
                        prop2: resolutionContext.sourceValue.prop2 + this._convertUsingSuffix
                     };
                });
        }
    }

    class CamelCaseToPascalCaseMappingProfile extends Profile {
        public sourceMemberNamingConvention: INamingConvention;
        public destinationMemberNamingConvention: INamingConvention;

        public profileName = 'CamelCaseToPascalCase';

        public configure() {
            this.sourceMemberNamingConvention = new CamelCaseNamingConvention();
            this.destinationMemberNamingConvention = new PascalCaseNamingConvention();
        }
    }

    class ValidatedAgeMappingProfile extends Profile {
        public profileName = 'ValidatedAgeMappingProfile';

        public configure() {
            const sourceKey = '{808D9D7F-AA89-4D07-917E-A528F078E642}';
            const destinationKey = '{808D9D6F-BA89-4D17-915E-A528E178EE64}';

            this.createMap(sourceKey, destinationKey)
                .forMember('proclaimedAge', (opts: IMemberConfigurationOptions) => opts.ignore())
                .forMember('age', (opts: IMemberConfigurationOptions) => opts.mapFrom('ageOnId'))
                .convertToType(Person);
        }
    }

    class ValidatedAgeMappingProfile2 extends Profile {
        public profileName = 'ValidatedAgeMappingProfile2';

        public configure() {
            const sourceKey = '{918D9D7F-AA89-4D07-917E-A528F07EEF42}';
            const destinationKey = '{908D9D6F-BA89-4D17-915E-A528E988EE64}';

            this.createMap(sourceKey, destinationKey)
                .forMember('proclaimedAge', (opts: IMemberConfigurationOptions) => opts.ignore())
                .forMember('age', (opts: IMemberConfigurationOptions) => opts.mapFrom('ageOnId'))
                .convertToType(Person);
        }
    }

    class Person {
        fullName: string = null;
        age: number = null;
    }

    class BeerBuyingYoungster extends Person {
    }

    describe('AutoMapper.initialize', () => {
        let postfix = ' [f0e5ef4a-ebe1-32c4-a3ed-48f8b5a5fac7]';
        const automapper = AutoMapper.getInstance();

        it('should use created mapping profile', () => {
            // arrange
            var fromKey = '{5700E351-8D88-A327-A216-3CC94A308EDE}';
            var toKey = '{BB33A261-3CA9-A8FC-85E6-2C269F73728C}';

            automapper.initialize((config: IConfiguration) => {
                config.createMap(fromKey, toKey);
            });

            // act
            automapper.map(fromKey, toKey, {});

            // assert
        });

        it('should be able to use a naming convention to convert Pascal case to camel case', () => {
            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new PascalCaseToCamelCaseMappingProfile());
            });

            const sourceKey = 'PascalCase';
            const destinationKey = 'CamelCase';

            const sourceObject = { FullName: 'John Doe' };

            automapper
                .createMap(sourceKey, destinationKey)
                .withProfile('PascalCaseToCamelCase');

            var result = automapper.map(sourceKey, destinationKey, sourceObject);

            expect(result).toEqual({ fullName: 'John Doe' });
        });

        it('should be able to use a naming convention to convert camelCase to PascalCase', () => {
            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new CamelCaseToPascalCaseMappingProfile());
            });

            const sourceKey = 'CamelCase2';
            const destinationKey = 'PascalCase2';

            const sourceObject = { fullName: 'John Doe' };

            automapper
                .createMap(sourceKey, destinationKey)
                .withProfile('CamelCaseToPascalCase');

            var result = automapper.map(sourceKey, destinationKey, sourceObject);

            expect(result).toEqual({ FullName: 'John Doe' });
        });

        it('should be able to use forMember besides using a profile', () => {
            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new CamelCaseToPascalCaseMappingProfile());
            });

            const sourceKey = 'CamelCase';
            const destinationKey = 'PascalCase';

            const sourceObject = { fullName: 'John Doe', age: 20 };

            automapper
                .createMap(sourceKey, destinationKey)
                .forMember('theAge', (opts: IMemberConfigurationOptions) => opts.mapFrom('age'))
                .withProfile('CamelCaseToPascalCase');

            var result = automapper.map(sourceKey, destinationKey, sourceObject);

            expect(result).toEqual({ FullName: 'John Doe', theAge: sourceObject.age });
        });

        it('should use profile when only profile properties are specified', () => {
            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new ValidatedAgeMappingProfile2());
            });

            const sourceKey = '{918D9D7F-AA89-4D07-917E-A528F07EEF42}';
            const destinationKey = '{908D9D6F-BA89-4D17-915E-A528E988EE64}';

            const sourceObject = { fullName: 'John Doe', proclaimedAge: 21, ageOnId: 15 };

            automapper
                .createMap(sourceKey, destinationKey)
                .withProfile('ValidatedAgeMappingProfile2');

            var result = automapper.map(sourceKey, destinationKey, sourceObject);

            expect(result).toEqual({ fullName: 'John Doe', age: sourceObject.ageOnId });
            expect(result instanceof Person).toBeTruthy();
            expect(result instanceof BeerBuyingYoungster).not.toBeTruthy();
        });

        it('should fail when using a non-existing profile', () => {
            // arrange

            var profileName = 'Non-existing profile';
            const sourceKey = 'should fail when using ';
            const destinationKey = 'a non-existing profile';
            const sourceObject = {};

            // act

            expect(() => {
                automapper
                    .createMap(sourceKey, destinationKey)
                    .withProfile(profileName);
                automapper.map(sourceKey, destinationKey, sourceObject);
            }).toThrow(
                'Could not find profile with profile name \'' + profileName + '\'.'
            );

        });

        it('should merge forMember calls when specifying the same destination property normally and using profile', () => {
            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new ValidatedAgeMappingProfile());
            });

            const sourceKey = '{808D9D7F-AA89-4D07-917E-A528F078E642}';
            const destinationKey = '{808D9D6F-BA89-4D17-915E-A528E178EE64}';

            const sourceObject = { fullName: 'John Doe', proclaimedAge: 21, ageOnId: 15 };

            automapper
                .createMap(sourceKey, destinationKey)
                .forMember('ageOnId', (opts: IMemberConfigurationOptions) => opts.ignore())
                .forMember('age', (opts: IMemberConfigurationOptions) => opts.mapFrom('proclaimedAge'))
                .convertToType(BeerBuyingYoungster)
                .withProfile('ValidatedAgeMappingProfile');

            var result = automapper.map(sourceKey, destinationKey, sourceObject);

            expect(result).toEqual({ fullName: 'John Doe', age: sourceObject.ageOnId });
            expect(result instanceof Person).toBeTruthy();
            expect(result instanceof BeerBuyingYoungster).not.toBeTruthy();
        });

        // it('should be able to use currying when calling initialize(cfg => cfg.createMap)', () => {
        //     // arrange
        //     var fromKey = '{808D9D7F-AA89-4D07-917E-A528F078EE64}';
        //     var toKey1 = '{B364C0A0-9E24-4424-A569-A4C14102147C}';
        //     var toKey2 = '{1055CA5A-4FC4-44CA-B4D8-B004F43D4440}';

        //     var source = { prop: 'Value' };

        //     // act
        //     var mapFromKeyCurry: (destinationKey: string) => ICreateMapFluentFunctions;

        //     automapper.initialize((config: IConfiguration) => {
        //         mapFromKeyCurry = config.createMap(fromKey);

        //         mapFromKeyCurry(toKey1)
        //             .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => {
        //                 opts.ignore();
        //             });

        //         mapFromKeyCurry(toKey2);
        //     });

        //     var result1 = automapper.map(fromKey, toKey1, source);
        //     var result2 = automapper.map(fromKey, toKey2, source);

        //     // assert
        //     expect(typeof mapFromKeyCurry === 'function').toBeTruthy();
        //     expect(result1.prop).toBeUndefined();
        //     expect(result2.prop).toEqual(source.prop);
        // });

        it('should be able to use a mapping profile with forAllMemberMappings', () => {
            // arrange
            var fromKey = 'should be able to use a mapping profile ';
            var toKey = 'with forAllMemberMappings' + postfix;

            var source = { prop1: 'prop1', prop2: 'prop2' };
            var forAllMembersMappingSuffix = ' [forAllMembers]';

            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new ForAllMembersMappingProfile(fromKey, toKey, forAllMembersMappingSuffix));
            });

            automapper
                .createMap(fromKey, toKey)
                .withProfile('ForAllMembers');

            // act
            var destination = automapper.map(fromKey, toKey, source);

            // assert
            expect(destination.prop1).toEqual(source.prop1 + forAllMembersMappingSuffix);
            expect(destination.prop2).toEqual(source.prop2 + forAllMembersMappingSuffix);
        });

        it('should be able to use a mapping profile with convertUsing', () => {
            // arrange
            var fromKey = 'should be able to use a mapping profile ';
            var toKey = 'with convertUsing' + postfix;

            var source = { prop1: 'prop1', prop2: 'prop2' };
            var convertUsingSuffix = ' [convertUsing]';

            automapper.initialize((config: IConfiguration) => {
                config.addProfile(new ConvertUsingMappingProfile(fromKey, toKey, convertUsingSuffix));
            });

            automapper
                .createMap(fromKey, toKey)
                .withProfile('ConvertUsing');

            // act
            var destination = automapper.map(fromKey, toKey, source);

            // assert
            expect(destination.prop1).toEqual(source.prop1 + convertUsingSuffix);
            expect(destination.prop2).toEqual(source.prop2 + convertUsingSuffix);
        });
    });

