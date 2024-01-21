export type isCharacterNameUnique = (
  name: string,
) => Promise<'Character name is not unique' | 'Character name is unique'>;

export type isGuildNameUnique = (
  name: string,
) => Promise<'Guild name is not unique' | 'Guild name is unique'>;
