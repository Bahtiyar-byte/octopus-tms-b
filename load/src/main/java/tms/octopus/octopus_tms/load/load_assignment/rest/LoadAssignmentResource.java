package tms.octopus.octopus_tms.load.load_assignment.rest;

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
import tms.octopus.octopus_tms.load.load_assignment.model.LoadAssignmentDTO;
import tms.octopus.octopus_tms.load.load_assignment.service.LoadAssignmentService;


@RestController
@RequestMapping(value = "/api/loadAssignments", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
@SecurityRequirement(name = "bearer-jwt")
public class LoadAssignmentResource {

    private final LoadAssignmentService loadAssignmentService;

    public LoadAssignmentResource(final LoadAssignmentService loadAssignmentService) {
        this.loadAssignmentService = loadAssignmentService;
    }

    @GetMapping
    public ResponseEntity<List<LoadAssignmentDTO>> getAllLoadAssignments() {
        return ResponseEntity.ok(loadAssignmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoadAssignmentDTO> getLoadAssignment(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadAssignmentService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadAssignment(
            @RequestBody @Valid final LoadAssignmentDTO loadAssignmentDTO) {
        final UUID createdId = loadAssignmentService.create(loadAssignmentDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateLoadAssignment(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadAssignmentDTO loadAssignmentDTO) {
        loadAssignmentService.update(id, loadAssignmentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadAssignment(@PathVariable(name = "id") final UUID id) {
        loadAssignmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
