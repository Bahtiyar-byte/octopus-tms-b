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
import tms.octopus.octopus_tms.core.user_preference.repos.UserPreferenceRepository;


@Sql("/data/clearAllCore.sql")
public class UserPreferenceResourceTest extends BaseIT {

    @Autowired
    public UserPreferenceRepository userPreferenceRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/userPreferenceData.sql"})
    void getAllUserPreferences_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/userPreferences")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a92d0103-08a6-3379-9a3d-9c728ee74244"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/userPreferenceData.sql"})
    void getUserPreference_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/userPreferences/a92d0103-08a6-3379-9a3d-9c728ee74244")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("theme", Matchers.equalTo("Lorem ipsum dolor."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getUserPreference_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/userPreferences/23de10ad-baa1-32ee-93f7-7f679fa1483a")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createUserPreference_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/userPreferenceDTORequest.json"))
                .when()
                    .post("/api/userPreferences")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, userPreferenceRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/userPreferenceData.sql"})
    void updateUserPreference_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/userPreferenceDTORequest.json"))
                .when()
                    .put("/api/userPreferences/a92d0103-08a6-3379-9a3d-9c728ee74244")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Et ea rebum.", userPreferenceRepository.findById(UUID.fromString("a92d0103-08a6-3379-9a3d-9c728ee74244")).orElseThrow().getTheme());
        assertEquals(2, userPreferenceRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/userPreferenceData.sql"})
    void deleteUserPreference_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/userPreferences/a92d0103-08a6-3379-9a3d-9c728ee74244")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, userPreferenceRepository.count());
    }

}
