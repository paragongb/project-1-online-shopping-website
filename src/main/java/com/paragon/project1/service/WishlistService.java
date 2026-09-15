package com.paragon.project1.service;

import com.paragon.project1.domain.Product;
import com.paragon.project1.domain.User;
import com.paragon.project1.domain.Wishlist;
import com.paragon.project1.repository.ProductRepository;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.repository.WishlistRepository;
import com.paragon.project1.security.SecurityUtils;
import com.paragon.project1.service.dto.WishlistDTO;
import com.paragon.project1.service.dto.WishlistView;
import com.paragon.project1.service.mapper.ProductMapper;
import com.paragon.project1.service.mapper.WishlistMapper;
import com.paragon.project1.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.paragon.project1.domain.Wishlist}.
 */
@Service
@Transactional
public class WishlistService {

    private static final Logger LOG = LoggerFactory.getLogger(WishlistService.class);

    private final WishlistRepository wishlistRepository;

    private final WishlistMapper wishlistMapper;

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    public WishlistService(
        WishlistRepository wishlistRepository,
        WishlistMapper wishlistMapper,
        UserRepository userRepository,
        ProductRepository productRepository,
        ProductMapper productMapper
    ) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistMapper = wishlistMapper;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    /** Return the current user's wishlist, creating it on first use. */
    public WishlistView getCurrentUserWishlist() {
        return toView(getOrCreateCurrentUserWishlist());
    }

    /** Add one product to the current user's wishlist. Existing entries are left unchanged. */
    public WishlistView addProductForCurrentUser(Long productId) {
        Wishlist wishlist = getOrCreateCurrentUserWishlist();
        Product product = productRepository
            .findById(productId)
            .orElseThrow(() -> new BadRequestAlertException("Product not found", "wishlist", "productnotfound"));
        wishlist.addProduct(product);
        wishlistRepository.save(wishlist);
        return toView(wishlist);
    }

    /** Remove one product from the current user's wishlist. */
    public WishlistView removeProductForCurrentUser(Long productId) {
        Wishlist wishlist = getOrCreateCurrentUserWishlist();
        Product product = productRepository
            .findById(productId)
            .orElseThrow(() -> new BadRequestAlertException("Product not found", "wishlist", "productnotfound"));
        wishlist.removeProduct(product);
        wishlistRepository.save(wishlist);
        return toView(wishlist);
    }

    private Wishlist getOrCreateCurrentUserWishlist() {
        User user = getCurrentUser();
        return wishlistRepository.findByUserId(user.getId()).orElseGet(() -> {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setCreatedDate(Instant.now());
            return wishlistRepository.save(wishlist);
        });
    }

    private User getCurrentUser() {
        String login = SecurityUtils.getCurrentUserLogin().orElseThrow(() ->
            new BadRequestAlertException("User is not authenticated", "wishlist", "usernotfound")
        );
        return userRepository
            .findOneByLogin(login)
            .orElseThrow(() -> new BadRequestAlertException("User not found", "wishlist", "usernotfound"));
    }

    private WishlistView toView(Wishlist wishlist) {
        WishlistView view = new WishlistView();
        view.setId(wishlist.getId());
        view.setProducts(wishlist.getProducts().stream().map(productMapper::toDto).toList());
        return view;
    }

    /**
     * Save a wishlist.
     *
     * @param wishlistDTO the entity to save.
     * @return the persisted entity.
     */
    public WishlistDTO save(WishlistDTO wishlistDTO) {
        LOG.debug("Request to save Wishlist : {}", wishlistDTO);
        Wishlist wishlist = wishlistMapper.toEntity(wishlistDTO);
        wishlist = wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(wishlist);
    }

    /**
     * Update a wishlist.
     *
     * @param wishlistDTO the entity to save.
     * @return the persisted entity.
     */
    public WishlistDTO update(WishlistDTO wishlistDTO) {
        LOG.debug("Request to update Wishlist : {}", wishlistDTO);
        Wishlist wishlist = wishlistMapper.toEntity(wishlistDTO);
        wishlist = wishlistRepository.save(wishlist);
        return wishlistMapper.toDto(wishlist);
    }

    /**
     * Partially update a wishlist.
     *
     * @param wishlistDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<WishlistDTO> partialUpdate(WishlistDTO wishlistDTO) {
        LOG.debug("Request to partially update Wishlist : {}", wishlistDTO);

        return wishlistRepository
            .findById(wishlistDTO.getId())
            .map(existingWishlist -> {
                wishlistMapper.partialUpdate(existingWishlist, wishlistDTO);

                return existingWishlist;
            })
            .map(wishlistRepository::save)
            .map(wishlistMapper::toDto);
    }

    /**
     * Get all the wishlists.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<WishlistDTO> findAll() {
        LOG.debug("Request to get all Wishlists");
        return wishlistRepository.findAll().stream().map(wishlistMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the wishlists with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public List<WishlistDTO> findAllWithEagerRelationships() {
        return wishlistRepository
            .findAllWithEagerRelationships()
            .stream()
            .map(wishlistMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one wishlist by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<WishlistDTO> findOne(Long id) {
        LOG.debug("Request to get Wishlist : {}", id);
        return wishlistRepository.findOneWithEagerRelationships(id).map(wishlistMapper::toDto);
    }

    /**
     * Delete the wishlist by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Wishlist : {}", id);
        wishlistRepository.deleteById(id);
    }
}
