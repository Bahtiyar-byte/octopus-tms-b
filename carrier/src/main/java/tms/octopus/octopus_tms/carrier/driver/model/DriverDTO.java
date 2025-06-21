package tms.octopus.octopus_tms.carrier.driver.model;

import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class DriverDTO {

    private UUID id;

    private UUID companyId;

    private UUID userId;

    @Size(max = 50)
    private String driverCode;

    @Size(max = 50)
    private String cdlNumber;

    @Size(max = 50)
    private String cdlState;

    private LocalDate cdlExpiration;

    private LocalDate medicalCertExpiration;

    private Boolean hazmatEndorsed;

    private Boolean tankerEndorsed;

    private Boolean doublesEndorsed;

    @Size(max = 50)
    private String assignedTruck;

    @Size(max = 100)
    private String homeTerminal;

    @Size(max = 50)
    private String status;

    private LocalDate hireDate;

    private LocalDate terminationDate;

    @Size(max = 255)
    private String emergencyContactName;

    @Size(max = 50)
    private String emergencyContactPhone;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
