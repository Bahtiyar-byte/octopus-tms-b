package tms.octopus.octopus_tms.core.user.validation;

import org.springframework.stereotype.Component;
import tms.octopus.octopus_tms.core.user.model.UserDTO;
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;

import java.util.UUID;

@Component
public class UserValidator {
    
    private final CompanyRepository companyRepository;
    
    public UserValidator(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }
    
    /**
     * Validates user creation/update request
     * @param userDTO The user data to validate
     * @param isUpdate Whether this is an update operation
     * @throws IllegalArgumentException if validation fails
     */
    public void validateUser(UserDTO userDTO, boolean isUpdate) {
        // For new users, company is mandatory
        if (!isUpdate && userDTO.getCompany() == null) {
            throw new IllegalArgumentException("Company assignment is required for new users");
        }
        
        // If company is provided, verify it exists
        if (userDTO.getCompany() != null) {
            if (!companyRepository.existsById(userDTO.getCompany())) {
                throw new IllegalArgumentException("Invalid company ID: " + userDTO.getCompany());
            }
        }
        
        // Validate email format is already handled by @Email annotation
        
        // For updates, prevent removing company assignment
        if (isUpdate && userDTO.getCompany() == null) {
            // This is ok - null means don't change the company
            // The mapper will preserve the existing company
        }
    }
    
    /**
     * Validates that a user belongs to a specific company
     * @param userId The user ID
     * @param companyId The company ID to check
     * @return true if user belongs to the company
     */
    public boolean userBelongsToCompany(UUID userId, UUID companyId) {
        // This would be used for multi-tenant data access control
        return true; // Placeholder - implement when needed
    }
}