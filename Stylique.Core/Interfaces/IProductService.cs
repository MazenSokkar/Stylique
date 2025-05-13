using Stylique.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stylique.Core.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product> GetProductByIdAsync(int id);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        Task<IEnumerable<Product>> GetFeaturedProductsAsync();
        Task<IEnumerable<Product>> FilterProductsAsync(string category = null, decimal? minPrice = null, decimal? maxPrice = null, List<string> sizes = null, List<string> colors = null, bool? inStock = null);
        Task<Product> AddProductAsync(Product product);
        Task<bool> UpdateProductAsync(Product product);
        Task<bool> DeleteProductAsync(int id);
    }
}
