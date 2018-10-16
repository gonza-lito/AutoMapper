import { AutoMapper } from './AutoMapperClass';
import { ICreateMapFluentFunctions } from './interfaces/ICreateMapFluentFunctions';
import { INamingConvention } from './interfaces/INamingConvention';
import { IProfile } from './interfaces/IProfile';

/**
 * Converts source type to destination type instead of normal member mapping
 */
export class Profile implements IProfile {
    /** Profile name */
    public profileName: string;

    /** Naming convention for source members */
    public sourceMemberNamingConvention: INamingConvention;

    /** Naming convention for destination members */
    public destinationMemberNamingConvention: INamingConvention;

    /**
     * Implement this method in a derived class and call the CreateMap method to associate that map with this profile.
     * Avoid calling the AutoMapper class / automapper instance from this method.
     */
    public configure(): void {
        // do nothing
    }

    /**
     * Create a mapping profile.
     * @param {string} sourceKey The map source key.
     * @param {string} destinationKey The map destination key.
     * @returns {Core.ICreateMapFluentFunctions}
     */
    protected createMap(sourceKey: string, destinationKey: string): ICreateMapFluentFunctions {
        const argsCopy = Array.prototype.slice.apply(arguments);

        for (let index = 0, length = argsCopy.length; index < length; index++) {
            if (argsCopy[index]) {
                // prefix sourceKey and destinationKey with 'profileName=>'
                argsCopy[index] = `${this.profileName}=>${argsCopy[index]}`;
            }
        }

        const instance = AutoMapper.getInstance();
        // pass through using arguments to keep createMap's currying support fully functional.
        return instance.createMap.apply(instance, argsCopy);
    }
}
