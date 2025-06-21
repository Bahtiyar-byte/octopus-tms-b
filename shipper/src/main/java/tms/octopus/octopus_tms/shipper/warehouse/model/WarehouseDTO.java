package tms.octopus.octopus_tms.shipper.warehouse.model;

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
public class WarehouseDTO {

    private UUID id;

    private UUID companyId;

    @NotNull
    @Size(max = 255)
    private String name;

    @Size(max = 50)
    private String code;

    @Size(max = 500)
    private String address;

    @Size(max = 100)
    private String city;

    @Size(max = 50)
    private String state;

    @Size(max = 20)
    private String zip;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "84.0008")
    private BigDecimal latitude;

    @Digits(integer = 10, fraction = 6)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "39.0008")
    private BigDecimal longitude;

    private UUID managerId;

    @Size(max = 50)
    private String phone;

    @Size(max = 255)
    private String email;

    private String operatingHours;

    private Integer capacitySqft;

    private Integer dockDoors;

    @Size(max = 50)
    private String status;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
