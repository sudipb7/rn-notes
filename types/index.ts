export interface Note {
  $id: string;
  text: string;
  userId: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface User {
  $id: string;
  email: string;
  $createdAt: string;
  $updatedAt: string;
}
