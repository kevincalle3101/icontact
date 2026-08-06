import { useState, useEffect } from 'react';
import { FiX, FiMapPin, FiMaximize2, FiMinimize2, FiSearch, FiCheck } from 'react-icons/fi';
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

const PREDICTIVE_ADDRESS_SUGGESTIONS = [
  'Avenida Javier Prado Oeste',
  'Avenida Javier Prado Este',
  'Avenida Arequipa',
  'Avenida Paseo de la República',
  'Avenida Conquistadores',
  'Avenida Camino Real',
  'Avenida Larco',
  'Avenida José Pardo',
  'Avenida Benavides',
  'Avenida Brasil',
  'Avenida Primavera',
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

  // Predictive search state
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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
    if (val.trim().length > 2) {
      const filtered = PREDICTIVE_ADDRESS_SUGGESTIONS.filter((item) =>
        item.toLowerCase().includes(val.toLowerCase()),
      );
      setAddressSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleNumberChange = (val: string) => {
    setNumber(val);
    setMapSearch(`${address} ${val}`.trim());
  };

  const selectSuggestion = (sug: string) => {
    setAddress(sug);
    setMapSearch(`${sug} ${number}`.trim());
    setShowSuggestions(false);
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
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#0f172a] px-5 py-3.5 text-white">
          <div className="flex items-center gap-2">
            <FiMapPin className="text-red-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider">
              Registro / Actualización de Cliente
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar ventana"
          >
            <FiX size={18} />
          </button>
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
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase text-slate-700">Datos Personales</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Teléfono</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">TLF REF</label>
                  <input
                    type="text"
                    value={refCode}
                    onChange={(e) => setRefCode(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                    placeholder="Ref. Teléfono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Nombres</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full rounded-lg border px-3 py-1.5 text-xs font-medium focus:outline-none ${
                      errors.firstName ? 'border-red-500' : 'border-slate-300 focus:border-blue-600'
                    }`}
                  />
                  {errors.firstName && (
                    <p className="mt-0.5 text-[10px] text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Apellidos</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600">DNI</label>
                <input
                  type="text"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  maxLength={8}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                />
              </div>

              <h3 className="mt-2 text-xs font-bold uppercase text-slate-700">
                Dirección de Entrega
              </h3>

              {/* Predictive Address Search Field */}
              <div className="relative">
                <label className="block text-[11px] font-semibold text-slate-600">
                  Dirección (Sugerencias predictivas)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() => address.length > 2 && setShowSuggestions(true)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                  placeholder="Ej: Av. Javier Prado..."
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg text-xs">
                    {addressSuggestions.map((sug, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          onClick={() => selectSuggestion(sug)}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-100 font-medium text-slate-700"
                        >
                          📍 {sug}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Renamed Nro to Nro/Mz */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Nro/Mz</label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => handleNumberChange(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                    placeholder="1650 / Mz A"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600">Distrito</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none bg-white"
                  >
                    {LIMA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dpto/Interior as Mandatory */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-600">
                  Dpto/Interior <span className="text-red-500">* (Obligatorio)</span>
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value);
                    if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
                  }}
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs font-medium focus:outline-none ${
                    errors.department ? 'border-red-500' : 'border-slate-300 focus:border-blue-600'
                  }`}
                  placeholder="Block C / Dpto 201"
                />
                {errors.department && (
                  <p className="mt-0.5 text-[10px] text-red-500">{errors.department}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600">Referencia</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium focus:border-blue-600 focus:outline-none"
                  placeholder="CRC AV LAS FLORES"
                />
              </div>
            </div>

            {/* Right side: Interactive Map with Draggable Pin */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700">
                  Ubicación en Mapa
                </label>
                <button
                  type="button"
                  onClick={() => setIsMapExpanded((v) => !v)}
                  className="flex items-center gap-1 rounded-md border border-slate-300 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                >
                  {isMapExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
                  {isMapExpanded ? 'Reducir Mapa' : 'Ampliar Mapa'}
                </button>
              </div>

              {/* Map search display */}
              <div className="flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs">
                <FiSearch className="text-slate-400" />
                <span className="font-medium text-slate-600 truncate">
                  Buscar en el mapa: {mapSearch || 'Ingrese dirección y número'}
                </span>
              </div>

              {/* Map container with draggable pin */}
              <div
                className={`relative w-full rounded-xl border border-slate-300 bg-[#e5e9f0] overflow-hidden cursor-crosshair transition-all ${
                  isMapExpanded ? 'h-96' : 'h-64'
                }`}
                onClick={handleMapClick}
                title="Haga clic o arrastre el pin para cambiar la ubicación"
              >
                {/* Mock OpenStreetMap background tiles / grid */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{
                    backgroundImage:
                      'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #e2e8f0 1px)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                  }}
                />
                {/* Simulated streets */}
                <div className="absolute top-1/2 left-0 right-0 h-4 bg-white/80 border-y border-slate-300 -translate-y-1/2" />
                <div className="absolute left-1/3 top-0 bottom-0 w-4 bg-white/80 border-x border-slate-300" />
                <div className="absolute left-2/3 top-0 bottom-0 w-3 bg-white/80 border-x border-slate-300" />

                {/* Map labels */}
                <div className="absolute top-3 left-3 rounded bg-white/90 px-2 py-1 text-[10px] font-bold text-slate-700 shadow-xs">
                  {district}
                </div>
                <div className="absolute bottom-2 right-2 text-[9px] text-slate-500 bg-white/80 px-1 rounded">
                  OpenStreetMap contributors
                </div>

                {/* Draggable Pin Marker */}
                <div
                  className="absolute -translate-x-1/2 -translate-y-full transition-transform cursor-grab active:cursor-grabbing hover:scale-110"
                  style={{ left: `${pinPos.x}%`, top: `${pinPos.y}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div className="rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
                      📍 {address || 'Cliente'} {number}
                    </div>
                    <div className="h-2 w-2 rotate-45 bg-red-600 -mt-1" />
                    <div className="h-2 w-2 rounded-full bg-red-800/40 blur-xs" />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 text-center">
                * Haga clic en el mapa para ubicar el Pin exacto en la dirección del cliente.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSaveCustomer}
            className="rounded-lg bg-[#0f172a] px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 shadow-sm"
          >
            Actualizar cliente
          </button>
        </div>
      </div>
    </div>
  );
}
