package com.paragon.project1.repository;

import com.paragon.project1.domain.Wishlist;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class WishlistRepositoryWithBagRelationshipsImpl implements WishlistRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String WISHLISTS_PARAMETER = "wishlists";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Wishlist> fetchBagRelationships(Optional<Wishlist> wishlist) {
        return wishlist.map(this::fetchProducts);
    }

    @Override
    public Page<Wishlist> fetchBagRelationships(Page<Wishlist> wishlists) {
        return new PageImpl<>(fetchBagRelationships(wishlists.getContent()), wishlists.getPageable(), wishlists.getTotalElements());
    }

    @Override
    public List<Wishlist> fetchBagRelationships(List<Wishlist> wishlists) {
        return Optional.of(wishlists).map(this::fetchProducts).orElse(List.of());
    }

    Wishlist fetchProducts(Wishlist result) {
        return entityManager
            .createQuery("select wishlist from Wishlist wishlist left join fetch wishlist.products where wishlist.id = :id", Wishlist.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Wishlist> fetchProducts(List<Wishlist> wishlists) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, wishlists.size()).forEach(index -> order.put(wishlists.get(index).getId(), index));
        List<Wishlist> result = entityManager
            .createQuery(
                "select wishlist from Wishlist wishlist left join fetch wishlist.products where wishlist in :wishlists",
                Wishlist.class
            )
            .setParameter(WISHLISTS_PARAMETER, wishlists)
            .getResultList();
        result.sort((o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
