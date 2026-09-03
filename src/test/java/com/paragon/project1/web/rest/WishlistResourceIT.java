package com.paragon.project1.web.rest;

import static com.paragon.project1.domain.WishlistAsserts.*;
import static com.paragon.project1.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.paragon.project1.IntegrationTest;
import com.paragon.project1.domain.Wishlist;
import com.paragon.project1.repository.UserRepository;
import com.paragon.project1.repository.WishlistRepository;
import com.paragon.project1.service.WishlistService;
import com.paragon.project1.service.dto.WishlistDTO;
import com.paragon.project1.service.mapper.WishlistMapper;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

/**
 * Integration tests for the {@link WishlistResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class WishlistResourceIT {

    private static final Instant DEFAULT_CREATED_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_CREATED_DATE = Instant.ofEpochMilli(1788406036041L);

    private static final String ENTITY_API_URL = "/api/wishlists";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + 2L * Integer.MAX_VALUE);

    @Autowired
    private ObjectMapper om;

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Mock
    private WishlistRepository wishlistRepositoryMock;

    @Autowired
    private WishlistMapper wishlistMapper;

    @Mock
    private WishlistService wishlistServiceMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWishlistMockMvc;

    private Wishlist wishlist;

    private Wishlist insertedWishlist;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Wishlist createEntity() {
        return new Wishlist().createdDate(DEFAULT_CREATED_DATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Wishlist createUpdatedEntity() {
        return new Wishlist().createdDate(UPDATED_CREATED_DATE);
    }

    @BeforeEach
    void initTest() {
        wishlist = createEntity();
    }

    @AfterEach
    void cleanup() {
        if (insertedWishlist != null) {
            wishlistRepository.delete(insertedWishlist);
            insertedWishlist = null;
        }
    }

    @Test
    @Transactional
    void createWishlist() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);
        var returnedWishlistDTO = om.readValue(
            restWishlistMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(wishlistDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            WishlistDTO.class
        );

        // Validate the Wishlist in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedWishlist = wishlistMapper.toEntity(returnedWishlistDTO);
        assertWishlistUpdatableFieldsEquals(returnedWishlist, getPersistedWishlist(returnedWishlist));

        insertedWishlist = returnedWishlist;
    }

    @Test
    @Transactional
    void createWishlistWithExistingId() throws Exception {
        // Create the Wishlist with an existing ID
        wishlist.setId(1L);
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWishlistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(wishlistDTO)))
            .andExpect(status().isBadRequest());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkCreatedDateIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        wishlist.setCreatedDate(null);

        // Create the Wishlist, which fails.
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        restWishlistMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(wishlistDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWishlists() throws Exception {
        // Initialize the database
        insertedWishlist = wishlistRepository.saveAndFlush(wishlist);

        // Get all the wishlistList
        restWishlistMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(wishlist.getId().intValue())))
            .andExpect(jsonPath("$.[*].createdDate").value(hasItem(DEFAULT_CREATED_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWishlistsWithEagerRelationshipsIsEnabled() throws Exception {
        when(wishlistServiceMock.findAllWithEagerRelationships()).thenReturn(new ArrayList<>());

        restWishlistMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(wishlistServiceMock, times(1)).findAllWithEagerRelationships();
    }

    @SuppressWarnings({ "unchecked" })
    void getAllWishlistsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(wishlistServiceMock.findAllWithEagerRelationships()).thenReturn(new ArrayList<>());

        restWishlistMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(wishlistRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getWishlist() throws Exception {
        // Initialize the database
        insertedWishlist = wishlistRepository.saveAndFlush(wishlist);

        // Get the wishlist
        restWishlistMockMvc
            .perform(get(ENTITY_API_URL_ID, wishlist.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(wishlist.getId().intValue()))
            .andExpect(jsonPath("$.createdDate").value(DEFAULT_CREATED_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWishlist() throws Exception {
        // Get the wishlist
        restWishlistMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWishlist() throws Exception {
        // Initialize the database
        insertedWishlist = wishlistRepository.saveAndFlush(wishlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the wishlist
        Wishlist updatedWishlist = wishlistRepository.findById(wishlist.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedWishlist are not directly saved in db
        em.detach(updatedWishlist);
        updatedWishlist.createdDate(UPDATED_CREATED_DATE);
        WishlistDTO wishlistDTO = wishlistMapper.toDto(updatedWishlist);

        restWishlistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, wishlistDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(wishlistDTO))
            )
            .andExpect(status().isOk());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedWishlistToMatchAllProperties(updatedWishlist);
    }

    @Test
    @Transactional
    void putNonExistingWishlist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        wishlist.setId(longCount.incrementAndGet());

        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWishlistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, wishlistDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(wishlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWishlist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        wishlist.setId(longCount.incrementAndGet());

        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWishlistMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(wishlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWishlist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        wishlist.setId(longCount.incrementAndGet());

        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWishlistMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(wishlistDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWishlistWithPatch() throws Exception {
        // Initialize the database
        insertedWishlist = wishlistRepository.saveAndFlush(wishlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the wishlist using partial update
        Wishlist partialUpdatedWishlist = new Wishlist();
        partialUpdatedWishlist.setId(wishlist.getId());

        restWishlistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWishlist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedWishlist))
            )
            .andExpect(status().isOk());

        // Validate the Wishlist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertWishlistUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedWishlist, wishlist), getPersistedWishlist(wishlist));
    }

    @Test
    @Transactional
    void fullUpdateWishlistWithPatch() throws Exception {
        // Initialize the database
        insertedWishlist = wishlistRepository.saveAndFlush(wishlist);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the wishlist using partial update
        Wishlist partialUpdatedWishlist = new Wishlist();
        partialUpdatedWishlist.setId(wishlist.getId());

        partialUpdatedWishlist.createdDate(UPDATED_CREATED_DATE);

        restWishlistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWishlist.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedWishlist))
            )
            .andExpect(status().isOk());

        // Validate the Wishlist in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertWishlistUpdatableFieldsEquals(partialUpdatedWishlist, getPersistedWishlist(partialUpdatedWishlist));
    }

    @Test
    @Transactional
    void patchNonExistingWishlist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        wishlist.setId(longCount.incrementAndGet());

        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWishlistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, wishlistDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(wishlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWishlist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        wishlist.setId(longCount.incrementAndGet());

        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWishlistMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(wishlistDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWishlist() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        wishlist.setId(longCount.incrementAndGet());

        // Create the Wishlist
        WishlistDTO wishlistDTO = wishlistMapper.toDto(wishlist);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWishlistMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(wishlistDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Wishlist in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWishlist() throws Exception {
        // Initialize the database
        insertedWishlist = wishlistRepository.saveAndFlush(wishlist);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the wishlist
        restWishlistMockMvc
            .perform(delete(ENTITY_API_URL_ID, wishlist.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return wishlistRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Wishlist getPersistedWishlist(Wishlist wishlist) {
        return wishlistRepository.findById(wishlist.getId()).orElseThrow();
    }

    protected void assertPersistedWishlistToMatchAllProperties(Wishlist expectedWishlist) {
        assertWishlistAllPropertiesEquals(expectedWishlist, getPersistedWishlist(expectedWishlist));
    }

    protected void assertPersistedWishlistToMatchUpdatableProperties(Wishlist expectedWishlist) {
        assertWishlistAllUpdatablePropertiesEquals(expectedWishlist, getPersistedWishlist(expectedWishlist));
    }
}
