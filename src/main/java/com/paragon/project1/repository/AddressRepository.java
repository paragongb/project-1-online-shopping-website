package com.paragon.project1.repository;

import com.paragon.project1.domain.Address;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    @EntityGraph(attributePaths = "user")
    @Override
    List<Address> findAll();

    @EntityGraph(attributePaths = "user")
    @Override
    Optional<Address> findById(Long id);

    @EntityGraph(attributePaths = "user")
    Optional<Address> findFirstByUserIdOrderByIdDesc(Long userId);
}
