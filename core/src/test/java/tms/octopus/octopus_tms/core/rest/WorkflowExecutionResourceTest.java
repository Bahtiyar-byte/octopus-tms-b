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
import tms.octopus.octopus_tms.core.workflow_execution.repos.WorkflowExecutionRepository;


@Sql("/data/clearAllCore.sql")
public class WorkflowExecutionResourceTest extends BaseIT {

    @Autowired
    public WorkflowExecutionRepository workflowExecutionRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/workflowExecutionData.sql"})
    void getAllWorkflowExecutions_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflowExecutions")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9c6598e-9ddd-3961-a7df-a4d4eb8144a1"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowExecutionData.sql"})
    void getWorkflowExecution_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflowExecutions/a9c6598e-9ddd-3961-a7df-a4d4eb8144a1")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("workflowId", Matchers.equalTo("a9aa41b9-dc2b-394f-b000-d6f70abf8bae"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getWorkflowExecution_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflowExecutions/2346e93a-054f-34c0-99e1-fa4701f5a892")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createWorkflowExecution_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowExecutionDTORequest.json"))
                .when()
                    .post("/api/workflowExecutions")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, workflowExecutionRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowExecutionData.sql"})
    void updateWorkflowExecution_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowExecutionDTORequest.json"))
                .when()
                    .put("/api/workflowExecutions/a9c6598e-9ddd-3961-a7df-a4d4eb8144a1")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4aa41b9-dc2b-394f-b000-d6f70abf8bae"), workflowExecutionRepository.findById(UUID.fromString("a9c6598e-9ddd-3961-a7df-a4d4eb8144a1")).orElseThrow().getWorkflowId());
        assertEquals(2, workflowExecutionRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowExecutionData.sql"})
    void deleteWorkflowExecution_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/workflowExecutions/a9c6598e-9ddd-3961-a7df-a4d4eb8144a1")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, workflowExecutionRepository.count());
    }

}
