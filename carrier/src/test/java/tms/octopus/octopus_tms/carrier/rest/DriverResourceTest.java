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
import tms.octopus.octopus_tms.carrier.driver.repos.DriverRepository;


@Sql({"/data/clearAllCarrier.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllCarrier.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class DriverResourceTest extends BaseIT {

    @Autowired
    public DriverRepository driverRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/driverData.sql"})
    void getAllDrivers_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/drivers")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9f90c1a-4171-3536-9a5c-4b8d297e0d78"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverData.sql"})
    void getAllDrivers_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/drivers?filter=b8fb963f-f976-39c3-bfc8-1fe03c21ea7b")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8fb963f-f976-39c3-bfc8-1fe03c21ea7b"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverData.sql"})
    void getDriver_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/drivers/a9f90c1a-4171-3536-9a5c-4b8d297e0d78")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("companyId", Matchers.equalTo("a9ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getDriver_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/drivers/2302a326-d5f7-39e0-8fc3-c89d0ede88c9")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createDriver_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverDTORequest.json"))
                .when()
                    .post("/api/drivers")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, driverRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverData.sql"})
    void updateDriver_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/driverDTORequest.json"))
                .when()
                    .put("/api/drivers/a9f90c1a-4171-3536-9a5c-4b8d297e0d78")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"), driverRepository.findById(UUID.fromString("a9f90c1a-4171-3536-9a5c-4b8d297e0d78")).orElseThrow().getCompanyId());
        assertEquals(2, driverRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/driverData.sql"})
    void deleteDriver_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/drivers/a9f90c1a-4171-3536-9a5c-4b8d297e0d78")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, driverRepository.count());
    }

}
