package tms.octopus.octopus_tms.core.ai_provider_config.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import tms.octopus.octopus_tms.core.ai_provider_config.model.*;
import tms.octopus.octopus_tms.core.ai_provider_config.service.AiIntegrationService;

import jakarta.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Tag(name = "AI Integration", description = "AI provider management")
public class AiIntegrationController {

    private final AiIntegrationService aiIntegrationService;

    @GetMapping("/providers")
    @Operation(summary = "Get all AI provider configurations")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERVISOR')")
    public ResponseEntity<List<AiProviderConfigDTO>> getAllProviders() {
        return ResponseEntity.ok(aiIntegrationService.getAllProviders());
    }

    @GetMapping("/providers/active")
    @Operation(summary = "Get active AI provider configurations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AiProviderConfigDTO>> getActiveProviders() {
        return ResponseEntity.ok(aiIntegrationService.getActiveProviders());
    }

    @PostMapping("/providers")
    @Operation(summary = "Create or update an AI provider configuration")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AiProviderConfigDTO> saveProvider(@Valid @RequestBody AiProviderConfigDTO providerConfig) {
        log.info("Saving AI provider configuration: {}", providerConfig.getProvider());
        return ResponseEntity.ok(aiIntegrationService.saveProvider(providerConfig));
    }

    @DeleteMapping("/providers/{id}")
    @Operation(summary = "Delete an AI provider configuration")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProvider(@PathVariable Long id) {
        log.info("Deleting AI provider configuration: {}", id);
        aiIntegrationService.deleteProvider(id);
        return ResponseEntity.noContent().build();
    }
}