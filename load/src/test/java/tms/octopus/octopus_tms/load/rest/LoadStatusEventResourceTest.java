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
import tms.octopus.octopus_tms.load.load_status_event.repos.LoadStatusEventRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadStatusEventResourceTest extends BaseIT {

    @Autowired
    public LoadStatusEventRepository loadStatusEventRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStatusEventData.sql"})
    void getAllLoadStatusEvents_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStatusEvents")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a93028bd-c1aa-3dfb-b687-181f2031765d"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStatusEventData.sql"})
    void getLoadStatusEvent_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStatusEvents/a93028bd-c1aa-3dfb-b687-181f2031765d")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("eventType", Matchers.equalTo("Sed ut perspiciatis."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadStatusEvent_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStatusEvents/23a97de8-5eb6-34d5-8016-1c603422437f")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void createLoadStatusEvent_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusEventDTORequest.json"))
                .when()
                    .post("/api/loadStatusEvents")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadStatusEventRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadStatusEvent_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusEventDTORequest_missingField.json"))
                .when()
                    .post("/api/loadStatusEvents")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("eventType"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStatusEventData.sql"})
    void updateLoadStatusEvent_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStatusEventDTORequest.json"))
                .when()
                    .put("/api/loadStatusEvents/a93028bd-c1aa-3dfb-b687-181f2031765d")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Nulla facilisis.", loadStatusEventRepository.findById(UUID.fromString("a93028bd-c1aa-3dfb-b687-181f2031765d")).orElseThrow().getEventType());
        assertEquals(2, loadStatusEventRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStatusEventData.sql"})
    void deleteLoadStatusEvent_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadStatusEvents/a93028bd-c1aa-3dfb-b687-181f2031765d")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadStatusEventRepository.count());
    }

}
