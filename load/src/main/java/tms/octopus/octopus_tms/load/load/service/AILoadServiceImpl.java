package tms.octopus.octopus_tms.load.load.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import tms.octopus.octopus_tms.core.ai_provider_config.service.AILoadService;
import tms.octopus.octopus_tms.load.load.model.LoadDTO;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Implementation of AILoadService that uses LoadService to fetch real load data.
 */
@Service
@RequiredArgsConstructor
public class AILoadServiceImpl implements AILoadService {

    private final LoadService loadService;

    @Override
    public List<Map<String, Object>> getLoadsForAI(String filter, int limit) {
        // Fetch loads from the database - pass null for search parameter since this is for AI
        Page<LoadDTO> loadsPage = loadService.findAll(filter, null, PageRequest.of(0, limit));
        List<LoadDTO> loads = loadsPage.getContent();

        // Convert LoadDTO objects to the format expected by AI Assistant
        List<Map<String, Object>> result = new ArrayList<>();
        for (LoadDTO load : loads) {
            Map<String, Object> loadMap = new HashMap<>();
            loadMap.put("load_number", load.getLoadNumber());
            loadMap.put("origin_city", load.getOriginCity());
            loadMap.put("origin_state", load.getOriginState());
            loadMap.put("destination_city", load.getDestinationCity());
            loadMap.put("destination_state", load.getDestinationState());
            loadMap.put("rate", load.getRate() != null ? load.getRate().intValue() : 0);
            loadMap.put("equipment_type", load.getEquipmentType() != null ? load.getEquipmentType().toString() : "");
            loadMap.put("status", load.getStatus() != null ? load.getStatus().toString() : "");
            loadMap.put("pickup_date", load.getPickupDate() != null ? load.getPickupDate().toString() : "");
            loadMap.put("distance", load.getDistance());

            // Now that we've added DIRECT to the base RoutingType enum, we can safely include it
            if (load.getRoutingType() != null) {
                loadMap.put("routing_type", load.getRoutingType().toString());
            }

            result.add(loadMap);
        }

        return result;
    }
}
