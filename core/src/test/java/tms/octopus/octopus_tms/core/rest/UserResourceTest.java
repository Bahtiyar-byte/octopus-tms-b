package tms.octopus.octopus_tms.core.rest;

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
import tms.octopus.octopus_tms.core.user.repos.UserRepository;


@Sql("/data/clearAllCore.sql")
public class UserResourceTest extends BaseIT {

    @Autowired
    public UserRepository userRepository;

    @Test
    @Sql("/data/userData.sql")
    void getAllUsers_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/users")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(7))
                    .body("content.get(0).id", Matchers.equalTo("a96e0a04-d20f-3096-bc64-dac2d639a577"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getAllUsers_filtered() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/users?filter=b8bff625-bdb0-3939-92c9-d4db0c6bbe45")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("page.totalElements", Matchers.equalTo(1))
                    .body("content.get(0).id", Matchers.equalTo("b8bff625-bdb0-3939-92c9-d4db0c6bbe45"));
    }

    @Test
    @Sql("/data/userData.sql")
    void getUser_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/users/a96e0a04-d20f-3096-bc64-dac2d639a577")
                .then()
                    .statusCode(HttpStatus.OK.value())
                    .body("email", Matchers.equalTo("Sed ut perspiciatis."));
    }

    @Test
    @Sql("/data/userData.sql")
    void getUser_notFound() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .get("/api/users/23a93ba8-9a5b-3c6c-a26e-49b88973f46e")
                .then()
                    .statusCode(HttpStatus.NOT_FOUND.value())
                    .body("code", Matchers.equalTo("NOT_FOUND"));
    }

    @Test
    @Sql("/data/userData.sql")
    void createUser_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/userDTORequest.json"))
                .when()
                    .post("/api/users")
                .then()
                    .statusCode(HttpStatus.CREATED.value());
        assertEquals(8, userRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void createUser_missingField() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/userDTORequest_missingField.json"))
                .when()
                    .post("/api/users")
                .then()
                    .statusCode(HttpStatus.BAD_REQUEST.value())
                    .body("code", Matchers.equalTo("VALIDATION_FAILED"))
                    .body("fieldErrors.get(0).property", Matchers.equalTo("username"))
                    .body("fieldErrors.get(0).code", Matchers.equalTo("REQUIRED_NOT_NULL"));
    }

    @Test
    @Sql("/data/userData.sql")
    void updateUser_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                    .contentType(ContentType.JSON)
                    .body(readResource("/requests/userDTORequest.json"))
                .when()
                    .put("/api/users/a96e0a04-d20f-3096-bc64-dac2d639a577")
                .then()
                    .statusCode(HttpStatus.OK.value());
        assertEquals("Nulla facilisis.", userRepository.findById(UUID.fromString("a96e0a04-d20f-3096-bc64-dac2d639a577")).orElseThrow().getEmail());
        assertEquals(7, userRepository.count());
    }

    @Test
    @Sql("/data/userData.sql")
    void deleteUser_success() {
        RestAssured
                .given()
                    .header(HttpHeaders.AUTHORIZATION, adminOctopusTMSSecurityConfigToken())
                    .accept(ContentType.JSON)
                .when()
                    .delete("/api/users/a96e0a04-d20f-3096-bc64-dac2d639a577")
                .then()
                    .statusCode(HttpStatus.NO_CONTENT.value());
        assertEquals(6, userRepository.count());
    }

}
