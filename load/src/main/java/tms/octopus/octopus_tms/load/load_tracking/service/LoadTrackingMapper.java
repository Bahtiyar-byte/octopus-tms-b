package tms.octopus.octopus_tms.load.load_tracking.service;

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
import tms.octopus.octopus_tms.load.load_tracking.domain.LoadTracking;
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadTrackingMapper {

    @Mapping(target = "load", ignore = true)
    LoadTrackingDTO updateLoadTrackingDTO(LoadTracking loadTracking,
            @MappingTarget LoadTrackingDTO loadTrackingDTO);

    @AfterMapping
    default void afterUpdateLoadTrackingDTO(LoadTracking loadTracking,
            @MappingTarget LoadTrackingDTO loadTrackingDTO) {
        loadTrackingDTO.setLoad(loadTracking.getLoad() == null ? null : loadTracking.getLoad().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "load", ignore = true)
    LoadTracking updateLoadTracking(LoadTrackingDTO loadTrackingDTO,
            @MappingTarget LoadTracking loadTracking, @Context LoadRepository loadRepository);

    @AfterMapping
    default void afterUpdateLoadTracking(LoadTrackingDTO loadTrackingDTO,
            @MappingTarget LoadTracking loadTracking, @Context LoadRepository loadRepository) {
        final Load load = loadTrackingDTO.getLoad() == null ? null : loadRepository.findById(loadTrackingDTO.getLoad())
                .orElseThrow(() -> new NotFoundException("load not found"));
        loadTracking.setLoad(load);
    }

}
