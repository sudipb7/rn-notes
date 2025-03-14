export interface Note {
  $id: string;
  title: string;
  content: string;
  userId: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface User {
  $id: string;
  email: string;
  name: string;
  $createdAt: string;
  $updatedAt: string;
}
