package tms.octopus.octopus_tms.core.ai_provider_config.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.core.ai_provider_config.domain.AiProviderConfig;


public interface AiProviderConfigRepository extends JpaRepository<AiProviderConfig, Long> {
}
