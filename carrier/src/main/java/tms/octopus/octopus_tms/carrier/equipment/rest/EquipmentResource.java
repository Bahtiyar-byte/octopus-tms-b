package tms.octopus.octopus_tms.carrier.equipment.rest;

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
import tms.octopus.octopus_tms.carrier.equipment.model.EquipmentDTO;
import tms.octopus.octopus_tms.carrier.equipment.service.EquipmentService;


@RestController
@RequestMapping(value = "/api/equipments", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.DISPATCHER + "')")
@SecurityRequirement(name = "bearer-jwt")
public class EquipmentResource {

    private final EquipmentService equipmentService;

    public EquipmentResource(final EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping
    public ResponseEntity<List<EquipmentDTO>> getAllEquipments() {
        return ResponseEntity.ok(equipmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EquipmentDTO> getEquipment(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(equipmentService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createEquipment(
            @RequestBody @Valid final EquipmentDTO equipmentDTO) {
        final UUID createdId = equipmentService.create(equipmentDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateEquipment(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final EquipmentDTO equipmentDTO) {
        equipmentService.update(id, equipmentDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteEquipment(@PathVariable(name = "id") final UUID id) {
        equipmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
