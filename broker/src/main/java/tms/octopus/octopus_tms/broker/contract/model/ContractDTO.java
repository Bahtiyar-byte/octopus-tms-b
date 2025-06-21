package tms.octopus.octopus_tms.broker.contract.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ContractDTO {

    private UUID id;

    private UUID brokerId;

    private UUID carrierId;

    @Size(max = 50)
    private String contractNumber;

    @Size(max = 50)
    private String status;

    private LocalDate effectiveDate;

    private LocalDate expirationDate;

    private Boolean autoRenew;

    private String terms;

    private String rateSchedule;

    private String insuranceRequirements;

    private LocalDate signedDate;

    @Size(max = 255)
    private String signedBy;

    @Size(max = 500)
    private String filePath;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
