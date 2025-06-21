package tms.octopus.octopus_tms.load.rest;

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
import tms.octopus.octopus_tms.load.load_status_history.repos.LoadStatusHistoryRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadStatusHistoryResourceTest extends BaseIT {

    @Autowired
    public LoadStatusHistoryRepository loadStatusHistoryRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadStatusHistoryData.sql"})
    void getAllLoadStatusHistories_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStatusHistories")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a99ae9ff-3a81-3499-a30c-4126e01f421b"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadStatusHistoryData.sql"})
    void getLoadStatusHistory_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStatusHistories/a99ae9ff-3a81-3499-a30c-4126e01f421b")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("loadId", Matchers.equalTo("a9aaa05a-17e2-3fae-97c9-ea5a3f213275"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadStatusHistory_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStatusHistories/2341bfa5-0858-36df-a24b-8c9de0ce567f")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadStatusHistory_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusHistoryDTORequest.json"))
                .when()
                    .post("/api/loadStatusHistories")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadStatusHistoryRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadStatusHistory_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusHistoryDTORequest_missingField.json"))
                .when()
                    .post("/api/loadStatusHistories")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("newStatus"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadStatusHistoryData.sql"})
    void updateLoadStatusHistory_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusHistoryDTORequest.json"))
                .when()
                    .put("/api/loadStatusHistories/a99ae9ff-3a81-3499-a30c-4126e01f421b")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4aaa05a-17e2-3fae-97c9-ea5a3f213275"), loadStatusHistoryRepository.findById(UUID.fromString("a99ae9ff-3a81-3499-a30c-4126e01f421b")).orElseThrow().getLoadId());
        assertEquals(2, loadStatusHistoryRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadStatusHistoryData.sql"})
    void deleteLoadStatusHistory_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadStatusHistories/a99ae9ff-3a81-3499-a30c-4126e01f421b")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadStatusHistoryRepository.count());
    }

}
