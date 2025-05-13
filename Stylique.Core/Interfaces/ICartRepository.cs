using Stylique.Core.Entities;
using System.Threading.Tasks;

namespace Stylique.Core.Interfaces
{
    public interface ICartRepository
    {
        Task<Cart> GetCartByUserIdAsync(string userId);
        Task<Cart> CreateCartAsync(string userId);
        Task<Cart> AddItemToCartAsync(string userId, CartItem item);
        Task<Cart> UpdateCartItemAsync(string userId, int cartItemId, int quantity);
        Task<Cart> RemoveItemFromCartAsync(string userId, int cartItemId);
        Task<bool> ClearCartAsync(string userId);
    }
}
