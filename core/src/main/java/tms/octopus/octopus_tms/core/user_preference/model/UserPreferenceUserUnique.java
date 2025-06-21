package tms.octopus.octopus_tms.core.user_preference.model;

import static java.lang.annotation.ElementType.ANNOTATION_TYPE;
import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.METHOD;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;
import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.servlet.HandlerMapping;
import tms.octopus.octopus_tms.core.user_preference.service.UserPreferenceService;


/**
 * Validate that the id value isn't taken yet.
 */
@Target({ FIELD, METHOD, ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(
        validatedBy = UserPreferenceUserUnique.UserPreferenceUserUniqueValidator.class
)
public @interface UserPreferenceUserUnique {

    String message() default "{Exists.userPreference.user}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    class UserPreferenceUserUniqueValidator implements ConstraintValidator<UserPreferenceUserUnique, UUID> {

        private final UserPreferenceService userPreferenceService;
        private final HttpServletRequest request;

        public UserPreferenceUserUniqueValidator(final UserPreferenceService userPreferenceService,
                final HttpServletRequest request) {
            this.userPreferenceService = userPreferenceService;
            this.request = request;
        }

        @Override
        public boolean isValid(final UUID value, final ConstraintValidatorContext cvContext) {
            if (value == null) {
                // no value present
                return true;
            }
            @SuppressWarnings("unchecked") final Map<String, String> pathVariables =
                    ((Map<String, String>)request.getAttribute(HandlerMapping.URI_TEMPLATE_VARIABLES_ATTRIBUTE));
            final String currentId = pathVariables.get("id");
            if (currentId != null && value.equals(userPreferenceService.get(UUID.fromString(currentId)).getUser())) {
                // value hasn't changed
                return true;
            }
            return !userPreferenceService.userExists(value);
        }

    }

}
