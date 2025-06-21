package tms.octopus.octopus_tms.load.load_stop.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;
import tms.octopus.octopus_tms.load.load_stop.model.LoadStopDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadStopMapper {

    @Mapping(target = "load", ignore = true)
    LoadStopDTO updateLoadStopDTO(LoadStop loadStop, @MappingTarget LoadStopDTO loadStopDTO);

    @AfterMapping
    default void afterUpdateLoadStopDTO(LoadStop loadStop, @MappingTarget LoadStopDTO loadStopDTO) {
        loadStopDTO.setLoad(loadStop.getLoad() == null ? null : loadStop.getLoad().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "load", ignore = true)
    LoadStop updateLoadStop(LoadStopDTO loadStopDTO, @MappingTarget LoadStop loadStop,
            @Context LoadRepository loadRepository);

    @AfterMapping
    default void afterUpdateLoadStop(LoadStopDTO loadStopDTO, @MappingTarget LoadStop loadStop,
            @Context LoadRepository loadRepository) {
        final Load load = loadStopDTO.getLoad() == null ? null : loadRepository.findById(loadStopDTO.getLoad())
                .orElseThrow(() -> new NotFoundException("load not found"));
        loadStop.setLoad(load);
    }

}
