package tms.octopus.octopus_tms.financial.accessorial_charge.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.accessorial_charge.model.AccessorialType;


@Getter
@Setter
public class AccessorialChargeDTO {

    private UUID id;

    @NotNull
    private AccessorialType chargeType;

    private String description;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "45.08")
    private BigDecimal quantity;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal rate;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "92.08")
    private BigDecimal amount;

    @NotNull
    @Size(max = 50)
    private String billableTo;

    @Size(max = 50)
    private String status;

    private OffsetDateTime approvedAt;

    @Size(max = 500)
    private String receiptUrl;

    private String notes;

    private OffsetDateTime createdAt;

}
