package tms.octopus.octopus_tms.shipper.inventory_movement.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.shipper.inventory_movement.model.InventoryMovementDTO;
import tms.octopus.octopus_tms.shipper.inventory_movement.service.InventoryMovementService;


@RestController
@RequestMapping(value = "/api/inventoryMovements", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class InventoryMovementResource {

    private final InventoryMovementService inventoryMovementService;

    public InventoryMovementResource(final InventoryMovementService inventoryMovementService) {
        this.inventoryMovementService = inventoryMovementService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryMovementDTO>> getAllInventoryMovements() {
        return ResponseEntity.ok(inventoryMovementService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryMovementDTO> getInventoryMovement(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(inventoryMovementService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createInventoryMovement(
            @RequestBody @Valid final InventoryMovementDTO inventoryMovementDTO) {
        final UUID createdId = inventoryMovementService.create(inventoryMovementDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateInventoryMovement(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final InventoryMovementDTO inventoryMovementDTO) {
        inventoryMovementService.update(id, inventoryMovementDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteInventoryMovement(@PathVariable(name = "id") final UUID id) {
        inventoryMovementService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
