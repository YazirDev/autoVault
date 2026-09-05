export type ExpenseCategory = 'FUEL' | 'MAINTENANCE' | 'INSURANCE' | 'TAX' | 'REPAIR' | 'PARKING' | 'TOLL' | 'OTHER';
export interface Expense {
    id: string;
    vehicleId: string;
    userId: string;
    category: ExpenseCategory;
    amount: number;
    description?: string;
    date: Date;
    km?: number;
    receiptUrl?: string;
    createdAt: Date;
}
//# sourceMappingURL=expense.types.d.ts.map