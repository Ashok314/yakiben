
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const MOCK_USERS: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'staff' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'driver' },
];
