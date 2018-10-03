import { INamingConvention } from './INamingConvention';

export interface IProfile {
    /** Profile name */
    profileName: string;

    /** Naming convention for source members */
    sourceMemberNamingConvention: INamingConvention;

    /** Naming convention for destination members */
    destinationMemberNamingConvention: INamingConvention;

    /**
     * Implement this method in a derived class and call the CreateMap method to associate that map with this profile.
     * Avoid calling the AutoMapper class / automapper instance from this method.
     */
    configure: () => void;
}