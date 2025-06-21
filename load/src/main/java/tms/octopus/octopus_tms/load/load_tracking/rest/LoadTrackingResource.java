package tms.octopus.octopus_tms.load.load_tracking.rest;

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
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;
import tms.octopus.octopus_tms.load.load_tracking.service.LoadTrackingService;


@RestController
@RequestMapping(value = "/api/loadTrackings", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadTrackingResource {

    private final LoadTrackingService loadTrackingService;

    public LoadTrackingResource(final LoadTrackingService loadTrackingService) {
        this.loadTrackingService = loadTrackingService;
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
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<Page<LoadTrackingDTO>> getAllLoadTrackings(
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(loadTrackingService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadTrackingDTO> getLoadTracking(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadTrackingService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadTracking(
            @RequestBody @Valid final LoadTrackingDTO loadTrackingDTO) {
        final UUID createdId = loadTrackingService.create(loadTrackingDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "')")
    public ResponseEntity<UUID> updateLoadTracking(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadTrackingDTO loadTrackingDTO) {
        loadTrackingService.update(id, loadTrackingDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadTracking(@PathVariable(name = "id") final UUID id) {
        loadTrackingService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
