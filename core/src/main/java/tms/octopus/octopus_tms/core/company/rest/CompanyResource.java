package tms.octopus.octopus_tms.core.company.rest;

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
import tms.octopus.octopus_tms.base.util.ReferencedException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;
import tms.octopus.octopus_tms.core.company.service.CompanyService;


@RestController
@RequestMapping(value = "/api/companies", produces = MediaType.APPLICATION_JSON_VALUE)
@SecurityRequirement(name = "bearer-jwt")
public class CompanyResource {

    private final CompanyService companyService;

    public CompanyResource(final CompanyService companyService) {
        this.companyService = companyService;
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
    public ResponseEntity<Page<CompanyDTO>> getAllCompanies(
            @RequestParam(name = "filter", required = false) final String filter,
            @Parameter(hidden = true) @SortDefault(sort = "id") @PageableDefault(size = 20) final Pageable pageable) {
        return ResponseEntity.ok(companyService.findAll(filter, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<CompanyDTO> getCompany(@PathVariable(name = "id") final UUID id) {
        return ResponseEntity.ok(companyService.get(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "201")
    public ResponseEntity<UUID> createCompany(@RequestBody @Valid final CompanyDTO companyDTO) {
        final UUID createdId = companyService.create(companyDTO);
        return new ResponseEntity<>(createdId, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    public ResponseEntity<UUID> updateCompany(@PathVariable(name = "id") final UUID id,
            @RequestBody @Valid final CompanyDTO companyDTO) {
        companyService.update(id, companyDTO);
        return ResponseEntity.ok(id);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SALES_REP + "')")
    @ApiResponse(responseCode = "204")
    public ResponseEntity<Void> deleteCompany(@PathVariable(name = "id") final UUID id) {
        final ReferencedWarning referencedWarning = companyService.getReferencedWarning(id);
        if (referencedWarning != null) {
            throw new ReferencedException(referencedWarning);
        }
        companyService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
