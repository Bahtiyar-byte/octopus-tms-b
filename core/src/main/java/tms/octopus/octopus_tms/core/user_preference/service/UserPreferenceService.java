package tms.octopus.octopus_tms.core.user_preference.service;

import java.util.List;
import java.util.UUID;
import tms.octopus.octopus_tms.core.user_preference.model.UserPreferenceDTO;


public interface UserPreferenceService {

    List<UserPreferenceDTO> findAll();

    UserPreferenceDTO get(UUID id);

    UUID create(UserPreferenceDTO userPreferenceDTO);

    void update(UUID id, UserPreferenceDTO userPreferenceDTO);

    void delete(UUID id);

    boolean userExists(UUID id);

}
