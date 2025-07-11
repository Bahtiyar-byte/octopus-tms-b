package tms.octopus.octopus_tms.shipper.shipment_readiness.rest;

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
import tms.octopus.octopus_tms.shipper.shipment_readiness.model.ShipmentReadinessDTO;
import tms.octopus.octopus_tms.shipper.shipment_readiness.service.ShipmentReadinessService;


@RestController
@RequestMapping(value = "/api/shipmentReadinesses", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "')")
@SecurityRequirement(name = "bearer-jwt")
public class ShipmentReadinessResource {

    private final ShipmentReadinessService shipmentReadinessService;

    public ShipmentReadinessResource(final ShipmentReadinessService shipmentReadinessService) {
        this.shipmentReadinessService = shipmentReadinessService;
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
    public ResponseEntity<Page<ShipmentReadinessDTO>> getAllShipmentReadinesses(
            @RequestParam(name = "filter", required = false) final String filter,
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(shipmentReadinessService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShipmentReadinessDTO> getShipmentReadiness(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(shipmentReadinessService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createShipmentReadiness(
            @RequestBody @Valid final ShipmentReadinessDTO shipmentReadinessDTO) {
        final UUID createdId = shipmentReadinessService.create(shipmentReadinessDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateShipmentReadiness(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final ShipmentReadinessDTO shipmentReadinessDTO) {
        shipmentReadinessService.update(id, shipmentReadinessDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteShipmentReadiness(@PathVariable(name = "id") final UUID id) {
        shipmentReadinessService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
