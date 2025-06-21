package tms.octopus.octopus_tms.core.ai_provider_config.rest;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.List;
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
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;
import tms.octopus.octopus_tms.core.ai_provider_config.service.AiProviderConfigService;


@RestController
@RequestMapping(value = "/api/aiProviderConfigs", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class AiProviderConfigResource {

    private final AiProviderConfigService aiProviderConfigService;

    public AiProviderConfigResource(final AiProviderConfigService aiProviderConfigService) {
        this.aiProviderConfigService = aiProviderConfigService;
    }

    @GetMapping
    public ResponseEntity<List<AiProviderConfigDTO>> getAllAiProviderConfigs() {
        return ResponseEntity.ok(aiProviderConfigService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AiProviderConfigDTO> getAiProviderConfig(
            @PathVariable(name = "id") final Long id) {
        return ResponseEntity.ok(aiProviderConfigService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<Long> createAiProviderConfig(
            @RequestBody @Valid final AiProviderConfigDTO aiProviderConfigDTO) {
        final Long createdId = aiProviderConfigService.create(aiProviderConfigDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Long> updateAiProviderConfig(@PathVariable(name = "id") final Long id,
            @RequestBody @Valid final AiProviderConfigDTO aiProviderConfigDTO) {
        aiProviderConfigService.update(id, aiProviderConfigDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteAiProviderConfig(@PathVariable(name = "id") final Long id) {
        aiProviderConfigService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
