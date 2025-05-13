using Stylique.Core.Entities;
using System.Threading.Tasks;

namespace Stylique.Core.Interfaces
{
    public interface ICartService
    {
        Task<Cart> GetUserCartAsync(string userId);
        Task<Cart> AddToCartAsync(string userId, int productId, int quantity, string selectedSize, string selectedColor);
        Task<Cart> UpdateCartItemAsync(string userId, int cartItemId, int quantity);
        Task<Cart> RemoveFromCartAsync(string userId, int cartItemId);
        Task<bool> ClearCartAsync(string userId);
    }
}
