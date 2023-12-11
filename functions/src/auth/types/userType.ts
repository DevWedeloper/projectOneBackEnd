export type IUser = {
  _id: string;
  username: string;
  password: string;
  role: 'admin' | 'standard';
};

export type IUserWithoutId = Omit<IUser, '_id'>;