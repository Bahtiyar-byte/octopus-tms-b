package tms.octopus.octopus_tms.core.user.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import tms.octopus.octopus_tms.core.user.model.ChangePasswordRequest;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.model.UserStatsDTO;
import tms.octopus.octopus_tms.core.user.service.UserService;

@RestController
@RequestMapping(value = "/api/profile", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class ProfileResource {

    private final UserService userService;

    public ProfileResource(final UserService userService) {
        this.userService = userService;
    }

    @Operation(summary = "Get current user profile")
    @GetMapping
    public ResponseEntity<UserDTO> getCurrentUser(Principal principal) {
        String username = principal != null ? principal.getName() : 
            SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getCurrentUser(username));
    }

    @Operation(summary = "Update current user profile")
    @PutMapping
    public ResponseEntity<UserDTO> updateCurrentUser(
            Principal principal,
            @RequestBody @Valid final UserDTO userDTO) {
        String username = principal != null ? principal.getName() : 
            SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.updateCurrentUser(username, userDTO));
    }

    @Operation(summary = "Change password")
    @PostMapping("/change-password")
    @ApiResponse(responseCode = "204", description = "Password changed successfully")
    public ResponseEntity<Void> changePassword(
            Principal principal,
            @RequestBody @Valid final ChangePasswordRequest request) {
        String username = principal != null ? principal.getName() : 
            SecurityContextHolder.getContext().getAuthentication().getName();
        userService.changePassword(username, request);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Upload profile avatar")
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ApiResponse(responseCode = "200", description = "Avatar uploaded successfully", 
                 content = @Content(schema = @Schema(implementation = String.class)))
    public ResponseEntity<String> uploadAvatar(
            Principal principal,
            @RequestParam("file") MultipartFile file) throws IOException {
        String username = principal != null ? principal.getName() : 
            SecurityContextHolder.getContext().getAuthentication().getName();
        String avatarUrl = userService.uploadAvatar(username, file);
        return ResponseEntity.ok(avatarUrl);
    }

    @Operation(summary = "Get user statistics")
    @GetMapping("/stats")
    public ResponseEntity<UserStatsDTO> getUserStats(Principal principal) {
        String username = principal != null ? principal.getName() : 
            SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(userService.getUserStats(username));
    }
}