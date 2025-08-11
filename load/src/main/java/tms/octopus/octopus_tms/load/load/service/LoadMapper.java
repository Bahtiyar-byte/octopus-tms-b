package tms.octopus.octopus_tms.load.load.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadMapper {

    LoadDTO updateLoadDTO(Load load, @MappingTarget LoadDTO loadDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Load updateLoad(LoadDTO loadDTO, @MappingTarget Load load);

}
