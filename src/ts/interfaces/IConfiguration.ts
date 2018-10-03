import { ICreateMapFluentFunctions } from './ICreateMapFluentFunctions';
import { IProfile } from './IProfile';

export interface IConfiguration {
    /**
     * Add an existing profile
     * @param profile {IProfile} Profile to add.
     */
    addProfile(profile: IProfile): void;

    /**
     * Create a createMap curry function which expects only a destination key.
     * @param {string} sourceKey The map source key.
     * @returns {(destinationKey: string) => IAutoMapperCreateMapChainingFunctions}
     */
    createMap?(sourceKey: string): (destinationKey: string) => ICreateMapFluentFunctions;

    /**
     * Create a mapping profile.
     * @param {string} sourceKey The map source key.
     * @param {string} destinationKey The map destination key.
     * @returns {Core.IAutoMapperCreateMapChainingFunctions}
     */
    createMap?(sourceKey: string, destinationKey: string): ICreateMapFluentFunctions;
}
