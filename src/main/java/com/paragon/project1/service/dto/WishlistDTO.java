package com.paragon.project1.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.paragon.project1.domain.Wishlist} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class WishlistDTO implements Serializable {

    private Long id;

    @NotNull
    private Instant createdDate;

    private UserDTO user;

    private Set<ProductDTO> products = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Set<ProductDTO> getProducts() {
        return products;
    }

    public void setProducts(Set<ProductDTO> products) {
        this.products = products;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WishlistDTO)) {
            return false;
        }

        WishlistDTO wishlistDTO = (WishlistDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, wishlistDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WishlistDTO{" +
            "id=" + getId() +
            ", createdDate='" + getCreatedDate() + "'" +
            ", user=" + getUser() +
            ", products=" + getProducts() +
            "}";
    }
}
