function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #555",
        background: "#111",
        color: "white"
      }}
    />
  );
}

export default SearchBar;