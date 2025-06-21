package tms.octopus.octopus_tms.load.load_offer.repos;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_offer.domain.LoadOffer;


public interface LoadOfferRepository extends JpaRepository<LoadOffer, UUID> {

    LoadOffer findFirstByLoad(Load load);

}
