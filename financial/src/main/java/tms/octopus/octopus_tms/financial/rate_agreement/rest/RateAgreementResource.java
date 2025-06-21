package tms.octopus.octopus_tms.financial.rate_agreement.rest;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.financial.rate_agreement.model.RateAgreementDTO;
import tms.octopus.octopus_tms.financial.rate_agreement.service.RateAgreementService;


@RestController
@RequestMapping(value = "/api/rateAgreements", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAuthority('" + UserRole.Fields.ADMIN + "')")
@SecurityRequirement(name = "bearer-jwt")
public class RateAgreementResource {

    private final RateAgreementService rateAgreementService;

    public RateAgreementResource(final RateAgreementService rateAgreementService) {
        this.rateAgreementService = rateAgreementService;
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
    public ResponseEntity<Page<RateAgreementDTO>> getAllRateAgreements(
            @RequestParam(name = "filter", required = false) final String filter,
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(rateAgreementService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RateAgreementDTO> getRateAgreement(
            @PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(rateAgreementService.get(id));
    }

    @PostMapping
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createRateAgreement(
            @RequestBody @Valid final RateAgreementDTO rateAgreementDTO) {
        final UUID createdId = rateAgreementService.create(rateAgreementDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UUID> updateRateAgreement(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final RateAgreementDTO rateAgreementDTO) {
        rateAgreementService.update(id, rateAgreementDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteRateAgreement(@PathVariable(name = "id") final UUID id) {
        rateAgreementService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
