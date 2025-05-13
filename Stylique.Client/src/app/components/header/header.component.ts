import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  cart$: Observable<Cart>;
  categories: string[] = [];
  isMenuOpen = false;

  constructor(
    private cartService: CartService,
    private productService: ProductService
  ) {
    this.cart$ = this.cartService.getCart();
  }

  ngOnInit(): void {
    this.productService.getCategories().subscribe((categories) => {
      this.categories = categories;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
