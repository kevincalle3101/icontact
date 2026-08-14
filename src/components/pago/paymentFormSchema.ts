import { z } from 'zod';

export const paymentFormSchema = z.object({
  invoiceType: z.enum(['boleta', 'factura']),
  dni: z.string().min(1, 'DNI/CE/RUC es requerido'),
  name: z
    .string()
    .min(1, 'Nombre / Razón Social es requerido')
    .max(100, 'Máximo 100 caracteres para Nombre / Razón Social'),
  bonusDni: z.string().optional(),
  driverObservation: z
    .string()
    .max(80, 'Máximo 80 caracteres para Observación Driver')
    .optional(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
