package com.project.woofpayment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class WoofPaymentServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(WoofPaymentServiceApplication.class, args);
	}

}
