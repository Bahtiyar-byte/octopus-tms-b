package tms.octopus.octopus_tms.base.config;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import lombok.SneakyThrows;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.SqlMergeMode;
import org.springframework.util.StreamUtils;
import tms.octopus.octopus_tms.base.OctopusTmsApplication;

/**
 * Local integration test base class that uses local PostgreSQL instead of Testcontainers.
 * Requires local PostgreSQL database: octopus-tms-b-test
 */
@SpringBootTest(
        classes = OctopusTmsApplication.class,
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@ActiveProfiles("local-test")
@SqlMergeMode(SqlMergeMode.MergeMode.MERGE)
public abstract class LocalBaseIT {

    @LocalServerPort
    public int serverPort;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initRestAssured() {
        RestAssured.port = serverPort;
        RestAssured.urlEncodingEnabled = false;
        RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    }

    @BeforeEach
    public void beforeEach() {
        // Clean up database before each test
        cleanDatabase();
    }

    private void cleanDatabase() {
        // Disable foreign key checks
        jdbcTemplate.execute("SET session_replication_role = 'replica';");

        // Get all tables and truncate them
        jdbcTemplate.query(
            "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT LIKE 'flyway%'",
            (rs, rowNum) -> rs.getString("tablename")
        ).forEach(table -> {
            jdbcTemplate.execute("TRUNCATE TABLE \"" + table + "\" CASCADE");
        });

        // Re-enable foreign key checks
        jdbcTemplate.execute("SET session_replication_role = 'origin';");
    }

    @SneakyThrows
    public String readResource(final String resourceName) {
        return StreamUtils.copyToString(getClass().getResourceAsStream(resourceName), StandardCharsets.UTF_8);
    }

    public String adminOctopusTMSSecurityConfigToken() {
        // user admin@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJhZG1pbkBpbnZhbGlkLmJvb3RpZnkuaW8iLCJyb2xlcyI6WyJBRE1JTiJdLCJpc3MiOiJib290aWZ5IiwiaWF0IjoxNzQ4NDc4ODUzLCJleHAiOjIyMDg5ODg4MDB9." +
                "Ztj8eYRSuNNMdV_9jcvKW5lF2Ors45PD8bz3cOhW3Teg9ZLv9yUzWq8xde4OLysvwzMO7ol7DvxD3UxOLxZtOw";
    }

    public String salesRepOctopusTMSSecurityConfigToken() {
        // user salesrep@invalid.bootify.io, expires 2040-01-01
        return "Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9." +
                "eyJzdWIiOiJzYWxlc3JlcEBpbnZhbGlkLmJvb3RpZnkuaW8iLCJyb2xlcyI6WyJTQUxFU19SRVAiXSwiaXNzIjoiYm9vdGlmeSIsImlhdCI6MTc0ODQ3ODg1MywiZXhwIjoyMjA4OTg4ODAwfQ." +
                "fkIiEZGZYTkQRByzOCDXiXOQq3AraJh6uC4S7jCN4EzfaZjIvpsHqYg7rM3bKoeGKbbHfkgo7NyCq59GhmAGmQ";
    }

    // Backward compatibility method - delegates to salesRepOctopusTMSSecurityConfigToken
    public String supervisorOctopusTMSSecurityConfigToken() {
        return salesRepOctopusTMSSecurityConfigToken();
    }
}
