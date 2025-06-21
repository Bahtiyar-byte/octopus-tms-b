package tms.octopus.octopus_tms.shipper.inventory_movement.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.shipper.inventory_item.repos.InventoryItemRepository;
import tms.octopus.octopus_tms.shipper.inventory_movement.domain.InventoryMovement;
import tms.octopus.octopus_tms.shipper.inventory_movement.model.InventoryMovementDTO;
import tms.octopus.octopus_tms.shipper.inventory_movement.repos.InventoryMovementRepository;
import tms.octopus.octopus_tms.shipper.warehouse.repos.WarehouseRepository;


@Service
public class InventoryMovementServiceImpl implements InventoryMovementService {

    private final InventoryMovementRepository inventoryMovementRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryMovementMapper inventoryMovementMapper;

    public InventoryMovementServiceImpl(
            final InventoryMovementRepository inventoryMovementRepository,
            final InventoryItemRepository inventoryItemRepository,
            final WarehouseRepository warehouseRepository,
            final InventoryMovementMapper inventoryMovementMapper) {
        this.inventoryMovementRepository = inventoryMovementRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryMovementMapper = inventoryMovementMapper;
    }

    @Override
    public List<InventoryMovementDTO> findAll() {
        final List<InventoryMovement> inventoryMovements = inventoryMovementRepository.findAll(Sort.by("id"));
        return inventoryMovements.stream()
                .map(inventoryMovement -> inventoryMovementMapper.updateInventoryMovementDTO(inventoryMovement, new InventoryMovementDTO()))
                .toList();
    }

    @Override
    public InventoryMovementDTO get(final UUID id) {
        return inventoryMovementRepository.findById(id)
                .map(inventoryMovement -> inventoryMovementMapper.updateInventoryMovementDTO(inventoryMovement, new InventoryMovementDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final InventoryMovementDTO inventoryMovementDTO) {
        final InventoryMovement inventoryMovement = new InventoryMovement();
        inventoryMovementMapper.updateInventoryMovement(inventoryMovementDTO, inventoryMovement, inventoryItemRepository, warehouseRepository);
        return inventoryMovementRepository.save(inventoryMovement).getId();
    }

    @Override
    public void update(final UUID id, final InventoryMovementDTO inventoryMovementDTO) {
        final InventoryMovement inventoryMovement = inventoryMovementRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        inventoryMovementMapper.updateInventoryMovement(inventoryMovementDTO, inventoryMovement, inventoryItemRepository, warehouseRepository);
        inventoryMovementRepository.save(inventoryMovement);
    }

    @Override
    public void delete(final UUID id) {
        inventoryMovementRepository.deleteById(id);
    }

}
