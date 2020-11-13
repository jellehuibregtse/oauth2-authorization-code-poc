package com.jellehuibregtse.resourceserviceone.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@RequiredArgsConstructor
public class Resource {

    private final @NotNull int id;
    private String name;
    private String description;
}
