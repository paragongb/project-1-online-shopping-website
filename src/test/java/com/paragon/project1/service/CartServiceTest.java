package com.paragon.project1.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.enumeration.ProductStatus;
import com.paragon.project1.repository.CartItemRepository;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.ShoppingCartRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.service.mapper.ProductMapper;
import com.paragon.project1.web.rest.errors.BadRequestAlertException;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class CartServiceTest {

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    private CartService cartService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("alice", "password"));
        cartService = new CartService(shoppingCartRepository, cartItemRepository, userRepository, productRepository, productMapper);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void addItemRejectsQuantityAboveAvailableStock() {
        User user = new User();
        user.setId(42L);
        user.setLogin("alice");
        ShoppingCart cart = new ShoppingCart().id(7L).user(user);
        Product product = new Product().id(3L).stockQuantity(2).status(ProductStatus.IN_STOCK);

        when(userRepository.findOneByLogin("alice")).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUserId(42L)).thenReturn(Optional.of(cart));
        when(productRepository.findByIdForUpdate(3L)).thenReturn(Optional.of(product));
        when(cartItemRepository.findByCartIdAndProductId(7L, 3L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> cartService.addItem(3L, 3))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("Only 2 unit(s) are available");
    }
}
