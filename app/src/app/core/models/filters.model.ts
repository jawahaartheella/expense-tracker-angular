export interface Filters {
    dateRange?: Date,
    category?: number,
    minAmount?: number,
    maxAmount?: number,
    sortBy?: 'title' | 'date' | 'category' | 'amount'
}