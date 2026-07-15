import { z } from 'zod';

export const paymentFormSchema = z.object({
  dni: z.string().regex(/^\d{8}$/, 'DNI debe tener 8 dígitos'),
  name: z.string().min(1, 'Nombre requerido'),
  driverObservation: z.string(),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
