import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends ApiService {

  constructor(http: HttpClient) { 
    super(http)
  }

  getCategories(): Observable<Category[]> {
    return this.get<Category[]>(`/categories`);
  }

  addCategory(catergory: Category): Observable<Category> {
    return this.post(`/categories`, catergory);
  }

  editCategory(categoryId: number, category: Category): Observable<Category> {
    return this.put(`/categories/${categoryId}`, category);
  }

  deleteCategory(categoryId: number): Observable<Category> {
    return this.delete(`/categories/${categoryId}`);
  }
}
