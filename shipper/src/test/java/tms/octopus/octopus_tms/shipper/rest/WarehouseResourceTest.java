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
import tms.octopus.octopus_tms.shipper.warehouse.repos.WarehouseRepository;


@Sql({"/data/clearAllShipper.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllShipper.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class WarehouseResourceTest extends BaseIT {

    @Autowired
    public WarehouseRepository warehouseRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql"})
    void getAllWarehouses_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/warehouses")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a91ae30a-f875-3c2d-a872-0ea3c1f8c2b1"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql"})
    void getAllWarehouses_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/warehouses?filter=b8ec8468-b673-34c2-813d-215b77034476")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8ec8468-b673-34c2-813d-215b77034476"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql"})
    void getWarehouse_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/warehouses/a91ae30a-f875-3c2d-a872-0ea3c1f8c2b1")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("companyId", Matchers.equalTo("a9ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getWarehouse_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/warehouses/23df2255-ad64-3b92-bd95-503b9a7958d8")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createWarehouse_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/warehouseDTORequest.json"))
                .when()
                    .post("/api/warehouses")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, warehouseRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createWarehouse_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/warehouseDTORequest_missingField.json"))
                .when()
                    .post("/api/warehouses")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("name"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql"})
    void updateWarehouse_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/warehouseDTORequest.json"))
                .when()
                    .put("/api/warehouses/a91ae30a-f875-3c2d-a872-0ea3c1f8c2b1")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f4ea0c7d-9a94-3c28-9ab7-1b0f301e92aa"), warehouseRepository.findById(UUID.fromString("a91ae30a-f875-3c2d-a872-0ea3c1f8c2b1")).orElseThrow().getCompanyId());
        assertEquals(2, warehouseRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/warehouseData.sql"})
    void deleteWarehouse_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/warehouses/a91ae30a-f875-3c2d-a872-0ea3c1f8c2b1")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, warehouseRepository.count());
    }

}
