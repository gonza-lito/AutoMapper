import { IMapCallback } from './IMapCallback';
import { IMapping } from './IMapping';

export type IMapItemFunction = (mapping: IMapping, sourceObject: any, destinationObject: any) => any;

export type IAsyncMapItemFunction = (mapping: IMapping, sourceObject: any, destinationObject: any, callback: IMapCallback) => void;
