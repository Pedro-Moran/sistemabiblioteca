import { jsPDF } from 'jspdf';

export interface ConstanciaPayload {
  codigo: string;
  estudiante: string;
  tipoConstancia: number;
  sede?: string;
  correlativo?: string;
  descripcion: string;
}

export interface DetalleLaboratorio {
  ocurrencia: string;
  fecha: string;
  sede: string;
  ambiente: string;
  material: string;
}

export interface DetalleBiblioteca {
  prestamo: string;
  fecha: string;
  sede: string;
  codigoEjemplar: string;
  ejemplar: string;
}

export interface PendientePayload {
  codigo: string;
  estudiante: string;
  especialidad: string;
  detallesLaboratorio?: DetalleLaboratorio[];
  detallesBiblioteca?: DetalleBiblioteca[];
}

export function generarConstanciaNoAdeudo(data: ConstanciaPayload): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fecha = new Date();

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('UNIVERSIDAD PRIVADA SAN JUAN BAUTISTA', 105, 20, {
    align: 'center',
  });

  doc.setFontSize(14);
  doc.text('CONSTANCIA DE NO ADEUDO', 105, 50, { align: 'center' });
  doc.text('DE MATERIALES DE LABORATORIO Y BIBLIOTECA', 105, 58, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('Helvetica', 'normal');
  doc.text(`N° ${data.codigo}`, 20, 70);
  doc.text('Por la presente se deja constancia que:', 20, 80);

  doc.setFont('Helvetica', 'bold');
  doc.text(data.estudiante.toUpperCase(), 105, 90, { align: 'center' });
  doc.setFont('Helvetica', 'normal');

  const texto1 = `Estudiante de la ${data.descripcion}, con código o matrícula N° ${data.codigo}, no adeuda material alguno a esta casa superior de estudios.`;
  doc.text(texto1, 20, 100, { maxWidth: 170, align: 'justify' });

  const texto2 = 'Se expide la presente constancia, a solicitud de la parte interesada para los fines que estime conveniente.';
  doc.text(texto2, 20, 120, { maxWidth: 170, align: 'justify' });

  doc.text('Atentamente,', 105, 145, { align: 'center' });

  doc.line(60, 165, 150, 165);
  doc.text('María Zapata Colán', 105, 170, { align: 'center' });
  doc.text(
    'Coordinadora General Académica - Administrativa',
    105,
    176,
    { align: 'center' }
  );
  doc.text('Sede Central', 105, 182, { align: 'center' });

  const fechaTexto = fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`CHORRILLOS, ${fechaTexto}`, 20, 220);

  doc.save('constancia_no_adeudo.pdf');
}

export function generarConstanciaPendientes(data: PendientePayload): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const fecha = new Date();

  doc.setFont('Helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('UNIVERSIDAD PRIVADA SAN JUAN BAUTISTA', 105, 20, { align: 'center' });

  doc.setFontSize(14);
  doc.text('RELACION DE MATERIALES', 105, 40, { align: 'center' });
  doc.text('PENDIENTES POR REGULARIZAR', 105, 48, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('Helvetica', 'normal');
  doc.text(`N° ${data.codigo}`, 20, 60);
  doc.text('Se presenta la relación de materiales pendientes por regularizar a favor del Sr.:', 20, 70, { maxWidth: 170, align: 'justify' });

  doc.setFont('Helvetica', 'bold');
  doc.text(data.estudiante.toUpperCase(), 105, 80, { align: 'center' });
  doc.setFont('Helvetica', 'normal');
  const texto = `Estudiante de la Escuela Profesional de ${data.especialidad}, con código de matrícula N° ${data.codigo}, está adeudando los materiales que a continuación se detallan:`;
  doc.text(texto, 20, 90, { maxWidth: 170, align: 'justify' });

  let y = 110;
  doc.setFont('Helvetica', 'bold');
  doc.text('DETALLE DE OCURRENCIAS', 20, y);
  y += 10;

  doc.text('A) LABORATORIOS', 20, y);
  y += 6;
  doc.setFontSize(10);
  const cabLab = ['OCURRENCIA', 'FECHA', 'SEDE', 'AMBIENTE', 'MATERIAL'];
  let x = 20;
  const anchLab = [30, 30, 30, 30, 60];
  cabLab.forEach((h, i) => {
    doc.text(h, x, y);
    x += anchLab[i];
  });
  y += 6;
  doc.setFont('Helvetica', 'normal');
  (data.detallesLaboratorio || []).forEach(det => {
    const vals = [det.ocurrencia, det.fecha, det.sede, det.ambiente, det.material];
    x = 20;
    vals.forEach((v, i) => {
      doc.text(String(v), x, y, { maxWidth: anchLab[i] - 2 });
      x += anchLab[i];
    });
    y += 6;
  });

  y += 8;
  doc.setFont('Helvetica', 'bold');
  doc.text('B) BIBLIOTECA', 20, y);
  y += 6;
  doc.setFontSize(10);
  const cabBib = ['PRESTAMOS', 'FECHA', 'SEDE', 'CODIGO EJEMPLAR', 'EJEMPLAR'];
  x = 20;
  const anchBib = [30, 30, 30, 40, 50];
  cabBib.forEach((h, i) => {
    doc.text(h, x, y);
    x += anchBib[i];
  });
  y += 6;
  doc.setFont('Helvetica', 'normal');
  (data.detallesBiblioteca || []).forEach(det => {
    const vals = [det.prestamo, det.fecha, det.sede, det.codigoEjemplar, det.ejemplar];
    x = 20;
    vals.forEach((v, i) => {
      doc.text(String(v), x, y, { maxWidth: anchBib[i] - 2 });
      x += anchBib[i];
    });
    y += 6;
  });

  y += 20;
  doc.setFont('Helvetica', 'normal');
  doc.text('Atentamente,', 105, y, { align: 'center' });
  y += 20;
  doc.line(60, y, 150, y);
  y += 5;
  doc.text('María Zapata Colán', 105, y, { align: 'center' });
  y += 6;
  doc.text('Coordinadora General Académica - Administrativa', 105, y, { align: 'center' });
  y += 6;
  doc.text('Sede Central', 105, y, { align: 'center' });

  const fechaTexto = fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
  doc.text(`CHORRILLOS, ${fechaTexto}`, 20, 280);

  doc.save('constancia_pendientes.pdf');
}
