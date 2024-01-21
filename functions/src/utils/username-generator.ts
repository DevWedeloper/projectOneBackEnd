import { generateUsername as uniqueUsernameGenerator } from 'unique-username-generator';

export const generateUsername = (): string => {
  const separator = Math.random() < 0.5 ? '' : '_';
  const randomDigits = Math.floor(Math.random() * 5);
  const maxLength = Math.floor(Math.random() * 15) + 6;

  return uniqueUsernameGenerator(separator, randomDigits, maxLength);
};
