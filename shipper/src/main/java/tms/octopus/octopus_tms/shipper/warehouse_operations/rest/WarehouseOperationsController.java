package tms.octopus.octopus_tms.shipper.warehouse_operations.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.shipper.shipment_readiness.model.ShipmentReadinessDTO;
import tms.octopus.octopus_tms.shipper.warehouse_operations.model.ShipmentConfirmationDTO;
import tms.octopus.octopus_tms.shipper.warehouse_operations.model.WarehouseInventoryDTO;


@RestController
@RequestMapping(value = "/warehouse-operations", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class WarehouseOperationsController {

    @GetMapping("/{warehouseId}/inventory-summary")
    public ResponseEntity<WarehouseInventoryDTO> getInventorySummary(
            @PathVariable(name = "warehouseId") final String warehouseId) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/shipment-ready/{readinessId}/confirm")
    public ResponseEntity<ShipmentReadinessDTO> confirmShipmentReady(
            @PathVariable(name = "readinessId") final String readinessId,
            @RequestBody @Valid final ShipmentConfirmationDTO shipmentConfirmationDTO) {
        return ResponseEntity.ok(null);
    }

}
