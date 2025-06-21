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
import tms.octopus.octopus_tms.core.workflow_log.repos.WorkflowLogRepository;


@Sql("/data/clearAllCore.sql")
public class WorkflowLogResourceTest extends BaseIT {

    @Autowired
    public WorkflowLogRepository workflowLogRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/workflowLogData.sql"})
    void getAllWorkflowLogs_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflowLogs")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a937ba5c-d49c-3f03-8aaa-423049e66daf"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowLogData.sql"})
    void getWorkflowLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflowLogs/a937ba5c-d49c-3f03-8aaa-423049e66daf")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("executionId", Matchers.equalTo("a91c31ee-3115-3fcf-a283-2787e8c1f027"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getWorkflowLog_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/workflowLogs/231637a4-25ef-36e6-9539-aaaff113d1d5")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createWorkflowLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowLogDTORequest.json"))
                .when()
                    .post("/api/workflowLogs")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, workflowLogRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowLogData.sql"})
    void updateWorkflowLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/workflowLogDTORequest.json"))
                .when()
                    .put("/api/workflowLogs/a937ba5c-d49c-3f03-8aaa-423049e66daf")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f41c31ee-3115-3fcf-a283-2787e8c1f027"), workflowLogRepository.findById(UUID.fromString("a937ba5c-d49c-3f03-8aaa-423049e66daf")).orElseThrow().getExecutionId());
        assertEquals(2, workflowLogRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/workflowLogData.sql"})
    void deleteWorkflowLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/workflowLogs/a937ba5c-d49c-3f03-8aaa-423049e66daf")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, workflowLogRepository.count());
    }

}
