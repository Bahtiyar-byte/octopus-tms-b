package tms.octopus.octopus_tms.base.service;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import tms.octopus.octopus_tms.base.config.BaseIT;
import tms.octopus.octopus_tms.base.mail.service.MailService;


@ActiveProfiles("nosecurity")
public class MailServiceTest extends BaseIT {

    @Autowired
    private MailService mailService;

    @Test
    public void sendMail_success() {
        mailService.sendMail("bob@invalid.bootify.io", "my subject", "my body");
        waitForMessages(1);
        RestAssured
                .given()
                    .accept(ContentType.JSON)
                .when()
                    .get(messagesUrl)
                .then()
                    .body("messages[0].To.Address[0]", Matchers.equalTo("bob@invalid.bootify.io"))
                    .body("messages[0].Subject", Matchers.equalTo("my subject"));
    }

}
