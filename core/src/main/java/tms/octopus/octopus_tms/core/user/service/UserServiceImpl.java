package tms.octopus.octopus_tms.core.user.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;
import tms.octopus.octopus_tms.core.notification.domain.Notification;
import tms.octopus.octopus_tms.core.notification.repos.NotificationRepository;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;
import tms.octopus.octopus_tms.core.user_preference.domain.UserPreference;
import tms.octopus.octopus_tms.core.user_preference.repos.UserPreferenceRepository;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserPreferenceRepository userPreferenceRepository;
    private final NotificationRepository notificationRepository;

    public UserServiceImpl(final UserRepository userRepository,
            final CompanyRepository companyRepository, final PasswordEncoder passwordEncoder,
            final UserMapper userMapper, final UserPreferenceRepository userPreferenceRepository,
            final NotificationRepository notificationRepository) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userPreferenceRepository = userPreferenceRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public Page<UserDTO> findAll(final String filter, final Pageable pageable) {
        Page<User> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = userRepository.findAllById(uuidFilter, pageable);
        } else {
            page = userRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(user -> userMapper.updateUserDTO(user, new UserDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public UserDTO get(final UUID id) {
        return userRepository.findById(id)
                .map(user -> userMapper.updateUserDTO(user, new UserDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final UserDTO userDTO) {
        final User user = new User();
        userMapper.updateUser(userDTO, user, companyRepository, passwordEncoder);
        return userRepository.save(user).getId();
    }

    @Override
    public void update(final UUID id, final UserDTO userDTO) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        userMapper.updateUser(userDTO, user, companyRepository, passwordEncoder);
        userRepository.save(user);
    }

    @Override
    public void delete(final UUID id) {
        userRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final UserPreference userUserPreference = userPreferenceRepository.findFirstByUser(user);
        if (userUserPreference != null) {
            referencedWarning.setKey("user.userPreference.user.referenced");
            referencedWarning.addParam(userUserPreference.getId());
            return referencedWarning;
        }
        final Notification userNotification = notificationRepository.findFirstByUser(user);
        if (userNotification != null) {
            referencedWarning.setKey("user.notification.user.referenced");
            referencedWarning.addParam(userNotification.getId());
            return referencedWarning;
        }
        return null;
    }

}
