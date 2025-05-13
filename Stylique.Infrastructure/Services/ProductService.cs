using Stylique.Core.Entities;
using Stylique.Core.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Stylique.Infrastructure.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _productRepository.GetAllProductsAsync();
        }

        public async Task<Product> GetProductByIdAsync(int id)
        {
            return await _productRepository.GetProductByIdAsync(id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return await _productRepository.GetProductsByCategoryAsync(category);
        }

        public async Task<IEnumerable<Product>> GetFeaturedProductsAsync()
        {
            return await _productRepository.GetFeaturedProductsAsync();
        }

        public async Task<IEnumerable<Product>> FilterProductsAsync(
            string category = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            List<string> sizes = null,
            List<string> colors = null,
            bool? inStock = null)
        {
            var allProducts = await _productRepository.GetAllProductsAsync();
            var filteredProducts = allProducts.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(category))
            {
                filteredProducts = filteredProducts.Where(p => p.Category.ToLower() == category.ToLower());
            }

            if (minPrice.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.Price <= maxPrice.Value);
            }

            if (sizes != null && sizes.Any())
            {
                filteredProducts = filteredProducts.Where(p => p.Sizes.Any(s => sizes.Contains(s)));
            }

            if (colors != null && colors.Any())
            {
                filteredProducts = filteredProducts.Where(p => p.Colors.Any(c => colors.Contains(c)));
            }

            if (inStock.HasValue)
            {
                filteredProducts = filteredProducts.Where(p => p.InStock == inStock.Value);
            }

            return filteredProducts.ToList();
        }

        public async Task<Product> AddProductAsync(Product product)
        {
            return await _productRepository.AddProductAsync(product);
        }

        public async Task<bool> UpdateProductAsync(Product product)
        {
            return await _productRepository.UpdateProductAsync(product);
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            return await _productRepository.DeleteProductAsync(id);
        }
    }
}
