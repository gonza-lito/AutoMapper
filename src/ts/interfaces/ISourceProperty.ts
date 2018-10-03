import { IDestinationProperty } from './IDestinationProperty';
import { IProperty } from './IProperty';

export interface ISourceProperty extends IProperty {
    children: ISourceProperty[];
    destination: IDestinationProperty;
}
