using System;

namespace Stylique.Core.Entities
{
    public class CartItem
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public required Product Product { get; set; }
        public int Quantity { get; set; }
        public required string SelectedSize { get; set; }
        public required string SelectedColor { get; set; }
        public int CartId { get; set; }
    }
}
