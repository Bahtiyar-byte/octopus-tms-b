package tms.octopus.octopus_tms.shipper.shipment_readiness.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ShipmentReadinessDTO {

    private UUID id;

    private UUID warehouseId;

    @Size(max = 100)
    private String orderNumber;

    private UUID customerId;

    @Size(max = 50)
    private String status;

    @Size(max = 50)
    private String priority;

    private LocalDate requiredDate;

    private String specialInstructions;

    private Integer totalItems;

    private Integer pickedItems;

    private Integer packedItems;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
