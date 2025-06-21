package tms.octopus.octopus_tms.shipper.warehouse_operations.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ShipmentConfirmationDTO {

    @NotNull
    @Size(max = 255)
    private String confirmedBy;

    @NotNull
    private Integer actualPickedItems;

    @NotNull
    private Integer actualPackedItems;

    private UUID loadId;

    @Size(max = 1000)
    private String notes;

}
