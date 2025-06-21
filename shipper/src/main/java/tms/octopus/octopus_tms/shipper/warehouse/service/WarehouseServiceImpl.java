package tms.octopus.octopus_tms.shipper.warehouse.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.shipper.inventory_level.domain.InventoryLevel;
import tms.octopus.octopus_tms.shipper.inventory_level.repos.InventoryLevelRepository;
import tms.octopus.octopus_tms.shipper.inventory_movement.domain.InventoryMovement;
import tms.octopus.octopus_tms.shipper.inventory_movement.repos.InventoryMovementRepository;
import tms.octopus.octopus_tms.shipper.warehouse.domain.Warehouse;
import tms.octopus.octopus_tms.shipper.warehouse.model.WarehouseDTO;
import tms.octopus.octopus_tms.shipper.warehouse.repos.WarehouseRepository;


@Service
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final WarehouseMapper warehouseMapper;
    private final InventoryLevelRepository inventoryLevelRepository;
    private final InventoryMovementRepository inventoryMovementRepository;

    public WarehouseServiceImpl(final WarehouseRepository warehouseRepository,
            final WarehouseMapper warehouseMapper,
            final InventoryLevelRepository inventoryLevelRepository,
            final InventoryMovementRepository inventoryMovementRepository) {
        this.warehouseRepository = warehouseRepository;
        this.warehouseMapper = warehouseMapper;
        this.inventoryLevelRepository = inventoryLevelRepository;
        this.inventoryMovementRepository = inventoryMovementRepository;
    }

    @Override
    public Page<WarehouseDTO> findAll(final String filter, final Pageable pageable) {
        Page<Warehouse> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = warehouseRepository.findAllById(uuidFilter, pageable);
        } else {
            page = warehouseRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(warehouse -> warehouseMapper.updateWarehouseDTO(warehouse, new WarehouseDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public WarehouseDTO get(final UUID id) {
        return warehouseRepository.findById(id)
                .map(warehouse -> warehouseMapper.updateWarehouseDTO(warehouse, new WarehouseDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final WarehouseDTO warehouseDTO) {
        final Warehouse warehouse = new Warehouse();
        warehouseMapper.updateWarehouse(warehouseDTO, warehouse);
        return warehouseRepository.save(warehouse).getId();
    }

    @Override
    public void update(final UUID id, final WarehouseDTO warehouseDTO) {
        final Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        warehouseMapper.updateWarehouse(warehouseDTO, warehouse);
        warehouseRepository.save(warehouse);
    }

    @Override
    public void delete(final UUID id) {
        warehouseRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final InventoryLevel warehouseInventoryLevel = inventoryLevelRepository.findFirstByWarehouse(warehouse);
        if (warehouseInventoryLevel != null) {
            referencedWarning.setKey("warehouse.inventoryLevel.warehouse.referenced");
            referencedWarning.addParam(warehouseInventoryLevel.getId());
            return referencedWarning;
        }
        final InventoryMovement warehouseInventoryMovement = inventoryMovementRepository.findFirstByWarehouse(warehouse);
        if (warehouseInventoryMovement != null) {
            referencedWarning.setKey("warehouse.inventoryMovement.warehouse.referenced");
            referencedWarning.addParam(warehouseInventoryMovement.getId());
            return referencedWarning;
        }
        return null;
    }

}
