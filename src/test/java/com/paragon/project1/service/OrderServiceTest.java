package com.paragon.project1.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.paragon.project1.domain.Address;
import com.paragon.project1.domain.CartItem;
import com.paragon.project1.domain.CustomerOrder;
import com.paragon.project1.domain.OrderItem;
import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.enumeration.OrderStatus;
import com.paragon.project1.domain.enumeration.ProductStatus;
import com.paragon.project1.repository.AddressRepository;
import com.paragon.project1.repository.CartItemRepository;
import com.paragon.project1.repository.CustomerOrderRepository;
import com.paragon.project1.repository.OrderItemRepository;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.ShoppingCartRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.service.dto.AddressDTO;
import com.paragon.project1.service.dto.CheckoutAddressRequest;
import com.paragon.project1.service.dto.OrderSummaryView;
import com.paragon.project1.service.mapper.AddressMapper;
import com.paragon.project1.service.mapper.ProductMapper;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private CustomerOrderRepository customerOrderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ShoppingCartRepository shoppingCartRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private AddressMapper addressMapper;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private ProductRepository productRepository;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("alice", "password"));
        orderService = new OrderService(
            cartItemRepository,
            customerOrderRepository,
            orderItemRepository,
            shoppingCartRepository,
            userRepository,
            addressRepository,
            addressMapper,
            productMapper,
            productRepository
        );
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void checkoutCreatesPendingOrderWithAnAddressOwnedByTheCurrentUser() {
        User user = new User();
        user.setId(42L);
        user.setLogin("alice");
        ShoppingCart cart = new ShoppingCart().id(7L).user(user);
        Product product = new Product().id(3L).price(new BigDecimal("12.50")).stockQuantity(5).status(ProductStatus.IN_STOCK);
        CartItem cartItem = new CartItem().id(8L).quantity(2).cart(cart).product(product);
        CheckoutAddressRequest request = checkoutAddressRequest();

        when(userRepository.findOneByLogin("alice")).thenReturn(Optional.of(user));
        when(shoppingCartRepository.findByUserId(42L)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartIdOrderByIdAsc(7L)).thenReturn(List.of(cartItem));
        when(productRepository.findByIdForUpdate(3L)).thenReturn(Optional.of(product));
        when(addressRepository.save(any(Address.class))).thenAnswer(invocation -> {
            Address address = invocation.getArgument(0);
            address.setId(10L);
            return address;
        });
        when(customerOrderRepository.save(any(CustomerOrder.class))).thenAnswer(invocation -> {
            CustomerOrder order = invocation.getArgument(0);
            order.setId(11L);
            return order;
        });
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(invocation -> {
            OrderItem item = invocation.getArgument(0);
            item.setId(12L);
            return item;
        });
        when(addressMapper.toDto(any(Address.class))).thenAnswer(invocation -> {
            Address address = invocation.getArgument(0);
            AddressDTO dto = new AddressDTO();
            dto.setId(address.getId());
            dto.setAddressLine1(address.getAddressLine1());
            return dto;
        });

        OrderSummaryView result = orderService.checkoutCurrentUser(request);

        assertThat(result.getId()).isEqualTo(11L);
        assertThat(result.getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(result.getTotalAmount()).isEqualByComparingTo("25.00");
        assertThat(result.getShippingAddress().getAddressLine1()).isEqualTo("12 Blue Street");
        assertThat(product.getStockQuantity()).isEqualTo(3);
        verify(addressRepository).save(
            org.mockito.ArgumentMatchers.argThat(address -> address.getUser() == user && address.getAddressLine1().equals("12 Blue Street"))
        );
        verify(customerOrderRepository).save(
            org.mockito.ArgumentMatchers.argThat(order -> order.getUser() == user && order.getShippingAddress().getUser() == user)
        );
        verify(cartItemRepository).deleteAll(List.of(cartItem));
    }

    @Test
    void latestDeliveryAddressIsLookedUpOnlyForTheCurrentUser() {
        User user = new User();
        user.setId(42L);
        user.setLogin("alice");
        Address address = new Address().id(10L).addressLine1("12 Blue Street").user(user);
        AddressDTO addressDTO = new AddressDTO();
        addressDTO.setId(10L);

        when(userRepository.findOneByLogin("alice")).thenReturn(Optional.of(user));
        when(addressRepository.findFirstByUserIdOrderByIdDesc(42L)).thenReturn(Optional.of(address));
        when(addressMapper.toDto(address)).thenReturn(addressDTO);

        assertThat(orderService.getMyLatestDeliveryAddress()).contains(addressDTO);
        verify(addressRepository).findFirstByUserIdOrderByIdDesc(42L);
    }

    private CheckoutAddressRequest checkoutAddressRequest() {
        CheckoutAddressRequest request = new CheckoutAddressRequest();
        request.setAddressLine1(" 12 Blue Street ");
        request.setAddressLine2(" ");
        request.setCity("Kuala Lumpur");
        request.setState("Kuala Lumpur");
        request.setPostalCode("50000");
        request.setCountry("Malaysia");
        return request;
    }
}
