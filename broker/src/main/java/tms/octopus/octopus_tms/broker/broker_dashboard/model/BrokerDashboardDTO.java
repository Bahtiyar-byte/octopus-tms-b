package tms.octopus.octopus_tms.broker.broker_dashboard.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.Map;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class BrokerDashboardDTO {

    @NotNull
    private Long activeLoads;

    @NotNull
    private Long postedLoads;

    @NotNull
    private Long inTransitLoads;

    @NotNull
    private Long deliveredToday;

    @NotNull
    private Long pendingOffers;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "36.08")
    private BigDecimal totalRevenue;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "37.08")
    private BigDecimal monthlyRevenue;

    @NotNull
    @Digits(integer = 10, fraction = 2)
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    @Schema(type = "string", example = "36.08")
    private BigDecimal avgLoadRate;

    private Map<String, String> topLanes;

}
