package com.paragon.project1.service;

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
import com.paragon.project1.security.SecurityUtils;
import com.paragon.project1.service.dto.AddressDTO;
import com.paragon.project1.service.dto.CheckoutAddressRequest;
import com.paragon.project1.service.dto.OrderItemView;
import com.paragon.project1.service.dto.OrderSummaryView;
import com.paragon.project1.service.mapper.AddressMapper;
import com.paragon.project1.service.mapper.ProductMapper;
import com.paragon.project1.web.rest.errors.BadRequestAlertException;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for confirming a customer's cart into an order (admin action, no real payment
 * gateway - the seller confirms the transaction happened e.g. over WhatsApp) and for
 * listing the current user's own orders.
 */
@Service
@Transactional
public class OrderService {

    private static final Logger LOG = LoggerFactory.getLogger(OrderService.class);

    private final CartItemRepository cartItemRepository;

    private final CustomerOrderRepository customerOrderRepository;

    private final OrderItemRepository orderItemRepository;

    private final ShoppingCartRepository shoppingCartRepository;

    private final UserRepository userRepository;

    private final AddressRepository addressRepository;

    private final AddressMapper addressMapper;

    private final ProductMapper productMapper;

    private final ProductRepository productRepository;

    public OrderService(
        CartItemRepository cartItemRepository,
        CustomerOrderRepository customerOrderRepository,
        OrderItemRepository orderItemRepository,
        ShoppingCartRepository shoppingCartRepository,
        UserRepository userRepository,
        AddressRepository addressRepository,
        AddressMapper addressMapper,
        ProductMapper productMapper,
        ProductRepository productRepository
    ) {
        this.cartItemRepository = cartItemRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.orderItemRepository = orderItemRepository;
        this.shoppingCartRepository = shoppingCartRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.addressMapper = addressMapper;
        this.productMapper = productMapper;
        this.productRepository = productRepository;
    }

    /**
     * Creates an order from the authenticated customer's cart and stores an address
     * snapshot owned by that customer. The latest snapshot is reused only as a
     * private prefill for that same customer's next checkout.
     */
    public OrderSummaryView checkoutCurrentUser(CheckoutAddressRequest request) {
        User user = getCurrentUser();
        ShoppingCart cart = shoppingCartRepository
            .findByUserId(user.getId())
            .orElseThrow(() -> new BadRequestAlertException("Cart is empty", "customerOrder", "cartempty"));
        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByIdAsc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestAlertException("Cart is empty", "customerOrder", "cartempty");
        }

        Address deliveryAddress = new Address();
        deliveryAddress.setAddressLine1(request.getAddressLine1().trim());
        deliveryAddress.setAddressLine2(trimToNull(request.getAddressLine2()));
        deliveryAddress.setCity(request.getCity().trim());
        deliveryAddress.setState(request.getState().trim());
        deliveryAddress.setPostalCode(request.getPostalCode().trim());
        deliveryAddress.setCountry(request.getCountry().trim());
        deliveryAddress.setUser(user);
        deliveryAddress = addressRepository.save(deliveryAddress);

        return createOrderFromCart(cart, cartItems, user, OrderStatus.PENDING, deliveryAddress);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<AddressDTO> getMyLatestDeliveryAddress() {
        User user = getCurrentUser();
        return addressRepository.findFirstByUserIdOrderByIdDesc(user.getId()).map(addressMapper::toDto);
    }

    /**
     * Confirms the entire cart that the given cart item belongs to: moves every item in
     * that cart into a single new {@link CustomerOrder}, then clears the cart.
     */
    public OrderSummaryView confirmCartOrder(Long cartItemId) {
        CartItem clickedItem = cartItemRepository
            .findById(cartItemId)
            .orElseThrow(() -> new BadRequestAlertException("Cart item not found", "cartItem", "idnotfound"));
        ShoppingCart cart = clickedItem.getCart();
        if (cart == null) {
            throw new BadRequestAlertException("Cart item has no cart", "cartItem", "nocart");
        }
        User user = cart.getUser();
        if (user == null) {
            throw new BadRequestAlertException("Cart has no owning user", "cartItem", "nouser");
        }

        List<CartItem> cartItems = cartItemRepository.findByCartIdOrderByIdAsc(cart.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestAlertException("Cart is empty", "cartItem", "cartempty");
        }

        return createOrderFromCart(cart, cartItems, user, OrderStatus.PROCESSING, null);
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryView> getMyOrders() {
        List<OrderItem> orderItems = orderItemRepository.findByOrderUserIsCurrentUser();

        Map<Long, OrderSummaryView> ordersById = new LinkedHashMap<>();
        for (OrderItem orderItem : orderItems) {
            CustomerOrder order = orderItem.getOrder();
            OrderSummaryView view = ordersById.computeIfAbsent(order.getId(), id -> {
                OrderSummaryView summary = new OrderSummaryView();
                summary.setId(order.getId());
                summary.setPlacedDate(order.getPlacedDate());
                summary.setStatus(order.getStatus());
                summary.setTotalAmount(order.getTotalAmount());
                summary.setShippingAddress(addressMapper.toDto(order.getShippingAddress()));
                summary.setItems(new java.util.ArrayList<>());
                return summary;
            });
            view.getItems().add(toItemView(orderItem));
        }
        return List.copyOf(ordersById.values());
    }

    @Transactional(readOnly = true)
    public List<OrderItemView> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream().map(this::toItemView).toList();
    }

    private OrderSummaryView toSummaryView(CustomerOrder order, List<OrderItem> orderItems) {
        OrderSummaryView view = new OrderSummaryView();
        view.setId(order.getId());
        view.setPlacedDate(order.getPlacedDate());
        view.setStatus(order.getStatus());
        view.setTotalAmount(order.getTotalAmount());
        view.setShippingAddress(addressMapper.toDto(order.getShippingAddress()));
        view.setItems(orderItems.stream().map(this::toItemView).toList());
        return view;
    }

    private OrderSummaryView createOrderFromCart(
        ShoppingCart cart,
        List<CartItem> cartItems,
        User user,
        OrderStatus status,
        Address deliveryAddress
    ) {
        Map<Long, Product> productsByCartItemId = new LinkedHashMap<>();
        for (CartItem cartItem : cartItems) {
            Product product = productRepository
                .findByIdForUpdate(cartItem.getProduct().getId())
                .orElseThrow(() -> new BadRequestAlertException("Product not found", "customerOrder", "productnotfound"));
            reserveInventory(product, cartItem.getQuantity());
            productsByCartItemId.put(cartItem.getId(), product);
        }

        BigDecimal totalAmount = cartItems
            .stream()
            .map(item -> productsByCartItemId.get(item.getId()).getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        CustomerOrder order = new CustomerOrder();
        order.setPlacedDate(Instant.now());
        order.setStatus(status);
        order.setTotalAmount(totalAmount);
        order.setUser(user);
        order.setShippingAddress(deliveryAddress);
        order = customerOrderRepository.save(order);

        CustomerOrder savedOrder = order;
        List<OrderItem> orderItems = cartItems
            .stream()
            .map(cartItem -> {
                Product product = productsByCartItemId.get(cartItem.getId());
                OrderItem orderItem = new OrderItem();
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPriceAtPurchase(product.getPrice());
                orderItem.setProduct(product);
                orderItem.setOrder(savedOrder);
                return orderItemRepository.save(orderItem);
            })
            .toList();

        cartItemRepository.deleteAll(cartItems);
        LOG.debug("Created order {} for user {} from cart {}", savedOrder.getId(), user.getLogin(), cart.getId());
        return toSummaryView(savedOrder, orderItems);
    }

    private void reserveInventory(Product product, int requestedQuantity) {
        if (product.getStatus() == ProductStatus.OUT_OF_STOCK) {
            throw new BadRequestAlertException("A product in this cart is out of stock", "customerOrder", "outofstock");
        }
        // PRE_ORDER products do not consume on-hand inventory.
        if (product.getStatus() == ProductStatus.PRE_ORDER) {
            return;
        }

        int availableQuantity = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
        if (requestedQuantity > availableQuantity) {
            throw new BadRequestAlertException("There is not enough stock to complete this order", "customerOrder", "insufficientstock");
        }

        int remainingQuantity = availableQuantity - requestedQuantity;
        product.setStockQuantity(remainingQuantity);
        product.setStatus(remainingQuantity == 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.IN_STOCK);
        productRepository.save(product);
    }

    private User getCurrentUser() {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User is not authenticated", "customerOrder", "usernotfound")
        );
        return userRepository
            .findOneByLogin(login)
            .orElseThrow(() -> new BadRequestAlertException("User not found", "customerOrder", "usernotfound"));
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private OrderItemView toItemView(OrderItem orderItem) {
        return new OrderItemView(
            orderItem.getId(),
            orderItem.getQuantity(),
            orderItem.getPriceAtPurchase(),
            productMapper.toDto(orderItem.getProduct())
        );
    }
}
