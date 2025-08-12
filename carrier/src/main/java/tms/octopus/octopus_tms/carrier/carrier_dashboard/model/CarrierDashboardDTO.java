package tms.octopus.octopus_tms.carrier.carrier_dashboard.model;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CarrierDashboardDTO {

    @NotNull
    private Long unassignedShipments;

    @NotNull
    private Long enRouteShipments;
}
