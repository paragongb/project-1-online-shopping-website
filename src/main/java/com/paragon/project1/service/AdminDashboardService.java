package com.paragon.project1.service;

import com.paragon.project1.domain.enumeration.OrderStatus;
import com.paragon.project1.domain.enumeration.ProductStatus;
import com.paragon.project1.repository.CartItemRepository;
import com.paragon.project1.repository.CategoryRepository;
import com.paragon.project1.repository.CustomerOrderRepository;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.ReviewRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.repository.WishlistRepository;
import com.paragon.project1.service.dto.AdminDashboardStats;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Builds the business overview used by the administrator dashboard. */
@Service
@Transactional(readOnly = true)
public class AdminDashboardService {

    private static final int LOW_STOCK_THRESHOLD = 5;

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CustomerOrderRepository customerOrderRepository;
    private final ReviewRepository reviewRepository;
    private final CartItemRepository cartItemRepository;
    private final WishlistRepository wishlistRepository;

    public AdminDashboardService(
        UserRepository userRepository,
        ProductRepository productRepository,
        CategoryRepository categoryRepository,
        CustomerOrderRepository customerOrderRepository,
        ReviewRepository reviewRepository,
        CartItemRepository cartItemRepository,
        WishlistRepository wishlistRepository
    ) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.customerOrderRepository = customerOrderRepository;
        this.reviewRepository = reviewRepository;
        this.cartItemRepository = cartItemRepository;
        this.wishlistRepository = wishlistRepository;
    }

    public AdminDashboardStats getDashboardStats() {
        Instant now = Instant.now();
        ZoneId zone = ZoneId.systemDefault();
        LocalDate currentDate = LocalDate.now(zone);
        Instant startOfToday = currentDate.atStartOfDay(zone).toInstant();
        Instant startOfWeek = currentDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)).atStartOfDay(zone).toInstant();
        Instant startOfMonth = currentDate.withDayOfMonth(1).atStartOfDay(zone).toInstant();

        AdminDashboardStats.Overview overview = new AdminDashboardStats.Overview(
            userRepository.count(),
            productRepository.count(),
            categoryRepository.count(),
            customerOrderRepository.count(),
            customerOrderRepository.sumRevenueExcludingStatus(OrderStatus.CANCELLED),
            reviewRepository.count(),
            reviewRepository.averageRating(),
            cartItemRepository.count(),
            wishlistRepository.count()
        );

        AdminDashboardStats.Catalog catalog = new AdminDashboardStats.Catalog(
            productRepository.countByStatus(ProductStatus.IN_STOCK),
            productRepository.countByStockQuantityBetween(1, LOW_STOCK_THRESHOLD),
            productRepository.countByStatus(ProductStatus.OUT_OF_STOCK),
            productRepository.countByStatus(ProductStatus.PRE_ORDER)
        );

        AdminDashboardStats.OrderStatuses orderStatuses = new AdminDashboardStats.OrderStatuses(
            customerOrderRepository.countByStatus(OrderStatus.PENDING),
            customerOrderRepository.countByStatus(OrderStatus.PAID),
            customerOrderRepository.countByStatus(OrderStatus.PROCESSING),
            customerOrderRepository.countByStatus(OrderStatus.SHIPPED),
            customerOrderRepository.countByStatus(OrderStatus.DELIVERED),
            customerOrderRepository.countByStatus(OrderStatus.CANCELLED)
        );

        return new AdminDashboardStats(
            now,
            overview,
            periodSince(startOfToday),
            periodSince(startOfWeek),
            periodSince(startOfMonth),
            catalog,
            orderStatuses
        );
    }

    private AdminDashboardStats.Period periodSince(Instant startDate) {
        return new AdminDashboardStats.Period(
            customerOrderRepository.countByPlacedDateGreaterThanEqual(startDate),
            customerOrderRepository.sumRevenueSinceExcludingStatus(startDate, OrderStatus.CANCELLED),
            userRepository.countByCreatedDateGreaterThanEqual(startDate),
            reviewRepository.countByReviewDateGreaterThanEqual(startDate)
        );
    }
}
