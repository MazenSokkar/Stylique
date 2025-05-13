using Microsoft.EntityFrameworkCore;
using Stylique.Core.Entities;
using Stylique.Core.Interfaces;
using Stylique.Infrastructure.Data;
using System.Threading.Tasks;

namespace Stylique.Infrastructure.Services
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _context;
        private readonly IProductRepository _productRepository;

        public CartRepository(ApplicationDbContext context, IProductRepository productRepository)
        {
            _context = context;
            _productRepository = productRepository;
        }

        public async Task<Cart> GetCartByUserIdAsync(string userId)
        {
            var cart = await _context.Carts
                .Include(c => c.Items)
                .ThenInclude(i => i.Product)
                .FirstOrDefaultAsync(c => c.UserId == userId);

            return cart ?? await CreateCartAsync(userId);
        }

        public async Task<Cart> CreateCartAsync(string userId)
        {
            var cart = new Cart
            {
                UserId = userId
            };

            _context.Carts.Add(cart);
            await _context.SaveChangesAsync();
            return cart;
        }

        public async Task<Cart> AddItemToCartAsync(string userId, CartItem item)
        {
            var cart = await GetCartByUserIdAsync(userId);

            // Check if item already exists with the same product, size, and color
            var existingItem = cart.Items.FirstOrDefault(i =>
                i.ProductId == item.ProductId &&
                i.SelectedSize == item.SelectedSize &&
                i.SelectedColor == item.SelectedColor);

            if (existingItem != null)
            {
                // Update quantity of existing item
                existingItem.Quantity += item.Quantity;
            }
            else
            {
                // Add new item to cart
                item.CartId = cart.Id;
                cart.Items.Add(item);
            }

            cart.LastUpdated = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return cart;
        }

        public async Task<Cart> UpdateCartItemAsync(string userId, int cartItemId, int quantity)
        {
            var cart = await GetCartByUserIdAsync(userId);
            var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);

            if (item == null)
            {
                return cart;
            }

            if (quantity <= 0)
            {
                return await RemoveItemFromCartAsync(userId, cartItemId);
            }

            item.Quantity = quantity;
            cart.LastUpdated = System.DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return cart;
        }

        public async Task<Cart> RemoveItemFromCartAsync(string userId, int cartItemId)
        {
            var cart = await GetCartByUserIdAsync(userId);
            var item = cart.Items.FirstOrDefault(i => i.Id == cartItemId);

            if (item != null)
            {
                cart.Items.Remove(item);
                _context.CartItems.Remove(item);
                cart.LastUpdated = System.DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }

            return cart;
        }

        public async Task<bool> ClearCartAsync(string userId)
        {
            var cart = await GetCartByUserIdAsync(userId);

            _context.CartItems.RemoveRange(cart.Items);
            cart.Items.Clear();
            cart.LastUpdated = System.DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
