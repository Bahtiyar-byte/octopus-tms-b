package tms.octopus.octopus_tms.shipper.inventory_level.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.shipper.inventory_item.repos.InventoryItemRepository;
import tms.octopus.octopus_tms.shipper.inventory_level.domain.InventoryLevel;
import tms.octopus.octopus_tms.shipper.inventory_level.model.InventoryLevelDTO;
import tms.octopus.octopus_tms.shipper.inventory_level.repos.InventoryLevelRepository;
import tms.octopus.octopus_tms.shipper.warehouse.repos.WarehouseRepository;


@Service
public class InventoryLevelServiceImpl implements InventoryLevelService {

    private final InventoryLevelRepository inventoryLevelRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryLevelMapper inventoryLevelMapper;

    public InventoryLevelServiceImpl(final InventoryLevelRepository inventoryLevelRepository,
            final InventoryItemRepository inventoryItemRepository,
            final WarehouseRepository warehouseRepository,
            final InventoryLevelMapper inventoryLevelMapper) {
        this.inventoryLevelRepository = inventoryLevelRepository;
        this.inventoryItemRepository = inventoryItemRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryLevelMapper = inventoryLevelMapper;
    }

    @Override
    public List<InventoryLevelDTO> findAll() {
        final List<InventoryLevel> inventoryLevels = inventoryLevelRepository.findAll(Sort.by("id"));
        return inventoryLevels.stream()
                .map(inventoryLevel -> inventoryLevelMapper.updateInventoryLevelDTO(inventoryLevel, new InventoryLevelDTO()))
                .toList();
    }

    @Override
    public InventoryLevelDTO get(final UUID id) {
        return inventoryLevelRepository.findById(id)
                .map(inventoryLevel -> inventoryLevelMapper.updateInventoryLevelDTO(inventoryLevel, new InventoryLevelDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final InventoryLevelDTO inventoryLevelDTO) {
        final InventoryLevel inventoryLevel = new InventoryLevel();
        inventoryLevelMapper.updateInventoryLevel(inventoryLevelDTO, inventoryLevel, inventoryItemRepository, warehouseRepository);
        return inventoryLevelRepository.save(inventoryLevel).getId();
    }

    @Override
    public void update(final UUID id, final InventoryLevelDTO inventoryLevelDTO) {
        final InventoryLevel inventoryLevel = inventoryLevelRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        inventoryLevelMapper.updateInventoryLevel(inventoryLevelDTO, inventoryLevel, inventoryItemRepository, warehouseRepository);
        inventoryLevelRepository.save(inventoryLevel);
    }

    @Override
    public void delete(final UUID id) {
        inventoryLevelRepository.deleteById(id);
    }

}
