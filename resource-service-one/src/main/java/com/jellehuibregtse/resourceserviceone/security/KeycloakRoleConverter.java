package com.jellehuibregtse.resourceserviceone.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    /**
     * Converts a JWT token to a collection of granted authorities by extracting the roles from the claims.
     *
     * @param jwt token.
     * @return a collection of granted authorities.
     */
    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        var realmAccess = (Map<String, Object>) jwt.getClaims().get("realm_access");

        if (realmAccess == null || realmAccess.isEmpty()) {
            return new ArrayList<>();
        }

        return ((List<String>) realmAccess.get("roles")).stream()
                                                        .map(roleName -> "ROLE_" + roleName)
                                                        .map(SimpleGrantedAuthority::new)
                                                        .collect(Collectors.toList());
    }
}
