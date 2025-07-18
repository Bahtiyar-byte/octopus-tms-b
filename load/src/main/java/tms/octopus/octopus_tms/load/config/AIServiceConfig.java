package tms.octopus.octopus_tms.load.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tms.octopus.octopus_tms.core.ai_provider_config.service.AILoadService;
import tms.octopus.octopus_tms.load.load.service.AILoadServiceImpl;
import tms.octopus.octopus_tms.load.load.service.LoadService;

/**
 * Configuration class to register AI service implementations.
 */
@Configuration
public class AIServiceConfig {

    @Bean
    public AILoadService aiLoadService(LoadService loadService) {
        return new AILoadServiceImpl(loadService);
    }
}