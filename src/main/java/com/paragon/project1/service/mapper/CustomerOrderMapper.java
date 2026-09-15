package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.Address;
import com.paragon.project1.domain.CustomerOrder;
import com.paragon.project1.domain.User;
import com.paragon.project1.service.dto.AddressDTO;
import com.paragon.project1.service.dto.CustomerOrderDTO;
import com.paragon.project1.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link CustomerOrder} and its DTO {@link CustomerOrderDTO}.
 */
@Mapper(componentModel = "spring")
public interface CustomerOrderMapper extends EntityMapper<CustomerOrderDTO, CustomerOrder> {
    @Mapping(target = "shippingAddress", source = "shippingAddress")
    @Mapping(target = "billingAddress", source = "billingAddress")
    @Mapping(target = "user", source = "user", qualifiedByName = "userLogin")
    CustomerOrderDTO toDto(CustomerOrder s);

    @Named("userLogin")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserLogin(User user);
}
