import React, { useState } from "react";
import Modal from "./Modal";

const ActModal = ({ isModalOpen, setIsModalOpen, title , children }) => {
  return (
    <div className="p-4">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        {children}
      </Modal>
    </div>
  );
};

export default ActModal;
