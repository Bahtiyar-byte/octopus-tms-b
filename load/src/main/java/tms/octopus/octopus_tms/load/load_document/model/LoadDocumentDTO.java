package tms.octopus.octopus_tms.load.load_document.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import tms.octopus.octopus_tms.base.load_document.model.DocumentType;


@Getter
@Setter
public class LoadDocumentDTO {

    private UUID id;

    private UUID stopId;

    private UUID loadCargoId;

    @NotNull
    private DocumentType documentType;

    @NotNull
    @Size(max = 255)
    private String fileName;

    @NotNull
    @Size(max = 500)
    private String filePath;

    private Integer fileSize;

    @Size(max = 100)
    private String mimeType;

    private UUID uploadedBy;

    private OffsetDateTime uploadedAt;

    @NotNull
    private UUID load;

}
