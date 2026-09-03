package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.Wishlist;
import com.paragon.project1.service.dto.ProductDTO;
import com.paragon.project1.service.dto.UserDTO;
import com.paragon.project1.service.dto.WishlistDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Wishlist} and its DTO {@link WishlistDTO}.
 */
@Mapper(componentModel = "spring")
public interface WishlistMapper extends EntityMapper<WishlistDTO, Wishlist> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    @Mapping(target = "products", source = "products", qualifiedByName = "productNameSet")
    WishlistDTO toDto(Wishlist s);

    @Mapping(target = "removeProduct", ignore = true)
    Wishlist toEntity(WishlistDTO wishlistDTO);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);

    @Named("productName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductDTO toDtoProductName(Product product);

    @Named("productNameSet")
    default Set<ProductDTO> toDtoProductNameSet(Set<Product> product) {
        return product.stream().map(this::toDtoProductName).collect(Collectors.toSet());
    }
}
