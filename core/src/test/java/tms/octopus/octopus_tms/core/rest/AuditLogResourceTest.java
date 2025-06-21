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
import tms.octopus.octopus_tms.core.audit_log.repos.AuditLogRepository;


@Sql("/data/clearAllCore.sql")
public class AuditLogResourceTest extends BaseIT {

    @Autowired
    public AuditLogRepository auditLogRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/auditLogData.sql"})
    void getAllAuditLogs_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/auditLogs")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9a558d9-7954-3069-a411-c861cf78ef79"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/auditLogData.sql"})
    void getAllAuditLogs_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/auditLogs?filter=b845c629-e577-331c-8df8-4fc34f936a89")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b845c629-e577-331c-8df8-4fc34f936a89"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/auditLogData.sql"})
    void getAuditLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/auditLogs/a9a558d9-7954-3069-a411-c861cf78ef79")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("userId", Matchers.equalTo("a944f008-9b07-3e18-a718-eb9ca3d94674"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getAuditLog_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/auditLogs/23a31da7-ede4-3c9b-83fb-5bbf8f442ce9")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createAuditLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/auditLogDTORequest.json"))
                .when()
                    .post("/api/auditLogs")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, auditLogRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createAuditLog_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/auditLogDTORequest_missingField.json"))
                .when()
                    .post("/api/auditLogs")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("action"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/auditLogData.sql"})
    void updateAuditLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/auditLogDTORequest.json"))
                .when()
                    .put("/api/auditLogs/a9a558d9-7954-3069-a411-c861cf78ef79")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f444f008-9b07-3e18-a718-eb9ca3d94674"), auditLogRepository.findById(UUID.fromString("a9a558d9-7954-3069-a411-c861cf78ef79")).orElseThrow().getUserId());
        assertEquals(2, auditLogRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/auditLogData.sql"})
    void deleteAuditLog_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/auditLogs/a9a558d9-7954-3069-a411-c861cf78ef79")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, auditLogRepository.count());
    }

}
