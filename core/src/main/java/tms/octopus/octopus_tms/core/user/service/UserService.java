package tms.octopus.octopus_tms.core.user.service;

import java.io.IOException;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.user.model.ChangePasswordRequest;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.user.model.UserStatsDTO;


public interface UserService {

    Page<UserDTO> findAll(String filter, Pageable pageable);

    UserDTO get(UUID id);

    UUID create(UserDTO userDTO);

    void update(UUID id, UserDTO userDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);
    
    UserDTO getCurrentUser(String username);
    
    UserDTO updateCurrentUser(String username, UserDTO userDTO);
    
    void changePassword(String username, ChangePasswordRequest request);
    
    String uploadAvatar(String username, MultipartFile file) throws IOException;
    
    UserStatsDTO getUserStats(String username);
    
    UserDTO toggleStatus(UUID id);

}
