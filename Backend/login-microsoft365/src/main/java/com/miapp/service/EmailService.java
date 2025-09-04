package com.miapp.service;

import com.miapp.model.DetallePrestamo;
import com.miapp.model.DetalleBiblioteca;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
public class EmailService {

    private final JavaMailSender mailSender;
    @Value("${spring.mail.username}") private String from;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
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

    public void sendMaterialConfirmation(DetalleBiblioteca detalle) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject("Confirmación de préstamo del material "
                + detalle.getBiblioteca().getTitulo());
        msg.setText("Tu préstamo ha sido registrado.\n" +
                "Fecha devolución: " +
                (detalle.getFechaFin() != null
                        ? detalle.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                        : "N/A"));
        mailSender.send(msg);
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

    public void sendMaterialReturnReminder(DetalleBiblioteca detalle, long amount, ChronoUnit unit) {
        String unitName = unit == ChronoUnit.HOURS ? "horas" : "minutos";
        String fecha = detalle.getFechaFin() != null
                ? detalle.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "N/A";

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject(amount > 0
                ? "Recordatorio de devolución en " + amount + " " + unitName
                : "El préstamo vence hoy");
        msg.setText("Hola " + detalle.getCodigoUsuario() + ",\n\n" +
                "Tu préstamo del material \"" + detalle.getBiblioteca().getTitulo() +
                "\" vence el " + fecha + ".\n\nSaludos,\nTu App de Préstamos");
        mailSender.send(msg);
    }

    public void sendMaterialOverdue(DetalleBiblioteca detalle) {
        String fecha = detalle.getFechaFin() != null
                ? detalle.getFechaFin().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))
                : "N/A";
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo("moranpedro0398@gmail.com");
        msg.setSubject("Préstamo vencido");
        msg.setText("Hola " + detalle.getCodigoUsuario() + ",\n\n" +
                "El préstamo del material \"" + detalle.getBiblioteca().getTitulo() +
                "\" venció el " + fecha + ". Se aplicarán las sanciones correspondientes." +
                "\n\nSaludos,\nTu App de Préstamos");
        mailSender.send(msg);
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
