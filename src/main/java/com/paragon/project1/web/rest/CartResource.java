package com.paragon.project1.web.rest;

import com.paragon.project1.service.CartService;
import com.paragon.project1.service.dto.AddToCartRequest;
import com.paragon.project1.service.dto.CartView;
import com.paragon.project1.service.dto.UpdateCartItemRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing the current authenticated user's shopping cart.
 * All operations are scoped to the logged-in user, so cart contents are
 * never shared between different users.
 */
@RestController
@RequestMapping("/api/cart")
public class CartResource {

    private static final Logger LOG = LoggerFactory.getLogger(CartResource.class);

    private final CartService cartService;

    public CartResource(CartService cartService) {
        this.cartService = cartService;
    }

    /**
     * {@code GET  /api/cart} : get the current user's cart, creating one if it doesn't exist yet.
     */
    @GetMapping("")
    public ResponseEntity<CartView> getCart() {
        LOG.debug("REST request to get the current user's cart");
        return ResponseEntity.ok(cartService.getCartForCurrentUser());
    }

    /**
     * {@code POST  /api/cart/items} : add a product to the current user's cart (increments quantity if already present).
     */
    @PostMapping("/items")
    public ResponseEntity<CartView> addItem(@Valid @RequestBody AddToCartRequest request) {
        LOG.debug("REST request to add product {} to the current user's cart", request.getProductId());
        return ResponseEntity.ok(cartService.addItem(request.getProductId(), request.getQuantity()));
    }

    /**
     * {@code PUT  /api/cart/items/:itemId} : update the quantity of an item in the current user's cart.
     */
    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartView> updateItem(@PathVariable Long itemId, @Valid @RequestBody UpdateCartItemRequest request) {
        LOG.debug("REST request to update cart item {} to quantity {}", itemId, request.getQuantity());
        return ResponseEntity.ok(cartService.updateItemQuantity(itemId, request.getQuantity()));
    }

    /**
     * {@code DELETE  /api/cart/items/:itemId} : remove an item from the current user's cart.
     */
    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartView> removeItem(@PathVariable Long itemId) {
        LOG.debug("REST request to remove cart item {}", itemId);
        return ResponseEntity.ok(cartService.removeItem(itemId));
    }
}
