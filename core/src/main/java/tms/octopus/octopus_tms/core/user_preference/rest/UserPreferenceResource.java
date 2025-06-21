package tms.octopus.octopus_tms.core.user_preference.rest;

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
import tms.octopus.octopus_tms.core.user_preference.model.UserPreferenceDTO;
import tms.octopus.octopus_tms.core.user_preference.service.UserPreferenceService;


@RestController
@RequestMapping(value = "/api/userPreferences", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPPORT + "')")
@SecurityRequirement(name = "bearer-jwt")
public class UserPreferenceResource {

    private final UserPreferenceService userPreferenceService;

    public UserPreferenceResource(final UserPreferenceService userPreferenceService) {
        this.userPreferenceService = userPreferenceService;
    }

    @GetMapping
    public ResponseEntity<List<UserPreferenceDTO>> getAllUserPreferences() {
        return ResponseEntity.ok(userPreferenceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserPreferenceDTO> getUserPreference(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(userPreferenceService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createUserPreference(
            @RequestBody @Valid final UserPreferenceDTO userPreferenceDTO) {
        final UUID createdId = userPreferenceService.create(userPreferenceDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateUserPreference(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final UserPreferenceDTO userPreferenceDTO) {
        userPreferenceService.update(id, userPreferenceDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteUserPreference(@PathVariable(name = "id") final UUID id) {
        userPreferenceService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
