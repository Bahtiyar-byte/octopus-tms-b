package tms.octopus.octopus_tms.core.ai_provider_config.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.ai_provider_config.domain.AiProviderConfig;
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;

import java.util.UUID;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AiProviderConfigMapper {

    @Mapping(target = "userId", ignore = true)
    AiProviderConfigDTO updateAiProviderConfigDTO(AiProviderConfig aiProviderConfig,
            @MappingTarget AiProviderConfigDTO aiProviderConfigDTO);

    @AfterMapping
    default void afterUpdateAiProviderConfigDTO(AiProviderConfig aiProviderConfig,
            @MappingTarget AiProviderConfigDTO aiProviderConfigDTO) {
        if (aiProviderConfig.getUserId() != null) {
            aiProviderConfigDTO.setUserId(aiProviderConfig.getUserId());
        }
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "userId", ignore = true)
    AiProviderConfig updateAiProviderConfig(AiProviderConfigDTO aiProviderConfigDTO,
            @MappingTarget AiProviderConfig aiProviderConfig);

    @AfterMapping
    default void afterUpdateAiProviderConfig(AiProviderConfigDTO aiProviderConfigDTO,
            @MappingTarget AiProviderConfig aiProviderConfig) {
        if (aiProviderConfigDTO.getUserId() != null) {
            aiProviderConfig.setUserId(aiProviderConfigDTO.getUserId());
        }
        // Generate a random userId if not provided
        if (aiProviderConfig.getUserId() == null) {
            aiProviderConfig.setUserId(UUID.randomUUID());
        }
    }

}