package tms.octopus.octopus_tms.load.load_status_event.rest;

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
import tms.octopus.octopus_tms.load.load_status_event.model.LoadStatusEventDTO;
import tms.octopus.octopus_tms.load.load_status_event.service.LoadStatusEventService;


@RestController
@RequestMapping(value = "/api/loadStatusEvents", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class LoadStatusEventResource {

    private final LoadStatusEventService loadStatusEventService;

    public LoadStatusEventResource(final LoadStatusEventService loadStatusEventService) {
        this.loadStatusEventService = loadStatusEventService;
    }

    @GetMapping
    public ResponseEntity<List<LoadStatusEventDTO>> getAllLoadStatusEvents() {
        return ResponseEntity.ok(loadStatusEventService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoadStatusEventDTO> getLoadStatusEvent(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadStatusEventService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadStatusEvent(
            @RequestBody @Valid final LoadStatusEventDTO loadStatusEventDTO) {
        final UUID createdId = loadStatusEventService.create(loadStatusEventDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateLoadStatusEvent(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadStatusEventDTO loadStatusEventDTO) {
        loadStatusEventService.update(id, loadStatusEventDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadStatusEvent(@PathVariable(name = "id") final UUID id) {
        loadStatusEventService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
