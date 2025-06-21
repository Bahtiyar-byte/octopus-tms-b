package tms.octopus.octopus_tms.load.load_offer.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.load.load.repos.LoadRepository;
import tms.octopus.octopus_tms.load.load_offer.domain.LoadOffer;
import tms.octopus.octopus_tms.load.load_offer.model.LoadOfferDTO;
import tms.octopus.octopus_tms.load.load_offer.repos.LoadOfferRepository;


@Service
public class LoadOfferServiceImpl implements LoadOfferService {

    private final LoadOfferRepository loadOfferRepository;
    private final LoadRepository loadRepository;
    private final LoadOfferMapper loadOfferMapper;

    public LoadOfferServiceImpl(final LoadOfferRepository loadOfferRepository,
            final LoadRepository loadRepository, final LoadOfferMapper loadOfferMapper) {
        this.loadOfferRepository = loadOfferRepository;
        this.loadRepository = loadRepository;
        this.loadOfferMapper = loadOfferMapper;
    }

    @Override
    public Page<LoadOfferDTO> findAll(final Pageable pageable) {
        final Page<LoadOffer> page = loadOfferRepository.findAll(pageable);
        return new PageImpl<>(page.getContent()
                .stream()
                .map(loadOffer -> loadOfferMapper.updateLoadOfferDTO(loadOffer, new LoadOfferDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public LoadOfferDTO get(final UUID id) {
        return loadOfferRepository.findById(id)
                .map(loadOffer -> loadOfferMapper.updateLoadOfferDTO(loadOffer, new LoadOfferDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final LoadOfferDTO loadOfferDTO) {
        final LoadOffer loadOffer = new LoadOffer();
        loadOfferMapper.updateLoadOffer(loadOfferDTO, loadOffer, loadRepository);
        return loadOfferRepository.save(loadOffer).getId();
    }

    @Override
    public void update(final UUID id, final LoadOfferDTO loadOfferDTO) {
        final LoadOffer loadOffer = loadOfferRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        loadOfferMapper.updateLoadOffer(loadOfferDTO, loadOffer, loadRepository);
        loadOfferRepository.save(loadOffer);
    }

    @Override
    public void delete(final UUID id) {
        loadOfferRepository.deleteById(id);
    }

}
