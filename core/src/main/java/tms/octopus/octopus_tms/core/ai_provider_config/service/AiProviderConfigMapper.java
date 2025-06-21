package tms.octopus.octopus_tms.core.ai_provider_config.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.core.ai_provider_config.domain.AiProviderConfig;
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface AiProviderConfigMapper {

    AiProviderConfigDTO updateAiProviderConfigDTO(AiProviderConfig aiProviderConfig,
            @MappingTarget AiProviderConfigDTO aiProviderConfigDTO);

    @Mapping(target = "id", ignore = true)
    AiProviderConfig updateAiProviderConfig(AiProviderConfigDTO aiProviderConfigDTO,
            @MappingTarget AiProviderConfig aiProviderConfig);

}
