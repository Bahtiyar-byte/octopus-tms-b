package tms.octopus.octopus_tms.load.load_assignment.service;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.load.load_assignment.domain.LoadAssignment;
import tms.octopus.octopus_tms.load.load_assignment.model.LoadAssignmentDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface LoadAssignmentMapper {

    LoadAssignmentDTO updateLoadAssignmentDTO(LoadAssignment loadAssignment,
            @MappingTarget LoadAssignmentDTO loadAssignmentDTO);

    @Mapping(target = "id", ignore = true)
    LoadAssignment updateLoadAssignment(LoadAssignmentDTO loadAssignmentDTO,
            @MappingTarget LoadAssignment loadAssignment);

}
