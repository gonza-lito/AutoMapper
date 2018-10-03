import { IDestinationTransformation } from './IDestinationTransformation';

export interface IMemberMappingMetaData {
    destination: string;
    source: string;
    transformation: IDestinationTransformation;
    sourceMapping: boolean;
    ignore: boolean;
    async: boolean;
    condition: (sourceObject: any) => boolean;
}
