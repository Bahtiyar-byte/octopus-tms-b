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
import tms.octopus.octopus_tms.carrier.equipment.repos.EquipmentRepository;


@Sql({"/data/clearAllCarrier.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllCarrier.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class EquipmentResourceTest extends BaseIT {

    @Autowired
    public EquipmentRepository equipmentRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/equipmentData.sql"})
    void getAllEquipments_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/equipments")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a949ee8e-0cff-32ad-ab4c-c0ee0e50b7d1"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/equipmentData.sql"})
    void getEquipment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/equipments/a949ee8e-0cff-32ad-ab4c-c0ee0e50b7d1")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("carrierId", Matchers.equalTo("a96a2f58-9646-3dee-a979-2578931a1380"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getEquipment_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/equipments/231fd8c2-a4e7-3c1d-a4a4-0dc735c051ae")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createEquipment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/equipmentDTORequest.json"))
                .when()
                    .post("/api/equipments")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, equipmentRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createEquipment_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/equipmentDTORequest_missingField.json"))
                .when()
                    .post("/api/equipments")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("carrierId"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/equipmentData.sql"})
    void updateEquipment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/equipmentDTORequest.json"))
                .when()
                    .put("/api/equipments/a949ee8e-0cff-32ad-ab4c-c0ee0e50b7d1")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f46a2f58-9646-3dee-a979-2578931a1380"), equipmentRepository.findById(UUID.fromString("a949ee8e-0cff-32ad-ab4c-c0ee0e50b7d1")).orElseThrow().getCarrierId());
        assertEquals(2, equipmentRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/equipmentData.sql"})
    void deleteEquipment_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/equipments/a949ee8e-0cff-32ad-ab4c-c0ee0e50b7d1")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, equipmentRepository.count());
    }

}
