package tms.octopus.octopus_tms.shipper.warehouse.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.base.util.ReferencedException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.shipper.warehouse.model.WarehouseDTO;
import tms.octopus.octopus_tms.shipper.warehouse.service.WarehouseService;


@RestController
@RequestMapping(value = "/api/warehouses", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class WarehouseResource {

    private final WarehouseService warehouseService;

    public WarehouseResource(final WarehouseService warehouseService) {
        this.warehouseService = warehouseService;
    }

    @Operation(
            parameters = {
                    @Parameter(
                            name = "page",
                            in = ParameterIn.QUERY,
                            schema = @Schema(implementation = Integer.class)
                    ),
                    @Parameter(
                            name = "size",
                            in = ParameterIn.QUERY,
                            schema = @Schema(implementation = Integer.class)
                    ),
                    @Parameter(
                            name = "sort",
                            in = ParameterIn.QUERY,
                            schema = @Schema(implementation = String.class)
                    )
            }
    )
    @GetMapping
    public ResponseEntity<Page<WarehouseDTO>> getAllWarehouses(
            @RequestParam(name = "filter", required = false) final String filter,
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(warehouseService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WarehouseDTO> getWarehouse(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(warehouseService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createWarehouse(
            @RequestBody @Valid final WarehouseDTO warehouseDTO) {
        final UUID createdId = warehouseService.create(warehouseDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateWarehouse(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final WarehouseDTO warehouseDTO) {
        warehouseService.update(id, warehouseDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable(name = "id") final UUID id) {
        final ReferencedWarning referencedWarning = warehouseService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        warehouseService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
