package tms.octopus.octopus_tms.load.load_offer.rest;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.SortDefault;
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
import tms.octopus.octopus_tms.load.load_offer.model.LoadOfferDTO;
import tms.octopus.octopus_tms.load.load_offer.service.LoadOfferService;


@RestController
@RequestMapping(value = "/api/loadOffers", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class LoadOfferResource {

    private final LoadOfferService loadOfferService;

    public LoadOfferResource(final LoadOfferService loadOfferService) {
        this.loadOfferService = loadOfferService;
    }

    @Operation(
            parameters = {
                    @Parameter(
                            name = "page",
                            in = ParameterIn.QUERY,
                            schema = @Schema(implementation = Integer.class)
                    ),
                    @Parameter(
                            name = "size",
                            in = ParameterIn.QUERY,
                            schema = @Schema(implementation = Integer.class)
                    ),
                    @Parameter(
                            name = "sort",
                            in = ParameterIn.QUERY,
                            schema = @Schema(implementation = String.class)
                    )
            }
    )
    @GetMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<Page<LoadOfferDTO>> getAllLoadOffers(
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(loadOfferService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "',  '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<LoadOfferDTO> getLoadOffer(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(loadOfferService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "',  '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createLoadOffer(
            @RequestBody @Valid final LoadOfferDTO loadOfferDTO) {
        final UUID createdId = loadOfferService.create(loadOfferDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<UUID> updateLoadOffer(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final LoadOfferDTO loadOfferDTO) {
        loadOfferService.update(id, loadOfferDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteLoadOffer(@PathVariable(name = "id") final UUID id) {
        loadOfferService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
