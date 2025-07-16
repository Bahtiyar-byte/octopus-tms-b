package tms.octopus.octopus_tms.core.ai_provider_config.service;

import java.util.List;
import java.util.Map;

/**
 * Service interface for retrieving load data for AI Assistant.
 * This interface is designed to avoid circular dependencies between core and load modules.
 */
public interface AILoadService {

    /**
     * Retrieves a list of load data for AI Assistant.
     * 
     * @param filter Optional filter string to narrow down the results
     * @param limit Maximum number of loads to return
     * @return List of maps containing load data
     */
    List<Map<String, Object>> getLoadsForAI(String filter, int limit);
}