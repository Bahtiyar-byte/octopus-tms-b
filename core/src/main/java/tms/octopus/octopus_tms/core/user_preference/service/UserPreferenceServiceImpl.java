package tms.octopus.octopus_tms.core.user_preference.service;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;
import tms.octopus.octopus_tms.core.user_preference.domain.UserPreference;
import tms.octopus.octopus_tms.core.user_preference.model.UserPreferenceDTO;
import tms.octopus.octopus_tms.core.user_preference.repos.UserPreferenceRepository;


@Service
public class UserPreferenceServiceImpl implements UserPreferenceService {

    private final UserPreferenceRepository userPreferenceRepository;
    private final UserRepository userRepository;
    private final UserPreferenceMapper userPreferenceMapper;

    public UserPreferenceServiceImpl(final UserPreferenceRepository userPreferenceRepository,
            final UserRepository userRepository, final UserPreferenceMapper userPreferenceMapper) {
        this.userPreferenceRepository = userPreferenceRepository;
        this.userRepository = userRepository;
        this.userPreferenceMapper = userPreferenceMapper;
    }

    @Override
    public List<UserPreferenceDTO> findAll() {
        final List<UserPreference> userPreferences = userPreferenceRepository.findAll(Sort.by("id"));
        return userPreferences.stream()
                .map(userPreference -> userPreferenceMapper.updateUserPreferenceDTO(userPreference, new UserPreferenceDTO()))
                .toList();
    }

    @Override
    public UserPreferenceDTO get(final UUID id) {
        return userPreferenceRepository.findById(id)
                .map(userPreference -> userPreferenceMapper.updateUserPreferenceDTO(userPreference, new UserPreferenceDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final UserPreferenceDTO userPreferenceDTO) {
        final UserPreference userPreference = new UserPreference();
        userPreferenceMapper.updateUserPreference(userPreferenceDTO, userPreference, userRepository);
        return userPreferenceRepository.save(userPreference).getId();
    }

    @Override
    public void update(final UUID id, final UserPreferenceDTO userPreferenceDTO) {
        final UserPreference userPreference = userPreferenceRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        userPreferenceMapper.updateUserPreference(userPreferenceDTO, userPreference, userRepository);
        userPreferenceRepository.save(userPreference);
    }

    @Override
    public void delete(final UUID id) {
        userPreferenceRepository.deleteById(id);
    }

    @Override
    public boolean userExists(final UUID id) {
        return userPreferenceRepository.existsByUserId(id);
    }

}
