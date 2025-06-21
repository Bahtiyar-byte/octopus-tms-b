package tms.octopus.octopus_tms.carrier.rest;

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
import tms.octopus.octopus_tms.carrier.driver_performance.repos.DriverPerformanceRepository;


@Sql({"/data/clearAllCarrier.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllCarrier.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class DriverPerformanceResourceTest extends BaseIT {

    @Autowired
    public DriverPerformanceRepository driverPerformanceRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/driverPerformanceData.sql"})
    void getAllDriverPerformances_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/driverPerformances")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9ad8fa4-7bbe-3282-badb-b8de5374b894"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverPerformanceData.sql"})
    void getDriverPerformance_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/driverPerformances/a9ad8fa4-7bbe-3282-badb-b8de5374b894")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("milesDriven", Matchers.equalTo(22));
    }

    @Test
    @Sql("/data/userData.sql")
    void getDriverPerformance_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/driverPerformances/235cf83a-b072-3e78-acf7-2d14e44adf98")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createDriverPerformance_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverPerformanceDTORequest.json"))
                .when()
                    .post("/api/driverPerformances")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, driverPerformanceRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createDriverPerformance_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverPerformanceDTORequest_missingField.json"))
                .when()
                    .post("/api/driverPerformances")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("periodStart"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverPerformanceData.sql"})
    void updateDriverPerformance_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverPerformanceDTORequest.json"))
                .when()
                    .put("/api/driverPerformances/a9ad8fa4-7bbe-3282-badb-b8de5374b894")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(37, driverPerformanceRepository.findById(UUID.fromString("a9ad8fa4-7bbe-3282-badb-b8de5374b894")).orElseThrow().getMilesDriven());
        assertEquals(2, driverPerformanceRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverPerformanceData.sql"})
    void deleteDriverPerformance_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/driverPerformances/a9ad8fa4-7bbe-3282-badb-b8de5374b894")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, driverPerformanceRepository.count());
    }

}
