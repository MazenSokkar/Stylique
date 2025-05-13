// filepath: w:\.NET\projects\Stylique\Stylique.Client\src\app\services\cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/api/cart`;
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });

  constructor(private http: HttpClient) {
    // Initialize the cart on service start
    this.getCartFromApi().subscribe();
  }

  getCart(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  private getCartFromApi(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => {
        this.updateCartTotals(cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('Error fetching cart', error);
        return throwError(() => new Error('Failed to fetch cart. Please try again later.'));
      })
    );
  }

  private updateCartTotals(cart: Cart): void {
    // Calculate total items and price
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => {
      const price = item.product.discountPercentage
        ? item.product.price * (1 - item.product.discountPercentage / 100)
        : item.product.price;
      return total + price * item.quantity;
    }, 0);
  }

  addToCart(
    product: Product,
    quantity: number = 1,
    selectedSize: string,
    selectedColor: string
  ): Observable<Cart> {
    const request = {
      productId: product.id,
      quantity,
      selectedSize,
      selectedColor
    };

    return this.http.post<Cart>(`${this.apiUrl}/items`, request).pipe(
      tap(cart => {
        this.updateCartTotals(cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('Error adding item to cart', error);
        return throwError(() => new Error('Failed to add item to cart. Please try again later.'));
      })
    );
  }

  updateCartItem(
    cartItemId: number,
    quantity: number
  ): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/items/${cartItemId}`, { quantity }).pipe(
      tap(cart => {
        this.updateCartTotals(cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('Error updating cart item', error);
        return throwError(() => new Error('Failed to update cart item. Please try again later.'));
      })
    );
  }

  removeFromCart(cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/items/${cartItemId}`).pipe(
      tap(cart => {
        this.updateCartTotals(cart);
        this.cartSubject.next(cart);
      }),
      catchError(error => {
        console.error('Error removing item from cart', error);
        return throwError(() => new Error('Failed to remove item from cart. Please try again later.'));
      })
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => {
        const emptyCart: Cart = {
          items: [],
          totalItems: 0,
          totalPrice: 0,
        };
        this.cartSubject.next(emptyCart);
      }),
      catchError(error => {
        console.error('Error clearing cart', error);
        return throwError(() => new Error('Failed to clear cart. Please try again later.'));
      })
    );
  }
}
