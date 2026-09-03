package com.paragon.project1.domain;

import static com.paragon.project1.domain.ProductTestSamples.*;
import static com.paragon.project1.domain.WishlistTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.paragon.project1.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class WishlistTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Wishlist.class);
        Wishlist wishlist1 = getWishlistSample1();
        Wishlist wishlist2 = new Wishlist();
        assertThat(wishlist1).isNotEqualTo(wishlist2);

        wishlist2.setId(wishlist1.getId());
        assertThat(wishlist1).isEqualTo(wishlist2);

        wishlist2 = getWishlistSample2();
        assertThat(wishlist1).isNotEqualTo(wishlist2);
    }

    @Test
    void productTest() {
        Wishlist wishlist = getWishlistRandomSampleGenerator();
        Product productBack = getProductRandomSampleGenerator();

        wishlist.addProduct(productBack);
        assertThat(wishlist.getProducts()).containsOnly(productBack);

        wishlist.removeProduct(productBack);
        assertThat(wishlist.getProducts()).doesNotContain(productBack);

        wishlist.products(new HashSet<>(Set.of(productBack)));
        assertThat(wishlist.getProducts()).containsOnly(productBack);

        wishlist.setProducts(new HashSet<>());
        assertThat(wishlist.getProducts()).doesNotContain(productBack);
    }
}
