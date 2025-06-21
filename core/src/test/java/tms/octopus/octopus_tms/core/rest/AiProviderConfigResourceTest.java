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
import tms.octopus.octopus_tms.core.ai_provider_config.repos.AiProviderConfigRepository;


@Sql("/data/clearAllCore.sql")
public class AiProviderConfigResourceTest extends BaseIT {

    @Autowired
    public AiProviderConfigRepository aiProviderConfigRepository;

    @Test
    @Sql({"/data/aiProviderConfigData.sql", "/data/userData.sql"})
    void getAllAiProviderConfigs_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/aiProviderConfigs")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo(4100));
    }

    @Test
    @Sql({"/data/aiProviderConfigData.sql", "/data/userData.sql"})
    void getAiProviderConfig_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/aiProviderConfigs/4100")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("userId", Matchers.equalTo("a944f008-9b07-3e18-a718-eb9ca3d94674"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getAiProviderConfig_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/aiProviderConfigs/4766")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createAiProviderConfig_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/aiProviderConfigDTORequest.json"))
                .when()
                    .post("/api/aiProviderConfigs")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, aiProviderConfigRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createAiProviderConfig_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/aiProviderConfigDTORequest_missingField.json"))
                .when()
                    .post("/api/aiProviderConfigs")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("userId"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/aiProviderConfigData.sql", "/data/userData.sql"})
    void updateAiProviderConfig_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/aiProviderConfigDTORequest.json"))
                .when()
                    .put("/api/aiProviderConfigs/4100")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f444f008-9b07-3e18-a718-eb9ca3d94674"), aiProviderConfigRepository.findById(((long)4100)).orElseThrow().getUserId());
        assertEquals(2, aiProviderConfigRepository.count());
    }

    @Test
    @Sql({"/data/aiProviderConfigData.sql", "/data/userData.sql"})
    void deleteAiProviderConfig_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/aiProviderConfigs/4100")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, aiProviderConfigRepository.count());
    }

}
