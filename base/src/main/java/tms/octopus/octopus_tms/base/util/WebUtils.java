package tms.octopus.octopus_tms.base.util;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.LocaleResolver;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;


@Component
public class WebUtils {

    public static final String EMAIL_PATTERN = "([a-zA-Z0-9][\\-\\.\\+_]?)*[a-zA-Z0-9]+@([a-zA-Z0-9][\\-\\.]?)*[a-zA-Z0-9]+\\.[a-zA-Z]+";
    private static MessageSource messageSource;
    private static LocaleResolver localeResolver;
    private static TemplateEngine templateEngine;
    private static String baseHost;

    public WebUtils(final MessageSource messageSource, final LocaleResolver localeResolver,
            final TemplateEngine templateEngine, @Value("${app.baseHost}") final String baseHost) {
        WebUtils.messageSource = messageSource;
        WebUtils.localeResolver = localeResolver;
        WebUtils.templateEngine = templateEngine;
        WebUtils.baseHost = baseHost;
    }

    public static HttpServletRequest getRequest() {
        return ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
    }

    public static String getMessage(final String code, final Object... args) {
        return messageSource.getMessage(code, args, code, localeResolver.resolveLocale(getRequest()));
    }

    public static String renderTemplate(final String templateName,
            final Map<String, Object> templateModel) {
        final Context thymeleafContext = new Context();
        thymeleafContext.setVariables(templateModel);
        thymeleafContext.setVariable("baseHost", baseHost);
        return templateEngine.process(templateName, thymeleafContext);
    }

}
