import { createOrderIntent, confirmTossOrder } from './api';

afterEach(() => { jest.restoreAllMocks(); });

test('checkout sends only menu identifiers, quantities and options to the server', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true, json: async () => ({ success: true, data: { orderId: 'server-id', amount: 5000 } }),
  });
  const result = await createOrderIntent({
    cafe: { id: 'cafe-1', name: 'spoofed' },
    items: [{ id: 'menu-1', quantity: 2, price: 1, user_id: 'spoofed', options: { temperature: 'ICE' } }],
  }, '', 'access-token');
  const [, options] = fetchMock.mock.calls[0];
  expect(options.headers.Authorization).toBe('Bearer access-token');
  expect(JSON.parse(options.body)).toEqual({
    cafeId: 'cafe-1', note: '', items: [{ id: 'menu-1', quantity: 2, options: { temperature: 'ICE' } }],
  });
  expect(result.amount).toBe(5000);
});

test('payment confirmation sends redirect fields to the authenticated server endpoint', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({
    ok: true, json: async () => ({ success: true, data: { orderId: 'paid-order' } }),
  });
  await confirmTossOrder({ paymentKey: 'key', orderId: 'intent', amount: 5000 }, 'access-token');
  const [url, options] = fetchMock.mock.calls[0];
  expect(url).toMatch(/\/orders\/confirm$/);
  expect(JSON.parse(options.body)).toEqual({ paymentKey: 'key', orderId: 'intent', amount: 5000 });
  expect(options.headers.Authorization).toBe('Bearer access-token');
});
