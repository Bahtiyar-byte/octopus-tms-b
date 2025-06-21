package tms.octopus.octopus_tms.broker.rest;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import tms.octopus.octopus_tms.base.config.BaseIT;


public class BrokerDashboardControllerTest extends BaseIT {

    @Test
    void getBrokerDashboard_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, supervisorOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/dashboard/broker")
                .then()
                    .statusCode(HttpStatus.OK.value());
    }

}
