package tms.octopus.octopus_tms.core.service;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import tms.octopus.octopus_tms.base.mail.service.MailService;
import tms.octopus.octopus_tms.base.util.WebUtils;
import tms.octopus.octopus_tms.core.model.PasswordResetCompleteRequest;
import tms.octopus.octopus_tms.core.model.PasswordResetRequest;
import tms.octopus.octopus_tms.core.user.domain.User;
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Service
@Slf4j
public class PasswordResetService {

    private final MailService mailService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    public PasswordResetService(final MailService mailService,
            final PasswordEncoder passwordEncoder, final UserRepository userRepository) {
        this.mailService = mailService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
    }

    private boolean hasValidRequest(final User user) {
        return user != null && user.getResetToken() != null && 
                user.getResetTokenStarts().plusWeeks(1).isAfter(OffsetDateTime.now());
    }

    public void startProcess(final PasswordResetRequest passwordResetRequest) {
        log.info("received password reset request for {}", passwordResetRequest.getEmail());

        final User user = userRepository.findByUsernameIgnoreCase(passwordResetRequest.getEmail());
        if (user == null) {
            log.warn("user {} not found", passwordResetRequest.getEmail());
            return;
        }

        // keep existing uid if still valid
        if (!hasValidRequest(user)) {
            user.setResetToken(UUID.randomUUID().toString());
        }
        user.setResetTokenStarts(OffsetDateTime.now());
        userRepository.save(user);

        mailService.sendMail(passwordResetRequest.getEmail(), WebUtils.getMessage("passwordReset.mail.subject"),
                WebUtils.renderTemplate("/mails/passwordReset", Map.of("passwordResetUid", user.getResetToken())));
    }

    public boolean isValidPasswordResetUid(final String passwordResetUid) {
        final User user = userRepository.findByResetToken(passwordResetUid);
        if (hasValidRequest(user)) {
            return true;
        }
        log.warn("invalid password reset uid {}", passwordResetUid);
        return false;
    }

    public void completeProcess(final PasswordResetCompleteRequest passwordResetCompleteRequest) {
        final User user = userRepository.findByResetToken(passwordResetCompleteRequest.getUid());
        Assert.isTrue(hasValidRequest(user), "invalid update password request");

        log.warn("updating password for user {}", user.getUsername());

        user.setPasswordHash(passwordEncoder.encode(passwordResetCompleteRequest.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenStarts(null);
        userRepository.save(user);
    }

}
