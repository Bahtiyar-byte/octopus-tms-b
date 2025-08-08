package tms.octopus.octopus_tms.load.load.rest;

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
import tms.octopus.octopus_tms.load.load.model.LoadDTO;
import tms.octopus.octopus_tms.load.load.service.LoadService;


@RestController
@RequestMapping(value = "/api/loads", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadResource {

    private final LoadService loadService;

    public LoadResource(final LoadService loadService) {
        this.loadService = loadService;
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
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "', '" + UserRole.Fields.SUPPORT + "')")
    public ResponseEntity<Page<LoadDTO>> getAllLoads(
            @RequestParam(name = "filter", required = false) final String filter,
            @RequestParam(name = "search", required = false) final String search,
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(loadService.findAll(filter, search, pageable));
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
    @GetMapping("/broker/{brokerId}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<Page<LoadDTO>> getLoadsByBrokerId(
            @PathVariable(name = "brokerId") final UUID brokerId,
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(loadService.findAllByBrokerId(brokerId, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.DRIVER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<LoadDTO> getLoad(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoad(@RequestBody @Valid final LoadDTO loadDTO) {
        final UUID createdId = loadService.create(loadDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    public ResponseEntity<UUID> updateLoad(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadDTO loadDTO) {
        loadService.update(id, loadDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "', '" + UserRole.Fields.SALES + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoad(@PathVariable(name = "id") final UUID id) {
        final ReferencedWarning referencedWarning = loadService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        loadService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
