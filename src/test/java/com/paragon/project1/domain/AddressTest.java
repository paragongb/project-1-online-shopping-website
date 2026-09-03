package com.paragon.project1.domain;

import static com.paragon.project1.domain.AddressTestSamples.*;
import static com.paragon.project1.domain.CustomerOrderTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.paragon.project1.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AddressTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Address.class);
        Address address1 = getAddressSample1();
        Address address2 = new Address();
        assertThat(address1).isNotEqualTo(address2);

        address2.setId(address1.getId());
        assertThat(address1).isEqualTo(address2);

        address2 = getAddressSample2();
        assertThat(address1).isNotEqualTo(address2);
    }

    @Test
    void shippingOrderTest() {
        Address address = getAddressRandomSampleGenerator();
        CustomerOrder customerOrderBack = getCustomerOrderRandomSampleGenerator();

        address.setShippingOrder(customerOrderBack);
        assertThat(address.getShippingOrder()).isEqualTo(customerOrderBack);
        assertThat(customerOrderBack.getShippingAddress()).isEqualTo(address);

        address.shippingOrder(null);
        assertThat(address.getShippingOrder()).isNull();
        assertThat(customerOrderBack.getShippingAddress()).isNull();
    }

    @Test
    void billingOrderTest() {
        Address address = getAddressRandomSampleGenerator();
        CustomerOrder customerOrderBack = getCustomerOrderRandomSampleGenerator();

        address.setBillingOrder(customerOrderBack);
        assertThat(address.getBillingOrder()).isEqualTo(customerOrderBack);
        assertThat(customerOrderBack.getBillingAddress()).isEqualTo(address);

        address.billingOrder(null);
        assertThat(address.getBillingOrder()).isNull();
        assertThat(customerOrderBack.getBillingAddress()).isNull();
    }
}
