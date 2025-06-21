package tms.octopus.octopus_tms.shipper.warehouse.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;
import tms.octopus.octopus_tms.shipper.warehouse.model.WarehouseDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface WarehouseMapper {

    WarehouseDTO updateWarehouseDTO(Warehouse warehouse, @MappingTarget WarehouseDTO warehouseDTO);

    @Mapping(target = "id", ignore = true)
    Warehouse updateWarehouse(WarehouseDTO warehouseDTO, @MappingTarget Warehouse warehouse);

}
