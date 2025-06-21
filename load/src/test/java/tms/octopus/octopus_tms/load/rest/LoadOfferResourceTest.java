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
import tms.octopus.octopus_tms.load.load_offer.repos.LoadOfferRepository;


@Sql({"/data/clearAllLoad.sql", "/data/clearAllCore.sql"})
@Sql(scripts = {"/data/clearAllLoad.sql", "/data/clearAllCore.sql"}, executionPhase = Sql.ExecutionPhase.AFTER_TEST_CLASS)
public class LoadOfferResourceTest extends BaseIT {

    @Autowired
    public LoadOfferRepository loadOfferRepository;

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadOfferData.sql"})
    void getAllLoadOffers_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadOffers")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(2))
                    .body("content.get(0).id", Matchers.equalTo("a9696a9b-362a-35a5-9c3d-c8f098b73923"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadOfferData.sql"})
    void getLoadOffer_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadOffers/a9696a9b-362a-35a5-9c3d-c8f098b73923")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("carrierId", Matchers.equalTo("a96a2f58-9646-3dee-a979-2578931a1380"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getLoadOffer_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/loadOffers/236d27a7-a8a8-330d-b4b5-3240737ccc85")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql"})
    void createLoadOffer_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadOfferDTORequest.json"))
                .when()
                    .post("/api/loadOffers")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(1, loadOfferRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadOfferData.sql"})
    void updateLoadOffer_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/loadOfferDTORequest.json"))
                .when()
                    .put("/api/loadOffers/a9696a9b-362a-35a5-9c3d-c8f098b73923")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals(UUID.fromString("f46a2f58-9646-3dee-a979-2578931a1380"), loadOfferRepository.findById(UUID.fromString("a9696a9b-362a-35a5-9c3d-c8f098b73923")).orElseThrow().getCarrierId());
        assertEquals(2, loadOfferRepository.count());
    }

    @Test
    @Sql({"/data/userData.sql", "/data/loadData.sql", "/data/loadOfferData.sql"})
    void deleteLoadOffer_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/loadOffers/a9696a9b-362a-35a5-9c3d-c8f098b73923")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(1, loadOfferRepository.count());
    }

}
