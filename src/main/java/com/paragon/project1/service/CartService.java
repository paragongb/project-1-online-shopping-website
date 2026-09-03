package com.paragon.project1.service;

import com.paragon.project1.domain.CartItem;
import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.domain.User;
import com.paragon.project1.repository.CartItemRepository;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.ShoppingCartRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.security.SecurityUtils;
import com.paragon.project1.service.dto.CartItemView;
import com.paragon.project1.service.dto.CartView;
import com.paragon.project1.service.mapper.ProductMapper;
import com.paragon.project1.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing the current authenticated user's shopping cart.
 * Every operation resolves the cart via the logged-in user, so carts are
 * never shared or exposed across users.
 */
@Service
@Transactional
public class CartService {

    private static final Logger LOG = LoggerFactory.getLogger(CartService.class);

    private final ShoppingCartRepository shoppingCartRepository;

    private final CartItemRepository cartItemRepository;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    public CartService(
        ShoppingCartRepository shoppingCartRepository,
        CartItemRepository cartItemRepository,
        UserRepository userRepository,
        ProductRepository productRepository,
        ProductMapper productMapper
    ) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Transactional(readOnly = true)
    public CartView getCartForCurrentUser() {
        return toView(getOrCreateCartForCurrentUser());
    }

    public CartView addItem(Long productId, Integer quantity) {
        ShoppingCart cart = getOrCreateCartForCurrentUser();
        Product product = productRepository
            .findById(productId)
            .orElseThrow(() -> new BadRequestAlertException("Product not found", "cartItem", "productnotfound"));

        CartItem item = cartItemRepository
            .findByCartIdAndProductId(cart.getId(), productId)
            .map(existing -> {
                existing.setQuantity(existing.getQuantity() + quantity);
                return existing;
            })
            .orElseGet(() -> {
                CartItem newItem = new CartItem();
                newItem.setCart(cart);
                newItem.setProduct(product);
                newItem.setQuantity(quantity);
                return newItem;
            });
        cartItemRepository.save(item);
        LOG.debug("Added product {} (qty {}) to cart {}", productId, quantity, cart.getId());
        return toView(cart);
    }

    public CartView updateItemQuantity(Long itemId, Integer quantity) {
        ShoppingCart cart = getOrCreateCartForCurrentUser();
        CartItem item = getOwnedCartItem(cart, itemId);
        if (quantity == null || quantity < 1) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return toView(cart);
    }

    public CartView removeItem(Long itemId) {
        ShoppingCart cart = getOrCreateCartForCurrentUser();
        CartItem item = getOwnedCartItem(cart, itemId);
        cartItemRepository.delete(item);
        return toView(cart);
    }

    private CartItem getOwnedCartItem(ShoppingCart cart, Long itemId) {
        CartItem item = cartItemRepository
            .findById(itemId)
            .orElseThrow(() -> new BadRequestAlertException("Cart item not found", "cartItem", "idnotfound"));
        if (item.getCart() == null || !item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestAlertException("Cart item does not belong to the current user", "cartItem", "forbidden");
        }
        return item;
    }

    private ShoppingCart getOrCreateCartForCurrentUser() {
        User user = getCurrentUser();
        return shoppingCartRepository.findByUserId(user.getId()).orElseGet(() -> {
            ShoppingCart cart = new ShoppingCart();
            cart.setUser(user);
            cart.setCreatedDate(Instant.now());
            return shoppingCartRepository.save(cart);
        });
    }

    private User getCurrentUser() {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User is not authenticated", "cart", "usernotfound")
        );
        return userRepository
            .findOneByLogin(login)
            .orElseThrow(() -> new BadRequestAlertException("User not found", "cart", "usernotfound"));
    }

    private CartView toView(ShoppingCart cart) {
        List<CartItemView> itemViews = cartItemRepository
            .findByCartIdOrderByIdAsc(cart.getId())
            .stream()
            .map(item -> new CartItemView(item.getId(), item.getQuantity(), productMapper.toDto(item.getProduct())))
            .toList();
        CartView view = new CartView();
        view.setId(cart.getId());
        view.setItems(itemViews);
        return view;
    }
}
