import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsHalfStep(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isHalfStep',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          if (typeof value !== 'number' || isNaN(value)) return false;
          // Multiply by 2 to avoid floating-point issues
          return (value * 2) % 1 === 0;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a multiple of 0.5`;
        },
      },
    });
  };
}
