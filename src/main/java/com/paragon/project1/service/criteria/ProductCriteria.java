package com.paragon.project1.service.criteria;

import com.paragon.project1.domain.enumeration.ProductStatus;
import java.io.Serial;
import java.io.Serializable;
import java.util.Objects;
import java.util.Optional;
import org.springdoc.core.annotations.ParameterObject;
import tech.jhipster.service.Criteria;
import tech.jhipster.service.filter.*;

/**
 * Criteria class for the {@link com.paragon.project1.domain.Product} entity. This class is used
 * in {@link com.paragon.project1.web.rest.ProductResource} to receive all the possible filtering options from
 * the Http GET request parameters.
 * For example the following could be a valid request:
 * {@code /products?id.greaterThan=5&attr1.contains=something&attr2.specified=false}
 * As Spring is unable to properly convert the types, unless specific {@link Filter} class are used, we need to use
 * fix type specific filters.
 */
@ParameterObject
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ProductCriteria implements Serializable, Criteria {

    /**
     * Class for filtering ProductStatus
     */
    public static class ProductStatusFilter extends Filter<ProductStatus> {

        public ProductStatusFilter() {}

        public ProductStatusFilter(ProductStatusFilter filter) {
            super(filter);
        }

        @Override
        public ProductStatusFilter copy() {
            return new ProductStatusFilter(this);
        }
    }

    @Serial
    private static final long serialVersionUID = 1L;

    private LongFilter id;

    private StringFilter sku;

    private StringFilter name;

    private BigDecimalFilter price;

    private IntegerFilter stockQuantity;

    private ProductStatusFilter status;

    private LongFilter categoryId;

    private LongFilter wishlistId;

    private Boolean distinct;

    public ProductCriteria() {}

    public ProductCriteria(ProductCriteria other) {
        this.id = other.optionalId().map(LongFilter::copy).orElse(null);
        this.sku = other.optionalSku().map(StringFilter::copy).orElse(null);
        this.name = other.optionalName().map(StringFilter::copy).orElse(null);
        this.price = other.optionalPrice().map(BigDecimalFilter::copy).orElse(null);
        this.stockQuantity = other.optionalStockQuantity().map(IntegerFilter::copy).orElse(null);
        this.status = other.optionalStatus().map(ProductStatusFilter::copy).orElse(null);
        this.categoryId = other.optionalCategoryId().map(LongFilter::copy).orElse(null);
        this.wishlistId = other.optionalWishlistId().map(LongFilter::copy).orElse(null);
        this.distinct = other.distinct;
    }

    @Override
    public ProductCriteria copy() {
        return new ProductCriteria(this);
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

    public StringFilter getSku() {
        return sku;
    }

    public Optional<StringFilter> optionalSku() {
        return Optional.ofNullable(sku);
    }

    public StringFilter sku() {
        if (sku == null) {
            setSku(new StringFilter());
        }
        return sku;
    }

    public void setSku(StringFilter sku) {
        this.sku = sku;
    }

    public StringFilter getName() {
        return name;
    }

    public Optional<StringFilter> optionalName() {
        return Optional.ofNullable(name);
    }

    public StringFilter name() {
        if (name == null) {
            setName(new StringFilter());
        }
        return name;
    }

    public void setName(StringFilter name) {
        this.name = name;
    }

    public BigDecimalFilter getPrice() {
        return price;
    }

    public Optional<BigDecimalFilter> optionalPrice() {
        return Optional.ofNullable(price);
    }

    public BigDecimalFilter price() {
        if (price == null) {
            setPrice(new BigDecimalFilter());
        }
        return price;
    }

    public void setPrice(BigDecimalFilter price) {
        this.price = price;
    }

    public IntegerFilter getStockQuantity() {
        return stockQuantity;
    }

    public Optional<IntegerFilter> optionalStockQuantity() {
        return Optional.ofNullable(stockQuantity);
    }

    public IntegerFilter stockQuantity() {
        if (stockQuantity == null) {
            setStockQuantity(new IntegerFilter());
        }
        return stockQuantity;
    }

    public void setStockQuantity(IntegerFilter stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public ProductStatusFilter getStatus() {
        return status;
    }

    public Optional<ProductStatusFilter> optionalStatus() {
        return Optional.ofNullable(status);
    }

    public ProductStatusFilter status() {
        if (status == null) {
            setStatus(new ProductStatusFilter());
        }
        return status;
    }

    public void setStatus(ProductStatusFilter status) {
        this.status = status;
    }

    public LongFilter getCategoryId() {
        return categoryId;
    }

    public Optional<LongFilter> optionalCategoryId() {
        return Optional.ofNullable(categoryId);
    }

    public LongFilter categoryId() {
        if (categoryId == null) {
            setCategoryId(new LongFilter());
        }
        return categoryId;
    }

    public void setCategoryId(LongFilter categoryId) {
        this.categoryId = categoryId;
    }

    public LongFilter getWishlistId() {
        return wishlistId;
    }

    public Optional<LongFilter> optionalWishlistId() {
        return Optional.ofNullable(wishlistId);
    }

    public LongFilter wishlistId() {
        if (wishlistId == null) {
            setWishlistId(new LongFilter());
        }
        return wishlistId;
    }

    public void setWishlistId(LongFilter wishlistId) {
        this.wishlistId = wishlistId;
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
        final ProductCriteria that = (ProductCriteria) o;
        return (
            Objects.equals(id, that.id) &&
            Objects.equals(sku, that.sku) &&
            Objects.equals(name, that.name) &&
            Objects.equals(price, that.price) &&
            Objects.equals(stockQuantity, that.stockQuantity) &&
            Objects.equals(status, that.status) &&
            Objects.equals(categoryId, that.categoryId) &&
            Objects.equals(wishlistId, that.wishlistId) &&
            Objects.equals(distinct, that.distinct)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, sku, name, price, stockQuantity, status, categoryId, wishlistId, distinct);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ProductCriteria{" +
            optionalId().map(f -> "id=" + f + ", ").orElse("") +
            optionalSku().map(f -> "sku=" + f + ", ").orElse("") +
            optionalName().map(f -> "name=" + f + ", ").orElse("") +
            optionalPrice().map(f -> "price=" + f + ", ").orElse("") +
            optionalStockQuantity().map(f -> "stockQuantity=" + f + ", ").orElse("") +
            optionalStatus().map(f -> "status=" + f + ", ").orElse("") +
            optionalCategoryId().map(f -> "categoryId=" + f + ", ").orElse("") +
            optionalWishlistId().map(f -> "wishlistId=" + f + ", ").orElse("") +
            optionalDistinct().map(f -> "distinct=" + f + ", ").orElse("") +
        "}";
    }
}
