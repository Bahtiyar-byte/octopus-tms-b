package tms.octopus.octopus_tms.core.ai_provider_config.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tms.octopus.octopus_tms.core.ai_provider_config.model.AiProviderConfigDTO;
import tms.octopus.octopus_tms.core.ai_provider_config.service.AiProviderConfigService;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/integrations/ai")
@RequiredArgsConstructor
public class AIIntegrationController {

    private final AiProviderConfigService aiProviderConfigService;

    @GetMapping("/configurations")
    public ResponseEntity<List<AiProviderConfigDTO>> getUserConfigurations(Principal principal) {
        // Return all configurations for now
        List<AiProviderConfigDTO> configs = aiProviderConfigService.findAll();
        return ResponseEntity.ok(configs);
    }

    @PostMapping("/configure")
    public ResponseEntity<AiProviderConfigDTO> saveConfiguration(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        
        // Create a new DTO from the request
        AiProviderConfigDTO dto = new AiProviderConfigDTO();
        dto.setProvider((String) request.get("provider"));
        dto.setApiKey((String) request.get("apiKey"));
        dto.setIsActive((Boolean) request.getOrDefault("isActive", true));
        
        // Save using existing service
        Long id = aiProviderConfigService.create(dto);
        dto.setId(id);
        
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Boolean>> testConnection(
            @RequestBody Map<String, Object> request,
            Principal principal) {
        
        // For now, just return success
        boolean isValid = true;
        return ResponseEntity.ok(Map.of("valid", isValid));
    }

    @DeleteMapping("/configurations/{configId}")
    public ResponseEntity<Void> deleteConfiguration(
            @PathVariable Long configId,
            Principal principal) {
        
        aiProviderConfigService.delete(configId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/configurations/{configId}/toggle")
    public ResponseEntity<Void> toggleConfiguration(
            @PathVariable Long configId,
            Principal principal) {
        
        // Get existing config, toggle active status
        AiProviderConfigDTO config = aiProviderConfigService.get(configId);
        config.setIsActive(!config.getIsActive());
        aiProviderConfigService.update(configId, config);
        
        return ResponseEntity.ok().build();
    }
}