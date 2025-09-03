export class ExpenseResponseDto {
  id: number;
  userId: number;
  categoryId: number;
  amount: number;
  currency: string;
  note: string | null;
  spentAt: Date;
  createdAt: Date;
  user?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}