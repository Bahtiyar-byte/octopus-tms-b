package tms.octopus.octopus_tms.carrier.carrier.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.company.model.CompanyType;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.carrier.carrier.model.AvailableCarrierDTO;
import tms.octopus.octopus_tms.core.company.domain.Company;
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;

@RestController
@RequestMapping(value = "/api/carriers", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.ADMIN + "', '" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.SALES + "', '" + UserRole.Fields.DISPATCHER + "')")
@SecurityRequirement(name = "bearer-jwt")
@Tag(name = "Carrier - Carriers")
public class CarrierResource {

    private final CompanyRepository companyRepository;

    public CarrierResource(final CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @GetMapping("/available")
    public ResponseEntity<List<AvailableCarrierDTO>> getAvailableCarriers() {
        List<Company> carriers = companyRepository.findByType(CompanyType.CARRIER);

        List<AvailableCarrierDTO> result = carriers.stream().map(company -> {
            AvailableCarrierDTO dto = new AvailableCarrierDTO();
            dto.setId(company.getId());
            dto.setName(company.getName());
            // Contact is not modeled in Company; reuse name/email as a placeholder
            dto.setContact(company.getName());
            dto.setPhone(company.getPhone());
            dto.setEmail(company.getEmail());
            dto.setRating(0.0); // No rating available yet
            dto.setAvailableEquipment(List.of());
            dto.setPreferredLanes(List.of());
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }
}
