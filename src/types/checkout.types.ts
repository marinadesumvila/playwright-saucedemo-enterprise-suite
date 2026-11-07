export interface PaymentDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export interface CartItemPayload {
  name: string;
  price: string;
  quantity: number;
}

export interface OrderSummary {
  subtotal: number;
  tax: number;
  total: number;
}
