package tms.octopus.octopus_tms.carrier.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class DeriverReportControllerTest extends BaseIT {

    @Test
    void getDriverPerformance_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/reports/performance/test-driverId")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

}
