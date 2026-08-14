import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import type { AddressItem, Customer } from '@/types';

export const LIMA_DISTRICTS = [
  'San Isidro',
  'Lima (Cercado)',
  'Miraflores',
  'Santiago de Surco',
  'San Borja',
  'La Molina',
  'Lince',
  'Jesús María',
  'Pueblo Libre',
  'Magdalena del Mar',
  'San Miguel',
  'Barranco',
  'Ate',
  'Chorrillos',
  'Comas',
  'Los Olivos',
];

interface CustomerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave: (updatedData: Partial<Customer> & { id: string }) => void;
}

export default function CustomerRegistrationModal({
  isOpen,
  onClose,
  customer,
  onSave,
}: CustomerRegistrationModalProps) {
  if (!isOpen) return null;

  const [phone, setPhone] = useState(customer?.phone || '');
  const [refCode, setRefCode] = useState(customer?.refCode || '');
  const [firstName, setFirstName] = useState(customer?.firstName || '');
  const [paterno, setPaterno] = useState(customer?.lastName?.split(' ')[0] || '');
  const [materno, setMaterno] = useState(
    customer?.lastName?.split(' ').slice(1).join(' ') || '',
  );
  const [dni, setDni] = useState(customer?.dni || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [number, setNumber] = useState(customer?.number || '');
  const [district, setDistrict] = useState(customer?.district || 'San Isidro');
  const [department, setDepartment] = useState(customer?.department || '');
  const [reference, setReference] = useState(customer?.reference || '');

  // Map state
  const [mapSearch, setMapSearch] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [lat] = useState(-12.0464);
  const [lng] = useState(-77.0428);

  // Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addresses] = useState<AddressItem[]>(
    customer?.addresses || [
      {
        id: 'addr-1',
        address: customer?.address || 'Avenida Javier Prado Oeste',
        number: customer?.number || '1650',
        district: customer?.district || 'San Isidro',
        department: customer?.department || 'Block C',
        reference: customer?.reference || 'CRC AV LAS FLORES',
      },
      {
        id: 'addr-2',
        address: 'Av. Conquistadores',
        number: '820',
        district: 'San Isidro',
        department: 'Dpto 301',
        reference: 'Cerca a la Huaca Pucllana',
      },
    ],
  );

  const [errors, setErrors] = useState<{ department?: string; firstName?: string }>({});

  useEffect(() => {
    if (customer) {
      setPhone(customer.phone);
      setRefCode(customer.refCode || '');
      setFirstName(customer.firstName);
      setPaterno(customer.lastName.split(' ')[0] || '');
      setMaterno(customer.lastName.split(' ').slice(1).join(' '));
      setDni(customer.dni);
      setAddress(customer.address);
      setNumber(customer.number || '');
      setDistrict(customer.district.replace(' - Lima', ''));
      setDepartment(customer.department);
      setReference(customer.reference);
      setMapSearch(`${customer.address} ${customer.number || ''}`.trim());
    }
  }, [customer]);

  // Sync address + number into map search
  const handleAddressChange = (val: string) => {
    setAddress(val);
    setMapSearch(`${val} ${number}`.trim());
  };

  const handleNumberChange = (val: string) => {
    setNumber(val);
    setMapSearch(`${address} ${val}`.trim());
  };

  const handleSelectSavedAddress = (item: AddressItem) => {
    setSelectedAddressId(item.id);
    setAddress(item.address);
    setNumber(item.number);
    setDistrict(item.district);
    setDepartment(item.department);
    setReference(item.reference);
    setMapSearch(`${item.address} ${item.number}`.trim());
  };

  const handleSaveCustomer = () => {
    const newErrors: { department?: string; firstName?: string } = {};
    if (!department.trim()) {
      newErrors.department = 'El campo Dpto/Interior es obligatorio';
    }
    if (!firstName.trim()) {
      newErrors.firstName = 'Nombres es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (customer) {
      const updatedAddress = address;
      const updatedNumber = number;
      const combinedLastName = `${paterno} ${materno}`.trim();

      // Update addresses list if needed
      const updatedAddresses = addresses.map((addr) =>
        addr.id === selectedAddressId
          ? {
              ...addr,
              address: updatedAddress,
              number: updatedNumber,
              district,
              department,
              reference,
            }
          : addr,
      );

      onSave({
        id: customer.id,
        phone,
        refCode,
        firstName,
        lastName: combinedLastName,
        dni,
        address: updatedAddress,
        number: updatedNumber,
        district,
        department,
        reference,
        addresses: updatedAddresses,
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      // Clicking overlay intentionally does NOT close the modal per requirement:
      // "Al dar click fuera de la ventana no debe salirse de la Ventana, debe mantenerse. Para salir se debe dar click en la 'X'."
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative flex w-full flex-col rounded-2xl bg-white shadow-2xl transition-all max-h-[90vh] ${
          isMapExpanded ? 'max-w-[600px]' : 'max-w-[520px]'
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto px-3.5 py-3 scrollbar-thin">
          {/* Title */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex flex-col">
              <h2 className="text-[15px] font-bold text-[#1a1f5e]">Registro de Cliente</h2>
              <span className="text-[10px] font-bold uppercase text-slate-400">SISTEMA DE REGISTRO</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[#1a1f5e]">
                <span className="text-sm">📞</span>
                <span className="text-sm font-bold text-[#333333] text-[12px]">970220065</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Cerrar ventana"
              >
                <FiX size={24} />
              </button>
            </div>
          </div>

          {/* Banner */}
          <div
            className="mb-3 rounded-lg bg-[#EEF2FF] px-3 py-2"
            style={{ border: '1.5px solid rgb(200, 212, 240)' }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-[#1A1F5E]">👤 Editando cliente existente. Al guardar se actualizarán sus datos.</span>
            </div>
          </div>

          {/* DATOS DEL CLIENTE */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-500">
              <h3 className="text-[10px] font-bold uppercase tracking-wide">👤 DATOS DEL CLIENTE</h3>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#666666] mb-1">DNI <span className="font-normal">(Opcional)</span></label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  maxLength={8}
                  className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#666666] mb-1">Clase</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-100"
                    value="Gold"
                    disabled
                  >
                    <option value="Gold">Gold</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#666666] mb-1">Nombres <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full rounded-lg border px-2.5 py-1.5 text-[11px] font-medium focus:outline-none transition-colors ${
                  errors.firstName ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-[#FAFBFF] focus:border-[#1a1f5e]'
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-[9px] font-medium text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-[#666666] mb-1">Apellido Paterno <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={paterno}
                  onChange={(e) => setPaterno(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#666666] mb-1">Apellido Materno <span className="font-normal">(Opcional)</span></label>
                <input
                  type="text"
                  value={materno}
                  onChange={(e) => setMaterno(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* DIRECCIONES */}
          <div className="mt-5 flex flex-col gap-2.5">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-xs">📍</span>
              <h3 className="text-[10px] font-bold uppercase tracking-wide">DIRECCIONES</h3>
            </div>

            <div className={`grid grid-cols-1 gap-4 ${isMapExpanded ? 'lg:grid-cols-[1fr_auto]' : 'lg:grid-cols-2'}`}>
              {/* Left side: Address form fields */}
              <div className="flex flex-col gap-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Provincia <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select defaultValue="Lima" className="w-full appearance-none rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors">
                        <option value="">Seleccione provincia</option>
                        <option value="Lima">Lima</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Distrito <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                      >
                        <option value="">Seleccione distrito</option>
                        {LIMA_DISTRICTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Dirección (Calle / Av.) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      placeholder="Dirección principal"
                      className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Nro/Mz</label>
                    <input
                      type="text"
                      value={number}
                      onChange={(e) => handleNumberChange(e.target.value)}
                      placeholder="Nro/Mz"
                      className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] mb-1">Dpto / Interior <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => {
                      setDepartment(e.target.value);
                      if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
                    }}
                    placeholder="Dpto, piso, interior..."
                    className={`w-full rounded-lg border px-2.5 py-1.5 text-[11px] font-medium focus:outline-none transition-colors ${
                      errors.department ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-[#FAFBFF] focus:border-[#1a1f5e]'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] mb-1">Referencia</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="Cerca de..."
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Right side: Map */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#666666]">Buscar en el mapa</span>
                  <button
                    type="button"
                    onClick={() => setIsMapExpanded((v) => !v)}
                    className="flex items-center gap-1 text-[9px] font-bold text-[#1a1f5e] hover:underline"
                  >
                    <span>↗</span>
                    Expandir
                  </button>
                </div>

                {/* Map search box */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    placeholder="Buscar en el mapa..."
                    className="h-7 flex-1 rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 text-[9px] text-[#1a1f5e] focus:outline-none"
                  />
                  <button
                    type="button"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1a1f5e] text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                      <circle cx="12" cy="12" r="4" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Map */}
                <div
                  className={`relative shrink-0 overflow-hidden rounded-lg transition-all ${
                    isMapExpanded ? 'h-[240px] w-[280px]' : 'h-[148px] w-full'
                  }`}
                  style={{ border: '1.5px solid rgb(208, 216, 240)' }}
                >
                  <iframe
                    title="Mapa de ubicación"
                    className="h-full w-full border-0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.006}%2C${lat - 0.004}%2C${lng + 0.006}%2C${lat + 0.004}&layer=mapnik&marker=${lat}%2C${lng}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">LAT</label>
                    <input type="text" value={lat} readOnly className="h-7 w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-3 text-[9px] font-medium text-[#1a1f5e] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">LONG</label>
                    <input type="text" value={lng} readOnly className="h-7 w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-3 text-[9px] font-medium text-[#1a1f5e] focus:outline-none" />
                  </div>
                </div>

                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#c7d1e0] py-2 text-[10px] font-bold text-white transition-colors hover:bg-[#b1bdcf]"
                >
                  💾 Guardar Dirección
                </button>
              </div>
            </div>
          </div>

          {/* Registered Addresses Table */}
          <div className="mt-6">
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 flex items-center justify-between px-4 py-2.5">
                <h3 className="text-[10px] font-bold uppercase tracking-wide text-[#888888]">DIRECCIONES REGISTRADAS</h3>
                <span className="text-[9px] font-bold text-[#888888]">{addresses.length} dirección(es)</span>
              </div>
              <table className="w-full text-left text-[11px]">
                <thead className="border-b border-slate-100 text-[#bbbbbb] font-bold ">
                  <tr>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Distrito</th>
                    <th className="px-4 py-2">Provincia</th>
                    <th className="px-4 py-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {addresses.map((item) => (
                    <tr key={item.id} className=" text-[#333333]">
                      <td className="px-4 py-3 font-bold">{item.address} {item.number}</td>
                      <td className="px-4 py-3">{item.district}</td>
                      <td className="px-4 py-3">Lima</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectSavedAddress(item)}
                            className="text-amber-500 hover:text-amber-600"
                          >
                            ✏️
                          </button>
                          <button type="button" className="text-slate-300 hover:text-red-500">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tipo de Registro */}
          <div className="mt-3">
            <h3 className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-3">🏠 TIPO DE REGISTRO</h3>
            <div className="flex gap-3">
              <label className="group flex-1 cursor-pointer">
                <input type="radio" name="regType" className="hidden peer" defaultChecked />
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 p-3 text-[12px] font-bold text-slate-400 transition-all peer-checked:border-[#1a1f5e] peer-checked:text-[#1a1f5e] peer-checked:bg-blue-50/30">
                  <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-current opacity-0 group-has-checked:opacity-100" />
                  </div>
                  👨‍👩‍👧 Familia
                </div>
              </label>
              <label className="group flex-1 cursor-pointer">
                <input type="radio" name="regType" className="hidden peer" />
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 p-3 text-[12px] font-bold text-slate-400 transition-all peer-checked:border-[#1a1f5e] peer-checked:text-[#1a1f5e] peer-checked:bg-blue-50/30">
                  <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-current opacity-0 group-has-checked:opacity-100" />
                  </div>
                  🏢 Empresa
                </div>
              </label>
            </div>
          </div>

          {/* Actualizar Cliente */}
          <button
            type="button"
            onClick={handleSaveCustomer}
            className="mt-3 w-full rounded-xl bg-[#1a1f5e] p-3 text-[13px] font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#252b7a] active:scale-[0.98]"
          >
            💾 Actualizar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}
