package com.paragon.project1.service.criteria;

import com.paragon.project1.domain.enumeration.OrderStatus;
import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.paragon.project1.domain.CustomerOrder} entity. This class is used
 * in {@link com.paragon.project1.web.rest.CustomerOrderResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /customer-orders?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CustomerOrderCriteria implements Serializable, Criteria {

    /**
     * Class for filtering OrderStatus
     */
    public static class OrderStatusFilter extends Filter<OrderStatus> {

        public OrderStatusFilter() {}

        public OrderStatusFilter(OrderStatusFilter filter) {
            super(filter);
        }

        @Override
        public OrderStatusFilter copy() {
            return new OrderStatusFilter(this);
        }
    }

    @Serial
    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private InstantFilter placedDate;

    private OrderStatusFilter status;

    private BigDecimalFilter totalAmount;

    private LongFilter shippingAddressId;

    private LongFilter billingAddressId;

    private LongFilter orderItemId;

    private LongFilter userId;

    private Boolean distinct;

    public CustomerOrderCriteria() {}

    public CustomerOrderCriteria(CustomerOrderCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.placedDate = other.optionalPlacedDate().map(InstantFilter::copy).orElse(null);
        this.status = other.optionalStatus().map(OrderStatusFilter::copy).orElse(null);
        this.totalAmount = other.optionalTotalAmount().map(BigDecimalFilter::copy).orElse(null);
        this.shippingAddressId = other.optionalShippingAddressId().map(LongFilter::copy).orElse(null);
        this.billingAddressId = other.optionalBillingAddressId().map(LongFilter::copy).orElse(null);
        this.orderItemId = other.optionalOrderItemId().map(LongFilter::copy).orElse(null);
        this.userId = other.optionalUserId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public CustomerOrderCriteria copy() {
        return new CustomerOrderCriteria(this);
    }

    public LongFilter getId() {
        return id;
    }

    public Optional<LongFilter> optionalId() {
        return Optional.ofNullable(id);
    }

    public LongFilter id() {
        if (id == null) {
            setId(new LongFilter());
        }
        return id;
    }

    public void setId(LongFilter id) {
        this.id = id;
    }

    public InstantFilter getPlacedDate() {
        return placedDate;
    }

    public Optional<InstantFilter> optionalPlacedDate() {
        return Optional.ofNullable(placedDate);
    }

    public InstantFilter placedDate() {
        if (placedDate == null) {
            setPlacedDate(new InstantFilter());
        }
        return placedDate;
    }

    public void setPlacedDate(InstantFilter placedDate) {
        this.placedDate = placedDate;
    }

    public OrderStatusFilter getStatus() {
        return status;
    }

    public Optional<OrderStatusFilter> optionalStatus() {
        return Optional.ofNullable(status);
    }

    public OrderStatusFilter status() {
        if (status == null) {
            setStatus(new OrderStatusFilter());
        }
        return status;
    }

    public void setStatus(OrderStatusFilter status) {
        this.status = status;
    }

    public BigDecimalFilter getTotalAmount() {
        return totalAmount;
    }

    public Optional<BigDecimalFilter> optionalTotalAmount() {
        return Optional.ofNullable(totalAmount);
    }

    public BigDecimalFilter totalAmount() {
        if (totalAmount == null) {
            setTotalAmount(new BigDecimalFilter());
        }
        return totalAmount;
    }

    public void setTotalAmount(BigDecimalFilter totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LongFilter getShippingAddressId() {
        return shippingAddressId;
    }

    public Optional<LongFilter> optionalShippingAddressId() {
        return Optional.ofNullable(shippingAddressId);
    }

    public LongFilter shippingAddressId() {
        if (shippingAddressId == null) {
            setShippingAddressId(new LongFilter());
        }
        return shippingAddressId;
    }

    public void setShippingAddressId(LongFilter shippingAddressId) {
        this.shippingAddressId = shippingAddressId;
    }

    public LongFilter getBillingAddressId() {
        return billingAddressId;
    }

    public Optional<LongFilter> optionalBillingAddressId() {
        return Optional.ofNullable(billingAddressId);
    }

    public LongFilter billingAddressId() {
        if (billingAddressId == null) {
            setBillingAddressId(new LongFilter());
        }
        return billingAddressId;
    }

    public void setBillingAddressId(LongFilter billingAddressId) {
        this.billingAddressId = billingAddressId;
    }

    public LongFilter getOrderItemId() {
        return orderItemId;
    }

    public Optional<LongFilter> optionalOrderItemId() {
        return Optional.ofNullable(orderItemId);
    }

    public LongFilter orderItemId() {
        if (orderItemId == null) {
            setOrderItemId(new LongFilter());
        }
        return orderItemId;
    }

    public void setOrderItemId(LongFilter orderItemId) {
        this.orderItemId = orderItemId;
    }

    public LongFilter getUserId() {
        return userId;
    }

    public Optional<LongFilter> optionalUserId() {
        return Optional.ofNullable(userId);
    }

    public LongFilter userId() {
        if (userId == null) {
            setUserId(new LongFilter());
        }
        return userId;
    }

    public void setUserId(LongFilter userId) {
        this.userId = userId;
    }

    public Boolean getDistinct() {
        return distinct;
    }

    public Optional<Boolean> optionalDistinct() {
        return Optional.ofNullable(distinct);
    }

    public Boolean distinct() {
        if (distinct == null) {
            setDistinct(true);
        }
        return distinct;
    }

    public void setDistinct(Boolean distinct) {
        this.distinct = distinct;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        final CustomerOrderCriteria that = (CustomerOrderCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(placedDate, that.placedDate) &&
            Objects.equals(status, that.status) &&
            Objects.equals(totalAmount, that.totalAmount) &&
            Objects.equals(shippingAddressId, that.shippingAddressId) &&
            Objects.equals(billingAddressId, that.billingAddressId) &&
            Objects.equals(orderItemId, that.orderItemId) &&
            Objects.equals(userId, that.userId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, placedDate, status, totalAmount, shippingAddressId, billingAddressId, orderItemId, userId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CustomerOrderCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalPlacedDate().map(f -> "placedDate=" + f + ", ").orElse("") +
            optionalStatus().map(f -> "status=" + f + ", ").orElse("") +
            optionalTotalAmount().map(f -> "totalAmount=" + f + ", ").orElse("") +
            optionalShippingAddressId().map(f -> "shippingAddressId=" + f + ", ").orElse("") +
            optionalBillingAddressId().map(f -> "billingAddressId=" + f + ", ").orElse("") +
            optionalOrderItemId().map(f -> "orderItemId=" + f + ", ").orElse("") +
            optionalUserId().map(f -> "userId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
