package tms.octopus.octopus_tms.carrier.equipment.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.carrier.equipment.model.EquipmentDTO;


public interface EquipmentService {

    List<EquipmentDTO> findAll();

    EquipmentDTO get(UUID id);

    UUID create(EquipmentDTO equipmentDTO);

    void update(UUID id, EquipmentDTO equipmentDTO);

    void delete(UUID id);

}
