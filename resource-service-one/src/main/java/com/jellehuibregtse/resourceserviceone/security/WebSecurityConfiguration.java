package com.jellehuibregtse.resourceserviceone.security;

import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true, prePostEnabled = true)
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        var jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());

        http.authorizeRequests()
            .antMatchers("/actuator/**")
            .permitAll()
            .antMatchers(HttpMethod.GET, "/hamsters/status/check")
            .hasRole("user")
            .anyRequest()
            .authenticated()
            .and()
            .oauth2ResourceServer()
            .jwt()
            .jwtAuthenticationConverter(jwtAuthenticationConverter);
    }
}
