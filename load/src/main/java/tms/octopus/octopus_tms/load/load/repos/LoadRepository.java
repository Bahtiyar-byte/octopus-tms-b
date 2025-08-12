package tms.octopus.octopus_tms.load.load.repos;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import tms.octopus.octopus_tms.load.load.domain.Load;


public interface LoadRepository extends JpaRepository<Load, UUID> {

    Page<Load> findAllById(UUID id, Pageable pageable);

    Page<Load> findAllByBrokerId(UUID brokerId, Pageable pageable);
    
    /**
     * Count loads for a carrier that have not yet been assigned to a driver
     */
    long countByCarrierIdAndAssignedDriverIdIsNull(UUID carrierId);
    
    /**
     * Count loads for a carrier that have not yet been assigned to a driver, filtered by assigned dispatcher
     */
    long countByCarrierIdAndAssignedDriverIdIsNullAndAssignedDispatcher(UUID carrierId, UUID assignedDispatcher);
    
    /**
     * Find the load with the highest load number
     * @return the load with the highest load number
     */
    Optional<Load> findTopByOrderByLoadNumberDesc();
    
    /**
     * Find loads by status
     * @param status the status to filter by
     * @param pageable pagination information
     * @return page of loads with the specified status
     */
    @Query("SELECT l FROM Load l WHERE LOWER(l.status) = LOWER(:status)")
    Page<Load> findByStatus(@Param("status") String status, Pageable pageable);
    
    /**
     * Search loads by various fields
     * @param searchTerm the search term
     * @param pageable pagination information
     * @return page of loads matching the search criteria
     */
    @Query("SELECT l FROM Load l WHERE " +
           "LOWER(l.loadNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.originCity) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.originState) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.originZip) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.destinationCity) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.destinationState) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.destinationZip) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.commodity) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.referenceNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Load> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    /**
     * Search loads by status and search term
     * @param status the status to filter by
     * @param searchTerm the search term
     * @param pageable pagination information
     * @return page of loads matching both status and search criteria
     */
    @Query("SELECT l FROM Load l WHERE " +
           "LOWER(l.status) = LOWER(:status) AND (" +
           "LOWER(l.loadNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.originCity) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.originState) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.originZip) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.destinationCity) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.destinationState) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.destinationZip) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.commodity) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.referenceNumber) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Load> findByStatusAndSearchTerm(@Param("status") String status, @Param("searchTerm") String searchTerm, Pageable pageable);

}
