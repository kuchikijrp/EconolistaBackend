import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

function isValidEan(value: string): boolean {
    if (!value) return false;

    // somente números
    if (!/^\d+$/.test(value)) return false;

    // tamanhos válidos
    return [8, 12, 13, 14].includes(value.length);
}

export function IsEAN(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'IsEAN',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    if (value === null || value === undefined) return false;
                    return typeof value === 'string' && isValidEan(value);
                },
                defaultMessage() {
                    return 'EAN must contain only digits and have length 8, 12, 13 or 14';
                },
            },
        });
    };
}