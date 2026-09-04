package com.paragon.project1.web.rest;

import com.paragon.project1.security.AuthoritiesConstants;
import com.paragon.project1.service.OrderService;
import com.paragon.project1.service.dto.OrderItemView;
import com.paragon.project1.service.dto.OrderSummaryView;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for confirming cart orders (admin) and listing the current user's own orders.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrderResource.class);

    private final OrderService orderService;

    public OrderResource(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * {@code POST  /api/orders/confirm-cart/:cartItemId} : confirms the whole cart that the given
     * cart item belongs to, moving all of its items into a single new order.
     */
    @PostMapping("/confirm-cart/{cartItemId}")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<OrderSummaryView> confirmCartOrder(@PathVariable Long cartItemId) {
        LOG.debug("REST request to confirm the cart order for cart item {}", cartItemId);
        return ResponseEntity.ok(orderService.confirmCartOrder(cartItemId));
    }

    /**
     * {@code GET  /api/orders/my-orders} : get the current user's own orders (any status).
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderSummaryView>> getMyOrders() {
        LOG.debug("REST request to get the current user's orders");
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    /**
     * {@code GET  /api/orders/:orderId/items} : get the items belonging to the given order (admin only).
     */
    @GetMapping("/{orderId}/items")
    @PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
    public ResponseEntity<List<OrderItemView>> getOrderItems(@PathVariable Long orderId) {
        LOG.debug("REST request to get the items for order {}", orderId);
        return ResponseEntity.ok(orderService.getOrderItems(orderId));
    }
}
