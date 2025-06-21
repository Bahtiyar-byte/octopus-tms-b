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
import tms.octopus.octopus_tms.load.load_stop.repos.LoadStopRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadStopResourceTest extends BaseIT {

    @Autowired
    public LoadStopRepository loadStopRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStopData.sql"})
    void getAllLoadStops_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStops")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9dd4a99-fba6-375a-9494-772b58f95280"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStopData.sql"})
    void getLoadStop_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStops/a9dd4a99-fba6-375a-9494-772b58f95280")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("stopNumber", Matchers.equalTo(89));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadStop_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadStops/234920ea-2540-3ec7-bbee-9efce43ea25e")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void createLoadStop_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStopDTORequest.json"))
                .when()
                    .post("/api/loadStops")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadStopRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createLoadStop_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStopDTORequest_missingField.json"))
                .when()
                    .post("/api/loadStops")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("stopNumber"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStopData.sql"})
    void updateLoadStop_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadStopDTORequest.json"))
                .when()
                    .put("/api/loadStops/a9dd4a99-fba6-375a-9494-772b58f95280")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(74, loadStopRepository.findById(UUID.fromString("a9dd4a99-fba6-375a-9494-772b58f95280")).orElseThrow().getStopNumber());
        assertEquals(2, loadStopRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadStopData.sql"})
    void deleteLoadStop_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadStops/a9dd4a99-fba6-375a-9494-772b58f95280")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadStopRepository.count());
    }

}
