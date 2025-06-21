package tms.octopus.octopus_tms.load.load_cargo.model;

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
public class LoadCargoDTO {

    private UUID id;

    @NotNull
    @Size(max = 255)
    private String commodity;

    @Size(max = 50)
    private String commodityCode;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "24.08")
    private BigDecimal weight;

    @Size(max = 10)
    private String weightUnit;

    private Integer pieces;

    private Integer palletCount;

    private String dimensions;

    private Boolean hazmat;

    @Size(max = 50)
    private String hazmatClass;

    @Size(max = 10)
    private String unNumber;

    private Boolean temperatureControlled;

    @Digits(integer = 5, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "66.08")
    private BigDecimal temperatureMin;

    @Digits(integer = 5, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "28.08")
    private BigDecimal temperatureMax;

    @Size(max = 10)
    private String temperatureUnit;

    @Digits(integer = 12, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "67.08")
    private BigDecimal cargoValue;

    @Size(max = 100)
    private String poNumber;

    @Size(max = 50)
    private String sealNumber;

    @Size(max = 50)
    private String cargoStatus;

    @Size(max = 100)
    private String referenceNumber;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @NotNull
    private UUID load;

    private UUID pickupStop;

    private UUID deliveryStop;

}
