import {
  InvalidPropertyError,
  UniqueConstraintError,
} from '../../utils/errors';

export const handleMongooseUniqueConstraintError = (error: Error) => {
  const regex = /index: (\w+)_\d+ dup key: { (\w+): ".+" }/;
  const isDuplicateKeyError = error.message.includes('E11000');

  if (isDuplicateKeyError) {
    const match = error.message.match(regex);
    if (match) {
      const [, , propertyName] = match;
      throw new UniqueConstraintError(`${propertyName}`);
    }
  }
};

export const handleMongooseCastObjectIdError = (error: Error) => {
  const regex =
    /Cast to ObjectId failed for value "([^"]+)" \(type (string|number|Object)\) at path "_id"/;
  const isCastObjectIdError = error.message.includes('Cast to ObjectId failed');
  if (isCastObjectIdError) {
    const match = error.message.match(regex);
    if (match) {
      const [, value] = match;
      throw new InvalidPropertyError(`${value} is not a valid ObjectId.`);
    }
  }
};
