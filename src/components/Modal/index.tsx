import { ReactNode } from 'react';
import './styles.scss';

type ModalProps = {
    children: ReactNode,
}

export default function Modal(Props: ModalProps){
    return(
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="modal-conteiner">
                    {Props.children}
                </div>
            </div>
        </>
    )
}