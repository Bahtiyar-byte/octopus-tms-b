package tms.octopus.octopus_tms.shipper.inventory_level.rest;

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
import tms.octopus.octopus_tms.shipper.inventory_level.model.InventoryLevelDTO;
import tms.octopus.octopus_tms.shipper.inventory_level.service.InventoryLevelService;


@RestController
@RequestMapping(value = "/api/inventoryLevels", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class InventoryLevelResource {

    private final InventoryLevelService inventoryLevelService;

    public InventoryLevelResource(final InventoryLevelService inventoryLevelService) {
        this.inventoryLevelService = inventoryLevelService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryLevelDTO>> getAllInventoryLevels() {
        return ResponseEntity.ok(inventoryLevelService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryLevelDTO> getInventoryLevel(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(inventoryLevelService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createInventoryLevel(
            @RequestBody @Valid final InventoryLevelDTO inventoryLevelDTO) {
        final UUID createdId = inventoryLevelService.create(inventoryLevelDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateInventoryLevel(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final InventoryLevelDTO inventoryLevelDTO) {
        inventoryLevelService.update(id, inventoryLevelDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteInventoryLevel(@PathVariable(name = "id") final UUID id) {
        inventoryLevelService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
