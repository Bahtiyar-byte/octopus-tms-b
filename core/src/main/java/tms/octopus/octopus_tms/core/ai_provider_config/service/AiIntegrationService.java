package tms.octopus.octopus_tms.core.ai_provider_config.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tms.octopus.octopus_tms.core.ai_provider_config.domain.AiProviderConfig;
import tms.octopus.octopus_tms.core.ai_provider_config.model.*;
import tms.octopus.octopus_tms.core.ai_provider_config.repos.AiProviderConfigRepository;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AiIntegrationService {

    private final AiProviderConfigRepository aiProviderConfigRepository;

    @Transactional(readOnly = true)
    public List<AiProviderConfigDTO> getAllProviders() {
        return aiProviderConfigRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AiProviderConfigDTO> getActiveProviders() {
        return aiProviderConfigRepository.findByIsActiveTrue().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AiProviderConfigDTO saveProvider(AiProviderConfigDTO dto) {
        AiProviderConfig config;
        
        if (dto.getProvider() != null) {
            config = aiProviderConfigRepository.findByProviderIgnoreCase(dto.getProvider())
                    .orElse(new AiProviderConfig());
        } else {
            config = new AiProviderConfig();
        }

        config.setProvider(dto.getProvider().toUpperCase());
        config.setApiKey(dto.getApiKey());
        config.setIsActive(dto.getIsActive());
        config.setConnectionStatus("PENDING");
        config.setUserId(dto.getUserId());
        
        if (config.getCreatedAt() == null) {
            config.setCreatedAt(OffsetDateTime.now());
        }
        config.setUpdatedAt(OffsetDateTime.now());

        config = aiProviderConfigRepository.save(config);
        return toDto(config);
    }

    @Transactional
    public void deleteProvider(Long id) {
        aiProviderConfigRepository.deleteById(id);
    }

    private AiProviderConfigDTO toDto(AiProviderConfig config) {
        AiProviderConfigDTO dto = new AiProviderConfigDTO();
        dto.setId(config.getId());
        dto.setUserId(config.getUserId());
        dto.setProvider(config.getProvider());
        dto.setApiKey(maskApiKey(config.getApiKey()));
        dto.setIsActive(config.getIsActive());
        dto.setConnectionStatus(config.getConnectionStatus());
        dto.setLastTested(config.getLastTested());
        dto.setCreatedAt(config.getCreatedAt());
        dto.setUpdatedAt(config.getUpdatedAt());
        return dto;
    }

    private String maskApiKey(String apiKey) {
        if (apiKey == null || apiKey.length() < 8) {
            return "****";
        }
        return apiKey.substring(0, 4) + "****" + apiKey.substring(apiKey.length() - 4);
    }
}