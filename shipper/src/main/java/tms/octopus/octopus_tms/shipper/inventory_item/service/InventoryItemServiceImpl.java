package tms.octopus.octopus_tms.shipper.inventory_item.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.shipper.inventory_item.domain.InventoryItem;
import tms.octopus.octopus_tms.shipper.inventory_item.model.InventoryItemDTO;
import tms.octopus.octopus_tms.shipper.inventory_item.repos.InventoryItemRepository;
import tms.octopus.octopus_tms.shipper.inventory_level.domain.InventoryLevel;
import tms.octopus.octopus_tms.shipper.inventory_level.repos.InventoryLevelRepository;
import tms.octopus.octopus_tms.shipper.inventory_movement.domain.InventoryMovement;
import tms.octopus.octopus_tms.shipper.inventory_movement.repos.InventoryMovementRepository;


@Service
public class InventoryItemServiceImpl implements InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;
    private final InventoryItemMapper inventoryItemMapper;
    private final InventoryLevelRepository inventoryLevelRepository;
    private final InventoryMovementRepository inventoryMovementRepository;

    public InventoryItemServiceImpl(final InventoryItemRepository inventoryItemRepository,
            final InventoryItemMapper inventoryItemMapper,
            final InventoryLevelRepository inventoryLevelRepository,
            final InventoryMovementRepository inventoryMovementRepository) {
        this.inventoryItemRepository = inventoryItemRepository;
        this.inventoryItemMapper = inventoryItemMapper;
        this.inventoryLevelRepository = inventoryLevelRepository;
        this.inventoryMovementRepository = inventoryMovementRepository;
    }

    @Override
    public Page<InventoryItemDTO> findAll(final String filter, final Pageable pageable) {
        Page<InventoryItem> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = inventoryItemRepository.findAllById(uuidFilter, pageable);
        } else {
            page = inventoryItemRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(inventoryItem -> inventoryItemMapper.updateInventoryItemDTO(inventoryItem, new InventoryItemDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public InventoryItemDTO get(final UUID id) {
        return inventoryItemRepository.findById(id)
                .map(inventoryItem -> inventoryItemMapper.updateInventoryItemDTO(inventoryItem, new InventoryItemDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final InventoryItemDTO inventoryItemDTO) {
        final InventoryItem inventoryItem = new InventoryItem();
        inventoryItemMapper.updateInventoryItem(inventoryItemDTO, inventoryItem);
        return inventoryItemRepository.save(inventoryItem).getId();
    }

    @Override
    public void update(final UUID id, final InventoryItemDTO inventoryItemDTO) {
        final InventoryItem inventoryItem = inventoryItemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        inventoryItemMapper.updateInventoryItem(inventoryItemDTO, inventoryItem);
        inventoryItemRepository.save(inventoryItem);
    }

    @Override
    public void delete(final UUID id) {
        inventoryItemRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final InventoryItem inventoryItem = inventoryItemRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final InventoryLevel itemInventoryLevel = inventoryLevelRepository.findFirstByItem(inventoryItem);
        if (itemInventoryLevel != null) {
            referencedWarning.setKey("inventoryItem.inventoryLevel.item.referenced");
            referencedWarning.addParam(itemInventoryLevel.getId());
            return referencedWarning;
        }
        final InventoryMovement inventoryItemInventoryMovement = inventoryMovementRepository.findFirstByInventoryItem(inventoryItem);
        if (inventoryItemInventoryMovement != null) {
            referencedWarning.setKey("inventoryItem.inventoryMovement.inventoryItem.referenced");
            referencedWarning.addParam(inventoryItemInventoryMovement.getId());
            return referencedWarning;
        }
        return null;
    }

}
