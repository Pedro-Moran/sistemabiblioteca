package com.miapp.service;

import com.miapp.model.TipoDocumento;
import com.miapp.repository.TipoDocumentoRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TipoDocumentoService {

    private final TipoDocumentoRepository tipoDocumentoRepository;

    public TipoDocumentoService(TipoDocumentoRepository tipoDocumentoRepository) {
        this.tipoDocumentoRepository = tipoDocumentoRepository;
    }

    public List<TipoDocumento> getActivos() {
        return tipoDocumentoRepository.findByActivoTrue();
    }

}
