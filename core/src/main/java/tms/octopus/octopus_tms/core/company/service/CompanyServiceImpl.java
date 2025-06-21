package tms.octopus.octopus_tms.core.company.service;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.base.util.NotFoundException;
import tms.octopus.octopus_tms.base.util.ReferencedWarning;
import tms.octopus.octopus_tms.core.company.domain.Company;
import tms.octopus.octopus_tms.core.company.model.CompanyDTO;
import tms.octopus.octopus_tms.core.company.repos.CompanyRepository;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;
    private final UserRepository userRepository;

    public CompanyServiceImpl(final CompanyRepository companyRepository,
            final CompanyMapper companyMapper, final UserRepository userRepository) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
        this.userRepository = userRepository;
    }

    @Override
    public Page<CompanyDTO> findAll(final String filter, final Pageable pageable) {
        Page<Company> page;
        if (filter != null) {
            UUID uuidFilter = null;
            try {
                uuidFilter = UUID.fromString(filter);
            } catch (final IllegalArgumentException illegalArgumentException) {
                // keep null - no parseable input
            }
            page = companyRepository.findAllById(uuidFilter, pageable);
        } else {
            page = companyRepository.findAll(pageable);
        }
        return new PageImpl<>(page.getContent()
                .stream()
                .map(company -> companyMapper.updateCompanyDTO(company, new CompanyDTO()))
                .toList(),
                pageable, page.getTotalElements());
    }

    @Override
    public CompanyDTO get(final UUID id) {
        return companyRepository.findById(id)
                .map(company -> companyMapper.updateCompanyDTO(company, new CompanyDTO()))
                .orElseThrow(NotFoundException::new);
    }

    @Override
    public UUID create(final CompanyDTO companyDTO) {
        final Company company = new Company();
        companyMapper.updateCompany(companyDTO, company);
        return companyRepository.save(company).getId();
    }

    @Override
    public void update(final UUID id, final CompanyDTO companyDTO) {
        final Company company = companyRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        companyMapper.updateCompany(companyDTO, company);
        companyRepository.save(company);
    }

    @Override
    public void delete(final UUID id) {
        companyRepository.deleteById(id);
    }

    @Override
    public ReferencedWarning getReferencedWarning(final UUID id) {
        final ReferencedWarning referencedWarning = new ReferencedWarning();
        final Company company = companyRepository.findById(id)
                .orElseThrow(NotFoundException::new);
        final User companyUser = userRepository.findFirstByCompany(company);
        if (companyUser != null) {
            referencedWarning.setKey("company.user.company.referenced");
            referencedWarning.addParam(companyUser.getId());
            return referencedWarning;
        }
        return null;
    }

}
