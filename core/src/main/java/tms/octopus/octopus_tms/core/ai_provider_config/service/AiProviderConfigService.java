package tms.octopus.octopus_tms.core.ai_provider_config.service;

import java.util.List;
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;


public interface AiProviderConfigService {

    List<AiProviderConfigDTO> findAll();

    AiProviderConfigDTO get(Long id);

    Long create(AiProviderConfigDTO aiProviderConfigDTO);

    void update(Long id, AiProviderConfigDTO aiProviderConfigDTO);

    void delete(Long id);

}
