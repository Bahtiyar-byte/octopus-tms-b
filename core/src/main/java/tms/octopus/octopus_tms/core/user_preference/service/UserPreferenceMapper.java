package tms.octopus.octopus_tms.core.user_preference.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;
import tms.octopus.octopus_tms.core.user_preference.domain.UserPreference;
import tms.octopus.octopus_tms.core.user_preference.model.UserPreferenceDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserPreferenceMapper {

    @Mapping(target = "user", ignore = true)
    UserPreferenceDTO updateUserPreferenceDTO(UserPreference userPreference,
            @MappingTarget UserPreferenceDTO userPreferenceDTO);

    @AfterMapping
    default void afterUpdateUserPreferenceDTO(UserPreference userPreference,
            @MappingTarget UserPreferenceDTO userPreferenceDTO) {
        userPreferenceDTO.setUser(userPreference.getUser() == null ? null : userPreference.getUser().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    UserPreference updateUserPreference(UserPreferenceDTO userPreferenceDTO,
            @MappingTarget UserPreference userPreference, @Context UserRepository userRepository);

    @AfterMapping
    default void afterUpdateUserPreference(UserPreferenceDTO userPreferenceDTO,
            @MappingTarget UserPreference userPreference, @Context UserRepository userRepository) {
        final User user = userPreferenceDTO.getUser() == null ? null : userRepository.findById(userPreferenceDTO.getUser())
                .orElseThrow(() -> new NotFoundException("user not found"));
        userPreference.setUser(user);
    }

}
