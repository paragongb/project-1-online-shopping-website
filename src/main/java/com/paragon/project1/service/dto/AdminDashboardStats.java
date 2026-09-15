package com.paragon.project1.service.dto;

import java.math.BigDecimal;
import java.time.Instant;

/** Read-only statistics displayed on the administrator home dashboard. */
public record AdminDashboardStats(
    Instant generatedAt,
    Overview overview,
    Period today,
    Period week,
    Period month,
    Catalog catalog,
    OrderStatuses orderStatuses
) {
    public record Overview(
        long users,
        long products,
        long categories,
        long orders,
        BigDecimal revenue,
        long reviews,
        double averageRating,
        long cartItems,
        long wishlists
    ) {}

    public record Period(long orders, BigDecimal revenue, long newUsers, long reviews) {}

    public record Catalog(long inStock, long lowStock, long outOfStock, long preOrder) {}

    public record OrderStatuses(long pending, long paid, long processing, long shipped, long delivered, long cancelled) {}
}
