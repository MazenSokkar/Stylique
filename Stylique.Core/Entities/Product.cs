using System.Collections.Generic;

namespace Stylique.Core.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
        public decimal Price { get; set; }
        public required string ImageUrl { get; set; }
        public required string Category { get; set; }
        public List<string> Sizes { get; set; } = new List<string>();
        public List<string> Colors { get; set; } = new List<string>();
        public bool InStock { get; set; }
        public bool Featured { get; set; }
        public decimal? DiscountPercentage { get; set; }
    }
}