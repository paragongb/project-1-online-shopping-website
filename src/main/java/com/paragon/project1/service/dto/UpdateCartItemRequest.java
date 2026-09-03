package com.paragon.project1.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Request payload to update the quantity of an item in the current user's cart.
 */
public class UpdateCartItemRequest implements Serializable {

    @NotNull
    private Integer quantity;

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
