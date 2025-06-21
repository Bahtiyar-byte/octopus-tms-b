package tms.octopus.octopus_tms.base;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan("tms.octopus.octopus_tms")
public class OctopusTmsApplication {

    public static void main(final String[] args) {
        SpringApplication.run(OctopusTmsApplication.class, args);
    }

}
