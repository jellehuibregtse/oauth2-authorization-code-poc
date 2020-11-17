# OAuth2 – Authorization Code Grant (PKCE Enhanced): A Proof of Concept

## About
This is a simple proof of concept for an OAuth2 implementation for the authorization code grant in Java Spring Boot using the microservices architecture. Furthermore, we use PKCE to make the flow even more secure. There are is one discovery server, one resource service and an api gateway. Eureka is being used for discovery and Zuul for the api gateway.

## Getting Started
Once you cloned the repository, start the discovery server, resource service and api gateway using
```console
$ ./mvnw spring-boot:run
```
in their respective folders. Then, all we need is an authorization server to authorize and authenticate our users. For this we use [keycloak](https://www.keycloak.org/ "Keycloak's website"), to get it running quickly and with ease, we use docker with a image provided by quay.io:
```console
$ docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin quay.io/keycloak/keycloak:11.0.3
```
You can manually configure keycloak, which is quite straightforward, but a [file](../main/realm-export.json) is provided which you can easily import.

Then, finally to show the flow we have a React client as front-end. To get this up and running, we can use:
```console
$ yarn start
```
in the [client folder](../main/client).
