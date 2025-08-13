package tms.octopus.octopus_tms.load.load_status_history.rest;

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
import tms.octopus.octopus_tms.load.load_status_history.model.LoadStatusHistoryDTO;
import tms.octopus.octopus_tms.load.load_status_history.service.LoadStatusHistoryService;


@RestController
@RequestMapping(value = "/api/loadStatusHistories", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadStatusHistoryResource {

    private final LoadStatusHistoryService loadStatusHistoryService;

    public LoadStatusHistoryResource(final LoadStatusHistoryService loadStatusHistoryService) {
        this.loadStatusHistoryService = loadStatusHistoryService;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
    public ResponseEntity<List<LoadStatusHistoryDTO>> getAllLoadStatusHistories() {
        return ResponseEntity.ok(loadStatusHistoryService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<LoadStatusHistoryDTO> getLoadStatusHistory(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadStatusHistoryService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadStatusHistory(
            @RequestBody @Valid final LoadStatusHistoryDTO loadStatusHistoryDTO) {
        final UUID createdId = loadStatusHistoryService.create(loadStatusHistoryDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
    public ResponseEntity<UUID> updateLoadStatusHistory(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadStatusHistoryDTO loadStatusHistoryDTO) {
        loadStatusHistoryService.update(id, loadStatusHistoryDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadStatusHistory(@PathVariable(name = "id") final UUID id) {
        loadStatusHistoryService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
