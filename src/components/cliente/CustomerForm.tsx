import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiEdit2, FiPhone, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Input from '@/components/shared/Input';
import Button from '@/components/shared/Button';
import type { Customer } from '@/types';

const customerSchema = z.object({
  phone: z.string().min(6, 'Teléfono inválido').max(15, 'Teléfono inválido'),
  dni: z
    .string()
    .regex(/^\d{8}$/, 'DNI debe tener 8 dígitos')
    .or(z.literal('')),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  address: z.string().min(1, 'Dirección requerida'),
  district: z.string().min(1, 'Distrito requerido'),
  department: z.string().min(1, 'Departamento requerido'),
  reference: z.string(),
});

export type CustomerFormValues = z.infer<typeof customerSchema>;

interface CustomerFormProps {
  customer: Customer | null;
  loading: boolean;
  onSearch: (phone: string) => void;
  onSave: (values: CustomerFormValues) => void;
}

export default function CustomerForm({ customer, loading, onSearch, onSave }: CustomerFormProps) {
  const [editingPhone, setEditingPhone] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [phoneInput, setPhoneInput] = useState(customer?.phone ?? '');
  const [syncedPhone, setSyncedPhone] = useState(customer?.phone);

  if (customer && customer.phone !== syncedPhone) {
    setSyncedPhone(customer.phone);
    setPhoneInput(customer.phone);
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      phone: customer?.phone ?? '',
      dni: customer?.dni ?? '',
      firstName: customer?.firstName ?? '',
      lastName: customer?.lastName ?? '',
      address: customer?.address ?? '',
      district: customer?.district ?? '',
      department: customer?.department ?? '',
      reference: customer?.reference ?? '',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        phone: customer.phone,
        dni: customer.dni,
        firstName: customer.firstName,
        lastName: customer.lastName,
        address: customer.address,
        district: customer.district,
        department: customer.department,
        reference: customer.reference,
      });
    }
  }, [customer, reset]);

  const submit = handleSubmit((values) => {
    onSave(values);
    setEditingPhone(false);
    setEditingAddress(false);
    toast.success('Datos del cliente guardados');
  });

  return (
    <form className="flex flex-col gap-3" onSubmit={submit} aria-label="Formulario de cliente">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <FiPhone
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="tel"
            aria-label="Número de teléfono"
            value={phoneInput}
            disabled={!editingPhone}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="w-full rounded-md border border-slate-300 py-2 pl-8 pr-2 text-sm font-semibold text-slate-800 disabled:bg-slate-50"
          />
        </div>
        <button
          type="button"
          aria-label="Editar teléfono"
          onClick={() => setEditingPhone((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-100"
        >
          <FiEdit2 aria-hidden="true" />
        </button>
        <Button
          type="button"
          size="sm"
          onClick={() => onSearch(phoneInput)}
          isLoading={loading}
          aria-label="Buscar cliente"
        >
          <FiSearch aria-hidden="true" />
          Buscar
        </Button>
      </div>

      {customer?.refCode && <p className="text-[11px] text-slate-400">REF: {customer.refCode}</p>}

      <div className="grid grid-cols-2 gap-3">
        <Input label="Nombres" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Apellidos" error={errors.lastName?.message} {...register('lastName')} />
      </div>
      <Input label="DNI" inputMode="numeric" error={errors.dni?.message} {...register('dni')} />

      <fieldset className="rounded-md border border-slate-200 p-3">
        <legend className="px-1 text-xs font-semibold text-slate-500">Dirección de entrega</legend>
        <div className="flex items-center gap-2">
          <input
            aria-label="Dirección"
            disabled={!editingAddress}
            className="w-full rounded-md border border-slate-300 py-2 px-3 text-sm disabled:bg-slate-50"
            {...register('address')}
          />
          <button
            type="button"
            aria-label="Editar dirección"
            onClick={() => setEditingAddress((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-500 hover:bg-slate-100"
          >
            <FiEdit2 aria-hidden="true" />
          </button>
        </div>
        {errors.address && (
          <p role="alert" className="mt-1 text-xs text-red-600">
            {errors.address.message}
          </p>
        )}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Input label="Distrito" error={errors.district?.message} {...register('district')} />
          <Input
            label="Departamento"
            error={errors.department?.message}
            {...register('department')}
          />
        </div>
        <div className="mt-3">
          <Input label="Referencia" {...register('reference')} />
        </div>
      </fieldset>

      <Button type="submit" variant="secondary" disabled={!isDirty} className="self-end">
        Guardar cambios
      </Button>
    </form>
  );
}
