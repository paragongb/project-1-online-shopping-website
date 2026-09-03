package com.paragon.project1.domain;

import static com.paragon.project1.domain.CategoryTestSamples.*;
import static com.paragon.project1.domain.ProductTestSamples.*;
import static com.paragon.project1.domain.WishlistTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.paragon.project1.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProductTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Product.class);
        Product product1 = getProductSample1();
        Product product2 = new Product();
        assertThat(product1).isNotEqualTo(product2);

        product2.setId(product1.getId());
        assertThat(product1).isEqualTo(product2);

        product2 = getProductSample2();
        assertThat(product1).isNotEqualTo(product2);
    }

    @Test
    void categoryTest() {
        Product product = getProductRandomSampleGenerator();
        Category categoryBack = getCategoryRandomSampleGenerator();

        product.setCategory(categoryBack);
        assertThat(product.getCategory()).isEqualTo(categoryBack);

        product.category(null);
        assertThat(product.getCategory()).isNull();
    }

    @Test
    void wishlistTest() {
        Product product = getProductRandomSampleGenerator();
        Wishlist wishlistBack = getWishlistRandomSampleGenerator();

        product.addWishlist(wishlistBack);
        assertThat(product.getWishlists()).containsOnly(wishlistBack);
        assertThat(wishlistBack.getProducts()).containsOnly(product);

        product.removeWishlist(wishlistBack);
        assertThat(product.getWishlists()).doesNotContain(wishlistBack);
        assertThat(wishlistBack.getProducts()).doesNotContain(product);

        product.wishlists(new HashSet<>(Set.of(wishlistBack)));
        assertThat(product.getWishlists()).containsOnly(wishlistBack);
        assertThat(wishlistBack.getProducts()).containsOnly(product);

        product.setWishlists(new HashSet<>());
        assertThat(product.getWishlists()).doesNotContain(wishlistBack);
        assertThat(wishlistBack.getProducts()).doesNotContain(product);
    }
}
