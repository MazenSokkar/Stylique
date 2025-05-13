import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  };

  private cartSubject = new BehaviorSubject<Cart>(this.cart);

  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCartFromStorage();
  }

  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  addToCart(
    product: Product,
    quantity: number = 1,
    selectedSize: string,
    selectedColor: string
  ): void {
    // Check if the item is already in the cart with the same options
    const existingItemIndex = this.cart.items.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );

    if (existingItemIndex !== -1) {
      // Update quantity if item already exists
      this.cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        product,
        quantity,
        selectedSize,
        selectedColor,
      };
      this.cart.items.push(newItem);
    }

    // Update cart totals
    this.updateCartTotals();

    // Save to localStorage
    this.saveCartToStorage();
  }

  removeFromCart(index: number): void {
    if (index >= 0 && index < this.cart.items.length) {
      this.cart.items.splice(index, 1);
      this.updateCartTotals();
      this.saveCartToStorage();
    }
  }

  updateQuantity(index: number, quantity: number): void {
    if (index >= 0 && index < this.cart.items.length && quantity > 0) {
      this.cart.items[index].quantity = quantity;
      this.updateCartTotals();
      this.saveCartToStorage();
    }
  }

  clearCart(): void {
    this.cart.items = [];
    this.updateCartTotals();
    this.saveCartToStorage();
  }

  private updateCartTotals(): void {
    let totalItems = 0;
    let totalPrice = 0;

    this.cart.items.forEach((item) => {
      totalItems += item.quantity;

      const itemPrice = item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;

      totalPrice += itemPrice * item.quantity;
    });

    this.cart.totalItems = totalItems;
    this.cart.totalPrice = totalPrice;

    // Update subscribers
    this.cartSubject.next({ ...this.cart });
  }

  // Persist cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');

    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
        this.updateCartTotals();
      } catch (e) {
        // If there's an error parsing the saved cart, clear it
        localStorage.removeItem('cart');
      }
    }
  }
}
