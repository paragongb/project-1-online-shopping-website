package com.paragon.project1.service.dto;

import java.io.Serializable;
import java.util.List;

/**
 * A view of the current user's {@link com.paragon.project1.domain.ShoppingCart} and its items.
 */
public class CartView implements Serializable {

    private Long id;

    private List<CartItemView> items;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemView> getItems() {
        return items;
    }

    public void setItems(List<CartItemView> items) {
        this.items = items;
    }
}
