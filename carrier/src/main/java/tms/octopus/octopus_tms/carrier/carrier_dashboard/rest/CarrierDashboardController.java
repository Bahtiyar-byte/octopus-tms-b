package tms.octopus.octopus_tms.carrier.carrier_dashboard.rest;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import tms.octopus.octopus_tms.base.user.model.UserRole;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.service.UserService;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.carrier.carrier_dashboard.model.CarrierDashboardDTO;

import java.util.UUID;

@RestController
@RequestMapping(value = "/dashboard", produces = MediaType.APPLICATION_JSON_VALUE)
@PreAuthorize("hasAnyAuthority('" + UserRole.Fields.SUPERVISOR + "', '" + UserRole.Fields.SALES + "', '" + UserRole.Fields.DISPATCHER + "')")
@SecurityRequirement(name = "bearer-jwt")
public class CarrierDashboardController {

    private final UserService userService;
    private final LoadRepository loadRepository;

    public CarrierDashboardController(UserService userService, LoadRepository loadRepository) {
        this.userService = userService;
        this.loadRepository = loadRepository;
    }

    @GetMapping("/carrier")
    public ResponseEntity<CarrierDashboardDTO> getCarrierDashboard() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserDTO user = userService.getCurrentUser(username);
        UUID companyId = user.getCompany();

        long unassigned = 0L;
        if (companyId != null) {
            unassigned = loadRepository.countByCarrierIdAndAssignedDriverIdIsNull(companyId);
        }

        CarrierDashboardDTO dto = new CarrierDashboardDTO();
        dto.setUnassignedShipments(unassigned);
        return ResponseEntity.ok(dto);
    }

}
