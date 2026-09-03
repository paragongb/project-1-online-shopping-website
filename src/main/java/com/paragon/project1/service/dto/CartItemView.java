package com.paragon.project1.service.dto;

import java.io.Serializable;

/**
 * A view of a {@link com.paragon.project1.domain.CartItem} for the current user's cart,
 * with the full {@link ProductDTO} attached (price, image, stock, etc.).
 */
public class CartItemView implements Serializable {

    private Long id;

    private Integer quantity;

    private ProductDTO product;

    public CartItemView() {}

    public CartItemView(Long id, Integer quantity, ProductDTO product) {
        this.id = id;
        this.quantity = quantity;
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

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}
