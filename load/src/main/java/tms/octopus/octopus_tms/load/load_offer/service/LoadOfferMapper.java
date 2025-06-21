package tms.octopus.octopus_tms.load.load_offer.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_offer.domain.LoadOffer;
import tms.octopus.octopus_tms.load.load_offer.model.LoadOfferDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadOfferMapper {

    @Mapping(target = "load", ignore = true)
    LoadOfferDTO updateLoadOfferDTO(LoadOffer loadOffer, @MappingTarget LoadOfferDTO loadOfferDTO);

    @AfterMapping
    default void afterUpdateLoadOfferDTO(LoadOffer loadOffer,
            @MappingTarget LoadOfferDTO loadOfferDTO) {
        loadOfferDTO.setLoad(loadOffer.getLoad() == null ? null : loadOffer.getLoad().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "load", ignore = true)
    LoadOffer updateLoadOffer(LoadOfferDTO loadOfferDTO, @MappingTarget LoadOffer loadOffer,
            @Context LoadRepository loadRepository);

    @AfterMapping
    default void afterUpdateLoadOffer(LoadOfferDTO loadOfferDTO, @MappingTarget LoadOffer loadOffer,
            @Context LoadRepository loadRepository) {
        final Load load = loadOfferDTO.getLoad() == null ? null : loadRepository.findById(loadOfferDTO.getLoad())
                .orElseThrow(() -> new NotFoundException("load not found"));
        loadOffer.setLoad(load);
    }

}
