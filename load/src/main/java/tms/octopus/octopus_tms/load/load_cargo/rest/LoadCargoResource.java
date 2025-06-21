package tms.octopus.octopus_tms.load.load_cargo.rest;

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
import tms.octopus.octopus_tms.load.load_cargo.model.LoadCargoDTO;
import tms.octopus.octopus_tms.load.load_cargo.service.LoadCargoService;


@RestController
@RequestMapping(value = "/api/loadCargos", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.DISPATCHER + "')")
@SecurityRequirement(name = "bearer-jwt")
public class LoadCargoResource {

    private final LoadCargoService loadCargoService;

    public LoadCargoResource(final LoadCargoService loadCargoService) {
        this.loadCargoService = loadCargoService;
    }

    @GetMapping
    public ResponseEntity<List<LoadCargoDTO>> getAllLoadCargos() {
        return ResponseEntity.ok(loadCargoService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoadCargoDTO> getLoadCargo(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadCargoService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadCargo(
            @RequestBody @Valid final LoadCargoDTO loadCargoDTO) {
        final UUID createdId = loadCargoService.create(loadCargoDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateLoadCargo(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadCargoDTO loadCargoDTO) {
        loadCargoService.update(id, loadCargoDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadCargo(@PathVariable(name = "id") final UUID id) {
        loadCargoService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
