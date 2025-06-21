package tms.octopus.octopus_tms.load.load_operations.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;
import tms.octopus.octopus_tms.load.load_cargo.model.LoadCargoDTO;
import tms.octopus.octopus_tms.load.load_document.model.LoadDocumentDTO;
import tms.octopus.octopus_tms.load.load_offer.model.LoadOfferDTO;
import tms.octopus.octopus_tms.load.load_stop.model.LoadStopDTO;
import tms.octopus.octopus_tms.load.load_tracking.model.LoadTrackingDTO;


@Getter
@Setter
public class LoadDetailDTO {

    @NotNull
    @Valid
    private LoadDTO load;

    @NotNull
    @Valid
    private List<LoadStopDTO> stops;

    @NotNull
    @Valid
    private List<LoadCargoDTO> cargoes;

    @Valid
    private CompanyDTO brokerCompany;

    @Valid
    private CompanyDTO carrierCompany;

    @Valid
    private CompanyDTO shipperCompany;

    @Valid
    private LoadTrackingDTO currentTracking;

    @Valid
    private List<LoadOfferDTO> activeOffers;

    @Valid
    private List<LoadDocumentDTO> documents;

}
