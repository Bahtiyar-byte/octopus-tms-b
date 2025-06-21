package tms.octopus.octopus_tms.load.load_offer.model;

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


@Getter
@Setter
public class LoadOfferDTO {

    private UUID id;

    private UUID carrierId;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "99.08")
    private BigDecimal offeredRate;

    @Size(max = 50)
    private String status;

    private OffsetDateTime validUntil;

    @Size(max = 100)
    private String equipmentType;

    private UUID driverId;

    private String notes;

    private UUID createdBy;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @NotNull
    private UUID load;

}
