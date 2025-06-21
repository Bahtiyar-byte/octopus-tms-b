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
import tms.octopus.octopus_tms.load.load_tracking.repos.LoadTrackingRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadTrackingResourceTest extends BaseIT {

    @Autowired
    public LoadTrackingRepository loadTrackingRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadTrackingData.sql"})
    void getAllLoadTrackings_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadTrackings")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9db62f9-32ad-355a-b2c0-e09e55861964"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadTrackingData.sql"})
    void getLoadTracking_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadTrackings/a9db62f9-32ad-355a-b2c0-e09e55861964")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("driverId", Matchers.equalTo("a9b90747-42dc-358e-8991-4e7848f864eb"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadTracking_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadTrackings/23fe8808-1292-3e52-8249-e808937738d2")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void createLoadTracking_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadTrackingDTORequest.json"))
                .when()
                    .post("/api/loadTrackings")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadTrackingRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadTrackingData.sql"})
    void updateLoadTracking_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadTrackingDTORequest.json"))
                .when()
                    .put("/api/loadTrackings/a9db62f9-32ad-355a-b2c0-e09e55861964")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4b90747-42dc-358e-8991-4e7848f864eb"), loadTrackingRepository.findById(UUID.fromString("a9db62f9-32ad-355a-b2c0-e09e55861964")).orElseThrow().getDriverId());
        assertEquals(2, loadTrackingRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadTrackingData.sql"})
    void deleteLoadTracking_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadTrackings/a9db62f9-32ad-355a-b2c0-e09e55861964")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadTrackingRepository.count());
    }

}
