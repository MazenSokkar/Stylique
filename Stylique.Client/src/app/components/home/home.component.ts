import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  featuredProducts: Product[] = [];
  newArrivals: Product[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Get featured products
    this.subscriptions.push(
      this.productService.getFeaturedProducts().subscribe((products) => {
        this.featuredProducts = products;
      })
    );

    // Get all products for new arrivals (in a real app, this would be filtered by date)
    // For this demo, we're just showing some products
    this.subscriptions.push(
      this.productService.getProducts().subscribe((products) => {
        // Sort by id descending to simulate newest items
        this.newArrivals = [...products]
          .sort((a, b) => b.id - a.id)
          .slice(0, 4);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  calculateDiscountedPrice(price: number, discountPercentage?: number): number {
    if (!discountPercentage) return price;
    return price * (1 - discountPercentage / 100);
  }
}
