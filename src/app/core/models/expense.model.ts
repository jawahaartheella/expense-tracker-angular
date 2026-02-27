export interface Expense {
    id: number,
    title: string,
    date: string,  //ISO date
    category: string,
    amount: number,
    notes?: string,
    isBookmarked:  boolean
}