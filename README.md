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
  * What different types of authentication are there?
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
  
### Method
To answer these questions, I will be using the following methods:
- Best, good, and bad practices
- Community research
- Literature study
- Interview
- Peer review

### Answers

#### 1. Security terminology 
When we want something from a web application, say a protected resource. The application can ask two questions: "Who are you"" and "What do you want?". 

Firstly, the user trying to access the protected research needs to answer this first question, this is called **authentication**. Usually, this goes through accounts. The user needs to then tell the application, which account belongs to them. So, the user can tell the application that account with username, *username* belongs to them. Now, the user needs to prove that this is the case. Usually, this is usually done using a *password*. Other forms could be the use of a pincode or answering a question. This way of authenticating one's self is called *knowledge based authentication*, it's easy to implement and use. However, it's not fully safe, since someone can discover or steal your password. An alternative to this is *possesion based authentication*, this is where you use one's phone for example (in combination with text messages) to authenticate. Instead of a phone, key cards and badges or an access token device can be used aswell. If we combine the two, we call it *multi factor authentication*.

Secondly, the same user then needs to answer the second question. Then, the application needs to answer the following follow-up question: "Can this user do this"? The answer, is a simple yes or no. This is **authorization**. An example could be the following: a regular user can only do action 1, a manager can do action 1 and action 2, but then an admin can do all available actions. The user, manager and admin are all examples or roles. Then, if we take the manager role, that role is granted to do actions 1 and 2. These actions, which are granted by the system are called **granted authorities**. You can say that a role is a group of granted authorities.

Lastely, when a user is authenticated and authorized to the protected resource, the system useses what we call a **principal** to keep track of the user. We can also say that the principal *is* the currently logged in user.

In conclusion, authentication is simply the question of "Who is this user?" and authorization "Are they allowed to do this?". This user has a role stating which actions they are authorized to do (granted authorities). We keep track of the logged in user using a principal.

#### 2.
The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service, either onbehalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP service, or by allowing the third-party application to obtain access on its own behalf. This interaction is done using an OAuth access token, which contains user-allowed permissions, specifiying what can and cannot be done. Usually this token is in the form of a JWT (JSON Web Token).

OAuth2 defines four roles: resource owner, resource server, client and authoirzation server.

### Sources
1. [Five Spring Security Concepts - Authentication vs authorization - Java Brains Brain Bytes](https://www.youtube.com/watch?v=I0poT4UxFxE)
2. [What is OAuth really all about - OAuth tutorial - Java Brains](https://www.youtube.com/watch?v=t4-416mg6iU)
3. [OAuth terminologies and flows explained - OAuth tutorial - Java Brains](https://www.youtube.com/watch?v=3pZ3Nh8tgTE)
4. [Authorization Code Flow with Proof Key for Code Exchange (PKCE)](https://auth0.com/docs/flows/authorization-code-flow-with-proof-key-for-code-exchange-pkce)
5. [The OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
