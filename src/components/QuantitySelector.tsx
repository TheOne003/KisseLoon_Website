export function QuantitySelector({
  qty,
  onDecrement,
  onIncrement,
  label,
}: {
  qty: number;
  onDecrement: () => void;
  onIncrement: () => void;
  label?: string;
}) {
  return (
    <div className="qty" role="group" aria-label={label || "Quantity"}>
      <button type="button" onClick={onDecrement} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{qty}</span>
      <button type="button" onClick={onIncrement} aria-label="Increase quantity">
        +
      </button>
    </div>
  );
}

export function AddToCartControl({
  qty,
  onAdd,
  onIncrement,
  onDecrement,
  label,
}: {
  qty: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  label: string;
}) {
  if (qty > 0) {
    return <QuantitySelector qty={qty} onDecrement={onDecrement} onIncrement={onIncrement} label={label} />;
  }
  return (
    <button type="button" className="add-btn" onClick={onAdd} aria-label={label}>
      +
    </button>
  );
}
