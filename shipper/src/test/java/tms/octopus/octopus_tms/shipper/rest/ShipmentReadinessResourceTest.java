package tms.octopus.octopus_tms.shipper.rest;

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
import tms.octopus.octopus_tms.shipper.shipment_readiness.repos.ShipmentReadinessRepository;


@Sql({"/data/clearAllShipper.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllShipper.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class ShipmentReadinessResourceTest extends BaseIT {

    @Autowired
    public ShipmentReadinessRepository shipmentReadinessRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/shipmentReadinessData.sql"})
    void getAllShipmentReadinesses_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/shipmentReadinesses")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a97628dd-7a71-3c86-b8db-d22d4421ee46"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/shipmentReadinessData.sql"})
    void getAllShipmentReadinesses_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/shipmentReadinesses?filter=b8e7f2e0-90fe-350e-b8de-b4466fdc81b3")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8e7f2e0-90fe-350e-b8de-b4466fdc81b3"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/shipmentReadinessData.sql"})
    void getShipmentReadiness_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/shipmentReadinesses/a97628dd-7a71-3c86-b8db-d22d4421ee46")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("warehouseId", Matchers.equalTo("a941c15b-f343-39f4-aaab-9d64e744249a"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getShipmentReadiness_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/shipmentReadinesses/23139b17-a92b-3df7-96c3-c840e51465fe")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createShipmentReadiness_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/shipmentReadinessDTORequest.json"))
                .when()
                    .post("/api/shipmentReadinesses")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, shipmentReadinessRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/shipmentReadinessData.sql"})
    void updateShipmentReadiness_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/shipmentReadinessDTORequest.json"))
                .when()
                    .put("/api/shipmentReadinesses/a97628dd-7a71-3c86-b8db-d22d4421ee46")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f441c15b-f343-39f4-aaab-9d64e744249a"), shipmentReadinessRepository.findById(UUID.fromString("a97628dd-7a71-3c86-b8db-d22d4421ee46")).orElseThrow().getWarehouseId());
        assertEquals(2, shipmentReadinessRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/shipmentReadinessData.sql"})
    void deleteShipmentReadiness_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/shipmentReadinesses/a97628dd-7a71-3c86-b8db-d22d4421ee46")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, shipmentReadinessRepository.count());
    }

}
