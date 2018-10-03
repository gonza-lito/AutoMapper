import { IResolutionContext } from './IResolutionContext';

export interface ITypeConverter {
    /**
     * Performs conversion from source to destination type.
     * @param {IResolutionContext} resolutionContext Resolution context.
     * @returns {any} Destination object.
     */
    convert: (resolutionContext: IResolutionContext) => any;
}
