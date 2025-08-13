package tms.octopus.octopus_tms.load.load_document.rest;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.load.load_document.model.LoadDocumentDTO;
import tms.octopus.octopus_tms.load.load_document.service.LoadDocumentService;


@RestController
@RequestMapping(value = "/api/loadDocuments", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadDocumentResource {

    private final LoadDocumentService loadDocumentService;

    public LoadDocumentResource(final LoadDocumentService loadDocumentService) {
        this.loadDocumentService = loadDocumentService;
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<List<LoadDocumentDTO>> getAllLoadDocuments(
            @RequestParam(name = "filter", required = false) final String filter) {
        return ResponseEntity.ok(loadDocumentService.findAll(filter));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<LoadDocumentDTO> getLoadDocument(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadDocumentService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadDocument(
            @RequestBody @Valid final LoadDocumentDTO loadDocumentDTO) {
        final UUID createdId = loadDocumentService.create(loadDocumentDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<UUID> updateLoadDocument(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadDocumentDTO loadDocumentDTO) {
        loadDocumentService.update(id, loadDocumentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadDocument(@PathVariable(name = "id") final UUID id) {
        loadDocumentService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
