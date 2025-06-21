package tms.octopus.octopus_tms.base.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;
import org.junit.jupiter.api.Test;


public class WebUtilsTest {

    @Test
    public void emailValidation() {
        final List<String> validEmails = List.of("test@domain.com", "valid-email+1@invalid.bootify.io", "A1_2@TEST-1-2.TECHNOLOGY");
        final List<String> invalidEmails = List.of("invalid@domain", "invalid.domain", "test-@domain.com", "test#test@domain.com", "test--test@domain.com");
        for (final String validEmail : validEmails) {
            assertTrue(validEmail.matches(WebUtils.EMAIL_PATTERN), "email is not valid: " + validEmail);
        }
        for (final String invalidEmail : invalidEmails) {
            assertFalse(invalidEmail.matches(WebUtils.EMAIL_PATTERN), "email is not invalid: " + invalidEmail);
        }
    }

}
