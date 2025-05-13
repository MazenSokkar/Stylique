import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product, ProductFilter, SortOption } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // Mock product data for the fashion boutique
  private products: Product[] = [
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
      sizes: ['24', '25', '26', '27', '28'],
      colors: ['Blue', 'Black'],
      inStock: true,
    },
    {
      id: 3,
      name: 'Floral Summer Dress',
      description:
        'A beautiful floral print dress perfect for summer days, featuring a flattering A-line silhouette.',
      price: 89.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'dresses',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Pink', 'Blue'],
      inStock: true,
      discountPercentage: 15,
    },
    {
      id: 4,
      name: 'Leather Crossbody Bag',
      description:
        'A stylish leather crossbody bag with adjustable strap and multiple compartments.',
      price: 129.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'accessories',
      sizes: ['One Size'],
      colors: ['Brown', 'Black', 'Cream'],
      inStock: true,
    },
    {
      id: 5,
      name: 'Wool Blend Coat',
      description:
        'A sophisticated wool blend coat with a tailored fit, perfect for colder months.',
      price: 199.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'outerwear',
      sizes: ['S', 'M', 'L', 'XL'],
      colors: ['Navy', 'Beige', 'Gray'],
      inStock: true,
      featured: true,
    },
    {
      id: 6,
      name: 'Suede Ankle Boots',
      description:
        'Classic suede ankle boots with a comfortable block heel and side zipper closure.',
      price: 149.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'shoes',
      sizes: ['36', '37', '38', '39', '40'],
      colors: ['Brown', 'Black'],
      inStock: true,
    },
    {
      id: 7,
      name: 'Silk Camisole Top',
      description:
        'A luxurious silk camisole top with adjustable straps and a flowing silhouette.',
      price: 69.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'tops',
      sizes: ['XS', 'S', 'M', 'L'],
      colors: ['Cream', 'Black', 'Red'],
      inStock: true,
    },
    {
      id: 8,
      name: 'High-Waisted Linen Shorts',
      description:
        'Comfortable high-waisted linen shorts perfect for warm weather, featuring a paper bag waist.',
      price: 59.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'bottoms',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Beige', 'White', 'Navy'],
      inStock: true,
      discountPercentage: 10,
    },
    {
      id: 9,
      name: 'Wrap Midi Dress',
      description:
        'An elegant wrap midi dress with a flattering V-neck and tie waist.',
      price: 119.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'dresses',
      sizes: ['S', 'M', 'L'],
      colors: ['Green', 'Black', 'Pink'],
      inStock: true,
      featured: true,
    },
    {
      id: 10,
      name: 'Statement Hoop Earrings',
      description:
        'Bold gold-toned statement hoop earrings to elevate any outfit.',
      price: 39.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'accessories',
      sizes: ['One Size'],
      colors: ['Gold', 'Silver'],
      inStock: true,
    },
    {
      id: 11,
      name: 'Denim Jacket',
      description:
        'A classic denim jacket with button-up front and chest pockets.',
      price: 89.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'outerwear',
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      colors: ['Blue', 'Black', 'White'],
      inStock: true,
    },
    {
      id: 12,
      name: 'Canvas Sneakers',
      description:
        'Casual canvas sneakers with rubber sole, perfect for everyday wear.',
      price: 59.99,
      imageUrl: 'assets/images/placeholder.jpg',
      category: 'shoes',
      sizes: ['36', '37', '38', '39', '40', '41', '42'],
      colors: ['White', 'Black', 'Red', 'Blue'],
      inStock: true,
      discountPercentage: 20,
    },
  ];

  constructor() {}

  // Get all products
  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  // Get product by ID
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find((p) => p.id === id);
    return of(product);
  }

  // Get featured products
  getFeaturedProducts(): Observable<Product[]> {
    const featuredProducts = this.products.filter((p) => p.featured);
    return of(featuredProducts);
  }

  // Get all unique categories
  getCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map((p) => p.category))];
    return of(categories);
  }

  // Filter products based on criteria
  filterProducts(
    filter: ProductFilter = {},
    sortOption: SortOption = 'name-asc'
  ): Observable<Product[]> {
    let filteredProducts = [...this.products];

    // Apply category filter
    if (filter.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filter.category
      );
    }

    // Apply price range filter
    if (filter.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => {
        const actualPrice = p.discountPercentage
          ? p.price * (1 - p.discountPercentage / 100)
          : p.price;
        return actualPrice >= filter.minPrice!;
      });
    }

    if (filter.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter((p) => {
        const actualPrice = p.discountPercentage
          ? p.price * (1 - p.discountPercentage / 100)
          : p.price;
        return actualPrice <= filter.maxPrice!;
      });
    }

    // Apply sizes filter
    if (filter.sizes && filter.sizes.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
        filter.sizes!.some((size) => p.sizes.includes(size))
      );
    }

    // Apply colors filter
    if (filter.colors && filter.colors.length > 0) {
      filteredProducts = filteredProducts.filter((p) =>
        filter.colors!.some((color) => p.colors.includes(color))
      );
    }

    // Apply stock filter
    if (filter.inStock !== undefined) {
      filteredProducts = filteredProducts.filter(
        (p) => p.inStock === filter.inStock
      );
    }

    // Sort the products
    filteredProducts.sort((a, b) => {
      const priceA = a.discountPercentage
        ? a.price * (1 - a.discountPercentage / 100)
        : a.price;
      const priceB = b.discountPercentage
        ? b.price * (1 - b.discountPercentage / 100)
        : b.price;

      switch (sortOption) {
        case 'price-asc':
          return priceA - priceB;
        case 'price-desc':
          return priceB - priceA;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return of(filteredProducts);
  }

  // Get products by category
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.filterProducts({ category });
  }

  // Get recommended products based on a product
  getRecommendedProducts(product: Product): Observable<Product[]> {
    // First try to get products in the same category
    const sameCategory = this.products.filter(
      (p) => p.category === product.category && p.id !== product.id
    );

    // If we have enough in the same category, return those
    if (sameCategory.length >= 4) {
      return of(sameCategory.slice(0, 4));
    }

    // Otherwise, add some featured products
    const featured = this.products.filter(
      (p) =>
        p.featured && p.id !== product.id && p.category !== product.category
    );

    const recommended = [...sameCategory, ...featured].slice(0, 4);
    return of(recommended);
  }
}
