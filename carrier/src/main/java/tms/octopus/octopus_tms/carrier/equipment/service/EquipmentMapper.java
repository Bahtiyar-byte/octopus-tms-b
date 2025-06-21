package tms.octopus.octopus_tms.carrier.equipment.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.carrier.equipment.domain.Equipment;
import tms.octopus.octopus_tms.carrier.equipment.model.EquipmentDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface EquipmentMapper {

    EquipmentDTO updateEquipmentDTO(Equipment equipment, @MappingTarget EquipmentDTO equipmentDTO);

    @Mapping(target = "id", ignore = true)
    Equipment updateEquipment(EquipmentDTO equipmentDTO, @MappingTarget Equipment equipment);

}
