package com.paragon.project1.service.mapper;

import static com.paragon.project1.domain.CustomerOrderAsserts.*;
import static com.paragon.project1.domain.CustomerOrderTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CustomerOrderMapperTest {

    private CustomerOrderMapper customerOrderMapper;

    @BeforeEach
    void setUp() {
        customerOrderMapper = new CustomerOrderMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCustomerOrderSample1();
        var actual = customerOrderMapper.toEntity(customerOrderMapper.toDto(expected));
        assertCustomerOrderAllPropertiesEquals(expected, actual);
    }
}
