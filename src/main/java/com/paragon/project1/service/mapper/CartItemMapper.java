package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.CartItem;
import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.service.dto.CartItemDTO;
import com.paragon.project1.service.dto.ProductDTO;
import com.paragon.project1.service.dto.ShoppingCartDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CartItem} and its DTO {@link CartItemDTO}.
 */
@Mapper(componentModel = "spring")
public interface CartItemMapper extends EntityMapper<CartItemDTO, CartItem> {
    @Mapping(target = "product", source = "product", qualifiedByName = "productName")
    @Mapping(target = "cart", source = "cart", qualifiedByName = "shoppingCartId")
    CartItemDTO toDto(CartItem s);

    @Named("productName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductDTO toDtoProductName(Product product);

    @Named("shoppingCartId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    ShoppingCartDTO toDtoShoppingCartId(ShoppingCart shoppingCart);
}
