package tms.octopus.octopus_tms.carrier.driver_performance.rest;

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
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.carrier.driver_performance.model.DriverPerformanceDTO;
import tms.octopus.octopus_tms.carrier.driver_performance.service.DriverPerformanceService;


@RestController
@RequestMapping(value = "/api/driverPerformances", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class DriverPerformanceResource {

    private final DriverPerformanceService driverPerformanceService;

    public DriverPerformanceResource(final DriverPerformanceService driverPerformanceService) {
        this.driverPerformanceService = driverPerformanceService;
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
    public ResponseEntity<Page<DriverPerformanceDTO>> getAllDriverPerformances(
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(driverPerformanceService.findAll(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DriverPerformanceDTO> getDriverPerformance(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(driverPerformanceService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createDriverPerformance(
            @RequestBody @Valid final DriverPerformanceDTO driverPerformanceDTO) {
        final UUID createdId = driverPerformanceService.create(driverPerformanceDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateDriverPerformance(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final DriverPerformanceDTO driverPerformanceDTO) {
        driverPerformanceService.update(id, driverPerformanceDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteDriverPerformance(@PathVariable(name = "id") final UUID id) {
        driverPerformanceService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
