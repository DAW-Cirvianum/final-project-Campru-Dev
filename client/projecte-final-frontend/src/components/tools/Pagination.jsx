const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Returning items from currentPage
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: "8px",
        marginTop: "10px",
      }}
    >
      {/* On click change the current Page to back, if is the first disable button*/}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Back
      </button>

      {/* Getting the page number and onClick show the number of pagination it is */}
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => onPageChange(i + 1)}
          style={{
            fontWeight: currentPage === i + 1 ? "bold" : "normal",
          }}
        >
          {i + 1}
        </button>
      ))}

      {/* On click change the current Page to next, if is the last or unique page disable button*/}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
