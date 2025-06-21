package tms.octopus.octopus_tms.shipper.shipment_readiness.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.shipper.shipment_readiness.domain.ShipmentReadiness;
import tms.octopus.octopus_tms.shipper.shipment_readiness.model.ShipmentReadinessDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface ShipmentReadinessMapper {

    ShipmentReadinessDTO updateShipmentReadinessDTO(ShipmentReadiness shipmentReadiness,
            @MappingTarget ShipmentReadinessDTO shipmentReadinessDTO);

    @Mapping(target = "id", ignore = true)
    ShipmentReadiness updateShipmentReadiness(ShipmentReadinessDTO shipmentReadinessDTO,
            @MappingTarget ShipmentReadiness shipmentReadiness);

}
