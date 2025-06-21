package tms.octopus.octopus_tms.core.ai_provider_config.service;

import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.ai_provider_config.domain.AiProviderConfig;
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;
import tms.octopus.octopus_tms.core.ai_provider_config.repos.AiProviderConfigRepository;


@Service
public class AiProviderConfigServiceImpl implements AiProviderConfigService {

    private final AiProviderConfigRepository aiProviderConfigRepository;
    private final AiProviderConfigMapper aiProviderConfigMapper;

    public AiProviderConfigServiceImpl(final AiProviderConfigRepository aiProviderConfigRepository,
            final AiProviderConfigMapper aiProviderConfigMapper) {
        this.aiProviderConfigRepository = aiProviderConfigRepository;
        this.aiProviderConfigMapper = aiProviderConfigMapper;
    }

    @Override
    public List<AiProviderConfigDTO> findAll() {
        final List<AiProviderConfig> aiProviderConfigs = aiProviderConfigRepository.findAll(Sort.by("id"));
        return aiProviderConfigs.stream()
                .map(aiProviderConfig -> aiProviderConfigMapper.updateAiProviderConfigDTO(aiProviderConfig, new AiProviderConfigDTO()))
                .toList();
    }

    @Override
    public AiProviderConfigDTO get(final Long id) {
        return aiProviderConfigRepository.findById(id)
                .map(aiProviderConfig -> aiProviderConfigMapper.updateAiProviderConfigDTO(aiProviderConfig, new AiProviderConfigDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public Long create(final AiProviderConfigDTO aiProviderConfigDTO) {
        final AiProviderConfig aiProviderConfig = new AiProviderConfig();
        aiProviderConfigMapper.updateAiProviderConfig(aiProviderConfigDTO, aiProviderConfig);
        return aiProviderConfigRepository.save(aiProviderConfig).getId();
    }

    @Override
    public void update(final Long id, final AiProviderConfigDTO aiProviderConfigDTO) {
        final AiProviderConfig aiProviderConfig = aiProviderConfigRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        aiProviderConfigMapper.updateAiProviderConfig(aiProviderConfigDTO, aiProviderConfig);
        aiProviderConfigRepository.save(aiProviderConfig);
    }

    @Override
    public void delete(final Long id) {
        aiProviderConfigRepository.deleteById(id);
    }

}
