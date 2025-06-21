package tms.octopus.octopus_tms.base.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;


@Configuration
@EntityScan("tms.octopus.octopus_tms")
@EnableJpaRepositories("tms.octopus.octopus_tms")
@EnableTransactionManagement
public class DomainConfig {
}
