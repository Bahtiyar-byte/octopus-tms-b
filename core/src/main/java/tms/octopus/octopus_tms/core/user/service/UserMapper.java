package tms.octopus.octopus_tms.core.user.service;

import org.mapstruct.AfterMapping;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.core.company.domain.Company;
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.model.UserDTO;


@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface UserMapper {

    @Mapping(target = "company", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    UserDTO updateUserDTO(User user, @MappingTarget UserDTO userDTO);

    @AfterMapping
    default void afterUpdateUserDTO(User user, @MappingTarget UserDTO userDTO) {
        userDTO.setCompany(user.getCompany() == null ? null : user.getCompany().getId());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "company", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    User updateUser(UserDTO userDTO, @MappingTarget User user,
            @Context CompanyRepository companyRepository, @Context PasswordEncoder passwordEncoder);

    @AfterMapping
    default void afterUpdateUser(UserDTO userDTO, @MappingTarget User user,
            @Context CompanyRepository companyRepository,
            @Context PasswordEncoder passwordEncoder) {
        final Company company = userDTO.getCompany() == null ? null : companyRepository.findById(userDTO.getCompany())
                .orElseThrow(() -> new NotFoundException("company not found"));
        user.setCompany(company);
        user.setPasswordHash(passwordEncoder.encode(userDTO.getPasswordHash()));
    }

}
