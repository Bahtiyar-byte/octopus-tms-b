package tms.octopus.octopus_tms.load.load_operations.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load.model.EquipmentType;
import tms.octopus.octopus_tms.base.load.model.LoadStatus;


@Getter
@Setter
public class LoadSearchCriteriaDTO {

    @Size(max = 100)
    private String originCity;

    @Size(max = 50)
    private String originState;

    @Size(max = 100)
    private String destinationCity;

    @Size(max = 50)
    private String destinationState;

    private LoadStatus status;

    private EquipmentType equipmentType;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "66.08")
    private BigDecimal minRate;

    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "68.08")
    private BigDecimal maxRate;

}
