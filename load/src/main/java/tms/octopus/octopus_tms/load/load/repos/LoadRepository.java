package tms.octopus.octopus_tms.load.load.repos;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tms.octopus.octopus_tms.load.load.domain.Load;


public interface LoadRepository extends JpaRepository<Load, UUID> {

    Page<Load> findAllById(UUID id, Pageable pageable);

    Page<Load> findAllByBrokerId(UUID brokerId, Pageable pageable);
    
    /**
     * Find the load with the highest load number
     * @return the load with the highest load number
     */
    Optional<Load> findTopByOrderByLoadNumberDesc();

}
