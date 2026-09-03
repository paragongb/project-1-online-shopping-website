package com.paragon.project1.repository;

import com.paragon.project1.domain.Wishlist;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface WishlistRepositoryWithBagRelationships {
    Optional<Wishlist> fetchBagRelationships(Optional<Wishlist> wishlist);

    List<Wishlist> fetchBagRelationships(List<Wishlist> wishlists);

    Page<Wishlist> fetchBagRelationships(Page<Wishlist> wishlists);
}
