package com.paragon.project1.service.mapper;

import com.paragon.project1.domain.Address;
import com.paragon.project1.domain.User;
import com.paragon.project1.service.dto.AddressDTO;
import com.paragon.project1.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Address} and its DTO {@link AddressDTO}.
 */
@Mapper(componentModel = "spring")
public interface AddressMapper extends EntityMapper<AddressDTO, Address> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userIdentity")
    AddressDTO toDto(Address address);

    @Named("userIdentity")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    @Mapping(target = "login", source = "login")
    UserDTO toDtoUserIdentity(User user);
}
