package com.miapp.service;

import com.miapp.model.DetallePrestamo;
import com.miapp.model.DetalleBiblioteca;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}") private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private void sendHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Error al enviar correo", e);
        }
    }

    private String buildTemplate(String header, String content) {
        return """
                <html>
                  <body style=\"font-family:Arial,sans-serif;\">
                    <table width=\"600\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse;\">
                      <tr>
                        <td style=\"padding:10px 0;text-align:center;\">
                          <img src=\"https://via.placeholder.com/180x60?text=LOGO\" alt=\"Logo\"/>
                        </td>
                      </tr>
                      <tr>
                        <td style=\"background:#E2001A;color:#fff;padding:10px 20px;text-align:center;font-weight:bold;\">
                          %s
                        </td>
                      </tr>
                      <tr>
                        <td style=\"border:1px solid #E2001A;padding:20px;\">
                          %s
                        </td>
                      </tr>
                      <tr>
                        <td style=\"background:#E2001A;color:#fff;text-align:center;padding:15px;font-weight:bold;\">
                          UNIVERSIDAD PRIVADA SAN JUAN BAUTISTA
                        </td>
                      </tr>
                    </table>
                  </body>
                </html>
                """.formatted(header, content);
    }

    public void sendLoanConfirmation(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject("Confirmación de préstamo de " + dp.getEquipo().getNombreEquipo());
        msg.setText("Tu préstamo ha sido registrado.\n" +
                "Fecha devolución: " + dp.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        mailSender.send(msg);
    }

    public void sendAdminNotification(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("admin@tuorg.com");
        msg.setSubject("Nuevo préstamo registrado");
        msg.setText("Se ha registrado un préstamo de equipo “" +
                dp.getEquipo().getNombreEquipo() + "” por " + dp.getCodigoUsuario() +
                ". Devolución: " + dp.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        mailSender.send(msg);
    }

    public void sendReturnReminder(DetallePrestamo dp, long amount, ChronoUnit unit) {
        String unitName = unit == ChronoUnit.MINUTES ? "minutos" : "horas";

        String formattedFechaFin = dp.getFechaFin()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");  // enviarlo al usuario real
        msg.setSubject("Recordatorio de devolución en " + amount + " " + unitName);
        msg.setText("Hola " + dp.getCodigoUsuario() + ",\n\n"
                + "Tu préstamo de “" + dp.getEquipo().getNombreEquipo() + "” vence el "
                + formattedFechaFin + ".\n\n"
                + "Un saludo,\nTu App de Préstamos");

        mailSender.send(msg);
    }

    public void sendLoanRejection(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");  // o donde quieras enviar
        msg.setSubject("Solicitud de préstamo rechazada");
        msg.setText("Hola " + dp.getCodigoUsuario() + ",\n\n"
                + "Lo sentimos, tu solicitud de préstamo del equipo “"
                + dp.getEquipo().getNombreEquipo()
                + "” ha sido rechazada.\n\n"
                + "Si necesitas más información, contacta con el administrador.\n\n"
                + "Saludos,\n"
                + "Tu App de Préstamos");
        mailSender.send(msg);
    }

    public void sendLoanCancellation(DetallePrestamo dp) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject("Solicitud de préstamo cancelada");
        msg.setText("Hola " + dp.getCodigoUsuario() + ",\n\n" +
                "Has cancelado tu solicitud de préstamo del equipo \"" +
                dp.getEquipo().getNombreEquipo() + "\".\n\n" +
                "Saludos,\nTu App de Préstamos");
        mailSender.send(msg);
    }

    public void sendMaterialConfirmation(DetalleBiblioteca detalle) {
        LocalDateTime fechaDev = null;
        if (detalle.getFechaFin() != null) {
            LocalTime hf = detalle.getHoraFin() != null ? LocalTime.parse(detalle.getHoraFin()) : LocalTime.MIDNIGHT;
            fechaDev = LocalDateTime.of(detalle.getFechaFin(), hf);
        }
        String fecha = fechaDev != null
                ? fechaDev.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "N/A";
        String body = """
                <p>Hola %s,</p>
                <p>Tu préstamo del material <strong>%s</strong> ha sido aprobado.</p>
                <p>Fecha devolución: %s</p>
                """.formatted(detalle.getCodigoUsuario(),
                detalle.getBiblioteca().getTitulo(), fecha);
        String html = buildTemplate("NOTIFICACIÓN BIBLIOTECA", body);
        sendHtml("moranpedro0398@gmail.com",
                "Confirmación de préstamo del material " + detalle.getBiblioteca().getTitulo(),
                html);
    }

    public void sendMaterialRejection(DetalleBiblioteca detalle) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject("Solicitud de préstamo rechazada");
        msg.setText("Hola " + detalle.getCodigoUsuario() + ",\n\n"
                + "Tu solicitud del material “" + detalle.getBiblioteca().getTitulo()
                + "” ha sido rechazada.\n\n"
                + "Si necesitas más información, contacta con el administrador.\n\n"
                + "Saludos,\nTu App de Préstamos");
        mailSender.send(msg);
    }

    public void sendMaterialCancellation(DetalleBiblioteca detalle, String codigoUsuario) {
        String body = """
                <p>Hola %s,</p>
                <p>Has cancelado tu solicitud del material <strong>%s</strong>.</p>
                """.formatted(codigoUsuario, detalle.getBiblioteca().getTitulo());
        String html = buildTemplate("NOTIFICACIÓN BIBLIOTECA", body);
        sendHtml("moranpedro0398@gmail.com", "Solicitud de préstamo cancelada", html);
    }

    public void sendMaterialReturnReminder(DetalleBiblioteca detalle, long amount, ChronoUnit unit) {
        String unitName = unit == ChronoUnit.HOURS ? "horas" : "minutos";
        LocalDateTime fechaDev = null;
        if (detalle.getFechaFin() != null) {
            LocalTime hf = detalle.getHoraFin() != null ? LocalTime.parse(detalle.getHoraFin()) : LocalTime.MIDNIGHT;
            fechaDev = LocalDateTime.of(detalle.getFechaFin(), hf);
        }
        String fecha = fechaDev != null
                ? fechaDev.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "N/A";
        String body = """
                <p>Hola %s,</p>
                <p>Tu préstamo del material <strong>%s</strong> vence el %s.</p>
                """.formatted(detalle.getCodigoUsuario(),
                detalle.getBiblioteca().getTitulo(), fecha);
        String subject = amount > 0
                ? "Recordatorio de devolución en " + amount + " " + unitName
                : "El préstamo vence hoy";
        String html = buildTemplate("NOTIFICACIÓN BIBLIOTECA", body);
        sendHtml("moranpedro0398@gmail.com", subject, html);
    }

    public void sendMaterialOverdue(DetalleBiblioteca detalle) {
        LocalDateTime fechaDev2 = null;
        if (detalle.getFechaFin() != null) {
            LocalTime hf = detalle.getHoraFin() != null ? LocalTime.parse(detalle.getHoraFin()) : LocalTime.MIDNIGHT;
            fechaDev2 = LocalDateTime.of(detalle.getFechaFin(), hf);
        }
        String fecha = fechaDev2 != null
                ? fechaDev2.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "N/A";
        String body = """
                <p>Hola %s,</p>
                <p>El préstamo del material <strong>%s</strong> venció el %s. Se aplicarán las sanciones correspondientes.</p>
                """.formatted(detalle.getCodigoUsuario(),
                detalle.getBiblioteca().getTitulo(), fecha);
        String html = buildTemplate("NOTIFICACIÓN BIBLIOTECA", body);
        sendHtml("moranpedro0398@gmail.com", "Préstamo vencido", html);
    }
    /**
     * Envía un enlace de restablecimiento de contraseña al correo indicado.
     *
     * @param to   correo del destinatario
     * @param link enlace único para restablecer la contraseña
     */
    public void sendPasswordReset(String to, String link) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Recuperación de contraseña");
        msg.setText("Para restablecer tu contraseña, haz clic en el siguiente enlace:\n" + link);
        mailSender.send(msg);
    }

    public void sendOcurrenciaCosteada(String to, Long idOcurrencia) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject("Ocurrencia " + idOcurrencia + " costeada");
        msg.setText("Se registró el costo de la ocurrencia " + idOcurrencia + ".");
        mailSender.send(msg);
    }
}
