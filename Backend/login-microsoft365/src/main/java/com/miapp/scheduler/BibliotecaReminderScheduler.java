package com.miapp.scheduler;

import com.miapp.model.DetalleBiblioteca;
import com.miapp.model.OcurrenciaBiblioteca;
import com.miapp.repository.DetalleBibliotecaRepository;
import com.miapp.repository.OcurrenciaBibliotecaRepository;
import com.miapp.service.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Component
public class BibliotecaReminderScheduler {

    private final DetalleBibliotecaRepository detalleRepo;
    private final EmailService emailService;
    private final OcurrenciaBibliotecaRepository ocurrenciaRepo;

    public BibliotecaReminderScheduler(DetalleBibliotecaRepository detalleRepo,
                                       EmailService emailService,
                                       OcurrenciaBibliotecaRepository ocurrenciaRepo) {
        this.detalleRepo = detalleRepo;
        this.emailService = emailService;
        this.ocurrenciaRepo = ocurrenciaRepo;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void revisarPrestamos() {
        List<DetalleBiblioteca> prestamos = detalleRepo.findByIdEstado(4L);
        LocalDateTime now = LocalDateTime.now();
        for (DetalleBiblioteca d : prestamos) {
            if (d.getFechaFin() == null) continue;
            LocalTime hf = d.getHoraFin() != null ? LocalTime.parse(d.getHoraFin()) : LocalTime.MIDNIGHT;
            LocalDateTime fechaFin = LocalDateTime.of(d.getFechaFin(), hf);
            long horas = ChronoUnit.HOURS.between(now, fechaFin);
            if (horas == 24) {
                emailService.sendMaterialReturnReminder(d, 24, ChronoUnit.HOURS);
            } else if (horas == 0) {
                emailService.sendMaterialReturnReminder(d, 0, ChronoUnit.HOURS);
            } else if (horas < 0) {
                if (!ocurrenciaRepo.existsByDetalleBiblioteca(d)) {
                    emailService.sendMaterialOverdue(d);
                    OcurrenciaBiblioteca oc = new OcurrenciaBiblioteca();
                    oc.setDetalleBiblioteca(d);
                    oc.setCodigoUsuario(d.getCodigoUsuario());
                    oc.setCodigoLocalizacion(d.getBiblioteca().getCodigoLocalizacion());
                    oc.setDescripcion("Retraso en devolución del material bibliográfico.");
                    oc.setFechaOcurrencia(now);
                    oc.setFechaCreacion(now);
                    ocurrenciaRepo.save(oc);
                }
            }
        }
    }
}