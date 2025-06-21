package tms.octopus.octopus_tms.core.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class ReportControllerTest extends BaseIT {

    @Test
    void getRevenueReport_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/reports/revenue")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

    @Test
    void getLoadsSummary_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/reports/loads/summary")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

}
