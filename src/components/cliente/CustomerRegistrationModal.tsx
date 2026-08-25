import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { searchAddress } from '@/api/geocodeApi';
import CustomSelect from '@/components/shared/CustomSelect';
import type { AddressItem, Customer } from '@/types';

const PROVINCES = [
  'Lima',
  'Callao',
  'Arequipa',
  'Trujillo',
  'Chiclayo',
  'Piura',
  'Ica',
  'Cusco',
  'Lambayeque',
  'Junín',
];

const SELECT_TRIGGER_CLASSNAME =
  'rounded-[7px] border-[1.5px] border-[#e0e4f0] bg-[#fafbff] px-[9px] py-[5px] text-[11px]';

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

  // DIRECCIONES form: this section's purpose is registering a NEW address into
  // the list below, so it always opens blank — never pre-filled from the
  // customer's current address. Selecting the ✏️ on a saved row is the only
  // thing that fills it in (to edit that specific entry).
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [department, setDepartment] = useState('');
  const [reference, setReference] = useState('');

  // Map state: mapSearch is only ever set by the user typing their own query —
  // the address/number/district/province fields feed a live *placeholder*
  // suggestion instead (see mapSearchSuggestion), so typing there never
  // overwrites something the user already typed into the search box.
  const [mapSearch, setMapSearch] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [lat, setLat] = useState(-12.0464);
  const [lng, setLng] = useState(-77.0428);

  const mapSearchSuggestion = [[address, number].filter(Boolean).join(' '), district, province]
    .filter(Boolean)
    .join(', ');

  // Matches the required (*) fields in the Direcciones form: Provincia, Distrito,
  // Dirección and Dpto/Interior. Nro/Mz and Referencia are optional, so they don't gate this.
  const isAddressComplete =
    province.trim() !== '' &&
    district.trim() !== '' &&
    address.trim() !== '' &&
    department.trim() !== '';

  // Address selection state
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressItem[]>(
    customer?.addresses || [
      {
        id: 'addr-1',
        address: customer?.address || 'Avenida Javier Prado Oeste',
        number: customer?.number || '1650',
        province: 'Lima',
        district: customer?.district || 'San Isidro',
        department: customer?.department || 'Block C',
        reference: customer?.reference || 'CRC AV LAS FLORES',
      },
      {
        id: 'addr-2',
        address: 'Av. Conquistadores',
        number: '820',
        province: 'Lima',
        district: 'San Isidro',
        department: 'Dpto 301',
        reference: 'Cerca a la Huaca Pucllana',
      },
    ],
  );

  const [errors, setErrors] = useState<{ firstName?: string }>({});

  useEffect(() => {
    if (customer) {
      setPhone(customer.phone);
      setRefCode(customer.refCode || '');
      setFirstName(customer.firstName);
      setPaterno(customer.lastName.split(' ')[0] || '');
      setMaterno(customer.lastName.split(' ').slice(1).join(' '));
      setDni(customer.dni);
    }
  }, [customer]);

  const handleAddressChange = (val: string) => setAddress(val);

  const handleNumberChange = (val: string) => setNumber(val);

  const resetAddressForm = () => {
    setSelectedAddressId(null);
    setAddress('');
    setNumber('');
    setProvince('');
    setDistrict('');
    setDepartment('');
    setReference('');
    setMapSearch('');
    setSearchError(null);
    setLat(-12.0464);
    setLng(-77.0428);
  };

  const runMapSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setSearchError(null);
    try {
      const result = await searchAddress(trimmed);
      if (result) {
        setLat(result.lat);
        setLng(result.lng);
      } else {
        setSearchError('No se encontró la dirección');
      }
    } catch {
      setSearchError('Error al buscar la dirección');
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapSearchClick = () => {
    runMapSearch(mapSearch.trim() || mapSearchSuggestion);
  };

  const handleMapSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMapSearchClick();
    }
  };

  // Auto-search fires specifically when the user leaves Nro/Mz (blur) — not while
  // typing in Dirección, and not on every keystroke.
  const handleNumberBlur = () => {
    if (address.trim() && number.trim()) {
      runMapSearch(mapSearchSuggestion);
    }
  };

  const handleSelectSavedAddress = (item: AddressItem) => {
    setSelectedAddressId(item.id);
    setAddress(item.address);
    setNumber(item.number);
    setProvince(item.province || 'Lima');
    setDistrict(item.district);
    setDepartment(item.department);
    setReference(item.reference);
    setMapSearch(`${item.address} ${item.number}`.trim());
  };

  // Adds a brand-new entry to Direcciones Registradas, or — when a row's ✏️ was
  // clicked first (selectedAddressId set) — updates that entry in place instead.
  const handleSaveAddress = () => {
    if (!isAddressComplete) return;
    const savedAddress: AddressItem = {
      id: selectedAddressId ?? `addr-${Date.now()}`,
      address,
      number,
      province,
      district,
      department,
      reference,
    };
    setAddresses((prev) =>
      selectedAddressId
        ? prev.map((a) => (a.id === selectedAddressId ? savedAddress : a))
        : [...prev, savedAddress],
    );
    resetAddressForm();
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddressId === id) {
      resetAddressForm();
    }
  };

  const handleSaveCustomer = () => {
    const newErrors: { firstName?: string } = {};
    if (!firstName.trim()) {
      newErrors.firstName = 'Nombres es requerido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (customer) {
      const combinedLastName = `${paterno} ${materno}`.trim();

      onSave({
        id: customer.id,
        phone,
        refCode,
        firstName,
        lastName: combinedLastName,
        dni,
        addresses,
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
                <CustomSelect
                  ariaLabel="Clase"
                  value="Gold"
                  onChange={() => {}}
                  options={[{ value: 'Gold', label: 'Gold' }]}
                  placeholder="Gold"
                  triggerClassName={SELECT_TRIGGER_CLASSNAME}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#666666] mb-1">Nombres <span className="text-[#e01020]">*</span></label>
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
                <label className="block text-[10px] font-bold text-[#666666] mb-1">Apellido Paterno <span className="text-[#e01020]">*</span></label>
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
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Provincia <span className="text-[#e01020]">*</span></label>
                    <CustomSelect
                      ariaLabel="Provincia"
                      value={province}
                      onChange={(v) => {
                        setProvince(v);
                        setDistrict('');
                      }}
                      options={PROVINCES.map((p) => ({ value: p, label: p }))}
                      placeholder="Seleccione provincia"
                      triggerClassName={SELECT_TRIGGER_CLASSNAME}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Distrito <span className="text-[#e01020]">*</span></label>
                    <CustomSelect
                      ariaLabel="Distrito"
                      value={district}
                      onChange={setDistrict}
                      options={LIMA_DISTRICTS.map((d) => ({ value: d, label: d }))}
                      placeholder="Seleccione distrito"
                      triggerClassName={SELECT_TRIGGER_CLASSNAME}
                      disabled={!province}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-[#666666] mb-1">Dirección (Calle / Av.) <span className="text-[#e01020]">*</span></label>
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
                      onBlur={handleNumberBlur}
                      placeholder="Nro/Mz"
                      className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#666666] mb-1">Dpto / Interior <span className="text-[#e01020]">*</span></label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Dpto, piso, interior..."
                    className="w-full rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 py-1.5 text-[11px] font-medium focus:border-[#1a1f5e] focus:outline-none transition-colors"
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

                {/* Map search box: value is only ever what the user typed; the
                    address fields just suggest a query via placeholder so typing
                    Nro/Mz etc. never overwrites a search the user is composing */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={mapSearch}
                    onChange={(e) => setMapSearch(e.target.value)}
                    onKeyDown={handleMapSearchKeyDown}
                    placeholder={mapSearchSuggestion || 'Buscar en el mapa...'}
                    className="h-7 flex-1 rounded-lg border border-slate-200 bg-[#FAFBFF] px-2.5 text-[9px] text-[#1a1f5e] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleMapSearchClick}
                    disabled={isSearching}
                    aria-label="Buscar dirección en el mapa"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#1a1f5e] text-white disabled:opacity-60"
                  >
                    {isSearching ? (
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                </div>
                {searchError && (
                  <p className="-mt-1.5 text-[9px] font-medium text-red-500">{searchError}</p>
                )}

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
                  onClick={handleSaveAddress}
                  disabled={!isAddressComplete}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-[10px] font-bold text-white transition-colors ${
                    isAddressComplete
                      ? 'bg-[#1a1f5e] hover:bg-[#252b7a]'
                      : 'cursor-not-allowed bg-[#c7d1e0]'
                  }`}
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
                      <td className="px-4 py-3">{item.province || 'Lima'}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectSavedAddress(item)}
                            aria-label={`Editar dirección ${item.address}`}
                            className="text-amber-500 hover:text-amber-600"
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteAddress(item.id)}
                            aria-label={`Eliminar dirección ${item.address}`}
                            className="text-slate-300 hover:text-red-500"
                          >
                            🗑️
                          </button>
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
