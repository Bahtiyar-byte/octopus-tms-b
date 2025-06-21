package tms.octopus.octopus_tms.financial.rate_agreement.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;


@Getter
@Setter
public class RateAgreementDTO {

    private UUID id;

    @NotNull
    @Size(max = 50)
    private String agreementNumber;

    @Size(max = 100)
    private String laneOriginCity;

    @Size(max = 50)
    private String laneOriginState;

    @Size(max = 20)
    private String laneOriginZip;

    @Size(max = 100)
    private String laneDestinationCity;

    @Size(max = 50)
    private String laneDestinationState;

    @Size(max = 20)
    private String laneDestinationZip;

    private EquipmentType equipmentType;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "73.08")
    private BigDecimal baseRate;

    @Digits(integer = 5, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "34.08")
    private BigDecimal ratePerMile;

    @Digits(integer = 5, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "83.08")
    private BigDecimal fuelSurchargePercent;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "66.08")
    private BigDecimal minRate;

    private String accessorialRates;

    @NotNull
    private LocalDate validFrom;

    @NotNull
    private LocalDate validUntil;

    private Boolean autoRenew;

    @Size(max = 50)
    private String status;

    private String notes;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
