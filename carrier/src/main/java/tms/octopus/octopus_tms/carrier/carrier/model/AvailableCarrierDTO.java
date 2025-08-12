package tms.octopus.octopus_tms.carrier.carrier.model;

import java.util.List;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvailableCarrierDTO {

    private UUID id;
    private String name;
    private String contact;
    private String phone;
    private String email;
    private Double rating;
    private List<String> availableEquipment;
    private List<Lane> preferredLanes;

    @Getter
    @Setter
    public static class Lane {
        private String origin;
        private String destination;
    }
}

