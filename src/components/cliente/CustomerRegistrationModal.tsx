import { useState, useEffect } from 'react';
import { FiX, FiMaximize2, FiSearch, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
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
  const [lastName, setLastName] = useState(customer?.lastName || '');
  const [dni, setDni] = useState(customer?.dni || '');
  const [address, setAddress] = useState(customer?.address || '');
  const [number, setNumber] = useState(customer?.number || '');
  const [district, setDistrict] = useState(customer?.district || 'San Isidro');
  const [department, setDepartment] = useState(customer?.department || '');
  const [reference, setReference] = useState(customer?.reference || '');

  // Map state
  const [mapSearch, setMapSearch] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [pinPos, setPinPos] = useState({ x: 50, y: 50 }); // % coordinates on mock map

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
      setLastName(customer.lastName);
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
        lastName,
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

  // Map drag pin handler
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPinPos({ x: Math.max(10, Math.min(90, x)), y: Math.max(10, Math.min(90, y)) });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs"
      // Clicking overlay intentionally does NOT close the modal per requirement:
      // "Al dar click fuera de la ventana no debe salirse de la Ventana, debe mantenerse. Para salir se debe dar click en la 'X'."
      aria-modal="true"
      role="dialog"
    >
      <div
        className={`relative flex w-full flex-col rounded-2xl bg-white shadow-2xl transition-all ${
          isMapExpanded ? 'max-w-5xl h-[90vh]' : 'max-w-3xl max-h-[92vh]'
        } overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5">
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#1a1f5e]">Registro de Cliente</h2>
            <span className="text-[10px] font-bold uppercase text-slate-400">SISTEMA DE REGISTRO</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[#1a1f5e]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
              <span className="text-sm font-bold">970220065</span>
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
        <div className="mx-5 mt-4 rounded-lg border border-blue-100 bg-blue-50/50 px-4 py-2.5">
          <div className="flex items-center gap-2.5 text-[11px] text-blue-800">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.99c.029.028.06.053.091.077a6.991 6.991 0 009.404 0 1.206 1.206 0 00.091-.077A5.99 5.99 0 0010 12z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="font-medium">Editando cliente existente. Al guardar se actualizarán sus datos.</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          {/* Saved addresses selector if multiple */}
          {addresses.length > 0 && (
            <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-xs font-bold uppercase text-slate-600">
                Direcciones Registradas:
              </span>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {addresses.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSavedAddress(item)}
                    className={`flex items-start justify-between rounded-lg border p-2.5 text-left text-xs transition-colors ${
                      selectedAddressId === item.id ||
                      (address === item.address && number === item.number)
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div>
                      <p className="font-bold">
                        {item.address} {item.number}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {item.district} - {item.department} ({item.reference})
                      </p>
                    </div>
                    {(selectedAddressId === item.id ||
                      (address === item.address && number === item.number)) && (
                      <FiCheck className="shrink-0 text-blue-600 mt-0.5" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Left side: Form fields */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-[#1a1f5e]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <h3 className="text-[11px] font-bold uppercase tracking-wide">DATOS DEL CLIENTE</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">DNI <span className="font-normal">(Opcional)</span></label>
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    maxLength={8}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Clase</label>
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-100"
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
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Nombres <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={`w-full rounded-lg border px-3 py-2 text-[11px] font-medium focus:outline-none transition-colors ${
                    errors.firstName ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-[#1a1f5e]'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-[9px] font-medium text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Apellido Paterno <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Apellido Materno <span className="font-normal">(Opcional)</span></label>
                  <input
                    type="text"
                    value={lastName} // Using lastName as mock for materno
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-red-500 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h3 className="text-[11px] font-bold uppercase tracking-wide">DIRECCIONES</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Provincia <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors">
                      <option>Seleccione provincia</option>
                      <option selected>Lima</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Distrito <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                    >
                      <option>Seleccione distrito</option>
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

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Dirección (Calle / Av.) <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                    placeholder="Dirección principal"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Nro/Mz</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    placeholder="Nro/Mz"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Dpto / Interior <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
                  }}
                  placeholder="Dpto, piso, interior..."
                  className={`w-full rounded-lg border px-3 py-2 text-[11px] font-medium focus:outline-none transition-colors ${
                    errors.department ? 'border-red-500 bg-red-50/30' : 'border-slate-200 bg-slate-50/50 focus:border-[#1a1f5e]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-1">Referencia</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="Cerca de..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Right side: Interactive Map with Draggable Pin */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-700">UBICACIÓN EN MAPA</h3>
                <button
                  type="button"
                  onClick={() => setIsMapExpanded((v) => !v)}
                  className="flex items-center gap-1 text-[10px] font-bold text-[#1a1f5e] hover:underline"
                >
                  <FiMaximize2 size={12} />
                  Expandir
                </button>
              </div>

              {/* Map search display */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px]">
                <FiSearch className="text-slate-400" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Buscar en el mapa..."
                  className="flex-1 bg-transparent focus:outline-none"
                />
                <button type="button" className="flex h-6 w-6 items-center justify-center rounded-md bg-[#1a1f5e] text-white">
                  <FiSearch size={12} />
                </button>
              </div>

              {/* Map container with draggable pin */}
              <div
                className={`relative w-full rounded-xl border border-slate-200 bg-[#e5e9f0] overflow-hidden cursor-crosshair transition-all ${
                  isMapExpanded ? 'h-96' : 'h-48'
                }`}
                onClick={handleMapClick}
              >
                {/* Mock Map Background */}
                <div className="absolute inset-0 bg-[#f8fafc]" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                
                {/* Draggable Pin Marker */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-full transition-transform"
                  style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="rounded-md bg-red-600 px-2 py-1 text-[9px] font-bold text-white shadow-lg whitespace-nowrap">
                      {address || 'Dirección seleccionada'} {number}
                    </div>
                    <div className="h-2 w-2 rotate-45 bg-red-600 -mt-1" />
                  </div>
                </div>

                {/* Map Controls */}
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  <button type="button" className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm text-slate-600 font-bold">+</button>
                  <button type="button" className="flex h-6 w-6 items-center justify-center rounded bg-white shadow-sm text-slate-600 font-bold">-</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">LAT</label>
                  <input type="text" value="-12.0464" readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">LONG</label>
                  <input type="text" value="-77.0428" readOnly className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 focus:outline-none" />
                </div>
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#c7d1e0] py-2 text-[11px] font-bold text-white transition-colors hover:bg-[#b1bdcf]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Guardar Dirección
              </button>
            </div>
          </div>

          {/* Registered Addresses Table */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-400">DIRECCIONES REGISTRADAS</h3>
              <span className="text-[10px] font-bold text-slate-400">{addresses.length} dirección(es)</span>
            </div>
            <div className="rounded-xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase">
                  <tr>
                    <th className="px-4 py-2">Dirección</th>
                    <th className="px-4 py-2">Distrito</th>
                    <th className="px-4 py-2">Provincia</th>
                    <th className="px-4 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {addresses.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-700">{item.address} {item.number}</td>
                      <td className="px-4 py-3 text-slate-500">{item.district}</td>
                      <td className="px-4 py-3 text-slate-500">Lima</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" className="text-amber-500 hover:text-amber-600"><FiEdit2 size={14} /></button>
                          <button type="button" className="text-slate-300 hover:text-red-500"><FiTrash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tipo de Registro */}
          <div className="mt-6">
            <h3 className="text-[11px] font-bold uppercase tracking-wide text-slate-400 mb-3">🏠 TIPO DE REGISTRO</h3>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="regType" className="hidden peer" defaultChecked />
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 p-3 text-[11px] font-bold text-slate-400 transition-all peer-checked:border-[#1a1f5e] peer-checked:text-[#1a1f5e] peer-checked:bg-blue-50/30">
                  <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-current opacity-0 peer-checked:opacity-100" />
                  </div>
                  👨‍👩‍👧 Familia
                </div>
              </label>
              <label className="flex-1 cursor-pointer">
                <input type="radio" name="regType" className="hidden peer" />
                <div className="flex items-center justify-center gap-2 rounded-xl border-2 border-slate-100 p-3 text-[11px] font-bold text-slate-400 transition-all peer-checked:border-[#1a1f5e] peer-checked:text-[#1a1f5e] peer-checked:bg-blue-50/30">
                  <div className="h-4 w-4 rounded-full border-2 border-current flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-current opacity-0 peer-checked:opacity-100" />
                  </div>
                  🏢 Empresa
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-4">
          <button
            type="button"
            onClick={handleSaveCustomer}
            className="w-full rounded-xl bg-[#1a1f5e] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-blue-900/20 transition-all hover:bg-[#252b7a] active:scale-[0.98]"
          >
            💾 Actualizar cliente
          </button>
        </div>
      </div>
    </div>
  );
}
