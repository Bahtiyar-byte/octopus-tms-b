package tms.octopus.octopus_tms.core.user.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.user.model.UserDTO;


public interface UserService {

    Page<UserDTO> findAll(String filter, Pageable pageable);

    UserDTO get(UUID id);

    UUID create(UserDTO userDTO);

    void update(UUID id, UserDTO userDTO);

    void delete(UUID id);

    ReferencedWarning getReferencedWarning(UUID id);

}
