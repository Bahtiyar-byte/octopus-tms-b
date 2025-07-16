package tms.octopus.octopus_tms.core.ai_provider_config.rest;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tms.octopus.octopus_tms.core.ai_provider_config.service.AILoadService;

import java.security.Principal;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai/agent")
@RequiredArgsConstructor
public class AIAgentController {

    private final AILoadService aiLoadService;

    @PostMapping("/query")
    public ResponseEntity<Map<String, Object>> processQuery(
            @RequestBody Map<String, Object> request,
            Principal principal) {

        String query = (String) request.get("query");
        Object context = request.get("context");

        // Create response based on query
        Map<String, Object> response = new HashMap<>();
        Map<String, Object> data = new HashMap<>();

        if (query.toLowerCase().contains("load") || query.toLowerCase().contains("california")) {
            // Get real loads data from database
            String filter = query.toLowerCase().contains("california") ? "california" : null;
            List<Map<String, Object>> loads = aiLoadService.getLoadsForAI(filter, 3);
            data.put("loads", loads);

            int loadCount = loads.size();
            String loadText = loadCount == 1 ? "load" : "loads";
            response.put("text", "I found " + loadCount + " available " + loadText + ". Here are the best matches:");

            // Create suggestions based on the first load if available
            if (loadCount > 0) {
                String loadNumber = (String) loads.get(0).get("load_number");
                response.put("suggestions", Arrays.asList("Book load " + loadNumber, "Contact carrier", "View all loads"));
            } else {
                response.put("suggestions", Arrays.asList("Search for more loads", "Create new load", "View all loads"));
            }
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

    // Method removed as we now use real data from the database

    private Map<String, Object> createMockCarrier(String name, String mcNumber, String equipmentType, String phone) {
        Map<String, Object> carrier = new HashMap<>();
        carrier.put("name", name);
        carrier.put("mc_number", mcNumber);
        carrier.put("equipment_types", equipmentType);
        carrier.put("phone", phone);
        return carrier;
    }
}
