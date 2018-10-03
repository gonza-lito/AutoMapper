import { ICreateMapFluentFunctions } from './ICreateMapFluentFunctions';
import { IMapping } from './IMapping';

export interface ICreateMapForMemberParameters {
    mapping: IMapping;
    propertyName: string;
    transformation: any;
    sourceMapping: boolean;
    fluentFunctions: ICreateMapFluentFunctions;
}
