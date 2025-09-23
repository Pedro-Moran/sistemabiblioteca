package com.miapp.controller;

import com.miapp.model.dto.ResponseDTO;
import com.miapp.service.TipoRecursoDigitalService;
import com.miapp.service.impl.TipoRecursoDigitalDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/auth/api/tipos-recursos-digitales")
@RequiredArgsConstructor
public class TipoRecursoDigitalController {
    private final TipoRecursoDigitalService srv;

    @GetMapping("/listar")
    public ResponseDTO<List<TipoRecursoDigitalDTO>> listar() {
        return new ResponseDTO<>(0, "OK", srv.listar());
    }
}