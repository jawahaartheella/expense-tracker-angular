import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TooltipDirective } from '../../core/directives/tooltip/tooltip.directive';
import { Filters } from '../../core/models/filters.model';
import { Category } from '../../core/models/category.model';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-filters',
  imports: [TooltipDirective, FormsModule, ReactiveFormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  @Input() categories!: Array<Category>;
  @Output() filtersChange = new EventEmitter<Filters>();

  filtersForm!: FormGroup;
  filters: Filters = {};

  ngOnInit() {
    this.buildFilterForm();
  }

  buildFilterForm() {
    this.filtersForm = new FormGroup({
      dateRange: new FormControl('default'),
      category: new FormControl(0),
      minAmount: new FormControl(),
      maxAmount: new FormControl(),
      sortBy: new FormControl('default')
    })
  }

  onDateRangeChange(event: any) {
    const selectedDateRange = event.target.value;
    this.filtersForm.get('dateRange')?.setValue(selectedDateRange);
    this.filters.dateRange = this.getstartDate(selectedDateRange);
    this.emitFilters();
  }

  getstartDate(range: 'default' | '6M' | '3M' | '1M' | '10D' | '1W'): Date {
    const currentDate = new Date();
    switch(range) {
      case '6M':
        return new Date(currentDate.setMonth(currentDate.getMonth() - 6));
      case '3M':
        return new Date(currentDate.setMonth(currentDate.getMonth() - 3));
      case '1M':
        return new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      case '10D':
        return new Date(currentDate.setDate(currentDate.getDate() - 10));
      case '1W':
        return new Date(currentDate.setDate(currentDate.getDate() - 7));
      default:
        return new Date(0);
    }
  }

  onCategoryChange(event: any) {
    this.filtersForm.get('category')?.setValue(event.target.value);
    this.emitFilters();
  }

  onMinAmountChange(min?: string, max?: string) {
    this.filtersForm.get('minAmount')?.setValue(min ? +min : undefined);
    this.filtersForm.get('maxAmount')?.setValue(max ? +max : undefined);
    this.emitFilters();
  }

  onSortOptionChange(event: any) {
    this.filtersForm.get('sortBy')?.setValue(event.target.value);
    this.emitFilters();
  }

  clearFilters() {
    this.filtersForm.reset({
      dateRange: 'default',
      category: 0,
      minAmount: null,
      maxAmount: null,
      sortBy: 'default'
    });
    this.filters = {};
    this.filtersChange.emit({...this.filters});
  }

  private emitFilters() {
    this.filters.category = this.filtersForm.get('category')?.value;
    this.filters.minAmount = this.filtersForm.get('minAmount')?.value;
    this.filters.maxAmount = this.filtersForm.get('maxAmount')?.value;
    this.filters.sortBy = this.filtersForm.get('sortBy')?.value;
    this.filtersChange.emit({...this.filters});
  }
}
