import { ValidStatsAttribute } from '../types/valid-stat-attribute.type';
import { InvalidPropertyError, RequiredParameterError } from './errors';

export const requiredParam = (
  value: string | number | boolean | object,
  paramName: string
) => {
  const message = `${paramName} is required.`;
  if (
    value === null ||
    value === undefined ||
    value === false ||
    value === ''
  ) {
    throw new RequiredParameterError(message);
  }
};

export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  paramName: string
) => {
  const message = `${paramName} must be between ${min} and ${max}.`;
  if (value < min || value > max) {
    throw new InvalidPropertyError(message);
  }
};

export const validateStringType = (value: string, paramName: string) => {
  const message = `${paramName} must be a string.`;
  if (typeof value !== 'string') {
    throw new InvalidPropertyError(message);
  }
};

export const validateNumberType = (value: number, paramName: string) => {
  const message = `${paramName} must be a number.`;
  if (typeof value !== 'number') {
    throw new InvalidPropertyError(message);
  }
};

export const validateAlphanumericUnderscore = (
  value: string,
  paramName: string
) => {
  const pattern = /^[A-Za-z0-9_]*$/;
  const message = `${paramName} must only contain letters, numbers, and underscore.`;
  if (!pattern.test(value)) {
    throw new InvalidPropertyError(message);
  }
};

export const validatePositiveNumber = (value: number, paramName: string) => {
  const message = `${paramName} must be a positive number.`;
  if (typeof value !== 'number' || value <= 0) {
    throw new InvalidPropertyError(message);
  }
};

export const validateSortOrder = (sortOrder: string, paramName: string) => {
  const validSortOrders = ['asc', 'desc'];
  const message = `${paramName} should be either 'asc' or 'desc'.`;
  if (!validSortOrders.includes(sortOrder)) {
    throw new InvalidPropertyError(message);
  }
};

export const validateStatsAttribute = (
  attribute: string,
) => {
  const validAttributes: ValidStatsAttribute[] = [
    'health',
    'strength',
    'agility',
    'intelligence',
    'armor',
    'critChance',
  ];
  const message = `Invalid attribute: ${attribute}.`;
  if (!validAttributes.includes(attribute as ValidStatsAttribute)) {
    throw new InvalidPropertyError(message);
  }
};
