import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductFilter, SortOption } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];

  // Filter state
  filter: ProductFilter = {};
  sortOption: SortOption = 'name-asc';

  // Available filter options
  availableSizes: string[] = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    '24',
    '25',
    '26',
    '27',
    '28',
    'One Size',
  ];
  availableColors: string[] = [
    'Black',
    'White',
    'Blue',
    'Red',
    'Pink',
    'Gray',
    'Brown',
    'Navy',
    'Cream',
    'Beige',
  ];

  // Price range
  minPrice: number = 0;
  maxPrice: number = 200;

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get all categories
    this.subscriptions.push(
      this.productService.getCategories().subscribe((categories) => {
        this.categories = categories;
      })
    );

    // Listen for route params to handle category filtering
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const category = params['category'];
        if (category) {
          this.filter.category = category;
        } else {
          this.filter.category = undefined;
        }
        this.applyFilters();
      })
    );

    // Initialize with all products
    this.subscriptions.push(
      this.productService.getProducts().subscribe((products) => {
        this.products = products;
        this.applyFilters();
      })
    );
  }

  ngOnDestroy(): void {
    // Clean up subscriptions to prevent memory leaks
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  applyFilters(): void {
    // Apply price filters if set
    if (this.minPrice > 0) {
      this.filter.minPrice = this.minPrice;
    } else {
      delete this.filter.minPrice;
    }

    if (this.maxPrice < 200) {
      this.filter.maxPrice = this.maxPrice;
    } else {
      delete this.filter.maxPrice;
    }

    console.log(
      'Applying filters:',
      this.filter,
      'with sort option:',
      this.sortOption
    );

    this.productService
      .filterProducts(this.filter, this.sortOption)
      .subscribe((filtered) => {
        this.filteredProducts = filtered;
        console.log('Filtered products count:', this.filteredProducts.length);
      });
  }
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortOption = select.value as SortOption;
    console.log('Sort option changed to:', this.sortOption);
    this.applyFilters();
  }
  onCategoryChange(category: string | undefined): void {
    this.filter.category = category;

    // Update the URL to reflect the selected category
    if (category) {
      this.router.navigate(['/products', category]);
    } else {
      this.router.navigate(['/products']);
    }

    console.log('Category changed to:', category);
    this.applyFilters();
  }
  onSizeChange(size: string): void {
    if (!this.filter.sizes) {
      this.filter.sizes = [];
    }

    const index = this.filter.sizes.indexOf(size);
    if (index === -1) {
      // Add size to filter
      this.filter.sizes.push(size);
    } else {
      // Remove size from filter
      this.filter.sizes.splice(index, 1);
    }

    // If no sizes selected, remove the filter altogether
    if (this.filter.sizes.length === 0) {
      delete this.filter.sizes;
    }

    console.log('Size filter updated:', this.filter.sizes);
    this.applyFilters();
  }

  onColorChange(color: string): void {
    if (!this.filter.colors) {
      this.filter.colors = [];
    }

    const index = this.filter.colors.indexOf(color);
    if (index === -1) {
      // Add color to filter
      this.filter.colors.push(color);
    } else {
      // Remove color from filter
      this.filter.colors.splice(index, 1);
    }

    // If no colors selected, remove the filter altogether
    if (this.filter.colors.length === 0) {
      delete this.filter.colors;
    }

    console.log('Color filter updated:', this.filter.colors);
    this.applyFilters();
  }

  onPriceRangeChange(): void {
    this.applyFilters();
  }
  resetFilters(): void {
    this.filter = {};
    this.sortOption = 'name-asc';
    this.minPrice = 0;
    this.maxPrice = 200;
    this.router.navigate(['/products']);

    // If we have products loaded, apply filters directly, otherwise fetch products
    if (this.products.length > 0) {
      this.applyFilters();
    } else {
      this.productService.getProducts().subscribe((products) => {
        this.products = products;
        this.filteredProducts = [...products];
      });
    }
  }
  isSizeSelected(size: string): boolean {
    return !!this.filter.sizes?.includes(size);
  }

  isColorSelected(color: string): boolean {
    return !!this.filter.colors?.includes(color);
  }
}
