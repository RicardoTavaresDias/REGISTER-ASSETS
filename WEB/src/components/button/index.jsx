import "./styles.css"

export function Button({ children }) {
  return (
    <div className="actions-wrapper">
      {children}
    </div>
  );
}
