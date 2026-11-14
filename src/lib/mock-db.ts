export type UserRole = "Admin" | "User";
export type AccountStatus = "Active" | "Suspended";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
  balance: number;
  account_id: string;
};

export type Transaction = {
  id: string;
  user_id: string;
  reference: string;
  type: "Credit" | "Debit" | "Adjustment";
  amount: number;
  description: string;
  transaction_date: string;
  created_at: string;
};

export type Book = {
  id: string;
  profile_id: string;
  title: string;
  author: string;
  status: "Published" | "Draft" | "Active";
  royalty_rate: number;
  current_balance: number;
};

const initialProfiles: Profile[] = [
  {
    id: "admin-1",
    first_name: "Alicia",
    last_name: "Stone",
    email: "admin@kdplus.demo",
    phone: "",
    address: "",
    role: "Admin",
    status: "Active",
    created_at: "2024-01-05T09:00:00.000Z",
    balance: 125000,
    account_id: "ACC-ADM-001",
  },
  {
    id: "user-1",
    first_name: "Marcus",
    last_name: "Bell",
    email: "marcus.bell@kdplus.demo",
    phone: "",
    address: "",
    role: "User",
    status: "Active",
    created_at: "2024-02-14T11:20:00.000Z",
    balance: 2840.5,
    account_id: "ACC-USR-101",
  },
  {
    id: "user-2",
    first_name: "Sofia",
    last_name: "Nguyen",
    email: "sofia.nguyen@kdplus.demo",
    phone: "",
    address: "",
    role: "User",
    status: "Suspended",
    created_at: "2024-03-18T15:35:00.000Z",
    balance: 580,
    account_id: "ACC-USR-102",
  },
];

const initialTransactions: Transaction[] = [
  {
    id: "txn-01",
    user_id: "user-1",
    reference: "ROYALTY-4401",
    type: "Credit",
    amount: 1250.75,
    description: "Monthly royalty payout",
    transaction_date: "2024-10-02",
    created_at: "2024-10-02T08:30:00.000Z",
  },
  {
    id: "txn-02",
    user_id: "user-1",
    reference: "ADVANCE-2201",
    type: "Credit",
    amount: 450,
    description: "Advance against royalties",
    transaction_date: "2024-10-12",
    created_at: "2024-10-12T14:10:00.000Z",
  },
  {
    id: "txn-03",
    user_id: "user-1",
    reference: "ADJUST-1104",
    type: "Adjustment",
    amount: -60.25,
    description: "Platform fee adjustment",
    transaction_date: "2024-10-20",
    created_at: "2024-10-20T09:45:00.000Z",
  },
  {
    id: "txn-04",
    user_id: "user-1",
    reference: "PAYOUT-7740",
    type: "Debit",
    amount: 1200,
    description: "Transfer to bank account",
    transaction_date: "2024-11-01",
    created_at: "2024-11-01T10:55:00.000Z",
  },
];

const initialBooks: Book[] = [
  {
    id: "book-1",
    profile_id: "user-1",
    title: "The Quiet Atlas",
    author: "Marcus Bell",
    status: "Published",
    royalty_rate: 0.7,
    current_balance: 1640.5,
  },
  {
    id: "book-2",
    profile_id: "user-1",
    title: "Northbound Stories",
    author: "Marcus Bell",
    status: "Active",
    royalty_rate: 0.72,
    current_balance: 980.25,
  },
  {
    id: "book-3",
    profile_id: "user-1",
    title: "City in Layers",
    author: "Marcus Bell",
    status: "Draft",
    royalty_rate: 0.68,
    current_balance: 0,
  },
];

let profiles: Profile[] = [...initialProfiles];
let transactions: Transaction[] = [...initialTransactions];
let books: Book[] = [...initialBooks];

export function getProfiles(): Profile[] {
  return profiles;
}

export function getProfileByEmail(email: string): Profile | undefined {
  return profiles.find((profile) => profile.email.toLowerCase() === email.toLowerCase());
}

export function getTransactionsByUser(userId: string): Transaction[] {
  return transactions
    .filter((transaction) => transaction.user_id === userId)
    .sort((left, right) => right.transaction_date.localeCompare(left.transaction_date));
}

export function getAllTransactions(): Transaction[] {
  return [...transactions].sort((left, right) => right.transaction_date.localeCompare(left.transaction_date));
}

export function getBooksByUser(userId: string): Book[] {
  return books.filter((book) => book.profile_id === userId);
}

export function getAllBooks(): Book[] {
  return books;
}

export function getBooksByAuthor(authorName: string): Book[] {
  return books.filter((book) => book.author.toLowerCase() === authorName.toLowerCase());
}

export function createProfile(data: {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  status: AccountStatus;
  created_at: string;
  balance?: number;
  account_id?: string;
}): Profile {
  const profile: Profile = {
    id: `profile-${Date.now()}`,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    role: data.role,
    status: data.status,
    created_at: data.created_at,
    balance: data.balance ?? 0,
    account_id: data.account_id ?? `ACC-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };

  profiles = [...profiles, profile];
  return profile;
}

export function createBook(data: {
  profile_id: string;
  title: string;
  author: string;
  status: Book["status"];
  royalty_rate: number;
  current_balance: number;
}): Book {
  const book: Book = {
    id: `book-${Date.now()}`,
    ...data,
  };

  books = [...books, book];
  return book;
}

export function createTransaction(data: {
  user_id: string;
  reference: string;
  type: Transaction["type"];
  amount: number;
  description: string;
  transaction_date: string;
  created_at: string;
}): Transaction {
  const transaction: Transaction = {
    id: `txn-${Date.now()}`,
    ...data,
  };

  transactions = [...transactions, transaction];
  profiles = profiles.map((profile) =>
    profile.id === data.user_id ? { ...profile, balance: profile.balance + data.amount } : profile,
  );
  return transaction;
}

export function resetMockData(): void {
  profiles = [...initialProfiles];
  transactions = [...initialTransactions];
  books = [...initialBooks];
}
