import { useEffect, useState } from 'react';
import { FiEdit2, FiPhone, FiSearch, FiUser, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Spinner from '@/components/shared/Spinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import DeliveryType from '@/components/cliente/DeliveryType';
import OrderHistoryTable from '@/components/cliente/OrderHistoryTable';
import CustomerRegistrationModal from '@/components/cliente/CustomerRegistrationModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearCustomerError,
  loadCustomerByPhone,
  saveCustomer,
  setDeliveryChannel,
} from '@/store/slices/customerSlice';
import type { Customer, OrderHistoryItem } from '@/types';

export default function ClienteSection() {
  const dispatch = useAppDispatch();
  const { customer, orderHistory, storeInfo, deliveryChannel, loading, error } = useAppSelector(
    (state) => state.customer,
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneInput, setPhoneInput] = useState(customer?.phone || '970220065');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  useEffect(() => {
    dispatch(loadCustomerByPhone('970220065'));
  }, [dispatch]);

  const handleSearch = (phone: string) => {
    dispatch(clearCustomerError());
    dispatch(loadCustomerByPhone(phone));
  };

  const handleSave = (updatedData: Partial<Customer> & { id: string }) => {
    dispatch(saveCustomer(updatedData));
    toast.success('Cliente actualizado correctamente');
  };

  const handleViewOrder = (order: OrderHistoryItem) => {
    toast.info(`Pedido ${order.time} · S/ ${order.total.toFixed(2)}`);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(phoneInput);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2.5">
        {loading && !customer && <Spinner label="Buscando cliente..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(loadCustomerByPhone('970220065'))}
          />
        )}

        {/* Card 1: 1. CLIENTE */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold uppercase tracking-wide text-slate-700">
              1. CLIENTE
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              title="Editar / Registrar cliente"
            >
              <FiEdit2 size={12} />
            </button>
          </div>

          <div className="flex flex-col gap-2 text-xs">
            {/* Phone search line */}
            <div className="flex items-center gap-1.5">
              <div className="relative flex-1">
                <FiPhone
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                  size={13}
                />
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={handlePhoneKeyDown}
                  className="w-full rounded-md border border-slate-300 py-1 pl-7 pr-16 text-xs font-bold text-slate-800 focus:border-slate-800 focus:outline-none bg-slate-50/50"
                />
                <span className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded bg-[#0f172a] px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                  AUDAZ
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSearch(phoneInput)}
                disabled={loading}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                title="Buscar teléfono"
              >
                <FiSearch size={13} />
              </button>
            </div>

            {/* TLF REF */}
            <div className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-600">TLF REF:</span>{' '}
              <span>{customer?.refCode || '996097394'}</span>
            </div>

            {/* Customer name dropdown row */}
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 font-bold text-slate-800">
              <div className="flex items-center gap-1.5 truncate">
                <FiUser className="text-slate-500 shrink-0" size={13} />
                <span className="truncate">
                  {customer
                    ? `${customer.firstName} ${customer.lastName}`
                    : 'Rosa Stefania Gerónimo Llanos'}
                </span>
              </div>
              <FiChevronDown className="text-slate-400 shrink-0 ml-1" />
            </div>

            {/* DNI & Familia */}
            <div className="text-[11px] text-slate-600 leading-tight">
              <p>
                <span className="font-semibold">DNI:</span> {customer?.dni || '72749143'}
              </p>
              <p>
                <span className="font-semibold">Familia:</span>{' '}
                {customer?.familyName || customer?.lastName || 'Gerónimo Llanos'}
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: DIRECCIÓN DE ENTREGA */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-700">
            DIRECCIÓN DE ENTREGA
          </h2>

          <div className="relative mb-2">
            <button
              type="button"
              onClick={() => setShowAddressDropdown((v) => !v)}
              className="flex w-full items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-semibold text-slate-800 text-left text-xs"
            >
              <div className="flex items-center gap-1.5 truncate">
                <FiMapPin className="text-red-500 shrink-0" size={13} />
                <span className="truncate">
                  {customer
                    ? `${customer.address} ${customer.number || ''}`.trim()
                    : 'Avenida Javier Prado Oeste 1650'}
                </span>
              </div>
              <FiChevronDown className="text-slate-400 shrink-0 ml-1" />
            </button>

            {showAddressDropdown && customer?.addresses && customer.addresses.length > 0 && (
              <ul className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg text-xs">
                {customer.addresses.map((addr) => (
                  <li key={addr.id}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSave({
                          id: customer.id,
                          address: addr.address,
                          number: addr.number,
                          district: addr.district,
                          department: addr.department,
                          reference: addr.reference,
                        });
                        setShowAddressDropdown(false);
                      }}
                      className="w-full px-3 py-1.5 text-left hover:bg-slate-100 font-medium text-slate-700"
                    >
                      📍 {addr.address} {addr.number} ({addr.district})
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-0.5 text-[11px] text-slate-600 leading-tight">
            <p>
              <span className="font-semibold">Distrito:</span> {customer?.district || 'San Isidro'}
            </p>
            <p>
              <span className="font-semibold">Departamento:</span> {customer?.department || 'Block C'}
            </p>
            <p className="truncate">
              <span className="font-semibold">Ref.:</span> {customer?.reference || 'CRC AV LAS FLORES'}
            </p>
          </div>
        </section>

        {/* Card 3: CANAL DE VENTA */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-700">
            CANAL DE VENTA
          </h2>
          <DeliveryType
            value={deliveryChannel}
            onChange={(channel) => dispatch(setDeliveryChannel(channel))}
          />
        </section>

        {/* Card 4: ÚLTIMOS PEDIDOS */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-700">
            ÚLTIMOS PEDIDOS
          </h2>
          <OrderHistoryTable orders={orderHistory} onViewDetails={handleViewOrder} />
        </section>

        {/* Card 5: DETALLE TIENDA */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs text-xs text-slate-600">
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-700">
            DETALLE TIENDA
          </h2>
          <p className="font-semibold text-slate-800">
            Tienda: {storeInfo.code} - {storeInfo.name}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Direcc.: {storeInfo.address}</p>
        </section>
      </div>

      {/* Interactive Modal for Customer and Map Registration */}
      <CustomerRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={customer}
        onSave={handleSave}
      />
    </>
  );
}
