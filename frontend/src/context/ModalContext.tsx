import React, { createContext, useContext, useState, type ReactNode } from "react";
import "./ModalContext.scss";

interface ModalOptions {
    title: string;
    message: string;
    type?: "alert" | "confirm";
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface ModalContextType {
    showModal: (options: ModalOptions) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
};

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modal, setModal] = useState<ModalOptions | null>(null);

    const showModal = (options: ModalOptions) => {
        setModal(options);
    };

    const hideModal = () => {
        setModal(null);
    };

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            {modal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>{modal.title}</h3>
                            <button className="close-btn" onClick={hideModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>{modal.message}</p>
                        </div>
                        <div className="modal-footer">
                            {modal.type === "confirm" ? (
                                <>
                                    <button className="btn-cancel" onClick={() => {
                                        if (modal.onCancel) modal.onCancel();
                                        hideModal();
                                    }}>Mégse</button>
                                    <button className="btn-confirm" onClick={() => {
                                        if (modal.onConfirm) modal.onConfirm();
                                        hideModal();
                                    }}>Igen</button>
                                </>
                            ) : (
                                <button className="btn-ok" onClick={hideModal}>OK</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
