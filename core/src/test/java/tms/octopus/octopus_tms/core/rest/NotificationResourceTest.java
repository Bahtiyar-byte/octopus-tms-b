package tms.octopus.octopus_tms.core.rest;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import java.util.UUID;
import org.hamcrest.Matchers;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;
import tms.octopus.octopus_tms.base.config.BaseIT;
import tms.octopus.octopus_tms.core.notification.repos.NotificationRepository;


@Sql("/data/clearAllCore.sql")
public class NotificationResourceTest extends BaseIT {

    @Autowired
    public NotificationRepository notificationRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/notificationData.sql"})
    void getAllNotifications_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/notifications")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9d69c7d-f311-3fb9-a584-fbd9edfc6c90"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/notificationData.sql"})
    void getNotification_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/notifications/a9d69c7d-f311-3fb9-a584-fbd9edfc6c90")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("type", Matchers.equalTo("No sea takimata."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getNotification_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/notifications/239e8cba-3700-3f6a-947a-8cf91035ab84")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createNotification_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/notificationDTORequest.json"))
                .when()
                    .post("/api/notifications")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, notificationRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createNotification_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/notificationDTORequest_missingField.json"))
                .when()
                    .post("/api/notifications")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("type"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/notificationData.sql"})
    void updateNotification_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/notificationDTORequest.json"))
                .when()
                    .put("/api/notifications/a9d69c7d-f311-3fb9-a584-fbd9edfc6c90")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Consetetur sadipscing.", notificationRepository.findById(UUID.fromString("a9d69c7d-f311-3fb9-a584-fbd9edfc6c90")).orElseThrow().getType());
        assertEquals(2, notificationRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/notificationData.sql"})
    void deleteNotification_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/notifications/a9d69c7d-f311-3fb9-a584-fbd9edfc6c90")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, notificationRepository.count());
    }

}
