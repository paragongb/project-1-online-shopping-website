package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.Review;
import com.paragon.project1.domain.User;
import com.paragon.project1.service.dto.ProductDTO;
import com.paragon.project1.service.dto.ReviewDTO;
import com.paragon.project1.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Review} and its DTO {@link ReviewDTO}.
 */
@Mapper(componentModel = "spring")
public interface ReviewMapper extends EntityMapper<ReviewDTO, Review> {
    @Mapping(target = "product", source = "product", qualifiedByName = "productName")
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    ReviewDTO toDto(Review s);

    @Named("productName")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    ProductDTO toDtoProductName(Product product);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
