// filepath: w:\.NET\projects\Stylique\Stylique.Client\src\app\services\product.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Product, ProductFilter, SortOption } from '../models/product.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/api/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching products', error);
        return throwError(
          () => new Error('Failed to fetch products. Please try again later.')
        );
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching product with id ${id}`, error);
        return throwError(
          () =>
            new Error(
              'Failed to fetch product details. Please try again later.'
            )
        );
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      catchError((error) => {
        console.error(`Error fetching products in category ${category}`, error);
        return throwError(
          () =>
            new Error(
              'Failed to fetch category products. Please try again later.'
            )
        );
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`).pipe(
      catchError((error) => {
        console.error('Error fetching featured products', error);
        return throwError(
          () =>
            new Error(
              'Failed to fetch featured products. Please try again later.'
            )
        );
      })
    );
  }

  getCategories(): Observable<string[]> {
    // We could have a dedicated endpoint for this, but for now we'll extract them from products
    return this.getProducts().pipe(
      map((products) => {
        const categories = [...new Set(products.map((p) => p.category))];
        return categories;
      }),
      catchError((error) => {
        console.error('Error fetching categories', error);
        return throwError(
          () => new Error('Failed to fetch categories. Please try again later.')
        );
      })
    );
  }

  filterProducts(
    filter: ProductFilter = {},
    sortOption: SortOption = 'name-asc'
  ): Observable<Product[]> {
    let params = new HttpParams();

    if (filter.category) {
      params = params.set('category', filter.category);
    }

    if (filter.minPrice !== undefined) {
      params = params.set('minPrice', filter.minPrice.toString());
    }

    if (filter.maxPrice !== undefined) {
      params = params.set('maxPrice', filter.maxPrice.toString());
    }

    if (filter.sizes && filter.sizes.length > 0) {
      filter.sizes.forEach((size) => {
        params = params.append('sizes', size);
      });
    }

    if (filter.colors && filter.colors.length > 0) {
      filter.colors.forEach((color) => {
        params = params.append('colors', color);
      });
    }

    if (filter.inStock !== undefined) {
      params = params.set('inStock', filter.inStock.toString());
    }

    return this.http.get<Product[]>(`${this.apiUrl}/filter`, { params }).pipe(
      catchError((error) => {
        console.error('Error filtering products', error);
        return throwError(
          () => new Error('Failed to filter products. Please try again later.')
        );
      })
    );
  }

  getRecommendedProducts(product: Product): Observable<Product[]> {
    // For now, we'll get related products by category
    return this.getProductsByCategory(product.category).pipe(
      map((products) => products.filter((p) => p.id !== product.id).slice(0, 4))
    );
  }
}
