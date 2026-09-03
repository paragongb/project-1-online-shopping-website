package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.domain.User;
import com.paragon.project1.service.dto.ShoppingCartDTO;
import com.paragon.project1.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link ShoppingCart} and its DTO {@link ShoppingCartDTO}.
 */
@Mapper(componentModel = "spring")
public interface ShoppingCartMapper extends EntityMapper<ShoppingCartDTO, ShoppingCart> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    ShoppingCartDTO toDto(ShoppingCart s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
