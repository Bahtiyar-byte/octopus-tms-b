package tms.octopus.octopus_tms.core.ai_provider_config.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/agent")
@RequiredArgsConstructor
public class AIAgentController {

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> processQuery(
            @RequestBody Map<String, Object> request,
            Principal principal) {

        String query = (String) request.get("query");
        Object context = request.get("context");

        // Create mock response based on query
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();

        if (query.toLowerCase().contains("load") || query.toLowerCase().contains("california")) {
            // Mock loads data
            data.put("loads", Arrays.asList(
                createMockLoad("LOAD001", "Los Angeles, CA", "Phoenix, AZ", 1500, "DRY_VAN"),
                createMockLoad("LOAD002", "San Francisco, CA", "Denver, CO", 2200, "REEFER"),
                createMockLoad("LOAD003", "Sacramento, CA", "Las Vegas, NV", 1800, "FLATBED")
            ));
            response.put("text", "I found 3 available loads to California. Here are the best matches:");
            response.put("suggestions", Arrays.asList("Book load LOAD001", "Contact carrier", "View all loads"));
        } else if (query.toLowerCase().contains("revenue") || query.toLowerCase().contains("payment")) {
            // Mock revenue data
            Map<String, Object> revenue = new HashMap<>();
            revenue.put("total", 45890);
            revenue.put("count", 23);
            data.put("revenue", revenue);
            
            Map<String, Object> pendingPayments = new HashMap<>();
            pendingPayments.put("total", 12450);
            pendingPayments.put("count", 5);
            data.put("pending_payments", pendingPayments);
            
            response.put("text", "Your total revenue this month is $45,890 from 23 invoices. You have $12,450 in pending payments.");
            response.put("suggestions", Arrays.asList("Generate invoice report", "View payment history", "Export financial data"));
        } else if (query.toLowerCase().contains("carrier")) {
            // Mock carrier data
            data.put("carriers", Arrays.asList(
                createMockCarrier("ABC Logistics", "MC123456", "DRY_VAN", "555-0123"),
                createMockCarrier("XYZ Transport", "MC789012", "REEFER", "555-0456"),
                createMockCarrier("Fast Freight Co", "MC345678", "FLATBED", "555-0789")
            ));
            response.put("text", "I found 3 available carriers that match your criteria:");
            response.put("suggestions", Arrays.asList("Contact ABC Logistics", "View carrier details", "Book carrier"));
        } else {
            response.put("text", "I can help you with loads, carriers, revenue, and more. What would you like to know?");
            response.put("suggestions", Arrays.asList(
                "Show me open loads", 
                "Find carriers", 
                "What's my revenue this month?",
                "Check payment status"
            ));
        }

        response.put("data", data);
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> createMockLoad(String loadNumber, String origin, String destination, int rate, String equipmentType) {
        Map<String, Object> load = new HashMap<>();
        load.put("load_number", loadNumber);
        load.put("origin_city", origin.split(",")[0]);
        load.put("origin_state", origin.split(",")[1].trim());
        load.put("destination_city", destination.split(",")[0]);
        load.put("destination_state", destination.split(",")[1].trim());
        load.put("rate", rate);
        load.put("equipment_type", equipmentType);
        load.put("status", "POSTED");
        load.put("pickup_date", "2025-07-15");
        load.put("distance", 450);
        return load;
    }

    private Map<String, Object> createMockCarrier(String name, String mcNumber, String equipmentType, String phone) {
        Map<String, Object> carrier = new HashMap<>();
        carrier.put("name", name);
        carrier.put("mc_number", mcNumber);
        carrier.put("equipment_types", equipmentType);
        carrier.put("phone", phone);
        return carrier;
    }
}