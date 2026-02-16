package com.project.woof;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class WoofApplication {

	public static void main(String[] args) {
		SpringApplication.run(WoofApplication.class, args);
	}

}
