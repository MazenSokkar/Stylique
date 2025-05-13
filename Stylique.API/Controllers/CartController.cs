using Microsoft.AspNetCore.Mvc;
using Stylique.Core.Entities;
using Stylique.Core.Interfaces;
using System.Threading.Tasks;

namespace Stylique.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CartController : ControllerBase
    {
        private readonly ICartService _cartService;

        public CartController(ICartService cartService)
        {
            _cartService = cartService;
        }

        // For demonstration purposes, we're using a simple ID as the user ID
        // In a real application, this would come from authentication
        private string GetUserId()
        {
            // Check if a user ID is provided in the request header, otherwise use a default
            if (Request.Headers.TryGetValue("User-Id", out var userId) && !string.IsNullOrEmpty(userId))
            {
                return userId;
            }
            return "guest-user";
        }

        [HttpGet]
        public async Task<ActionResult<Cart>> GetCart()
        {
            var userId = GetUserId();
            var cart = await _cartService.GetUserCartAsync(userId);
            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] AddToCartRequest request)
        {
            if (request == null || request.ProductId <= 0 || request.Quantity <= 0)
            {
                return BadRequest("Invalid request");
            }

            var userId = GetUserId();

            try
            {
                var cart = await _cartService.AddToCartAsync(
                    userId,
                    request.ProductId,
                    request.Quantity,
                    request.SelectedSize,
                    request.SelectedColor);

                return Ok(cart);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("items/{itemId}")]
        public async Task<ActionResult<Cart>> UpdateCartItem(int itemId, [FromBody] UpdateCartItemRequest request)
        {
            if (request == null || request.Quantity < 0)
            {
                return BadRequest("Invalid request");
            }

            var userId = GetUserId();
            var cart = await _cartService.UpdateCartItemAsync(userId, itemId, request.Quantity);
            return Ok(cart);
        }

        [HttpDelete("items/{itemId}")]
        public async Task<ActionResult<Cart>> RemoveCartItem(int itemId)
        {
            var userId = GetUserId();
            var cart = await _cartService.RemoveFromCartAsync(userId, itemId);
            return Ok(cart);
        }

        [HttpDelete]
        public async Task<ActionResult> ClearCart()
        {
            var userId = GetUserId();
            var result = await _cartService.ClearCartAsync(userId);

            if (result)
            {
                return NoContent();
            }

            return BadRequest("Failed to clear cart");
        }
    }

    public class AddToCartRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string SelectedSize { get; set; } = string.Empty;
        public string SelectedColor { get; set; } = string.Empty;
    }

    public class UpdateCartItemRequest
    {
        public int Quantity { get; set; }
    }
}
