    package com.miapp.controller;

    import com.miapp.model.dto.CambioEstadoRequest;
    import com.miapp.model.dto.HorarioDTO;
    import com.miapp.model.dto.ResponseDTO;
    import com.miapp.repository.HorarioRepository;
    import com.miapp.service.HorarioService;
    import lombok.Data;
    import lombok.RequiredArgsConstructor;
    import org.springframework.web.bind.annotation.*;

    import java.util.List;
    import java.util.stream.Collectors;

    @RestController
    @RequestMapping("/auth/api/horarios")
    @RequiredArgsConstructor
    public class HorarioController {
        private final HorarioService srv;
        private final HorarioRepository repo;

        @GetMapping("/listar")
        public ResponseDTO<List<HorarioDTO>> listar(@RequestParam(value = "sedeId", required = false) Long sedeId) {
            List<HorarioDTO> list = srv.listar(sedeId);
            return new ResponseDTO<>(0, "OK", list);
        }

        @PostMapping("/registrar")
        public ResponseDTO<Void> registrar(@RequestBody HorarioDTO dto) {
            srv.guardar(dto);
            return new ResponseDTO<>(0, "HORARIO REGISTRADO", null);
        }

        @DeleteMapping("/eliminar/{id}")
        public ResponseDTO<Void> eliminar(@PathVariable Long id) {
            srv.eliminar(id);
            return new ResponseDTO<>(0, "HORARIO ELIMINADO", null);
        }

        @PutMapping("/activo")
        public ResponseDTO<Void> cambiarEstado(@RequestBody CambioEstadoRequest r) {
            System.out.println("ver controller: "+ r.getNuevoEstado());
            srv.cambiarEstado(r.getId(), r.getNuevoEstado(), r.getUsuario());
            return new ResponseDTO<>(0 ,"ESTADO CAMBIADO", null);
        }

        @Data
        static class CambioEstadoRequest {
            private Long id;
            private Long nuevoEstado;
            private String usuario;
        }
    }

