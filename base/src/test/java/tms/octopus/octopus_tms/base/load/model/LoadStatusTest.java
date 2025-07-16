package tms.octopus.octopus_tms.base.load.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Test class to verify that all load statuses used in the frontend are properly defined in the LoadStatus enum.
 */
public class LoadStatusTest {

    // Frontend load statuses from web/src/main/webapp/app/data/loads.ts
    private static final Set<String> FRONTEND_LOAD_STATUSES = new HashSet<>(Arrays.asList(
            "New", "Posted", "Assigned", "En Route", "Delivered", "Awaiting Docs", "POD Received", "Paid", "Closed",
            "Draft", "Carrier Assigned", "In Transit"
    ));

    @Test
    public void testAllFrontendStatusesAreDefined() {
        // For each frontend status, try to find a matching enum value
        for (String frontendStatus : FRONTEND_LOAD_STATUSES) {
            boolean found = false;
            
            // Try to find an exact match or a match with underscores instead of spaces
            String normalizedStatus = frontendStatus.replace(" ", "_");
            
            for (LoadStatus enumStatus : LoadStatus.values()) {
                String enumName = enumStatus.name();
                
                // Check if the enum name matches the frontend status (case-sensitive)
                // or if the enum name matches the normalized frontend status (case-sensitive)
                if (enumName.equals(frontendStatus) || enumName.equals(normalizedStatus)) {
                    found = true;
                    break;
                }
                
                // Also check if the enum name matches the frontend status (case-insensitive)
                // or if the enum name matches the normalized frontend status (case-insensitive)
                if (enumName.equalsIgnoreCase(frontendStatus) || enumName.equalsIgnoreCase(normalizedStatus)) {
                    found = true;
                    break;
                }
            }
            
            // If we couldn't find a matching enum value, fail the test
            assertTrue(found, "Frontend status '" + frontendStatus + "' is not defined in LoadStatus enum");
        }
    }

    @Test
    public void testEnumToStringConversion() {
        // Test that each enum value can be converted to a string
        for (LoadStatus status : LoadStatus.values()) {
            assertNotNull(status.toString(), "Enum value " + status.name() + " cannot be converted to string");
        }
    }

    @Test
    public void testStringToEnumConversion() {
        // Test that each frontend status can be converted to an enum value
        for (String frontendStatus : FRONTEND_LOAD_STATUSES) {
            try {
                // Try to convert the frontend status to an enum value
                LoadStatus.valueOf(frontendStatus.replace(" ", "_"));
            } catch (IllegalArgumentException e) {
                // If we couldn't convert the frontend status to an enum value,
                // try to find a matching enum value with a different case
                boolean found = false;
                for (LoadStatus enumStatus : LoadStatus.values()) {
                    if (enumStatus.name().equalsIgnoreCase(frontendStatus.replace(" ", "_"))) {
                        found = true;
                        break;
                    }
                }
                
                // If we still couldn't find a matching enum value, fail the test
                assertTrue(found, "Frontend status '" + frontendStatus + "' cannot be converted to enum value");
            }
        }
    }
}