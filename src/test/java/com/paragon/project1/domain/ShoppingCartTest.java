package com.paragon.project1.domain;

import static com.paragon.project1.domain.CartItemTestSamples.*;
import static com.paragon.project1.domain.ShoppingCartTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.paragon.project1.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ShoppingCartTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ShoppingCart.class);
        ShoppingCart shoppingCart1 = getShoppingCartSample1();
        ShoppingCart shoppingCart2 = new ShoppingCart();
        assertThat(shoppingCart1).isNotEqualTo(shoppingCart2);

        shoppingCart2.setId(shoppingCart1.getId());
        assertThat(shoppingCart1).isEqualTo(shoppingCart2);

        shoppingCart2 = getShoppingCartSample2();
        assertThat(shoppingCart1).isNotEqualTo(shoppingCart2);
    }

    @Test
    void cartItemTest() {
        ShoppingCart shoppingCart = getShoppingCartRandomSampleGenerator();
        CartItem cartItemBack = getCartItemRandomSampleGenerator();

        shoppingCart.addCartItem(cartItemBack);
        assertThat(shoppingCart.getCartItems()).containsOnly(cartItemBack);
        assertThat(cartItemBack.getCart()).isEqualTo(shoppingCart);

        shoppingCart.removeCartItem(cartItemBack);
        assertThat(shoppingCart.getCartItems()).doesNotContain(cartItemBack);
        assertThat(cartItemBack.getCart()).isNull();

        shoppingCart.cartItems(new HashSet<>(Set.of(cartItemBack)));
        assertThat(shoppingCart.getCartItems()).containsOnly(cartItemBack);
        assertThat(cartItemBack.getCart()).isEqualTo(shoppingCart);

        shoppingCart.setCartItems(new HashSet<>());
        assertThat(shoppingCart.getCartItems()).doesNotContain(cartItemBack);
        assertThat(cartItemBack.getCart()).isNull();
    }
}
