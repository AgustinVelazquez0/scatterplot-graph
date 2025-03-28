const Tooltip = ({ visible, x, y, info, dataYear }) => {
  if (!visible) return null;

  return (
    <div
      id="tooltip"
      data-year={dataYear}
      style={{
        position: "absolute",
        left: `${x + 10}px`,
        top: `${y + 10}px`,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
      }}
      dangerouslySetInnerHTML={{ __html: info }} // 👈 Renderiza HTML
    />
  );
};

export default Tooltip;
