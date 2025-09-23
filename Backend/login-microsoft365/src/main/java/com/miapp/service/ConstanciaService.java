package com.miapp.service;

import com.miapp.model.DetallePrestamo;
import com.miapp.model.OcurrenciaBiblioteca;
import com.miapp.model.Usuario;
import com.miapp.model.dto.ConstanciaBusquedaDTO;
import com.miapp.model.dto.ConstanciaPrintRequest;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import com.miapp.repository.DetallePrestamoRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.repository.OcurrenciaMaterialRepository;
import com.miapp.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConstanciaService {

    private final DetallePrestamoRepository detallePrestamoRepository;
    private final OcurrenciaBibliotecaRepository ocurrenciaRepository;
    private final UsuarioRepository usuarioRepository;
    private final OcurrenciaMaterialRepository materialRepository;

    public ConstanciaService(DetallePrestamoRepository detallePrestamoRepository,
                             OcurrenciaBibliotecaRepository ocurrenciaRepository,
                             UsuarioRepository usuarioRepository,
                             OcurrenciaMaterialRepository materialRepository) {
        this.detallePrestamoRepository = detallePrestamoRepository;
        this.ocurrenciaRepository = ocurrenciaRepository;
        this.usuarioRepository = usuarioRepository;
        this.materialRepository = materialRepository;
    }

    public boolean tienePendientes(String codigoUsuario) {
        boolean prestamosPendientes = !detallePrestamoRepository
                .findByCodigoUsuarioIgnoreCaseAndFechaRecepcionIsNull(codigoUsuario)
                .isEmpty();
        boolean ocurrenciasPendientes = !ocurrenciaRepository
                .findPendientesByCodigoUsuarioIgnoreCase(codigoUsuario)
                .isEmpty();
        return prestamosPendientes || ocurrenciasPendientes;
    }

    public List<ConstanciaBusquedaDTO> buscar(String q) {
        List<Usuario> usuarios = (q == null || q.isBlank())
                ? usuarioRepository.findAll()
                : usuarioRepository.findByEmailContainingIgnoreCase(q);

        return usuarios.stream()
                .map(u -> new ConstanciaBusquedaDTO(
                        u.getIdUsuario(),
                        u.getLogin(),
                        u.getNombreUsuario() + " " +
                                (u.getApellidoPaterno() != null ? u.getApellidoPaterno() : "") + " " +
                                (u.getApellidoMaterno() != null ? u.getApellidoMaterno() : ""),
                        null,
                        u.getIdSede() != null ? u.getIdSede().toString() : null,
                        tienePendientes(u.getLogin())
                ))
                .collect(Collectors.toList());
    }

    public byte[] generarConstanciaPdf(ConstanciaPrintRequest request) throws IOException {
        List<OcurrenciaBiblioteca> ocurrencias =
                ocurrenciaRepository.findPendientesByCodigoUsuarioIgnoreCase(request.getCodigo());
        boolean prestamosPendientes = !detallePrestamoRepository
                .findByCodigoUsuarioIgnoreCaseAndFechaRecepcionIsNull(request.getCodigo())
                .isEmpty();
        boolean pendiente = prestamosPendientes || !ocurrencias.isEmpty();

        PDDocument document = new PDDocument();
        PDPage page = new PDPage(PDRectangle.A4);
        document.addPage(page);

        PDPageContentStream stream = new PDPageContentStream(document, page);
        stream.beginText();
        stream.setFont(PDType1Font.HELVETICA_BOLD, 16);
        stream.newLineAtOffset(50, 750);
        String titulo = pendiente ?
                "RELACION DE MATERIALES PENDIENTES POR REGULARIZAR" :
                "CONSTANCIA DE NO ADEUDAR MATERIALES DE BIBLIOTECA Y EQUIPOS DE COMPUTO";
        stream.showText(titulo);
        stream.endText();

        stream.beginText();
        stream.setFont(PDType1Font.HELVETICA, 12);
        stream.newLineAtOffset(50, 720);
        stream.showText("Codigo: " + request.getCodigo());
        stream.newLineAtOffset(0, -20);
        if (request.getEstudiante() != null) {
            stream.showText("Estudiante: " + request.getEstudiante());
            stream.newLineAtOffset(0, -20);
        }
        if (request.getTipoConstancia() != null && request.getTipoConstancia() == 2) {
            stream.showText("Solicitud: " + request.getSede() + "-" + request.getCorrelativo());
            stream.newLineAtOffset(0, -20);
        }
        if (request.getDescripcion() != null && !request.getDescripcion().isBlank()) {
            stream.showText("Detalle: " + request.getDescripcion());
            stream.newLineAtOffset(0, -20);
        }

        if (pendiente) {
            stream.showText("Ocurrencias pendientes:");
            stream.newLineAtOffset(0, -20);

            // Encabezado de tabla
            stream.setFont(PDType1Font.COURIER_BOLD, 10);
            stream.showText(String.format("%-8s %-60s %-12s %-10s", "ID", "Descripcion", "Fecha", "Costo"));
            stream.newLineAtOffset(0, -15);
            stream.setFont(PDType1Font.COURIER, 10);

            for (OcurrenciaBiblioteca oc : ocurrencias) {
                String desc = oc.getDescripcion() != null ? oc.getDescripcion() : "";
                if (desc.length() > 60) desc = desc.substring(0,60);
                String fecha = oc.getFechaCreacion() != null ? oc.getFechaCreacion().toLocalDate().toString() : "";
                BigDecimal total = materialRepository.sumCostoByOcurrencia(oc.getId());
                String costo = total != null ? total.toPlainString() : "0";
                stream.showText(String.format("%-8s %-60s %-12s %-10s", oc.getId(), desc, fecha, costo));
                stream.newLineAtOffset(0, -15);
            }
            // restaurar fuente
            stream.setFont(PDType1Font.HELVETICA, 12);
        }
        stream.endText();
        stream.close();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        document.save(baos);
        document.close();
        return baos.toByteArray();
    }

    public byte[] previsualizarPdf(String codigo) throws IOException {
        Usuario usuario = usuarioRepository.findByLoginIgnoreCase(codigo).orElse(null);
        ConstanciaPrintRequest req = new ConstanciaPrintRequest();
        req.setCodigo(codigo);
        if (usuario != null) {
            req.setEstudiante(usuario.getNombreUsuario() + " " +
                    (usuario.getApellidoPaterno() != null ? usuario.getApellidoPaterno() : "") + " " +
                    (usuario.getApellidoMaterno() != null ? usuario.getApellidoMaterno() : ""));
        }
        req.setTipoConstancia(1);
        return generarConstanciaPdf(req);
    }
}