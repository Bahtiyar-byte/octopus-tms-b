package tms.octopus.octopus_tms.core.company.model;

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
import tms.octopus.octopus_tms.base.company.model.CompanyType;


@Getter
@Setter
public class CompanyDTO {

    private UUID id;

    @NotNull
    @Size(max = 255)
    private String name;

    @NotNull
    private CompanyType type;

    @Size(max = 50)
    private String mcNumber;

    @Size(max = 50)
    private String dotNumber;

    @Size(max = 50)
    private String ein;

    @Size(max = 255)
    private String addressLine1;

    @Size(max = 255)
    private String addressLine2;

    @Size(max = 100)
    private String city;

    @Size(max = 50)
    private String state;

    @Size(max = 20)
    private String zipCode;

    @Size(max = 50)
    private String country;

    @Size(max = 50)
    private String phone;

    @Size(max = 255)
    private String email;

    @Size(max = 255)
    private String website;

    @Size(max = 500)
    private String logoUrl;

    @Size(max = 50)
    private String status;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "82.08")
    private BigDecimal creditLimit;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "26.08")
    private BigDecimal creditUsed;

    private Integer paymentTerms;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

}
