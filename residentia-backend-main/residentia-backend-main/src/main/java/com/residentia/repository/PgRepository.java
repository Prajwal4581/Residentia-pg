package com.residentia.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.residentia.entity.Booking;
import com.residentia.entity.Owner;
import com.residentia.entity.Property;


public interface PgRepository extends JpaRepository<Property,Integer>
{
	long countByStatus(String status);

	List<Property> findByOwner(Owner owner);
	
	@Modifying(clearAutomatically = true, flushAutomatically = true)
	@Query("""
	    update Property p
	    set p.rentAmount = :rent,
	        p.city = :city
	    where p.id = :id
	""")
	int applyPgUpdate(@Param("id") Integer id,
	                  @Param("rent") Integer rent,
	                  @Param("city") String city);
}
