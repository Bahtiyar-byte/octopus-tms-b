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
import tms.octopus.octopus_tms.load.load_assignment.repos.LoadAssignmentRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadAssignmentResourceTest extends BaseIT {

    @Autowired
    public LoadAssignmentRepository loadAssignmentRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadAssignmentData.sql"})
    void getAllLoadAssignments_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadAssignments")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a93d69ed-781b-36bc-a066-87822ae56e6d"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadAssignmentData.sql"})
    void getLoadAssignment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadAssignments/a93d69ed-781b-36bc-a066-87822ae56e6d")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("loadId", Matchers.equalTo("a9aaa05a-17e2-3fae-97c9-ea5a3f213275"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadAssignment_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadAssignments/23cae1be-0fba-374d-afbf-8399ee2209cb")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadAssignment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadAssignmentDTORequest.json"))
                .when()
                    .post("/api/loadAssignments")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadAssignmentRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadAssignment_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadAssignmentDTORequest_missingField.json"))
                .when()
                    .post("/api/loadAssignments")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("loadId"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadAssignmentData.sql"})
    void updateLoadAssignment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadAssignmentDTORequest.json"))
                .when()
                    .put("/api/loadAssignments/a93d69ed-781b-36bc-a066-87822ae56e6d")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4aaa05a-17e2-3fae-97c9-ea5a3f213275"), loadAssignmentRepository.findById(UUID.fromString("a93d69ed-781b-36bc-a066-87822ae56e6d")).orElseThrow().getLoadId());
        assertEquals(2, loadAssignmentRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadAssignmentData.sql"})
    void deleteLoadAssignment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadAssignments/a93d69ed-781b-36bc-a066-87822ae56e6d")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadAssignmentRepository.count());
    }

}
