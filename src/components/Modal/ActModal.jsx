import React, { useState } from "react";
import Modal from "./Modal";

const ActModal = ({ isModalOpen, setIsModalOpen, title , children , height}) => {
  return (
    <div className="p-4">
      <Modal
      height={height}
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
