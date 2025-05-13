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
        // Return fallback products if API call fails
        return of([
          {
            id: 1,
            name: 'Classic White Blouse',
            description:
              'A timeless white blouse made from lightweight cotton with a relaxed fit and button-up front.',
            price: 49.99,
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'tops',
            sizes: ['XS', 'S', 'M', 'L', 'XL'],
            colors: ['White', 'Blue', 'Black'],
            inStock: true,
            featured: true,
          },
          {
            id: 2,
            name: 'Vintage Denim Jeans',
            description:
              'High-waisted vintage denim jeans with a straight leg cut and classic five-pocket styling.',
            price: 79.99,
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'bottoms',
            sizes: ['S', 'M', 'L'],
            colors: ['Blue', 'Black', 'Light Wash'],
            inStock: true,
            featured: false,
          },
          {
            id: 3,
            name: 'Summer Floral Dress',
            description:
              'Light and airy floral print dress, perfect for summer days.',
            price: 59.99,
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'dresses',
            sizes: ['XS', 'S', 'M', 'L'],
            colors: ['Pink', 'Blue', 'Yellow'],
            inStock: true,
            featured: true,
          },
          {
            id: 4,
            name: 'Leather Tote Bag',
            description:
              'Spacious leather tote bag with multiple compartments for everyday use.',
            price: 129.99,
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'accessories',
            sizes: ['One Size'],
            colors: ['Brown', 'Black', 'Navy'],
            inStock: true,
            featured: false,
          },
          {
            id: 5,
            name: 'Wool Peacoat',
            description:
              'Classic wool peacoat to keep you warm during colder months.',
            price: 149.99,
            imageUrl: 'assets/images/placeholder.jpg',
            category: 'outerwear',
            sizes: ['S', 'M', 'L', 'XL'],
            colors: ['Navy', 'Gray', 'Black'],
            inStock: true,
            featured: false,
            discountPercentage: 15,
          },
        ]);
      })
    );
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error fetching product with id ${id}`, error);
        // Try to get the product from our local cache
        return this.getProducts().pipe(
          map((products) => {
            const product = products.find((p) => p.id === id);
            if (product) {
              return product;
            }
            throw new Error('Product not found');
          })
        );
      })
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${category}`).pipe(
      catchError((error) => {
        console.error(`Error fetching products in category ${category}`, error);
        // Fall back to filtering from all products
        return this.getProducts().pipe(
          map((products) => products.filter((p) => p.category === category))
        );
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/featured`).pipe(
      catchError((error) => {
        console.error('Error fetching featured products', error);
        // Fall back to filtering from all products
        return this.getProducts().pipe(
          map((products) => products.filter((p) => p.featured))
        );
      })
    );
  }

  getCategories(): Observable<string[]> {
    // We could have a dedicated endpoint for this, but for now we'll extract them from products
    return this.getProducts().pipe(
      map((products) => {
        const uniqueCategories = [...new Set(products.map((p) => p.category))];
        return uniqueCategories.sort(); // Sort categories alphabetically
      }),
      catchError((error) => {
        console.error('Error fetching categories', error);
        // Provide default categories if API call fails
        return of(['tops', 'bottoms', 'dresses', 'accessories', 'outerwear']);
      })
    );
  }

  filterProducts(
    filter: ProductFilter = {},
    sortOption: SortOption = 'name-asc'
  ): Observable<Product[]> {
    // Client-side filtering as a fallback
    return this.getProducts().pipe(
      map((products) => {
        // Start with all products
        let filtered = [...products];

        // Apply category filter
        if (filter.category) {
          filtered = filtered.filter((p) => p.category === filter.category);
        }

        // Apply price filters
        if (filter.minPrice !== undefined) {
          filtered = filtered.filter((p) => p.price >= filter.minPrice!);
        }

        if (filter.maxPrice !== undefined) {
          filtered = filtered.filter((p) => p.price <= filter.maxPrice!);
        }

        // Apply size filter
        if (filter.sizes && filter.sizes.length > 0) {
          filtered = filtered.filter((p) =>
            filter.sizes!.some((size) => p.sizes.includes(size))
          );
        }

        // Apply color filter
        if (filter.colors && filter.colors.length > 0) {
          filtered = filtered.filter((p) =>
            filter.colors!.some((color) => p.colors.includes(color))
          );
        }

        // Apply in stock filter
        if (filter.inStock !== undefined) {
          filtered = filtered.filter((p) => p.inStock === filter.inStock);
        }

        // Apply sorting
        switch (sortOption) {
          case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            filtered.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'price-asc':
            filtered.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            filtered.sort((a, b) => b.price - a.price);
            break;
        }

        return filtered;
      }),
      catchError((error) => {
        console.error('Error filtering products', error);
        return throwError(
          () => new Error('Failed to filter products. Please try again later.')
        );
      })
    );
  }

  getRecommendedProducts(product: Product): Observable<Product[]> {
    // Get related products by category
    return this.getProductsByCategory(product.category).pipe(
      map((products) =>
        products.filter((p) => p.id !== product.id).slice(0, 4)
      ),
      catchError(() => {
        // If category filtering fails, return random products
        return this.getProducts().pipe(
          map((products) => {
            return products
              .filter((p) => p.id !== product.id)
              .sort(() => 0.5 - Math.random())
              .slice(0, 4);
          })
        );
      })
    );
  }
}
