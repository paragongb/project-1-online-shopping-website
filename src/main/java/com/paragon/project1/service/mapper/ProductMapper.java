package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.Category;
import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.Wishlist;
import com.paragon.project1.service.dto.CategoryDTO;
import com.paragon.project1.service.dto.ProductDTO;
import com.paragon.project1.service.dto.WishlistDTO;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Product} and its DTO {@link ProductDTO}.
 */
@Mapper(componentModel = "spring")
public interface ProductMapper extends EntityMapper<ProductDTO, Product> {
    @Mapping(target = "category", source = "category", qualifiedByName = "categoryName")
    @Mapping(target = "wishlists", source = "wishlists", qualifiedByName = "wishlistIdSet")
    ProductDTO toDto(Product s);

    @Mapping(target = "wishlists", ignore = true)
    @Mapping(target = "removeWishlist", ignore = true)
    Product toEntity(ProductDTO productDTO);

    @Named("categoryName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    CategoryDTO toDtoCategoryName(Category category);

    @Named("wishlistId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    WishlistDTO toDtoWishlistId(Wishlist wishlist);

    @Named("wishlistIdSet")
    default Set<WishlistDTO> toDtoWishlistIdSet(Set<Wishlist> wishlist) {
        return wishlist.stream().map(this::toDtoWishlistId).collect(Collectors.toSet());
    }
}
