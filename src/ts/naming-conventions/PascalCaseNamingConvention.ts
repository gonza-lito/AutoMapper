import { INamingConvention } from '../interfaces/INamingConvention';

export class PascalCaseNamingConvention implements INamingConvention {
    public splittingExpression = /(^[A-Z]+(?=$|[A-Z]{1}[a-z0-9]+)|[A-Z]?[a-z0-9]+)/;
    public separatorCharacter = '';

    public transformPropertyName(sourcePropertyNameParts: string[]): string {
        // Transform the splitted parts.
        let result = '';

        for (let index = 0, length = sourcePropertyNameParts.length; index < length; index++) {
            result += sourcePropertyNameParts[index].charAt(0).toUpperCase() +
                sourcePropertyNameParts[index].substr(1);

        }

        return result;
    }
}
