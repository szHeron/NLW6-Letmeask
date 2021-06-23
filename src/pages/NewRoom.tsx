import { useState, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { database } from '../services/firebase';
import useAuth from '../hooks/useAuth';
import IllustratorImg from '../assets/illustration.svg';
import LogoImg from '../assets/logo.svg';
import Button from '../components/Button';
import '../styles/auth.scss';

export default function NewRoom(){
    const { user } = useAuth();
    const [newRoom, setNewRoom] = useState('');
    const history = useHistory();

    async function handleCreateRoom(event: FormEvent){
        event.preventDefault();
        if(newRoom.trim() === ''){
            return;
        }
        
        const roomRef = database.ref("rooms");
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id
        });

        history.push(`/rooms/${firebaseRoom.key}`);
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={IllustratorImg} alt="Ilustração"/>
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas de sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={LogoImg} alt="Letmeask Logo"/>
                    <h2>Crie uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input type="text" placeholder="Nome da sala" value={newRoom} onChange={event=>setNewRoom(event.target.value)}></input>
                        <Button> Criar sala </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/"> Clique aqui!</Link></p>
                </div>
            </main>
        </div>
    )
}