export type membershipStatus = (
  character: string,
  guild: string,
) => Promise<'Member' | 'Not member'>;
