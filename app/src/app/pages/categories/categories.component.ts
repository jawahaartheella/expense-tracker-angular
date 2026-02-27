import { Component, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';

import { of, switchMap } from 'rxjs';

import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.model';
import { ConfirmService } from '../../core/services/confirm.service';
import { SaveCategoryComponent } from '../../components/save-category/save-category.component';

@Component({
  selector: 'app-categories',
  imports: [NgStyle, SaveCategoryComponent],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  @ViewChild('addOrEditCategory') addOrEditCategory!: SaveCategoryComponent
  categories: Array<Category> = [];

  constructor(private categoryService: CategoriesService,
    private confirmService: ConfirmService
  ) {}

  ngOnInit() {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
      }
    })
  }

  updateCategoryList(event: any) {
    let category  = event;
    const index = this.categories.findIndex(c => c.id == category.id);
    this.categories = index !== -1 ? this.categories.map(c => c.id == category.id ? category : c) : [...this.categories, category];
  }

  openCategoryCanvas(isEdit: boolean, category?: Category) {
    if(isEdit && category) {
      this.addOrEditCategory.openEditCanvas(category);
    } else {
      this.addOrEditCategory.openAddCanvas();
    }
  }

  deleteCategory(category: Category) {
    this.confirmService.open(
      `Delete "${category.name}" category`,
      'Are you sure you want to delete this category.',
      'Delete',
      'btn-danger',
      'Cancel'
    ).pipe(
      switchMap(confirmed => {
        return confirmed ? this.categoryService.deleteCategory(category.id) : of(null);
      })
    ).subscribe({
      next: (res) => {
        if(res) {
          this.confirmService.currentModal.hide();
          this.categories = this.categories.filter(c => c.id !== category.id);
        }
      }
    });
  }
}
