package tms.octopus.octopus_tms.broker.rest;

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
import tms.octopus.octopus_tms.broker.contract.repos.ContractRepository;


@Sql({"/data/clearAllBroker.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllBroker.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class ContractResourceTest extends BaseIT {

    @Autowired
    public ContractRepository contractRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/contractData.sql"})
    void getAllContracts_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/contracts")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(2))
                    .body("get(0).id", Matchers.equalTo("a9fd2624-beef-3c78-88e4-e405d73f57ab"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/contractData.sql"})
    void getAllContracts_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/contracts?filter=b87e8915-461b-33ad-afb0-11530b711704")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("size()", Matchers.equalTo(1))
                    .body("get(0).id", Matchers.equalTo("b87e8915-461b-33ad-afb0-11530b711704"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/contractData.sql"})
    void getContract_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/contracts/a9fd2624-beef-3c78-88e4-e405d73f57ab")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("brokerId", Matchers.equalTo("a95fbadb-b9b1-3b6a-baf3-81dc9c24a68e"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getContract_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/contracts/2346dc72-3395-31ee-8ef5-7f4883be4cb4")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createContract_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/contractDTORequest.json"))
                .when()
                    .post("/api/contracts")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, contractRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/contractData.sql"})
    void updateContract_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/contractDTORequest.json"))
                .when()
                    .put("/api/contracts/a9fd2624-beef-3c78-88e4-e405d73f57ab")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f45fbadb-b9b1-3b6a-baf3-81dc9c24a68e"), contractRepository.findById(UUID.fromString("a9fd2624-beef-3c78-88e4-e405d73f57ab")).orElseThrow().getBrokerId());
        assertEquals(2, contractRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/contractData.sql"})
    void deleteContract_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/contracts/a9fd2624-beef-3c78-88e4-e405d73f57ab")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, contractRepository.count());
    }

}
