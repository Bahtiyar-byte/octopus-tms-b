package tms.octopus.octopus_tms.core.workflow_log.rest;

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
import tms.octopus.octopus_tms.core.workflow_log.model.WorkflowLogDTO;
import tms.octopus.octopus_tms.core.workflow_log.service.WorkflowLogService;


@RestController
@RequestMapping(value = "/api/workflowLogs", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class WorkflowLogResource {

    private final WorkflowLogService workflowLogService;

    public WorkflowLogResource(final WorkflowLogService workflowLogService) {
        this.workflowLogService = workflowLogService;
    }

    @GetMapping
    public ResponseEntity<List<WorkflowLogDTO>> getAllWorkflowLogs() {
        return ResponseEntity.ok(workflowLogService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkflowLogDTO> getWorkflowLog(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(workflowLogService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createWorkflowLog(
            @RequestBody @Valid final WorkflowLogDTO workflowLogDTO) {
        final UUID createdId = workflowLogService.create(workflowLogDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateWorkflowLog(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final WorkflowLogDTO workflowLogDTO) {
        workflowLogService.update(id, workflowLogDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteWorkflowLog(@PathVariable(name = "id") final UUID id) {
        workflowLogService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
