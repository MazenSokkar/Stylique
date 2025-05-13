using Stylique.Core.Entities;
using Stylique.Core.Interfaces;
using System.Threading.Tasks;

namespace Stylique.Infrastructure.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;

        public CartService(ICartRepository cartRepository, IProductRepository productRepository)
        {
            _cartRepository = cartRepository;
            _productRepository = productRepository;
        }

        public async Task<Cart> GetUserCartAsync(string userId)
        {
            return await _cartRepository.GetCartByUserIdAsync(userId);
        }

        public async Task<Cart> AddToCartAsync(string userId, int productId, int quantity, string selectedSize, string selectedColor)
        {
            // Validate product exists
            var product = await _productRepository.GetProductByIdAsync(productId);
            if (product == null)
            {
                throw new System.Exception("Product not found");
            }

            // Validate size and color are available for this product
            if (!product.Sizes.Contains(selectedSize))
            {
                throw new System.Exception($"Size {selectedSize} is not available for this product");
            }

            if (!product.Colors.Contains(selectedColor))
            {
                throw new System.Exception($"Color {selectedColor} is not available for this product");
            }

            // Create cart item
            var cartItem = new CartItem
            {
                ProductId = productId,
                Product = product,
                Quantity = quantity,
                SelectedSize = selectedSize,
                SelectedColor = selectedColor
            };

            return await _cartRepository.AddItemToCartAsync(userId, cartItem);
        }

        public async Task<Cart> UpdateCartItemAsync(string userId, int cartItemId, int quantity)
        {
            return await _cartRepository.UpdateCartItemAsync(userId, cartItemId, quantity);
        }

        public async Task<Cart> RemoveFromCartAsync(string userId, int cartItemId)
        {
            return await _cartRepository.RemoveItemFromCartAsync(userId, cartItemId);
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            return await _cartRepository.ClearCartAsync(userId);
        }
    }
}
