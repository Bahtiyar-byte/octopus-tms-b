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
import tms.octopus.octopus_tms.core.workflow.repos.WorkflowRepository;


@Sql("/data/clearAllCore.sql")
public class WorkflowResourceTest extends BaseIT {

    @Autowired
    public WorkflowRepository workflowRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/workflowData.sql"})
    void getAllWorkflows_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflows")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a92586a2-5bb3-345f-acd6-4ab20fd554ff"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowData.sql"})
    void getWorkflow_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflows/a92586a2-5bb3-345f-acd6-4ab20fd554ff")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("companyId", Matchers.equalTo("a9ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getWorkflow_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflows/23209d71-df52-38a3-9959-72ef488b636a")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createWorkflow_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowDTORequest.json"))
                .when()
                    .post("/api/workflows")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, workflowRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createWorkflow_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowDTORequest_missingField.json"))
                .when()
                    .post("/api/workflows")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("name"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowData.sql"})
    void updateWorkflow_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowDTORequest.json"))
                .when()
                    .put("/api/workflows/a92586a2-5bb3-345f-acd6-4ab20fd554ff")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"), workflowRepository.findById(UUID.fromString("a92586a2-5bb3-345f-acd6-4ab20fd554ff")).orElseThrow().getCompanyId());
        assertEquals(2, workflowRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowData.sql"})
    void deleteWorkflow_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/workflows/a92586a2-5bb3-345f-acd6-4ab20fd554ff")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, workflowRepository.count());
    }

}
