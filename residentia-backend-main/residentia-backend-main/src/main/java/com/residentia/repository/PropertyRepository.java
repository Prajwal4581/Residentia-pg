package com.residentia.repository;

import com.residentia.entity.Property;
import com.residentia.entity.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByOwner(Owner owner);
    List<Property> findByOwnerId(Long ownerId);
}
