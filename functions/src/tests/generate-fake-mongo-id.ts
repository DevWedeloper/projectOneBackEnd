export const generateFakeObjectId = () => {
  const objectId = [];
  const characters = 'abcdef0123456789';
  
  for (let i = 0; i < 24; i++) {
    objectId.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  
  return objectId.join('');
};
