package com.paragon.project1.repository;

import com.paragon.project1.domain.Wishlist;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Wishlist entity.
 *
 * When extending this class, extend WishlistRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface WishlistRepository extends WishlistRepositoryWithBagRelationships, JpaRepository<Wishlist, Long> {
    default Optional<Wishlist> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Wishlist> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Wishlist> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select wishlist from Wishlist wishlist left join fetch wishlist.user",
        countQuery = "select count(wishlist) from Wishlist wishlist"
    )
    Page<Wishlist> findAllWithToOneRelationships(Pageable pageable);

    @Query("select wishlist from Wishlist wishlist left join fetch wishlist.user")
    List<Wishlist> findAllWithToOneRelationships();

    @Query("select wishlist from Wishlist wishlist left join fetch wishlist.user where wishlist.id =:id")
    Optional<Wishlist> findOneWithToOneRelationships(@Param("id") Long id);
}
