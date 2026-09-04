package com.paragon.project1.service;

import com.paragon.project1.domain.CartItem;
import com.paragon.project1.domain.CustomerOrder;
import com.paragon.project1.domain.OrderItem;
import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.enumeration.OrderStatus;
import com.paragon.project1.repository.CartItemRepository;
import com.paragon.project1.repository.CustomerOrderRepository;
import com.paragon.project1.repository.OrderItemRepository;
import com.paragon.project1.service.dto.OrderItemView;
import com.paragon.project1.service.dto.OrderSummaryView;
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

    private final ProductMapper productMapper;

    public OrderService(
        CartItemRepository cartItemRepository,
        CustomerOrderRepository customerOrderRepository,
        OrderItemRepository orderItemRepository,
        ProductMapper productMapper
    ) {
        this.cartItemRepository = cartItemRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productMapper = productMapper;
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

        BigDecimal totalAmount = cartItems
            .stream()
            .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        CustomerOrder order = new CustomerOrder();
        order.setPlacedDate(Instant.now());
        order.setStatus(OrderStatus.PROCESSING);
        order.setTotalAmount(totalAmount);
        order.setUser(user);
        order = customerOrderRepository.save(order);

        CustomerOrder savedOrder = order;
        List<OrderItem> orderItems = cartItems
            .stream()
            .map(cartItem -> {
                OrderItem orderItem = new OrderItem();
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setPriceAtPurchase(cartItem.getProduct().getPrice());
                orderItem.setProduct(cartItem.getProduct());
                orderItem.setOrder(savedOrder);
                return orderItemRepository.save(orderItem);
            })
            .toList();

        cartItemRepository.deleteAll(cartItems);
        LOG.debug("Confirmed order {} for user {} from cart {}", savedOrder.getId(), user.getLogin(), cart.getId());

        return toSummaryView(savedOrder, orderItems);
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
        view.setItems(orderItems.stream().map(this::toItemView).toList());
        return view;
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
