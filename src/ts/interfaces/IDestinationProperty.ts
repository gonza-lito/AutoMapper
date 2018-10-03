import { IDestinationTransformation } from './IDestinationTransformation';
import { IProperty } from './IProperty';

export interface IDestinationProperty extends IProperty {
    child: IDestinationProperty;
    transformations: IDestinationTransformation[];
    conditionFunction: (sourceObject: any) => boolean;
    ignore: boolean;
    sourceMapping: boolean; // TODO is this still necessary?
}
