import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/models/category.model';

declare var bootstrap: any;

@Component({
  selector: 'app-save-category',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './save-category.component.html',
  styleUrl: './save-category.component.css'
})
export class SaveCategoryComponent {
  @Output() updatedCategory = new EventEmitter<Category>();
  private offcanvas: any;
  categoryForm!: FormGroup;
  categoryId!: number;
  isRequestInProgress: boolean = false;
  isEditMode: boolean = false;
  
  constructor(private categoryService: CategoriesService
  ) {}
  
  ngOnInit() {
    this.buildCategoryForm();
  }

  getCurrentDate(): string {
    let date = new Date();
    return date.toLocaleDateString().replace(/\//g, '-');
  }

  buildCategoryForm() {
    this.categoryForm  = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('',  [Validators.required]),
      colorCode: new FormControl('#ffc107', [Validators.required]),
      createdOn: new FormControl('', [Validators.required]),
      modifiedOn: new FormControl('')
    });
  }

  openAddCanvas() {
    this.isEditMode = false;
    this.categoryForm.reset({colorCode: '#ffc107'});
    this.openCanvas();
  }

  openEditCanvas(categoryDetails: Category) {
    this.isEditMode = true;
    this.categoryId = categoryDetails.id;
    this.categoryForm.patchValue(categoryDetails);
    this.openCanvas();
  }

  openCanvas() {
    const el = document.getElementById('offcanvasRight');
    this.offcanvas = new bootstrap.Offcanvas(el);
    this.offcanvas.show();
  }

  closeCanvas() {
    this.offcanvas?.hide();
    this.categoryForm.reset();
  }
  
  addCategory() {
    this.isRequestInProgress = true;
    this.categoryForm.get('createdOn')?.setValue(this.getCurrentDate());
    this.categoryForm.get('modifiedOn')?.setValue(this.getCurrentDate());
    const newCategory = this.categoryForm.value;
    this.categoryService.addCategory(newCategory).subscribe({
      next: (res) => {
        window.alert("Category Added Successfully!!");
        this.updatedCategory.emit(res);
        this.closeCanvas();
        this.isRequestInProgress = false;
      }
    });
  }
  
  editCategory() {
    this.isRequestInProgress = true;
    this.categoryForm.get('modifiedOn')?.setValue(this.getCurrentDate());
    let category = this.categoryForm.value;
    this.categoryService.editCategory(this.categoryId, category).subscribe({
      next: (res) => {
        window.alert("Category Updated Successfully!!");
        this.updatedCategory.emit(res);
        this.closeCanvas();
        this.isRequestInProgress = false;
      }
    });
  }
}
