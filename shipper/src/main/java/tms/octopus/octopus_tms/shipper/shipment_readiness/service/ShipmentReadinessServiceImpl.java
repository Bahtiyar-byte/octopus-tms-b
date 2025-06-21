package tms.octopus.octopus_tms.shipper.shipment_readiness.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.shipper.shipment_readiness.domain.ShipmentReadiness;
import tms.octopus.octopus_tms.shipper.shipment_readiness.model.ShipmentReadinessDTO;
import tms.octopus.octopus_tms.shipper.shipment_readiness.repos.ShipmentReadinessRepository;


@Service
public class ShipmentReadinessServiceImpl implements ShipmentReadinessService {

    private final ShipmentReadinessRepository shipmentReadinessRepository;
    private final ShipmentReadinessMapper shipmentReadinessMapper;

    public ShipmentReadinessServiceImpl(
            final ShipmentReadinessRepository shipmentReadinessRepository,
            final ShipmentReadinessMapper shipmentReadinessMapper) {
        this.shipmentReadinessRepository = shipmentReadinessRepository;
        this.shipmentReadinessMapper = shipmentReadinessMapper;
    }

    @Override
    public Page<ShipmentReadinessDTO> findAll(final String filter, final Pageable pageable) {
        Page<ShipmentReadiness> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = shipmentReadinessRepository.findAllById(uuidFilter, pageable);
        } else {
            page = shipmentReadinessRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(shipmentReadiness -> shipmentReadinessMapper.updateShipmentReadinessDTO(shipmentReadiness, new ShipmentReadinessDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public ShipmentReadinessDTO get(final UUID id) {
        return shipmentReadinessRepository.findById(id)
                .map(shipmentReadiness -> shipmentReadinessMapper.updateShipmentReadinessDTO(shipmentReadiness, new ShipmentReadinessDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final ShipmentReadinessDTO shipmentReadinessDTO) {
        final ShipmentReadiness shipmentReadiness = new ShipmentReadiness();
        shipmentReadinessMapper.updateShipmentReadiness(shipmentReadinessDTO, shipmentReadiness);
        return shipmentReadinessRepository.save(shipmentReadiness).getId();
    }

    @Override
    public void update(final UUID id, final ShipmentReadinessDTO shipmentReadinessDTO) {
        final ShipmentReadiness shipmentReadiness = shipmentReadinessRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        shipmentReadinessMapper.updateShipmentReadiness(shipmentReadinessDTO, shipmentReadiness);
        shipmentReadinessRepository.save(shipmentReadiness);
    }

    @Override
    public void delete(final UUID id) {
        shipmentReadinessRepository.deleteById(id);
    }

}
