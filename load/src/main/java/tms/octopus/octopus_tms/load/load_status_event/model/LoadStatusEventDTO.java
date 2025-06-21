package tms.octopus.octopus_tms.load.load_status_event.model;

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
public class LoadStatusEventDTO {

    private UUID id;

    @NotNull
    @Size(max = 100)
    private String eventType;

    @NotNull
    private OffsetDateTime eventTimestamp;

    @Size(max = 255)
    private String oldValue;

    @Size(max = 255)
    private String newValue;

    private UUID stopId;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "84.0008")
    private BigDecimal latitude;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "39.0008")
    private BigDecimal longitude;

    private String notes;

    private String metadata;

    private UUID createdBy;

    @NotNull
    private UUID load;

}
