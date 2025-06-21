package tms.octopus.octopus_tms.shipper.inventory_item.model;

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
public class InventoryItemDTO {

    private UUID id;

    private UUID companyId;

    @NotNull
    @Size(max = 100)
    private String sku;

    @NotNull
    @Size(max = 255)
    private String name;

    private String description;

    @Size(max = 100)
    private String category;

    @Size(max = 50)
    private String unitOfMeasure;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "24.08")
    private BigDecimal weight;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "70.08")
    private BigDecimal length;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "58.08")
    private BigDecimal width;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "89.08")
    private BigDecimal height;

    private Integer reorderPoint;

    private Integer reorderQuantity;

    private Boolean hazmat;

    private Boolean temperatureControlled;

    private Boolean fragile;

    @Size(max = 50)
    private String status;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
