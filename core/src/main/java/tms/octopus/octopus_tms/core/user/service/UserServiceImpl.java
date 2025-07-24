package tms.octopus.octopus_tms.core.user.service;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;
import tms.octopus.octopus_tms.core.notification.domain.Notification;
import tms.octopus.octopus_tms.core.notification.repos.NotificationRepository;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.model.ChangePasswordRequest;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.model.UserStatsDTO;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;
import tms.octopus.octopus_tms.core.user_preference.domain.UserPreference;
import tms.octopus.octopus_tms.core.user_preference.repos.UserPreferenceRepository;
import tms.octopus.octopus_tms.core.user.validation.UserValidator;
import tms.octopus.octopus_tms.base.company.model.CompanyType;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final UserPreferenceRepository userPreferenceRepository;
    private final NotificationRepository notificationRepository;
    private final UserValidator userValidator;

    public UserServiceImpl(final UserRepository userRepository,
            final CompanyRepository companyRepository, final PasswordEncoder passwordEncoder,
            final UserMapper userMapper, final UserPreferenceRepository userPreferenceRepository,
            final NotificationRepository notificationRepository,
            final UserValidator userValidator) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
        this.userPreferenceRepository = userPreferenceRepository;
        this.notificationRepository = notificationRepository;
        this.userValidator = userValidator;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> findAll(final String filter, final Pageable pageable) {
        // Get current user to filter by company type
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsernameIgnoreCase(currentUsername);
        
        Page<User> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = userRepository.findAllByIdWithCompany(uuidFilter, pageable);
        } else if (currentUser != null && currentUser.getCompanyType() != null) {
            // Filter by company type of current user
            page = userRepository.findAllByCompanyType(currentUser.getCompanyType().toString(), pageable);
        } else {
            page = userRepository.findAllWithCompany(pageable);
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
        // Validate company assignment
        if (userDTO.getCompany() == null) {
            throw new IllegalArgumentException("User must be assigned to a company");
        }
        
        // Verify company exists
        if (!companyRepository.existsById(userDTO.getCompany())) {
            throw new IllegalArgumentException("Invalid company ID");
        }
        
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
    
    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsernameIgnoreCaseWithCompany(username);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        return userMapper.toDto(user);
    }
    
    @Override
    @Transactional
    public UserDTO updateCurrentUser(String username, UserDTO userDTO) {
        User user = userRepository.findByUsernameIgnoreCaseWithCompany(username);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        
        // Only allow updating certain fields
        if (userDTO.getFirstName() != null) {
            user.setFirstName(userDTO.getFirstName());
        }
        if (userDTO.getLastName() != null) {
            user.setLastName(userDTO.getLastName());
        }
        if (userDTO.getPhone() != null) {
            user.setPhone(userDTO.getPhone());
        }
        if (userDTO.getDepartment() != null) {
            user.setDepartment(userDTO.getDepartment());
        }
        if (userDTO.getEmail() != null && !userDTO.getEmail().equals(user.getEmail())) {
            // Check if email is already taken
            if (userRepository.existsByEmailIgnoreCase(userDTO.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(userDTO.getEmail());
        }
        
        userRepository.save(user);
        return userMapper.toDto(user);
    }
    
    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsernameIgnoreCase(username);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        
        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        // Set new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
    
    @Override
    @Transactional
    public String uploadAvatar(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsernameIgnoreCase(username);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        
        // For now, we'll store the base64 encoded image
        // In production, you would upload to S3 or similar service
        String contentType = file.getContentType();
        byte[] bytes = file.getBytes();
        String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
        String dataUri = "data:" + contentType + ";base64," + base64;
        
        user.setAvatarUrl(dataUri);
        userRepository.save(user);
        
        return dataUri;
    }
    
    @Override
    @Transactional(readOnly = true)
    public UserStatsDTO getUserStats(String username) {
        User user = userRepository.findByUsernameIgnoreCaseWithCompany(username);
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        
        UserStatsDTO stats = new UserStatsDTO();
        
        // These would be calculated from actual data in production
        // For now, returning mock data based on company type
        if (user.getCompany() != null && user.getCompany().getType() != null) {
            switch (user.getCompany().getType()) {
                case BROKER:
                    stats.setActionsToday(38);
                    stats.setLoadsDispatched(156);
                    stats.setTasksCompleted(324);
                    stats.setPerformanceScore(92);
                    stats.setDealsClosedThisMonth(12);
                    stats.setRevenueGenerated(125000.00);
                    break;
                case SHIPPER:
                    stats.setActionsToday(24);
                    stats.setLoadsDispatched(89);
                    stats.setTasksCompleted(145);
                    stats.setPerformanceScore(88);
                    stats.setShipmentsThisMonth(89);
                    stats.setWarehouseCapacityUsed(76);
                    break;
                case CARRIER:
                    stats.setActionsToday(42);
                    stats.setLoadsDispatched(178);
                    stats.setTasksCompleted(356);
                    stats.setPerformanceScore(94);
                    stats.setActiveDriversToday(28);
                    stats.setTotalDriversManaged(42);
                    break;
                default:
                    stats.setActionsToday(15);
                    stats.setLoadsDispatched(45);
                    stats.setTasksCompleted(78);
                    stats.setPerformanceScore(85);
                    break;
            }
        } else {
            // Default stats if no company
            stats.setActionsToday(15);
            stats.setLoadsDispatched(45);
            stats.setTasksCompleted(78);
            stats.setPerformanceScore(85);
        }
        
        stats.setTotalCustomersServed(76);
        stats.setAvgResponseTime("2.4 min");
        
        return stats;
    }
    
    @Override
    @Transactional
    public UserDTO toggleStatus(UUID id) {
        final User user = userRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        
        // Toggle status between ACTIVE and INACTIVE
        if ("ACTIVE".equals(user.getStatus())) {
            user.setStatus("INACTIVE");
        } else {
            user.setStatus("ACTIVE");
        }
        
        user.setUpdatedAt(OffsetDateTime.now());
        final User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

}
