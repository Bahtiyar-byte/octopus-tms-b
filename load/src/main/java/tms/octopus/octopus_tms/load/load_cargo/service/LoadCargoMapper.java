package tms.octopus.octopus_tms.load.load_cargo.service;

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
import tms.octopus.octopus_tms.load.load_cargo.domain.LoadCargo;
import tms.octopus.octopus_tms.load.load_cargo.model.LoadCargoDTO;
import tms.octopus.octopus_tms.load.load_stop.domain.LoadStop;
import tms.octopus.octopus_tms.load.load_stop.repos.LoadStopRepository;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadCargoMapper {

    @Mapping(target = "load", ignore = true)
    @Mapping(target = "pickupStop", ignore = true)
    @Mapping(target = "deliveryStop", ignore = true)
    LoadCargoDTO updateLoadCargoDTO(LoadCargo loadCargo, @MappingTarget LoadCargoDTO loadCargoDTO);

    @AfterMapping
    default void afterUpdateLoadCargoDTO(LoadCargo loadCargo,
            @MappingTarget LoadCargoDTO loadCargoDTO) {
        loadCargoDTO.setLoad(loadCargo.getLoad() == null ? null : loadCargo.getLoad().getId());
        loadCargoDTO.setPickupStop(loadCargo.getPickupStop() == null ? null : loadCargo.getPickupStop().getId());
        loadCargoDTO.setDeliveryStop(loadCargo.getDeliveryStop() == null ? null : loadCargo.getDeliveryStop().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "load", ignore = true)
    @Mapping(target = "pickupStop", ignore = true)
    @Mapping(target = "deliveryStop", ignore = true)
    LoadCargo updateLoadCargo(LoadCargoDTO loadCargoDTO, @MappingTarget LoadCargo loadCargo,
            @Context LoadRepository loadRepository, @Context LoadStopRepository loadStopRepository);

    @AfterMapping
    default void afterUpdateLoadCargo(LoadCargoDTO loadCargoDTO, @MappingTarget LoadCargo loadCargo,
            @Context LoadRepository loadRepository,
            @Context LoadStopRepository loadStopRepository) {
        final Load load = loadCargoDTO.getLoad() == null ? null : loadRepository.findById(loadCargoDTO.getLoad())
                .orElseThrow(() -> new NotFoundException("load not found"));
        loadCargo.setLoad(load);
        final LoadStop pickupStop = loadCargoDTO.getPickupStop() == null ? null : loadStopRepository.findById(loadCargoDTO.getPickupStop())
                .orElseThrow(() -> new NotFoundException("pickupStop not found"));
        loadCargo.setPickupStop(pickupStop);
        final LoadStop deliveryStop = loadCargoDTO.getDeliveryStop() == null ? null : loadStopRepository.findById(loadCargoDTO.getDeliveryStop())
                .orElseThrow(() -> new NotFoundException("deliveryStop not found"));
        loadCargo.setDeliveryStop(deliveryStop);
    }

}
