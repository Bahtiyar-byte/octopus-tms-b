package tms.octopus.octopus_tms.core.ai_provider_config.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import tms.octopus.octopus_tms.core.ai_provider_config.domain.AiProviderConfig;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AiProviderConfigRepository extends JpaRepository<AiProviderConfig, Long> {
    
    Optional<AiProviderConfig> findByProviderIgnoreCase(String provider);
    
    List<AiProviderConfig> findByIsActiveTrue();
    
    @Query("SELECT a FROM AiProviderConfig a WHERE a.isActive = true AND a.provider = ?1")
    Optional<AiProviderConfig> findActiveProviderByName(String provider);
    
    boolean existsByProviderIgnoreCase(String provider);
    
    List<AiProviderConfig> findByUserId(UUID userId);
    
    List<AiProviderConfig> findByUserIdAndIsActiveTrue(UUID userId);
}
