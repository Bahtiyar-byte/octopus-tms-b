package tms.octopus.octopus_tms.core.workflow_execution.rest;

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
import tms.octopus.octopus_tms.core.workflow_execution.model.WorkflowExecutionDTO;
import tms.octopus.octopus_tms.core.workflow_execution.service.WorkflowExecutionService;


@RestController
@RequestMapping(value = "/api/workflowExecutions", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class WorkflowExecutionResource {

    private final WorkflowExecutionService workflowExecutionService;

    public WorkflowExecutionResource(final WorkflowExecutionService workflowExecutionService) {
        this.workflowExecutionService = workflowExecutionService;
    }

    @GetMapping
    public ResponseEntity<List<WorkflowExecutionDTO>> getAllWorkflowExecutions() {
        return ResponseEntity.ok(workflowExecutionService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowExecutionDTO> getWorkflowExecution(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(workflowExecutionService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createWorkflowExecution(
            @RequestBody @Valid final WorkflowExecutionDTO workflowExecutionDTO) {
        final UUID createdId = workflowExecutionService.create(workflowExecutionDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateWorkflowExecution(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final WorkflowExecutionDTO workflowExecutionDTO) {
        workflowExecutionService.update(id, workflowExecutionDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteWorkflowExecution(@PathVariable(name = "id") final UUID id) {
        workflowExecutionService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
