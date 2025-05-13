import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | undefined;
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  selectedImage: string = '';
  similarProducts: Product[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        const productId = +params['id'];
        this.loadProduct(productId);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadProduct(id: number): void {
    this.subscriptions.push(
      this.productService.getProductById(id).subscribe((product) => {
        if (product) {
          this.product = product;
          this.selectedImage = product.imageUrl;

          // Default selections
          if (product.sizes.length > 0) {
            this.selectedSize = product.sizes[0];
          }

          if (product.colors.length > 0) {
            this.selectedColor = product.colors[0];
          }

          // Load similar products (same category)
          this.loadSimilarProducts(product.category);
        } else {
          this.router.navigate(['/products']);
        }
      })
    );
  }

  loadSimilarProducts(category: string): void {
    this.subscriptions.push(
      this.productService.filterProducts({ category }).subscribe((products) => {
        // Exclude current product and limit to 4 similar products
        this.similarProducts = products
          .filter((p) => p.id !== this.product?.id)
          .slice(0, 4);
      })
    );
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  changeImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  addToCart(): void {
    if (this.product && this.selectedSize && this.selectedColor) {
      this.cartService.addToCart(
        this.product,
        this.quantity,
        this.selectedSize,
        this.selectedColor
      );
      // You could add a notification toast here in a real application
    }
  }

  calculateDiscountedPrice(price: number, discountPercentage?: number): number {
    if (!discountPercentage) return price;
    return price * (1 - discountPercentage / 100);
  }
}
