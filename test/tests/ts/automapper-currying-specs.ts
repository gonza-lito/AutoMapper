// import { AsyncAutoMapper } from '../../../src/ts/AsyncAutoMapper';
// import { AutoMapper } from '../../../src/ts/AutoMapper';
// import { IMemberCallback } from '../../../src/ts/interfaces/IMemberCallback';
// import {
//     IMemberConfigurationOptions
// } from '../../../src/ts/interfaces/IMemberConfigurationOptions';
// import {
//     ISourceMemberConfigurationOptions
// } from '../../../src/ts/interfaces/ISourceMemberConfigurationOptions';

//     describe('AutoMapper - Currying support', () => {
//         const automapper = AutoMapper.getInstance();
//         it('should be able to use currying when calling createMap', () => {
//             // arrangew
//             const fromKey = '{808D9D7F-AA89-4D07-917E-A528F055EE64}';
//             const toKey1 = '{B364C0A0-9E24-4424-A569-A4C14101947C}';
//             const toKey2 = '{1055CA5A-4FC4-44CB-B4D8-B004F43D8840}';

//             const source = { prop: 'Value' };

//             // act
//             const mapFromKeyCurry = automapper.createMap(fromKey);

//             mapFromKeyCurry(toKey1)
//                 .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

//             mapFromKeyCurry(toKey2);

//             const result1 = automapper.map(fromKey, toKey1, source);
//             const result2 = automapper.map(fromKey, toKey2, source);

//             // assert
//             expect(typeof mapFromKeyCurry === 'function').toBeTruthy();
//             expect(result1.prop).toBeUndefined();
//             expect(result2.prop).toEqual(source.prop);
//         });

//         it('should be able to use currying (one parameter) when calling map', () => {
//             // arrange
//             const fromKey = 'should be able to use currying (one parameter)';
//             const toKey1 = 'when calling map (1)';
//             const toKey2 = 'when calling map (2)';

//             const source = { prop: 'Value' };

//             // act
//             const createMapFromKeyCurry = automapper.createMap(fromKey);

//             createMapFromKeyCurry(toKey1)
//                 .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

//             createMapFromKeyCurry(toKey2);

//             const result1MapCurry = automapper.map(fromKey);
//             const result2MapCurry = automapper.map(fromKey);

//             const result1 = result1MapCurry(toKey1, source);
//             const result2 = result2MapCurry(toKey2, source);

//             // assert
//             expect(typeof createMapFromKeyCurry === 'function').toBeTruthy();
//             expect(typeof result1MapCurry === 'function').toBeTruthy();
//             expect(typeof result2MapCurry === 'function').toBeTruthy();

//             expect(result1.prop).toBeUndefined();
//             expect(result2.prop).toEqual(source.prop);
//         });

//         it('should be able to use currying when calling map', () => {
//             // arrange
//             const fromKey = '{FC18523B-5A7C-4193-B938-B6AA2EABB37A}';
//             const toKey1 = '{609202F4-15F7-4512-9178-CFAF073800E1}';
//             const toKey2 = '{85096AE2-92FB-43D7-8FC3-EC14DDC1DFDD}';

//             const source = { prop: 'Value' };

//             // act
//             const createMapFromKeyCurry = automapper.createMap(fromKey);

//             createMapFromKeyCurry(toKey1)
//                 .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions) => { opts.ignore(); });

//             createMapFromKeyCurry(toKey2);

//             const result1MapCurry = automapper.map(fromKey, toKey1);
//             const result2MapCurry = automapper.map(fromKey, toKey2);

//             const result1 = result1MapCurry(source);
//             const result2 = result2MapCurry(source);

//             // assert
//             expect(typeof createMapFromKeyCurry === 'function').toBeTruthy();
//             expect(typeof result1MapCurry === 'function').toBeTruthy();
//             expect(typeof result2MapCurry === 'function').toBeTruthy();

//             expect(result1.prop).toBeUndefined();
//             expect(result2.prop).toEqual(source.prop);
//         });

//         it('should be able to use currying when calling mapAsync', (done: () => void) => {
//             // arrange
//             const fromKey = '{1CA8523C-5A7C-4193-B938-B6AA2EABB37A}';
//             const toKey1 = '{409212FD-15E7-4512-9178-CFAF073800EG}';
//             const toKey2 = '{85096AE2-92FA-43N7-8FA3-EC14DDC1DFDE}';

//             const source = { prop: 'Value' };

//             // act
//             const createMapFromKeyCurry = automapper.createMap(fromKey);

//             createMapFromKeyCurry(toKey1)
//                 .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => { cb('Constant Value 1'); });

//             createMapFromKeyCurry(toKey2)
//                 .forMember('prop', (opts: IMemberConfigurationOptions, cb: IMemberCallback) => { cb('Constant Value 2'); });

//             const result1MapCurry = automapper.mapAsync(fromKey, toKey1);
//             const result2MapCurry = automapper.mapAsync(fromKey, toKey2);

//             // assert
//             expect(typeof createMapFromKeyCurry === 'function').toBeTruthy();
//             expect(typeof result1MapCurry === 'function').toBeTruthy();
//             expect(typeof result2MapCurry === 'function').toBeTruthy();

//             let resCount = 0;
//              result1MapCurry(source, (result: any) => {
//                 // assert
//                 expect(result.prop).toEqual('Constant Value 1');
//                 if (++resCount === 2) {
//                     done();
//                 }
//             });

//             result2MapCurry(source, (result: any) => {
//                 // assert
//                 expect(result.prop).toEqual('Constant Value 2');
//                 if (++resCount === 2) {
//                     done();
//                 }
//             });
//         });

//         it('should be able to use currying when calling mapAsync with one parameter', (done: () => void) => {
//             // arrange
//             const fromKey = '{1CA8523C-5AVC-4193-BS38-B6AA2EABB37A}';
//             const toKey = '{409212FD-1527-4512-9178-CFAG073800EG}';

//             const source = { prop: 'Value' };

//             // act
//             automapper.createMap(fromKey, toKey)
//                 .forSourceMember('prop', (opts: ISourceMemberConfigurationOptions, cb: IMemberCallback) => { cb('Constant Value'); });

//             const mapAsyncCurry = automapper.mapAsync(fromKey);

//             // assert
//             expect(typeof mapAsyncCurry === 'function').toBeTruthy();

//             mapAsyncCurry(toKey, source, (result: any) => {
//                 // assert
//                 expect(result.prop).toEqual('Constant Value');
//                 done();
//             });
//         });

//         it('should be able to use currying when calling mapAsync with two parameters', (done: () => void) => {
//             // arrange
//             const fromKey = '{1CA852SC-5AVC-4193-BS38-B6AA2KABB3LA}';
//             const toKey = '{409212FD-1Q27-45G2-9178-CFAG073800EG}';

//             const source = { prop: 'Value' };

//             // act
//             automapper.createMap(fromKey, toKey)
//                 .forMember('prop', (opts: IMemberConfigurationOptions, cb: IMemberCallback) => { cb('Constant Value'); });

//             const mapAsyncCurry = automapper.mapAsync(fromKey, toKey);

//             // assert
//             expect(typeof mapAsyncCurry === 'function').toBeTruthy();

//             mapAsyncCurry(source, (result: any) => {
//                 // assert
//                 expect(result.prop).toEqual('Constant Value');
//                 done();
//             });
//         });

//         it('should be able to use currying when calling mapAsync with three parameters', (done: () => void) => {
//             // NOTE BL 20151214 I wonder why anyone would like calling this one? Maybe this one will be removed in
//             //                  the future. Please get in touch if you need this one to stay in place...

//             // arrange
//             const fromKey = '{1CA852SC-5AVC-ZZ93-BS38-B6AA2KABB3LA}';
//             const toKey = '{409212FD-1Q27-45G2-91BB-CFAG0738WCEG}';

//             const source = { prop: 'Value' };

//             // act
//             automapper.createMap(fromKey, toKey)
//                 .forMember('prop', (opts: IMemberConfigurationOptions, cb: IMemberCallback) => { cb('Constant Value'); });

//             const mapAsyncCurry = automapper.mapAsync(fromKey, toKey, source);

//             // assert
//             expect(typeof mapAsyncCurry === 'function').toBeTruthy();

//             mapAsyncCurry((result: any) => {
//                 // assert
//                 expect(result.prop).toEqual('Constant Value');
//                 done();
//             });
//         });

//         it('should fail when calling mapAsync without parameters', () => {
//             // arrange

//             expect(() => {
//                 (automapper as any).mapAsync();
//             }).toThrow(
//                 'The mapAsync function expects between 1 and 4 parameters, you provided 0.'
//             );
//             // act
//             // try {
//             //     var mapAsyncCurry = (<any>automapper).mapAsync();
//             // } catch (e) {
//             //     // assert
//             //     expect(e.message).toEqual('The mapAsync function expects between 1 and 4 parameters, you provided 0.');
//             //     return;
//             // }

//             // // assert
//             // expect(null).fail('Expected error was not raised.');
//         });

//         it('should fail when calling mapAsync with > 4 parameters', () => {
//             // arrange

//             expect(() => {
//                 (automapper as any).mapAsync(undefined, undefined, undefined, undefined, undefined);
//             }).toThrow(
//                 'The mapAsync function expects between 1 and 4 parameters, you provided 5.'
//             );
//             // act
//             // try {
//             //     var mapAsyncCurry = (<any>automapper).mapAsync(undefined, undefined, undefined, undefined, undefined);
//             // } catch (e) {
//             //     // assert
//             //     expect(e.message).toEqual('The mapAsync function expects between 1 and 4 parameters, you provided 5.');
//             //     return;
//             // }

//             // // assert
//             // expect(null).fail('Expected error was not raised.');
//         });

//         it('should fail when specifying < 2 parameters to the asynchronous map function', () => {
//             // arrange

//             expect(() => {
//                 (new AsyncAutoMapper() as any).map(undefined);
//             }).toThrow(
//                 'The AsyncAutoMapper.map function expects between 2 and 5 parameters, you provided 1.'
//             );
//             // // act
//             // try {
//             //     (<any>new AsyncAutoMapper()).map(undefined);
//             // } catch (e) {
//             //     // assert
//             //     expect(e.message).toEqual('The AsyncAutoMapper.map function expects between 2 and 5 parameters, you provided 1.');
//             //     return;
//             // }

//             // // assert
//             // expect(null).fail('Expected error was not raised.');
//         });

//         it('should fail when specifying > 5 parameters to the asynchronous map function', () => {
//             // arrange
//             expect(() => {
//                 (new AsyncAutoMapper() as any).map(undefined, undefined, undefined, undefined, undefined, undefined);
//             }).toThrow(
//                 'The AsyncAutoMapper.map function expects between 2 and 5 parameters, you provided 6.'
//             );
//             // // act
//             // try {
//             //     (<any>new AsyncAutoMapper()).map(undefined, undefined, undefined, undefined, undefined, undefined);
//             // } catch (e) {
//             //     // assert
//             //     expect(e.message).toEqual('The AsyncAutoMapper.map function expects between 2 and 5 parameters, you provided 6.');
//             //     return;
//             // }

//             // // assert
//             // expect(null).fail('Expected error was not raised.');
//         });
//     });
