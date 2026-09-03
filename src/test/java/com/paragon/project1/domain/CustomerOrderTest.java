package com.paragon.project1.domain;

import static com.paragon.project1.domain.AddressTestSamples.*;
import static com.paragon.project1.domain.CustomerOrderTestSamples.*;
import static com.paragon.project1.domain.OrderItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.paragon.project1.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CustomerOrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CustomerOrder.class);
        CustomerOrder customerOrder1 = getCustomerOrderSample1();
        CustomerOrder customerOrder2 = new CustomerOrder();
        assertThat(customerOrder1).isNotEqualTo(customerOrder2);

        customerOrder2.setId(customerOrder1.getId());
        assertThat(customerOrder1).isEqualTo(customerOrder2);

        customerOrder2 = getCustomerOrderSample2();
        assertThat(customerOrder1).isNotEqualTo(customerOrder2);
    }

    @Test
    void shippingAddressTest() {
        CustomerOrder customerOrder = getCustomerOrderRandomSampleGenerator();
        Address addressBack = getAddressRandomSampleGenerator();

        customerOrder.setShippingAddress(addressBack);
        assertThat(customerOrder.getShippingAddress()).isEqualTo(addressBack);

        customerOrder.shippingAddress(null);
        assertThat(customerOrder.getShippingAddress()).isNull();
    }

    @Test
    void billingAddressTest() {
        CustomerOrder customerOrder = getCustomerOrderRandomSampleGenerator();
        Address addressBack = getAddressRandomSampleGenerator();

        customerOrder.setBillingAddress(addressBack);
        assertThat(customerOrder.getBillingAddress()).isEqualTo(addressBack);

        customerOrder.billingAddress(null);
        assertThat(customerOrder.getBillingAddress()).isNull();
    }

    @Test
    void orderItemTest() {
        CustomerOrder customerOrder = getCustomerOrderRandomSampleGenerator();
        OrderItem orderItemBack = getOrderItemRandomSampleGenerator();

        customerOrder.addOrderItem(orderItemBack);
        assertThat(customerOrder.getOrderItems()).containsOnly(orderItemBack);
        assertThat(orderItemBack.getOrder()).isEqualTo(customerOrder);

        customerOrder.removeOrderItem(orderItemBack);
        assertThat(customerOrder.getOrderItems()).doesNotContain(orderItemBack);
        assertThat(orderItemBack.getOrder()).isNull();

        customerOrder.orderItems(new HashSet<>(Set.of(orderItemBack)));
        assertThat(customerOrder.getOrderItems()).containsOnly(orderItemBack);
        assertThat(orderItemBack.getOrder()).isEqualTo(customerOrder);

        customerOrder.setOrderItems(new HashSet<>());
        assertThat(customerOrder.getOrderItems()).doesNotContain(orderItemBack);
        assertThat(orderItemBack.getOrder()).isNull();
    }
}
