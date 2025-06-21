package tms.octopus.octopus_tms.load.load_operations.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
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
import tms.octopus.octopus_tms.core.load_operations.model.DriverAssignmentDTO;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;
import tms.octopus.octopus_tms.load.load_operations.model.LoadDetailDTO;
import tms.octopus.octopus_tms.load.load_operations.model.LoadQuoteRequestDTO;
import tms.octopus.octopus_tms.load.load_operations.model.LoadSearchCriteriaDTO;
import tms.octopus.octopus_tms.load.load_operations.model.LoadSearchDTO;
import tms.octopus.octopus_tms.load.load_operations.model.LoadStatusUpdateDTO;
import tms.octopus.octopus_tms.load.load_operations.model.LoadTrackingUpdateDTO;
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;


@RestController
@RequestMapping(value = "/load-operations", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadOperationsController {

    @GetMapping("/{loadId}/details")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.DRIVER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadDetailDTO> getLoadDetails(
            @PathVariable(name = "loadId") final String loadId) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/{loadId}/accept-offer/{offerId}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadDTO> acceptOffer(@PathVariable(name = "loadId") final String loadId,
            @PathVariable(name = "offerId") final String offerId) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/{loadId}/assign-driver")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadDTO> assignDriver(@PathVariable(name = "loadId") final String loadId,
            @RequestBody @Valid final DriverAssignmentDTO driverAssignmentDTO) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/{loadId}/update-status")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadDTO> updateLoadStatus(
            @PathVariable(name = "loadId") final String loadId,
            @RequestBody @Valid final LoadStatusUpdateDTO loadStatusUpdateDTO) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/tracking/update")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.DRIVER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadTrackingDTO> updateTracking(
            @RequestBody @Valid final LoadTrackingUpdateDTO loadTrackingUpdateDTO) {
        return ResponseEntity.ok(null);
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
    @PostMapping("/search")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<Page<LoadSearchDTO>> searchLoads(
            @RequestBody @Valid final LoadSearchCriteriaDTO loadSearchCriteriaDTO,
            @Parameter(hidden = true) @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(null);
    }

    @PostMapping("/quote-request")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<LoadQuoteRequestDTO> requestQuote(
            @RequestBody @Valid final LoadQuoteRequestDTO loadQuoteRequestDTO) {
        return new ResponseEntity<>(null, HttpStatus.CREATED);
    }

}
