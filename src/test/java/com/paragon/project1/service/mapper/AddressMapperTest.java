package com.paragon.project1.service.mapper;

import static com.paragon.project1.domain.AddressAsserts.*;
import static com.paragon.project1.domain.AddressTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.paragon.project1.domain.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AddressMapperTest {

    private AddressMapper addressMapper;

    @BeforeEach
    void setUp() {
        addressMapper = new AddressMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAddressSample1();
        var actual = addressMapper.toEntity(addressMapper.toDto(expected));
        assertAddressAllPropertiesEquals(expected, actual);
    }

    @Test
    void shouldIncludeTheAddressOwnerLogin() {
        User owner = new User();
        owner.setId(42L);
        owner.setLogin("alice");

        var dto = addressMapper.toDto(getAddressSample1().user(owner));

        assertThat(dto.getUser().getId()).isEqualTo(42L);
        assertThat(dto.getUser().getLogin()).isEqualTo("alice");
    }
}
