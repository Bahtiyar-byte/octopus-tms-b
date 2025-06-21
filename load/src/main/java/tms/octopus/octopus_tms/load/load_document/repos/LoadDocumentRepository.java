package tms.octopus.octopus_tms.load.load_document.repos;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import tms.octopus.octopus_tms.load.load.domain.Load;
import tms.octopus.octopus_tms.load.load_document.domain.LoadDocument;


public interface LoadDocumentRepository extends JpaRepository<LoadDocument, UUID> {

    List<LoadDocument> findAllById(UUID id, Sort sort);

    LoadDocument findFirstByLoad(Load load);

}
