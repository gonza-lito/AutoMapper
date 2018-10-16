import { AutoMapper as am } from './AutoMapperClass';

export * from './AutoMapperClass';
export * from './interfaces/IConfiguration';
export * from './interfaces/IProfile';
export * from './naming-conventions/CamelCaseNamingConvention';
export * from './naming-conventions/PascalCaseNamingConvention';
export * from './interfaces/IMemberConfigurationOptions';
export * from './interfaces/ICreateMapFluentFunctions';
export * from './interfaces/ICreateMapForMemberParameters';

export const AutoMapperInstance = am.getInstance();
