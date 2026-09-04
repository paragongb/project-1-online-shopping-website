package com.paragon.project1.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * A single line item within an {@link OrderSummaryView}, with the full {@link ProductDTO}.
 */
public class OrderItemView implements Serializable {

    private Long id;

    private Integer quantity;

    private BigDecimal priceAtPurchase;

    private ProductDTO product;

    public OrderItemView() {}

    public OrderItemView(Long id, Integer quantity, BigDecimal priceAtPurchase, ProductDTO product) {
        this.id = id;
        this.quantity = quantity;
        this.priceAtPurchase = priceAtPurchase;
        this.product = product;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPriceAtPurchase() {
        return priceAtPurchase;
    }

    public void setPriceAtPurchase(BigDecimal priceAtPurchase) {
        this.priceAtPurchase = priceAtPurchase;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}
