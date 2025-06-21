package tms.octopus.octopus_tms.load.load_offer.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.load.load_offer.model.LoadOfferDTO;


public interface LoadOfferService {

    Page<LoadOfferDTO> findAll(Pageable pageable);

    LoadOfferDTO get(UUID id);

    UUID create(LoadOfferDTO loadOfferDTO);

    void update(UUID id, LoadOfferDTO loadOfferDTO);

    void delete(UUID id);

}
