package com.paragon.project1.repository;

import com.paragon.project1.domain.CustomerOrder;
import com.paragon.project1.domain.enumeration.OrderStatus;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CustomerOrder entity.
 */
@Repository
public interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long>, JpaSpecificationExecutor<CustomerOrder> {
    long countByPlacedDateGreaterThanEqual(Instant startDate);

    long countByStatus(OrderStatus status);

    @Query("select coalesce(sum(customerOrder.totalAmount), 0) from CustomerOrder customerOrder where customerOrder.status <> :status")
    BigDecimal sumRevenueExcludingStatus(@Param("status") OrderStatus status);

    @Query(
        "select coalesce(sum(customerOrder.totalAmount), 0) from CustomerOrder customerOrder " +
            "where customerOrder.placedDate >= :startDate and customerOrder.status <> :status"
    )
    BigDecimal sumRevenueSinceExcludingStatus(@Param("startDate") Instant startDate, @Param("status") OrderStatus status);

    @Query(
        "select customerOrder from CustomerOrder customerOrder left join fetch customerOrder.shippingAddress " +
            "where customerOrder.user.login = ?#{authentication.name} order by customerOrder.placedDate desc"
    )
    List<CustomerOrder> findByUserIsCurrentUser();

    default Optional<CustomerOrder> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<CustomerOrder> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<CustomerOrder> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select customerOrder from CustomerOrder customerOrder left join fetch customerOrder.user left join fetch customerOrder.shippingAddress left join fetch customerOrder.billingAddress",
        countQuery = "select count(customerOrder) from CustomerOrder customerOrder"
    )
    Page<CustomerOrder> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select customerOrder from CustomerOrder customerOrder left join fetch customerOrder.user left join fetch customerOrder.shippingAddress left join fetch customerOrder.billingAddress"
    )
    List<CustomerOrder> findAllWithToOneRelationships();

    @Query(
        "select customerOrder from CustomerOrder customerOrder left join fetch customerOrder.user left join fetch customerOrder.shippingAddress left join fetch customerOrder.billingAddress where customerOrder.id =:id"
    )
    Optional<CustomerOrder> findOneWithToOneRelationships(@Param("id") Long id);
}
