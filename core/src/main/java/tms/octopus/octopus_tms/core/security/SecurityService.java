package tms.octopus.octopus_tms.core.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.company.model.CompanyType;
import tms.octopus.octopus_tms.core.model.OctopusTMSSecurityConfigUserDetails;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;

/**
 * Service for handling security-related operations including company-based access control.
 */
@Service
public class SecurityService {

    private final UserRepository userRepository;

    public SecurityService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Check if the current user can access broker resources.
     */
    public boolean canAccessBrokerResources() {
        CompanyType userCompanyType = getCurrentUserCompanyType();
        return userCompanyType == CompanyType.BROKER;
    }

    /**
     * Check if the current user can access carrier resources.
     */
    public boolean canAccessCarrierResources() {
        CompanyType userCompanyType = getCurrentUserCompanyType();
        return userCompanyType == CompanyType.CARRIER;
    }

    /**
     * Check if the current user can access shipper resources.
     */
    public boolean canAccessShipperResources() {
        CompanyType userCompanyType = getCurrentUserCompanyType();
        return userCompanyType == CompanyType.SHIPPER;
    }

    /**
     * Check if the current user has the specified company type.
     */
    public boolean hasCompanyType(CompanyType companyType) {
        CompanyType userCompanyType = getCurrentUserCompanyType();
        return userCompanyType == companyType;
    }

    /**
     * Check if the current user is an admin.
     */
    public boolean isAdmin() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return false;
        }
        
        return auth.getAuthorities().stream()
                .anyMatch(authority -> "ADMIN".equals(authority.getAuthority()));
    }

    /**
     * Check if the current user is a sales representative.
     */
    public boolean isSalesRep() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return false;
        }
        
        return auth.getAuthorities().stream()
                .anyMatch(authority -> "SALES_REP".equals(authority.getAuthority()));
    }

    /**
     * Get the current user's company type.
     */
    private CompanyType getCurrentUserCompanyType() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }

        // Get the user details from the security context
        if (auth.getPrincipal() instanceof OctopusTMSSecurityConfigUserDetails userDetails) {
            // Load the full user entity to get company information
            User user = userRepository.findById(userDetails.getId()).orElse(null);
            if (user != null && user.getCompany() != null) {
                return user.getCompany().getType();
            }
        }

        return null;
    }

    /**
     * Get the current user's company ID.
     */
    public String getCurrentUserCompanyId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }

        if (auth.getPrincipal() instanceof OctopusTMSSecurityConfigUserDetails userDetails) {
            User user = userRepository.findById(userDetails.getId()).orElse(null);
            if (user != null && user.getCompany() != null) {
                return user.getCompany().getId().toString();
            }
        }

        return null;
    }

    /**
     * Get the current user entity.
     */
    public User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getPrincipal() == null) {
            return null;
        }

        if (auth.getPrincipal() instanceof OctopusTMSSecurityConfigUserDetails userDetails) {
            return userRepository.findById(userDetails.getId()).orElse(null);
        }

        return null;
    }
}