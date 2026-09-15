package com.paragon.project1.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.Review;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.enumeration.OrderStatus;
import com.paragon.project1.repository.OrderItemRepository;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.ReviewRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.service.dto.ProductDTO;
import com.paragon.project1.service.dto.ReviewDTO;
import com.paragon.project1.service.mapper.ReviewMapper;
import com.paragon.project1.web.rest.errors.BadRequestAlertException;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private ReviewMapper reviewMapper;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    private ReviewService reviewService;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken("alice", "password"));
        reviewService = new ReviewService(reviewRepository, reviewMapper, userRepository, productRepository, orderItemRepository);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void saveUsesCurrentUserAndRequiresDeliveredOrder() {
        User user = new User();
        user.setId(42L);
        user.setLogin("alice");
        Product product = new Product().id(3L);
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(3L);
        ReviewDTO request = new ReviewDTO();
        request.setRating(5);
        request.setComment("Excellent");
        request.setProduct(productDTO);

        when(userRepository.findOneByLogin("alice")).thenReturn(Optional.of(user));
        when(productRepository.findById(3L)).thenReturn(Optional.of(product));
        when(orderItemRepository.existsByOrderUserIdAndProductIdAndOrderStatus(42L, 3L, OrderStatus.DELIVERED)).thenReturn(true);
        when(reviewRepository.existsByProductIdAndUserId(3L, 42L)).thenReturn(false);
        when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(reviewMapper.toDto(any(Review.class))).thenReturn(request);

        reviewService.save(request);

        verify(reviewRepository).save(
            org.mockito.ArgumentMatchers.argThat(
                review -> review.getUser() == user && review.getProduct() == product && review.getReviewDate() != null
            )
        );
    }

    @Test
    void saveRejectsProductThatWasNotDeliveredToCurrentUser() {
        User user = new User();
        user.setId(42L);
        user.setLogin("alice");
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(3L);
        ReviewDTO request = new ReviewDTO();
        request.setRating(4);
        request.setProduct(productDTO);

        when(userRepository.findOneByLogin("alice")).thenReturn(Optional.of(user));
        when(productRepository.findById(3L)).thenReturn(Optional.of(new Product().id(3L)));
        when(orderItemRepository.existsByOrderUserIdAndProductIdAndOrderStatus(42L, 3L, OrderStatus.DELIVERED)).thenReturn(false);

        assertThatThrownBy(() -> reviewService.save(request))
            .isInstanceOf(BadRequestAlertException.class)
            .hasMessageContaining("after an order containing it is delivered");
        verify(reviewRepository, never()).save(any());
    }

    @Test
    void deleteRejectsAnotherUsersReview() {
        User owner = new User();
        owner.setLogin("bob");
        Review review = new Review().id(9L).user(owner);
        when(reviewRepository.findById(9L)).thenReturn(Optional.of(review));

        assertThatThrownBy(() -> reviewService.delete(9L)).isInstanceOf(AccessDeniedException.class);
        verify(reviewRepository, never()).delete(any());
        assertThat(SecurityContextHolder.getContext().getAuthentication().getName()).isEqualTo("alice");
    }
}
