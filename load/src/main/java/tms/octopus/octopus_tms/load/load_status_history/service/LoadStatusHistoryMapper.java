package tms.octopus.octopus_tms.load.load_status_history.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.load.load_status_history.domain.LoadStatusHistory;
import tms.octopus.octopus_tms.load.load_status_history.model.LoadStatusHistoryDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadStatusHistoryMapper {

    LoadStatusHistoryDTO updateLoadStatusHistoryDTO(LoadStatusHistory loadStatusHistory,
            @MappingTarget LoadStatusHistoryDTO loadStatusHistoryDTO);

    @Mapping(target = "id", ignore = true)
    LoadStatusHistory updateLoadStatusHistory(LoadStatusHistoryDTO loadStatusHistoryDTO,
            @MappingTarget LoadStatusHistory loadStatusHistory);

}
