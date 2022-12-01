import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export function ModalRendering(props: any) {
    const handleClose = () => props.setShowModal(false);
    return (
        <>
            <Modal show={props.showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{props.res} </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

