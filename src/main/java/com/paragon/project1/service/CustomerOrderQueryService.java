package com.paragon.project1.service;

import com.paragon.project1.domain.*; // for static metamodels
import com.paragon.project1.domain.CustomerOrder;
import com.paragon.project1.repository.CustomerOrderRepository;
import com.paragon.project1.service.criteria.CustomerOrderCriteria;
import com.paragon.project1.service.dto.CustomerOrderDTO;
import com.paragon.project1.service.mapper.CustomerOrderMapper;
import jakarta.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link CustomerOrder} entities in the database.
 * The main input is a {@link CustomerOrderCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link Page} of {@link CustomerOrderDTO} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class CustomerOrderQueryService extends QueryService<CustomerOrder> {

    private static final Logger LOG = LoggerFactory.getLogger(CustomerOrderQueryService.class);

    private final CustomerOrderRepository customerOrderRepository;

    private final CustomerOrderMapper customerOrderMapper;

    public CustomerOrderQueryService(CustomerOrderRepository customerOrderRepository, CustomerOrderMapper customerOrderMapper) {
        this.customerOrderRepository = customerOrderRepository;
        this.customerOrderMapper = customerOrderMapper;
    }

    /**
     * Return a {@link Page} of {@link CustomerOrderDTO} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<CustomerOrderDTO> findByCriteria(CustomerOrderCriteria criteria, Pageable page) {
        LOG.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<CustomerOrder> specification = createSpecification(criteria);
        return customerOrderRepository.findAll(specification, page).map(customerOrderMapper::toDto);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(CustomerOrderCriteria criteria) {
        LOG.debug("count by criteria : {}", criteria);
        final Specification<CustomerOrder> specification = createSpecification(criteria);
        return customerOrderRepository.count(specification);
    }

    /**
     * Function to convert {@link CustomerOrderCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<CustomerOrder> createSpecification(CustomerOrderCriteria criteria) {
        Specification<CustomerOrder> specification = Specification.unrestricted();
        specification = specification.and((root, query, builder) -> {
            if (Long.class != query.getResultType()) {
                root.fetch(CustomerOrder_.shippingAddress, JoinType.LEFT);
                root.fetch(CustomerOrder_.billingAddress, JoinType.LEFT);
                root.fetch(CustomerOrder_.user, JoinType.LEFT);
            }
            return null;
        });
        if (criteria != null) {
            // This has to be called first, because the distinct method returns null
            specification = specification.and(
                Specification.allOf(
                    Boolean.TRUE.equals(criteria.getDistinct()) ? distinct(criteria.getDistinct()) : Specification.unrestricted(),
                    buildRangeSpecification(criteria.getId(), CustomerOrder_.id),
                    buildRangeSpecification(criteria.getPlacedDate(), CustomerOrder_.placedDate),
                    buildSpecification(criteria.getStatus(), CustomerOrder_.status),
                    buildRangeSpecification(criteria.getTotalAmount(), CustomerOrder_.totalAmount),
                    buildSpecification(criteria.getShippingAddressId(), root ->
                        root.join(CustomerOrder_.shippingAddress, JoinType.LEFT).get(Address_.id)
                    ),
                    buildSpecification(criteria.getBillingAddressId(), root ->
                        root.join(CustomerOrder_.billingAddress, JoinType.LEFT).get(Address_.id)
                    ),
                    buildSpecification(criteria.getOrderItemId(), root ->
                        root.join(CustomerOrder_.orderItems, JoinType.LEFT).get(OrderItem_.id)
                    ),
                    buildSpecification(criteria.getUserId(), root -> root.join(CustomerOrder_.user, JoinType.LEFT).get(User_.id))
                )
            );
        }
        return specification;
    }
}
