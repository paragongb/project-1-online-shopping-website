package com.paragon.project1.service;

import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.Review;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.enumeration.OrderStatus;
import com.paragon.project1.repository.OrderItemRepository;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.ReviewRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.security.AuthoritiesConstants;
import com.paragon.project1.security.SecurityUtils;
import com.paragon.project1.service.dto.ReviewDTO;
import com.paragon.project1.service.mapper.ReviewMapper;
import com.paragon.project1.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.paragon.project1.domain.Review}.
 */
@Service
@Transactional
public class ReviewService {

    private static final Logger LOG = LoggerFactory.getLogger(ReviewService.class);

    private final ReviewRepository reviewRepository;

    private final ReviewMapper reviewMapper;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final OrderItemRepository orderItemRepository;

    public ReviewService(
        ReviewRepository reviewRepository,
        ReviewMapper reviewMapper,
        UserRepository userRepository,
        ProductRepository productRepository,
        OrderItemRepository orderItemRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * Save a review.
     *
     * @param reviewDTO the entity to save.
     * @return the persisted entity.
     */
    public ReviewDTO save(ReviewDTO reviewDTO) {
        LOG.debug("Request to save Review : {}", reviewDTO);
        if (reviewDTO.getProduct() == null || reviewDTO.getProduct().getId() == null) {
            throw new BadRequestAlertException("A product is required", "review", "productrequired");
        }

        User currentUser = getCurrentUser();
        Long productId = reviewDTO.getProduct().getId();
        Product product = productRepository
            .findById(productId)
            .orElseThrow(() -> new BadRequestAlertException("Product not found", "review", "productnotfound"));

        if (!orderItemRepository.existsByOrderUserIdAndProductIdAndOrderStatus(currentUser.getId(), productId, OrderStatus.DELIVERED)) {
            throw new BadRequestAlertException(
                "You can review this product after an order containing it is delivered",
                "review",
                "productnotdelivered"
            );
        }
        if (reviewRepository.existsByProductIdAndUserId(productId, currentUser.getId())) {
            throw new BadRequestAlertException("You have already reviewed this product", "review", "alreadyreviewed");
        }

        Review review = new Review();
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review.setReviewDate(Instant.now());
        review.setProduct(product);
        review.setUser(currentUser);
        review = reviewRepository.save(review);
        return reviewMapper.toDto(review);
    }

    /**
     * Update a review.
     *
     * @param reviewDTO the entity to save.
     * @return the persisted entity.
     */
    public ReviewDTO update(ReviewDTO reviewDTO) {
        LOG.debug("Request to update Review : {}", reviewDTO);
        Review review = getReviewForModification(reviewDTO.getId());
        review.setRating(reviewDTO.getRating());
        review.setComment(reviewDTO.getComment());
        review = reviewRepository.save(review);
        return reviewMapper.toDto(review);
    }

    /**
     * Partially update a review.
     *
     * @param reviewDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ReviewDTO> partialUpdate(ReviewDTO reviewDTO) {
        LOG.debug("Request to partially update Review : {}", reviewDTO);

        if (!reviewRepository.existsById(reviewDTO.getId())) {
            return Optional.empty();
        }
        Review review = getReviewForModification(reviewDTO.getId());
        if (reviewDTO.getRating() != null) {
            review.setRating(reviewDTO.getRating());
        }
        if (reviewDTO.getComment() != null) {
            review.setComment(reviewDTO.getComment());
        }
        return Optional.of(reviewMapper.toDto(reviewRepository.save(review)));
    }

    /**
     * Get all the reviews.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<ReviewDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Reviews");
        return reviewRepository.findAll(pageable).map(reviewMapper::toDto);
    }

    /**
     * Get all the reviews with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<ReviewDTO> findAllWithEagerRelationships(Pageable pageable) {
        return reviewRepository.findAllWithEagerRelationships(pageable).map(reviewMapper::toDto);
    }

    /** Get reviews matching the optional admin product and date filters. */
    @Transactional(readOnly = true)
    public Page<ReviewDTO> findAllWithFilters(Long productId, Instant reviewedFrom, Instant reviewedBefore, Pageable pageable) {
        return reviewRepository.findAllWithFilters(productId, reviewedFrom, reviewedBefore, pageable).map(reviewMapper::toDto);
    }

    /** Get the currently authenticated user's reviews, including their products. */
    @Transactional(readOnly = true)
    public List<ReviewDTO> findAllByCurrentUser() {
        return reviewRepository.findByUserIsCurrentUser().stream().map(reviewMapper::toDto).toList();
    }

    /**
     * Get one review by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ReviewDTO> findOne(Long id) {
        LOG.debug("Request to get Review : {}", id);
        return reviewRepository.findOneWithEagerRelationships(id).map(review -> {
            assertOwnerOrAdmin(review);
            return reviewMapper.toDto(review);
        });
    }

    /**
     * Delete the review by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Review : {}", id);
        Review review = getReviewForModification(id);
        reviewRepository.delete(review);
    }

    private Review getReviewForModification(Long id) {
        Review review = reviewRepository
            .findById(id)
            .orElseThrow(() -> new BadRequestAlertException("Review not found", "review", "idnotfound"));
        assertOwnerOrAdmin(review);
        return review;
    }

    private void assertOwnerOrAdmin(Review review) {
        if (SecurityUtils.hasCurrentUserThisAuthority(AuthoritiesConstants.ADMIN)) {
            return;
        }
        String currentLogin = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new AccessDeniedException("Authentication is required")
        );
        if (review.getUser() == null || !currentLogin.equals(review.getUser().getLogin())) {
            throw new AccessDeniedException("You can only access your own reviews");
        }
    }

    private User getCurrentUser() {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() -> new AccessDeniedException("Authentication is required"));
        return userRepository
            .findOneByLogin(login)
            .orElseThrow(() -> new BadRequestAlertException("User not found", "review", "usernotfound"));
    }
}
