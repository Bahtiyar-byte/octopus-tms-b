package tms.octopus.octopus_tms.carrier.equipment.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.carrier.equipment.domain.Equipment;
import tms.octopus.octopus_tms.carrier.equipment.model.EquipmentDTO;
import tms.octopus.octopus_tms.carrier.equipment.repos.EquipmentRepository;


@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;
    private final EquipmentMapper equipmentMapper;

    public EquipmentServiceImpl(final EquipmentRepository equipmentRepository,
            final EquipmentMapper equipmentMapper) {
        this.equipmentRepository = equipmentRepository;
        this.equipmentMapper = equipmentMapper;
    }

    @Override
    public List<EquipmentDTO> findAll() {
        final List<Equipment> equipments = equipmentRepository.findAll(Sort.by("id"));
        return equipments.stream()
                .map(equipment -> equipmentMapper.updateEquipmentDTO(equipment, new EquipmentDTO()))
                .toList();
    }

    @Override
    public EquipmentDTO get(final UUID id) {
        return equipmentRepository.findById(id)
                .map(equipment -> equipmentMapper.updateEquipmentDTO(equipment, new EquipmentDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final EquipmentDTO equipmentDTO) {
        final Equipment equipment = new Equipment();
        equipmentMapper.updateEquipment(equipmentDTO, equipment);
        return equipmentRepository.save(equipment).getId();
    }

    @Override
    public void update(final UUID id, final EquipmentDTO equipmentDTO) {
        final Equipment equipment = equipmentRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        equipmentMapper.updateEquipment(equipmentDTO, equipment);
        equipmentRepository.save(equipment);
    }

    @Override
    public void delete(final UUID id) {
        equipmentRepository.deleteById(id);
    }

}
