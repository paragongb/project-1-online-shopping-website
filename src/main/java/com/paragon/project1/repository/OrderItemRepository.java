package com.paragon.project1.repository;

import com.paragon.project1.domain.OrderItem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the OrderItem entity.
 */
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    default Optional<OrderItem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<OrderItem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<OrderItem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select orderItem from OrderItem orderItem left join fetch orderItem.product",
        countQuery = "select count(orderItem) from OrderItem orderItem"
    )
    Page<OrderItem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select orderItem from OrderItem orderItem left join fetch orderItem.product")
    List<OrderItem> findAllWithToOneRelationships();

    @Query("select orderItem from OrderItem orderItem left join fetch orderItem.product where orderItem.id =:id")
    Optional<OrderItem> findOneWithToOneRelationships(@Param("id") Long id);

    @Query(
        "select orderItem from OrderItem orderItem left join fetch orderItem.product left join fetch orderItem.order " +
            "where orderItem.order.user.login = ?#{authentication.name} " +
            "order by orderItem.order.placedDate desc, orderItem.id asc"
    )
    List<OrderItem> findByOrderUserIsCurrentUser();

    @Query(
        "select orderItem from OrderItem orderItem left join fetch orderItem.product where orderItem.order.id = :orderId order by orderItem.id asc"
    )
    List<OrderItem> findByOrderId(@Param("orderId") Long orderId);
}
