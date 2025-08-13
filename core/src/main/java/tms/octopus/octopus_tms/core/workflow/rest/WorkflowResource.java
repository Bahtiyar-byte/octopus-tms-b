package tms.octopus.octopus_tms.core.workflow.rest;

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
import tms.octopus.octopus_tms.core.workflow.model.WorkflowDTO;
import tms.octopus.octopus_tms.core.workflow.service.WorkflowService;


@RestController
@RequestMapping(value = "/api/workflows", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class WorkflowResource {

    private final WorkflowService workflowService;

    public WorkflowResource(final WorkflowService workflowService) {
        this.workflowService = workflowService;
    }

    @GetMapping
    public ResponseEntity<List<WorkflowDTO>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowDTO> getWorkflow(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(workflowService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createWorkflow(@RequestBody @Valid final WorkflowDTO workflowDTO) {
        final UUID createdId = workflowService.create(workflowDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateWorkflow(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final WorkflowDTO workflowDTO) {
        workflowService.update(id, workflowDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable(name = "id") final UUID id) {
        workflowService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
