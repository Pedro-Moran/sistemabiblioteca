package com.miapp.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix="file.storage")
public class FileStorageProperties {
    /** carpeta raíz donde guardamos */
    private String location;
    public String getLocation(){ return location; }
    public void setLocation(String location){ this.location = location; }
}

