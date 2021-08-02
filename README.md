# OAuth2 – Authorization Code Grant (PKCE Enhanced): A Proof of Concept

## About

This is a simple proof of concept for an OAuth2 implementation for the authorization code grant in Java Spring Boot
using the microservices architecture. Furthermore, we use PKCE to make the flow even more secure. There are is one
discovery server, one resource service and an api gateway. Eureka is being used for discovery and Zuul for the api
gateway.

## Disclaimer

The entire flow is secure, because we use OAuth2 Authorization Code Grant with PKCE Enhancements, and we also use state
to prevent CSRF attacks. However, if you were to deploy this it would not be secure, because the entire architecture is
using HTTP instead of more secure HTTPS. Setting HTTPS up in Java Spring Boot requires two steps getting an SSL
certificate and setting it up.

## Getting Started

Once you cloned the repository, start the discovery server, resource service and api gateway using

```console
$ ./mvnw spring-boot:run
```

in their respective folders. Then, all we need is an authorization server to authorize and authenticate our users. For
this we use [keycloak](https://www.keycloak.org/ "Keycloak's website"), to get it running quickly and with ease, we use
docker with a image provided by quay.io:

```console
$ docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin quay.io/keycloak/keycloak:11.0.3
```

You can manually configure keycloak, which is quite straightforward, but a [file](../main/realm-export.json) is provided
which you can easily import.

Then, finally to show the flow we have a React client as front-end. To get this up and running, we can use:

```console
$ yarn start
```

in the [client folder](../main/client).

## Research

Before creating this implementation I had to do some research on OAuth and PKCE. After that I needed to research this
particular implementation. To do this research properly, I need to come up with some questions on the topics, so that I
find the answers I need. For this research I will be using the DOT framework. I also came up with an overarching general
research question: How would OAuth2 be implemented in a Java Spring Boot microservices architecture? Since this is a
large question, it is divided into smaller more answerable research questions with their own sub-questions:

### Research questions

1. What is the terminology used when we talk about securing an application?
    * What is the difference between authentication and authorization?
    * What different types of authentication are there?
    * What is a principal?
    * What is a role?
    * What is a granted authority?
2. What is OAuth, it's terminology and what are its use cases?
    * What grant types are there?
    * Which one is best for my use case?
    * What is a resource?
    * What is a resource owner?
    * What is a client?
    * What is an authorization server?
3. What is PKCE?
    * What is it used for?
    * How does it work (what does its flow look like)?

### Method

Now that the questions are formulated, we can use the DOT framework using the following methods and strategies to answer
these questions. I will assign the best suited methods and strategies to the questions.

- Best, good, and bad practices (all three)
- Community research (all three)
- Literature study (all three)
- Interview (two and three)
- Peer review (two and three)
- Workshop (two and three)

For my research I continuously used most of these methods. The sources for literature study, community research and
best, good and bad practices are below. The interview, peer review and workshop consists of the interaction between me,
my teacher [@leonvanbokhorst](https://github.com/leonvanbokhorst/) and my
roommate [@koesie10](https://github.com/koesie10/).

### Answers

#### 1. Security terminology

When we want something from a web application, say a protected resource. The application can ask two questions: "Who are
you" and "What do you want?".

Firstly, the user trying to access the protected research needs to answer this first question, this is called **
authentication**. Usually, this goes through accounts. The user needs to then tell the application, which account
belongs to them. So, the user can tell the application that account with username, *username* belongs to them. Now, the
user needs to prove that this is the case. Usually, this is usually done using a *password*. Other forms could be the
use of a pincode or answering a question. This way of authenticating one's self is called *knowledge based
authentication*, it's easy to implement and use. However, it's not fully safe, since someone can discover or steal your
password. An alternative to this is *possession based authentication*, this is where you use one's phone for example (in
combination with text messages) to authenticate. Instead of a phone, key cards and badges or an access token device can
be used as well. If we combine the two, we call it *multi-factor authentication*.

Secondly, the same user then needs to answer the second question. Then, the application needs to answer the following
follow-up question: "Can this user do this"? The answer, is a simple yes or no. This is **authorization**. An example
could be the following: a regular user can only do action 1, a manager can do action 1 and action 2, but then an admin
can do all available actions. The user, manager and admin are all examples or roles. Then, if we take the manager role,
that role is granted to do actions 1 and 2. These actions, which are granted by the system are called **granted
authorities**. You can say that a role is a group of granted authorities.

Lastly, when a user is authenticated and authorized to the protected resource, the system uses what we call a **
principal** to keep track of the user. We can also say that the principal *is* the currently logged-in user.

In conclusion, authentication is simply the question of "Who is this user?" and authorization "Are they allowed to do
this?". This user has a role stating which actions they are authorized to do (granted authorities). We keep track of the
logged-in user using a principal.

#### 2. OAuth

The OAuth 2.0 authorization framework enables a third-party application to obtain limited access to an HTTP service,
either on behalf of a resource owner by orchestrating an approval interaction between the resource owner and the HTTP
service, or by allowing the third-party application to obtain access on its own behalf. This interaction is done using
an OAuth access token, which contains user-allowed permissions, specifying what can and cannot be done. Usually this
token is in the form of a JWT (JSON Web Token).

OAuth2 defines four roles: resource owner, resource server, client and authorization server.

- Resource owner: An entity capable of granting access to a protected resource. When the resource owner is a person, it
  is referred to as an end-user.
- Resource server: The server hosting the protected resources, capable of accepting and responding to protected resource
  requests using access tokens.
- Client: An application making protected resource requests on behalf of the resource owner and with its authorization.
  The term "client" does not imply any particular implementation characteristics (e.g., whether the application executes
  on a server, a desktop, or other devices).
- Authorization server: The server issuing access tokens to the client after successfully authenticating the resource
  owner and obtaining authorization.

There are multiple different grant types which you can use with OAuth: authorization code, implicit, password
credentials and client credentials. We will go more in depth on the **authorization code grant**:

1. User authenticates with the client.
2. The client makes an authorization code request to the authorization server.
3. Redirects the client to login/authorization prompt.
4. The user authenticates and gives consent.
5. The authorization server returns an authorization code.
6. The client sends the authorization code, together with client id and secret back to the authorization server.
7. The authorization server validates them.
8. The authorization server returns a JWT access token.
9. The client requests the resource from the resource server with the JWT access token.
10. The resource server verifies the token (via the authorization server).
11. The resource server sends the resource to the client.

#### 3. PCKE

One of the issues of the authorization code grant is an authorization code interception attack. Someone steals the
authorization code the client receives during step 5. The basic idea behind PKCE is proof of possession, the client
should give proof to the authorization server that the authorization code actually belongs to said client. PCKE
introduces a few new variables into the mix: a code verifier, a code challenge and a code challenge method.

- Code verifier: The code verifier should be a high-entropy cryptographic random string with 43 to 128 characters,
  consisting only of A-Z, a-z, 0-9, "-", ".", "_" and "~".
- Code challenge: The code challenge is basically the code verifier hashed using SHA256 and base64 URL
  encoding `Base64UrlEncode(SHA256Hash(code_verifier))`.
- Code challenge method: An optional parameter, but you should use `SHA256`. Otherwise, it will default to `plain`, which
  basically means that the code verifier and challenge are the same, which is not recommended.

Now let's take a look at the flow (combined with authorization code grant):

1. User authenticates with the client.
2. *The client creates a cryptographically-random `code_verifier` and from this generates a `code_challenge` using
   SHA265.*
2. The client makes an authorization code request to the authorization server *along with the `code_challenge`* and the
   client id.
3. Redirects the client to login/authorization prompt.
4. The user authenticates and gives consent.
5. The authorization server *stores the `code_challenge` and* returns an authorization code.
6. The client sends the authorization code, together with *the `code_verifier` to the authorization server*.
7. The authorization server validates the code and the `code_challenge` and `code_verifier`.
8. The authorization server returns a JWT access token.
9. The client requests the resource from the resource server with the JWT access token.
10. The resource server verifies the token (via the authorization server).
11. The resource server sends the resource to the client.

To prevent CSRF attacks you can even generate a `state`-value which you can send with the authorization code request and
must store locally. When the authorization server returns the authorization code, it will also provide the `state`
-value. When this value is not the same it may be a CSRF attack and the flow must be reset.

### Sources

1. [Five Spring Security Concepts - Authentication vs authorization - Java Brains Brain Bytes](https://www.youtube.com/watch?v=I0poT4UxFxE)
2. [What is OAuth really all about - OAuth tutorial - Java Brains](https://www.youtube.com/watch?v=t4-416mg6iU)
3. [OAuth terminologies and flows explained - OAuth tutorial - Java Brains](https://www.youtube.com/watch?v=3pZ3Nh8tgTE)
4. [Authorization Code Flow with Proof Key for Code Exchange (PKCE)](https://auth0.com/docs/flows/authorization-code-flow-with-proof-key-for-code-exchange-pkce)
5. [The OAuth 2.0 Authorization Framework](https://tools.ietf.org/html/rfc6749)
6. [What Is PKCE?](https://dzone.com/articles/what-is-pkce)
7. [Prevent Attacks and Redirect Users with OAuth 2.0 State Parameters](https://auth0.com/docs/protocols/state-parameters)
8. [Proof Key for Code Exchange by OAuth Public Clients](https://tools.ietf.org/html/rfc7636)
