import { useEffect, useRef, useState } from 'react';
import Spinner from '@/components/shared/Spinner';
import ErrorMessage from '@/components/shared/ErrorMessage';
import DeliveryType from '@/components/cliente/DeliveryType';
import OrderHistoryTable from '@/components/cliente/OrderHistoryTable';
import CustomerRegistrationModal from '@/components/cliente/CustomerRegistrationModal';
import StoreSelectionModal from '@/components/cliente/StoreSelectionModal';
import OrderDetailModal from '@/components/cliente/OrderDetailModal';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearCustomerError,
  loadCustomerByPhone,
  saveCustomer,
  setDeliveryChannel,
  setStoreInfo,
} from '@/store/slices/customerSlice';
import { loadOrder } from '@/store/slices/cartSlice';
import type { CartItem, Customer, DeliveryChannel, OrderHistoryItem, Store } from '@/types';

export default function ClienteSection() {
  const dispatch = useAppDispatch();
  const { customer, orderHistory, storeInfo, deliveryChannel, loading, error } = useAppSelector(
    (state) => state.customer,
  );
  const activeBrand = useAppSelector((state) => state.products.activeBrand);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPickupModalOpen, setIsPickupModalOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<OrderHistoryItem | null>(null);
  const [phoneInput, setPhoneInput] = useState(customer?.phone || '970220065');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const addressDropdownRef = useRef<HTMLDivElement>(null);
  const clientDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(loadCustomerByPhone('970220065'));
  }, [dispatch]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(event.target as Node)
      ) {
        setShowAddressDropdown(false);
      }
      if (
        clientDropdownRef.current &&
        !clientDropdownRef.current.contains(event.target as Node)
      ) {
        setShowClientDropdown(false);
      }
    }

    if (showAddressDropdown || showClientDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressDropdown, showClientDropdown]);

  const handleSearch = (phone: string) => {
    dispatch(clearCustomerError());
    dispatch(loadCustomerByPhone(phone));
  };

  const handleSave = (updatedData: Partial<Customer> & { id: string }) => {
    dispatch(saveCustomer(updatedData));
  };

  const handleViewOrder = (order: OrderHistoryItem) => {
    setViewingOrder(order);
  };

  const handleLoadOrder = (order: OrderHistoryItem) => {
    const cartItems: CartItem[] = order.items.map((item, idx) => ({
      productId: `order-${order.id}-${idx}`,
      name: item.name,
      description: '',
      price: item.price,
      quantity: item.quantity,
      emoji: item.emoji || '🍽️',
      options: item.optionGroups?.map((group) => ({
        category: group.category,
        items: group.items.map((opt) => (opt.note ? `${opt.label} — ${opt.note}` : opt.label)),
      })),
    }));
    dispatch(loadOrder(cartItems));
    setViewingOrder(null);
  };

  const handleDeliveryChannelChange = (channel: DeliveryChannel) => {
    dispatch(setDeliveryChannel(channel));
    setIsPickupModalOpen(channel === 'pickup');
  };

  const handleCancelPickup = () => {
    dispatch(setDeliveryChannel('delivery'));
    setIsPickupModalOpen(false);
  };

  const handleConfirmStore = (store: Store) => {
    dispatch(setStoreInfo({ code: store.code, name: store.name, address: store.address }));
    setIsPickupModalOpen(false);
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(phoneInput);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        {loading && !customer && <Spinner label="Buscando cliente..." />}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(loadCustomerByPhone('970220065'))}
          />
        )}

        {/* Card 1: 1. CLIENTE */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          {/* Header row */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-bold uppercase tracking-wide text-[#7b869d]">
              1. CLIENTE
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex h-5.5 w-5.5 items-center justify-center rounded-lg border border-[#c7d1e0] bg-white text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
              title="Editar / Registrar cliente"
            >
              ✏️
            </button>
          </div>

          <div className="flex flex-col gap-2 text-[11px]">
            {/* Phone row: icon + input + AUDAZ pill outside input */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 text-xs">📞</span>
              <div className="flex-1">
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  onKeyDown={handlePhoneKeyDown}
                  className="w-full rounded-xl border border-[#c0cbe0] py-1 px-2.5 text-[11px] font-bold text-[#0b1021] focus:border-[#0b1021] focus:outline-none bg-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleSearch(phoneInput)}
                disabled={loading}
                className="rounded-md bg-[#1a1f5e] px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white transition-colors shrink-0"
              >
                AUDAZ
              </button>
            </div>

            {/* TLF REF line */}
            <div className="text-[10px] text-[#7e8aa2] font-semibold">
              TLF REF: <span className="font-bold text-[#2a3449]">{customer?.refCode || '996097394'}</span>
            </div>

            {/* Customer name row with person icon on left & dark caret down on right */}
            <div className="relative" ref={clientDropdownRef}>
              <button
                type="button"
                onClick={() => setShowClientDropdown((v) => !v)}
                className="flex w-full items-center justify-between text-left bg-transparent"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-slate-500 text-xs shrink-0">👤</span>
                  <div className="flex flex-col text-[11px] leading-tight font-extrabold text-black truncate">
                    <span>{customer?.firstName || 'Rosa Stefania'}</span>
                    <span>{customer?.lastName || 'Gerónimo Llanos'}</span>
                  </div>
                </div>
                <span className="text-[#1a1f5e] text-[9px] ml-1 shrink-0">▼</span>
              </button>

              {showClientDropdown && customer?.relatedClients && customer.relatedClients.length > 0 && (
                <ul className="absolute left-0 right-0 z-20 mt-1 max-h-40 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg text-xs">
                  {customer.relatedClients.map((rel) => (
                    <li key={rel.id}>
                      <button
                        type="button"
                        onClick={() => {
                          handleSave({
                            id: customer.id,
                            firstName: rel.firstName,
                            lastName: rel.lastName,
                            dni: rel.dni,
                            familyName: rel.lastName,
                          });
                          setShowClientDropdown(false);
                        }}
                        className="w-full px-3 py-1.5 text-left hover:bg-slate-100"
                      >
                        <div className="font-semibold text-slate-700">
                          {rel.firstName} {rel.lastName}
                        </div>
                        <div className="text-[10px] text-[#7e8aa2]">DNI: {rel.dni}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* DNI & Familia lines */}
            <div className="flex flex-col gap-0.5 text-[10px] text-[#7e8aa2] font-medium leading-tight">
              <p>
                DNI: <span className="font-bold text-[#2a3449]">{customer?.dni || '72749143'}</span>
              </p>
              <p>
                Familia: <span className="font-bold text-[#2a3449]">{customer?.familyName || customer?.lastName || 'Gerónimo Llanos'}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Card 2: DIRECCIÓN DE ENTREGA */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#7b869d]">
            DIRECCIÓN DE ENTREGA
          </h2>

          <div className="relative mb-2" ref={addressDropdownRef}>
            <button
              type="button"
              onClick={() => setShowAddressDropdown((v) => !v)}
              className="flex w-full items-center justify-between font-bold text-left text-[11px] bg-transparent py-0.5"
            >
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-red-600 text-xs shrink-0">📍</span>
                <span className="truncate font-extrabold text-black">
                  {customer
                    ? `${customer.address} ${customer.number || ''}`.trim()
                    : 'Avenida Javier Prado Oeste 1650'}
                </span>
              </div>
              <span className="text-[#1a1f5e] text-[9px] ml-1 shrink-0">▼</span>
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

          <div className="flex flex-col gap-1 text-[10px] text-[#7e8aa2] font-medium leading-tight">
            <p>
              Distrito: <span className="font-bold text-[#2a3449]">{customer?.district || 'San Isidro'}</span>
            </p>
            <p>
              Departamento: <span className="font-bold text-[#2a3449]">{customer?.department || 'Block C'}</span>
            </p>
            <p className="truncate">
              Ref.: <span className="font-bold text-[#2a3449]">{customer?.reference || 'CRC AV LAS FLORES'}</span>
            </p>
          </div>
        </section>

        {/* Card 3: CANAL DE VENTA */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#7b869d]">
            CANAL DE VENTA
          </h2>
          <DeliveryType value={deliveryChannel} onChange={handleDeliveryChannelChange} />
        </section>

        {/* Card 4: ÚLTIMOS PEDIDOS */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wide text-[#7b869d]">
            ÚLTIMOS PEDIDOS
          </h2>
          <OrderHistoryTable orders={orderHistory} onViewDetails={handleViewOrder} />
        </section>

        {/* Card 5: DETALLE TIENDA */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-3 shadow-2xs text-[10px] text-[#7e8aa2] font-medium leading-relaxed flex flex-col gap-1">
          <h2 className="mb-1 text-[11px] font-bold uppercase tracking-wide text-[#7b869d]">
            DETALLE TIENDA
          </h2>
          <p>
            Tienda: <span className="font-extrabold text-[#212b40]">{storeInfo.code} - {storeInfo.name}</span>
          </p>
          <p>
            Direcc.: <span className="font-extrabold text-[#212b40]">{storeInfo.address}</span>
          </p>
        </section>
      </div>

      {/* Interactive Modal for Customer and Map Registration */}
      <CustomerRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={customer}
        onSave={handleSave}
      />

      {/* Store selection modal for Pickup orders */}
      <StoreSelectionModal
        isOpen={isPickupModalOpen}
        brand={activeBrand}
        onCancel={handleCancelPickup}
        onConfirm={handleConfirmStore}
      />

      {/* Order detail modal triggered by the history table's eye icon */}
      <OrderDetailModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
        onLoadOrder={handleLoadOrder}
      />
    </>
  );
}
