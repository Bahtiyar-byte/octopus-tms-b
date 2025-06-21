package tms.octopus.octopus_tms.load.load_document.service;

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
import tms.octopus.octopus_tms.load.load_document.domain.LoadDocument;
import tms.octopus.octopus_tms.load.load_document.model.LoadDocumentDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadDocumentMapper {

    @Mapping(target = "load", ignore = true)
    LoadDocumentDTO updateLoadDocumentDTO(LoadDocument loadDocument,
            @MappingTarget LoadDocumentDTO loadDocumentDTO);

    @AfterMapping
    default void afterUpdateLoadDocumentDTO(LoadDocument loadDocument,
            @MappingTarget LoadDocumentDTO loadDocumentDTO) {
        loadDocumentDTO.setLoad(loadDocument.getLoad() == null ? null : loadDocument.getLoad().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "load", ignore = true)
    LoadDocument updateLoadDocument(LoadDocumentDTO loadDocumentDTO,
            @MappingTarget LoadDocument loadDocument, @Context LoadRepository loadRepository);

    @AfterMapping
    default void afterUpdateLoadDocument(LoadDocumentDTO loadDocumentDTO,
            @MappingTarget LoadDocument loadDocument, @Context LoadRepository loadRepository) {
        final Load load = loadDocumentDTO.getLoad() == null ? null : loadRepository.findById(loadDocumentDTO.getLoad())
                .orElseThrow(() -> new NotFoundException("load not found"));
        loadDocument.setLoad(load);
    }

}
