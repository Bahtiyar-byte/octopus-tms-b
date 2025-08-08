package tms.octopus.octopus_tms.load.load_stop.rest;

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
import tms.octopus.octopus_tms.base.util.ReferencedException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.load.load_stop.model.LoadStopDTO;
import tms.octopus.octopus_tms.load.load_stop.service.LoadStopService;


@RestController
@RequestMapping(value = "/api/loadStops", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadStopResource {

    private final LoadStopService loadStopService;

    public LoadStopResource(final LoadStopService loadStopService) {
        this.loadStopService = loadStopService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<List<LoadStopDTO>> getAllLoadStops() {
        return ResponseEntity.ok(loadStopService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<LoadStopDTO> getLoadStop(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadStopService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "',  '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadStop(@RequestBody @Valid final LoadStopDTO loadStopDTO) {
        final UUID createdId = loadStopService.create(loadStopDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "',  '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<UUID> updateLoadStop(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadStopDTO loadStopDTO) {
        loadStopService.update(id, loadStopDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadStop(@PathVariable(name = "id") final UUID id) {
        final ReferencedWarning referencedWarning = loadStopService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        loadStopService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
