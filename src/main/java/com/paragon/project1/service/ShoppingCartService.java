package com.paragon.project1.service;

import com.paragon.project1.domain.ShoppingCart;
import com.paragon.project1.repository.ShoppingCartRepository;
import com.paragon.project1.service.dto.ShoppingCartDTO;
import com.paragon.project1.service.mapper.ShoppingCartMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.paragon.project1.domain.ShoppingCart}.
 */
@Service
@Transactional
public class ShoppingCartService {

    private static final Logger LOG = LoggerFactory.getLogger(ShoppingCartService.class);

    private final ShoppingCartRepository shoppingCartRepository;

    private final ShoppingCartMapper shoppingCartMapper;

    public ShoppingCartService(ShoppingCartRepository shoppingCartRepository, ShoppingCartMapper shoppingCartMapper) {
        this.shoppingCartRepository = shoppingCartRepository;
        this.shoppingCartMapper = shoppingCartMapper;
    }

    /**
     * Save a shoppingCart.
     *
     * @param shoppingCartDTO the entity to save.
     * @return the persisted entity.
     */
    public ShoppingCartDTO save(ShoppingCartDTO shoppingCartDTO) {
        LOG.debug("Request to save ShoppingCart : {}", shoppingCartDTO);
        ShoppingCart shoppingCart = shoppingCartMapper.toEntity(shoppingCartDTO);
        shoppingCart = shoppingCartRepository.save(shoppingCart);
        return shoppingCartMapper.toDto(shoppingCart);
    }

    /**
     * Update a shoppingCart.
     *
     * @param shoppingCartDTO the entity to save.
     * @return the persisted entity.
     */
    public ShoppingCartDTO update(ShoppingCartDTO shoppingCartDTO) {
        LOG.debug("Request to update ShoppingCart : {}", shoppingCartDTO);
        ShoppingCart shoppingCart = shoppingCartMapper.toEntity(shoppingCartDTO);
        shoppingCart = shoppingCartRepository.save(shoppingCart);
        return shoppingCartMapper.toDto(shoppingCart);
    }

    /**
     * Partially update a shoppingCart.
     *
     * @param shoppingCartDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ShoppingCartDTO> partialUpdate(ShoppingCartDTO shoppingCartDTO) {
        LOG.debug("Request to partially update ShoppingCart : {}", shoppingCartDTO);

        return shoppingCartRepository
            .findById(shoppingCartDTO.getId())
            .map(existingShoppingCart -> {
                shoppingCartMapper.partialUpdate(existingShoppingCart, shoppingCartDTO);

                return existingShoppingCart;
            })
            .map(shoppingCartRepository::save)
            .map(shoppingCartMapper::toDto);
    }

    /**
     * Get all the shoppingCarts.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<ShoppingCartDTO> findAll() {
        LOG.debug("Request to get all ShoppingCarts");
        return shoppingCartRepository.findAll().stream().map(shoppingCartMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get all the shoppingCarts with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public List<ShoppingCartDTO> findAllWithEagerRelationships() {
        return shoppingCartRepository
            .findAllWithEagerRelationships()
            .stream()
            .map(shoppingCartMapper::toDto)
            .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one shoppingCart by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<ShoppingCartDTO> findOne(Long id) {
        LOG.debug("Request to get ShoppingCart : {}", id);
        return shoppingCartRepository.findOneWithEagerRelationships(id).map(shoppingCartMapper::toDto);
    }

    /**
     * Delete the shoppingCart by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete ShoppingCart : {}", id);
        shoppingCartRepository.deleteById(id);
    }
}
