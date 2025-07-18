package tms.octopus.octopus_tms.core.ai_provider_config.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;

import java.util.List;

public interface AiProviderConfigService {

    List<AiProviderConfigDTO> findAll();

    Page<AiProviderConfigDTO> findAll(String filter, Pageable pageable);

    AiProviderConfigDTO get(Long id);

    Long create(AiProviderConfigDTO aiProviderConfigDTO);

    void update(Long id, AiProviderConfigDTO aiProviderConfigDTO);

    void delete(Long id);

    ReferencedWarning getReferencedWarning(Long id);

}