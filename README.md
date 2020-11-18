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

## Research
Before creating this implementation I had to do some research on OAuth and PKCE. After that I needed to research this particular implementation. To do this research properly, I need to come up with some questions on the topics, so that I find the answers I need:

### Research questions
1. What is the terminology used when we talk about securing an application?
  * What is the difference between authentication and authorization?
  * What is a principal?
  * What is a role?
  * What is a granted authority?
2. What is OAuth, it's terminology and what are it's use cases?
  * What grant types are there?
  * Which one is best for my use case?
  * What is a resource?
  * What is a resource owner?
  * What is a client?
  * What is an authorization server?
3. What is PKCE?
  * What is it used for?
  * How does it work (what does it's flow look like)?

### Answers

#### Security terminology 
When we want something from a web application, say a protected resource. The application can ask two questions: "Who are you"" and "What do you want?". Then, the user trying to access the protected research needs to answer this question, this is called *authentication*. Usually, this goes through accounts. The user needs to then tell the application, which account belongs to them. So, the user can tell the application that account with username, *username* belongs to them. Now, the user needs to prove that this is the case. Usually, this is usually done using a *password*.

### Method
To answer these questions, I will be using the following methods:
- Best, good, and bad practices
- Community research
- Literature study
- Interview
- Peer review

### Sources
1. [Five Spring Security Concepts - Authentication vs authorization - Java Brains Brain Bytes](https://www.youtube.com/watch?v=I0poT4UxFxE)
2. [What is OAuth really all about - OAuth tutorial - Java Brains](https://www.youtube.com/watch?v=t4-416mg6iU)
3. [OAuth terminologies and flows explained - OAuth tutorial - Java Brains](https://www.youtube.com/watch?v=3pZ3Nh8tgTE)
