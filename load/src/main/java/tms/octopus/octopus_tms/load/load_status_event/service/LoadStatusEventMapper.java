package tms.octopus.octopus_tms.load.load_status_event.service;

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
import tms.octopus.octopus_tms.load.load_status_event.domain.LoadStatusEvent;
import tms.octopus.octopus_tms.load.load_status_event.model.LoadStatusEventDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadStatusEventMapper {

    @Mapping(target = "load", ignore = true)
    LoadStatusEventDTO updateLoadStatusEventDTO(LoadStatusEvent loadStatusEvent,
            @MappingTarget LoadStatusEventDTO loadStatusEventDTO);

    @AfterMapping
    default void afterUpdateLoadStatusEventDTO(LoadStatusEvent loadStatusEvent,
            @MappingTarget LoadStatusEventDTO loadStatusEventDTO) {
        loadStatusEventDTO.setLoad(loadStatusEvent.getLoad() == null ? null : loadStatusEvent.getLoad().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "load", ignore = true)
    LoadStatusEvent updateLoadStatusEvent(LoadStatusEventDTO loadStatusEventDTO,
            @MappingTarget LoadStatusEvent loadStatusEvent, @Context LoadRepository loadRepository);

    @AfterMapping
    default void afterUpdateLoadStatusEvent(LoadStatusEventDTO loadStatusEventDTO,
            @MappingTarget LoadStatusEvent loadStatusEvent,
            @Context LoadRepository loadRepository) {
        final Load load = loadStatusEventDTO.getLoad() == null ? null : loadRepository.findById(loadStatusEventDTO.getLoad())
                .orElseThrow(() -> new NotFoundException("load not found"));
        loadStatusEvent.setLoad(load);
    }

}
